const $ = (id) => document.getElementById(id);
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const number = new Intl.NumberFormat("en-US");
const date = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
let config;
let seed;
let repos = [];
let filter = "all";
let query = "";
let presenceSocket;
let reconnectTimer;
let heartbeatTimer;
let activityTimer;
let reconnectDelay = 1000;
let presenceLive = false;

async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw Error(response.status);
  return response.json();
}

function clock() {
  $("clock").textContent = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function renderTechStack() {
  const counts = {};
  repos
    .filter((repo) => !repo.fork && repo.language)
    .forEach(
      (repo) => (counts[repo.language] = (counts[repo.language] || 0) + 1),
    );
  const names = Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 7);
  if (names.length)
    $("tech-stack").innerHTML = names
      .map((name) => "<span>" + esc(name) + "</span>")
      .join("");
}

function renderRepos() {
  renderTechStack();
  const list = repos
    .filter(
      (repo) =>
        (filter === "all" || (filter === "fork" ? repo.fork : !repo.fork)) &&
        (!query ||
          [repo.name, repo.language, repo.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)),
    )
    .slice(0, query ? 24 : 6);
  $("repos").innerHTML = list.length
    ? list
        .map(
          (repo, index) =>
            `<a class="repo-row" href="https://github.com/${esc(repo.full_name)}" target="_blank" rel="noopener"><span class="repo-number">${String(index + 1).padStart(2, "0")}</span><div><h3>${esc(repo.name)}${repo.fork ? '<span class="tag">FORK</span>' : ""}</h3><p>${esc(repo.description || "Public repository · updated " + date(repo.pushed_at))}</p></div><div class="repo-meta"><span>${esc(repo.language || "Repository")}</span><span>☆ ${number.format(repo.stargazers_count || 0)}</span></div><span class="repo-arrow">↗</span></a>`,
        )
        .join("")
    : '<p class="muted">No repositories match this search or filter.</p>';
}

function renderProfile(profile) {
  $("repo-count").textContent = number.format(profile.public_repos);
  $("followers").textContent = number.format(profile.followers);
}

function renderEventChart(events) {
  const localDay = (day) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(day);
  const base = new Date(localDay(new Date()) + "T00:00:00Z");
  const counts = {};
  events.forEach((event) => {
    const day = localDay(new Date(event.created_at));
    counts[day] = (counts[day] || 0) + 1;
  });
  const days = Array.from({ length: 14 }, (_, index) => {
    const day = new Date(base);
    day.setUTCDate(day.getUTCDate() - (13 - index));
    const key = day.toISOString().slice(0, 10);
    return { day: key, count: counts[key] || 0 };
  });
  const max = Math.max(1, ...days.map((item) => item.count));
  $("event-chart").innerHTML = days
    .map(
      (item) =>
        `<div class="event-bar" data-count="${item.count}" style="height:${item.count ? Math.max(10, (item.count / max) * 100) : 4}%" title="${item.day}: ${item.count} public events" tabindex="0" aria-label="${item.day}: ${item.count} public events"></div>`,
    )
    .join("");
  $("chart-start").textContent = date(days[0].day);
  $("event-total").textContent =
    days.reduce((sum, item) => sum + item.count, 0) + " EVENTS";
}

function renderEvents(events) {
  renderEventChart(events);
  const labels = {
    PushEvent: "Recent push",
    CreateEvent: "Created ",
    WatchEvent: "Starred repository",
    ForkEvent: "Forked repository",
    IssuesEvent: "Issue activity",
    IssueCommentEvent: "Issue comment",
    PullRequestEvent: "Pull request",
    ReleaseEvent: "New release",
    DeleteEvent: "Deleted branch/tag",
    PublicEvent: "Repository made public",
  };
  const list = events.filter((event) => event.repo).slice(0, 4);
  $("event-list").innerHTML = list.length
    ? list
        .map(
          (event) =>
            `<div class="event"><span class="event-marker">↳</span><div class="event-content"><a href="https://github.com/${esc(event.repo.name)}" target="_blank" rel="noopener">${esc(event.repo.name)}</a><span>${esc(labels[event.type] || "Repository activity")}</span></div><time datetime="${esc(event.created_at)}">${date(event.created_at)}</time></div>`,
        )
        .join("")
    : '<p class="muted">No recent public activity.</p>';
}

async function github() {
  const base =
    "https://api.github.com/users/" + encodeURIComponent(config.github);
  const results = await Promise.allSettled([
    json(base),
    json(base + "/repos?sort=pushed&per_page=100"),
    json(base + "/events/public?per_page=30"),
  ]);
  if (results[0].status === "fulfilled") renderProfile(results[0].value);
  else if (seed?.profile) renderProfile(seed.profile);
  if (results[1].status === "fulfilled") {
    repos = results[1].value;
    $("repo-source").textContent =
      "Updated from GitHub • " +
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
  } else {
    repos = seed?.repos || [];
    $("repo-source").textContent = repos.length
      ? "GitHub snapshot • " +
        date(seed.fetchedAt) +
        " · live updates unavailable"
      : "GitHub is currently unavailable. Visit the profile to explore repositories.";
  }
  renderRepos();
  if (results[2].status === "fulfilled") renderEvents(results[2].value);
  else if (seed?.events) {
    renderEvents(seed.events);
    $("events-source").textContent =
      "Public activity snapshot • " + date(seed.fetchedAt);
  } else
    $("event-list").innerHTML =
      '<p class="muted">GitHub activity is temporarily unavailable.</p>';
}

function activitySummary(data) {
  const activity = (data.activities || []).find(
    (item) => item.type !== 4 && item.type !== 2,
  );
  if (activity)
    return [
      { 0: "Playing", 1: "Streaming", 3: "Watching", 5: "Competing" }[
        activity.type
      ] || "Activity",
      activity.name,
      activity.details,
      activity.state,
    ]
      .filter(Boolean)
      .join(" · ");
  if (data.spotify)
    return (
      "Listening to Spotify · " +
      data.spotify.song +
      " · " +
      data.spotify.artist
    );
  const listening = (data.activities || []).find((item) => item.type === 2);
  if (listening)
    return ["Listening", listening.name, listening.details, listening.state]
      .filter(Boolean)
      .join(" · ");
  return (
    (data.activities || []).find((item) => item.type === 4)?.state ||
    "No activity is being shared."
  );
}

function activityAssetUrl(activity, assetKey) {
  if (typeof assetKey !== "string" || !assetKey) return "";
  if (assetKey.startsWith("mp:")) {
    const path = assetKey.slice(3);
    return path.startsWith("external/")
      ? `https://media.discordapp.net/${path}`
      : "";
  }
  if (/^https:\/\//i.test(assetKey)) return assetKey;
  if (!/^\d+$/.test(activity.application_id || "") || !/^\d+$/.test(assetKey))
    return "";
  return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assetKey}.png`;
}

function formatElapsed(startedAt) {
  if (!startedAt) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  return `${Math.floor(seconds / 3600)}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function renderPresence(data) {
  if (!data?.discord_user) return;
  const user = data.discord_user;
  $("discord-name").textContent = user.global_name || user.username;
  $("discord-handle").textContent = "@" + user.username;
  if (user.avatar)
    $("discord-avatar").src =
      `https://cdn.discordapp.com/avatars/${config.discordId}/${user.avatar}.png?size=128`;

  const labels = {
    online: "Online",
    idle: "Idle",
    dnd: "Do not disturb",
    offline: "Offline",
  };
  const colors = {
    online: "#8cbe83",
    idle: "#d2b26b",
    dnd: "#cf7d78",
    offline: "#939993",
  };
  $("status-text").textContent =
    labels[data.discord_status] || "Unknown status";
  $("status-dot").style.background = colors[data.discord_status] || "#939993";
  $("device").textContent = data.active_on_discord_desktop
    ? "DESKTOP"
    : data.active_on_discord_mobile
      ? "MOBILE"
      : data.active_on_discord_web
        ? "WEB"
        : "";

  const activity = (data.activities || []).find(
    (item) => item.type !== 4 && item.type !== 2,
  );
  const largeImage = $("activity-artwork");
  const smallImage = $("activity-small-artwork");
  const largeUrl = activityAssetUrl(
    activity || {},
    activity?.assets?.large_image,
  );
  const smallUrl = activityAssetUrl(
    activity || {},
    activity?.assets?.small_image,
  );
  [largeImage, smallImage].forEach((image) => {
    image.hidden = true;
    image.removeAttribute("src");
    image.onerror = null;
  });
  if (largeUrl) {
    largeImage.src = largeUrl;
    largeImage.hidden = false;
  }
  if (smallUrl) {
    smallImage.src = smallUrl;
    smallImage.hidden = false;
  }

  const activityIcons = document.querySelector(".activity-icons");
  activityIcons.hidden = !largeUrl && !smallUrl;
  activityIcons.setAttribute("aria-hidden", String(activityIcons.hidden));
  largeImage.alt = activity?.name ? `${activity.name} artwork` : "";
  smallImage.alt = "";
  largeImage.onerror = () => {
    largeImage.hidden = true;
    largeImage.removeAttribute("src");
    activityIcons.hidden = smallImage.hidden;
  };
  smallImage.onerror = () => {
    smallImage.hidden = true;
    smallImage.removeAttribute("src");
    activityIcons.hidden = largeImage.hidden;
  };
  $("activity-name").hidden = !activity?.name;
  $("activity-state").hidden = !activity?.state;
  $("activity-elapsed").hidden = !activity?.timestamps?.start;
  $("discord-activity").hidden = false;

  $("activity-name").textContent = activity?.name || "";
  $("discord-activity").textContent =
    activity?.details || activitySummary(data);
  $("activity-state").textContent = activity?.state || "";
  const start = activity?.timestamps?.start;
  $("activity-elapsed").textContent = formatElapsed(start);
  clearInterval(activityTimer);
  activityTimer = start
    ? setInterval(() => {
        $("activity-elapsed").textContent = formatElapsed(start);
      }, 1000)
    : undefined;

  $("spotify").hidden = !data.spotify;
  if (data.spotify)
    $("spotify").innerHTML =
      `<img src="${esc(data.spotify.album_art_url)}" alt=""><div class="spotify-copy"><strong>♫ ${esc(data.spotify.song)}</strong><span>${esc(data.spotify.artist)}</span></div>`;
  $("presence-time").textContent =
    "Updated " +
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  $("presence-source").textContent = "LIVE / LANYARD";
}

async function discord() {
  try {
    const response = await json(
      "https://api.lanyard.rest/v1/users/" + config.discordId,
    );
    if (!response.success) throw Error("not tracked");
    renderPresence(response.data);
  } catch {
    if (presenceLive) return;
    $("status-text").textContent = "Status unavailable";
    $("status-dot").style.background = "#939993";
    $("device").textContent = "";
    $("activity-name").textContent = "";
    $("activity-artwork").hidden = true;
    $("activity-small-artwork").hidden = true;
    const icons = document.querySelector(".activity-icons");
    icons.hidden = true;
    icons.setAttribute("aria-hidden", "true");
    clearInterval(activityTimer);
    activityTimer = undefined;
    $("activity-name").hidden = true;
    $("activity-state").hidden = true;
    $("activity-elapsed").hidden = true;
    $("discord-activity").textContent =
      "Discord presence could not be refreshed.";
    $("activity-state").textContent = "";
    $("spotify").hidden = true;
    $("presence-source").textContent = "LANYARD";
    $("presence-time").textContent = "Retrying automatically";
  }
}

function connectPresence() {
  clearTimeout(reconnectTimer);
  if (document.hidden || !config || presenceSocket) return;
  const socket = new WebSocket("wss://api.lanyard.rest/socket");
  presenceSocket = socket;

  socket.addEventListener("message", ({ data: raw }) => {
    let message;
    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }
    if (message.op === 1) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = setInterval(
        () => {
          if (socket.readyState === WebSocket.OPEN)
            socket.send(JSON.stringify({ op: 3 }));
        },
        Math.max(1000, Number(message.d?.heartbeat_interval) || 30000),
      );
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ op: 2, d: { subscribe_to_id: config.discordId } }),
        );
      }
      return;
    }
    if (message.op !== 0) return;
    const presence =
      message.t === "INIT_STATE"
        ? message.d?.[config.discordId] || message.d
        : message.t === "PRESENCE_UPDATE"
          ? message.d?.user_id === config.discordId
            ? message.d
            : null
          : null;
    if (presence?.discord_user) {
      reconnectDelay = 1000;
      presenceLive = true;
      renderPresence(presence);
    }
  });

  socket.addEventListener("open", () => {
    $("presence-source").textContent = "CONNECTING / LANYARD";
  });
  const close = () => {
    if (presenceSocket !== socket) return;
    clearInterval(heartbeatTimer);
    presenceSocket = null;
    presenceLive = false;
    if (!document.hidden) {
      reconnectTimer = setTimeout(connectPresence, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 30000);
    }
  };
  socket.addEventListener("close", close);
  socket.addEventListener("error", () => socket.close());
}

function stopPresence() {
  clearTimeout(reconnectTimer);
  reconnectTimer = undefined;
  clearInterval(heartbeatTimer);
  heartbeatTimer = undefined;
  clearInterval(activityTimer);
  activityTimer = undefined;
  presenceLive = false;
  if (presenceSocket) {
    const socket = presenceSocket;
    presenceSocket = null;
    socket.close();
  }
}

function renderWaka(response) {
  const data = response.data || response;
  if (data.human_readable_total) {
    $("waka-content").innerHTML =
      `<div class="waka-total">${esc(data.human_readable_total)}</div><p class="muted">${esc(data.range?.text || "Coding time")}</p>` +
      (data.languages || [])
        .slice(0, 4)
        .map(
          (language) =>
            `<div class="language"><div class="language-label"><span>${esc(language.name)}</span><span>${Number(language.percent || 0).toFixed(1)}%</span></div><div class="bar"><div style="width:${Math.min(100, Math.max(0, Number(language.percent) || 0))}%"></div></div></div>`,
        )
        .join("");
  } else if (Array.isArray(data)) {
    const numeric = data.filter((item) =>
      Number.isFinite(Number(item.percent)),
    );
    if (!numeric.length) throw Error("unsupported");
    $("waka-content").innerHTML =
      '<h3 style="margin-top:30px">Languages in the editor.</h3>' +
      numeric
        .slice(0, 5)
        .map(
          (language) =>
            `<div class="language"><div class="language-label"><span>${esc(language.name)}</span><span>${Number(language.percent).toFixed(1)}%</span></div><div class="bar"><div style="width:${Math.min(100, Math.max(0, Number(language.percent)))}%"></div></div></div>`,
        )
        .join("");
  } else throw Error("unsupported");
}

async function waka() {
  try {
    renderWaka(await json("/api/wakatime"));
  } catch {
    $("waka-content").innerHTML =
      '<div class="waka-icon">⌁</div><h3>Statistics unavailable.</h3><p class="muted">WakaTime could not be refreshed. Please try again later.</p>';
  }
}

function readingProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("reading-progress").style.width =
    (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + "%";
}

async function init() {
  config = await json("/config.json");
  try {
    seed = await json("/github-snapshot.json");
  } catch {}
  await Promise.allSettled([github(), discord(), waka()]);
  connectPresence();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPresence();
    else connectPresence();
  });
  window.addEventListener("pagehide", stopPresence);
  window.addEventListener("pageshow", () => {
    if (!document.hidden) connectPresence();
  });
  setInterval(() => {
    if (!document.hidden) github();
  }, 300000);
}

clock();
setInterval(clock, 1000);
$("year").textContent = new Date().getFullYear();
try {
  if (localStorage.getItem("wign-theme") === "light")
    document.body.classList.add("light");
} catch {}
$("theme").onclick = () => {
  document.body.classList.toggle("light");
  try {
    localStorage.setItem(
      "wign-theme",
      document.body.classList.contains("light") ? "light" : "dark",
    );
  } catch {}
};
$("copy-discord").onclick = async () => {
  try {
    await navigator.clipboard.writeText("762847406563524618");
    $("copy-result").textContent = "Discord ID copied.";
  } catch {
    $("copy-result").textContent = "Discord ID: 762847406563524618";
  }
};
document.querySelectorAll("[data-filter]").forEach(
  (button) =>
    (button.onclick = () => {
      filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderRepos();
    }),
);
$("repo-search").addEventListener("input", (event) => {
  query = event.target.value.trim().toLowerCase();
  renderRepos();
});
window.addEventListener("scroll", readingProgress, { passive: true });
window.addEventListener("resize", readingProgress);
readingProgress();
init().catch(() => {
  $("status-text").textContent = "Status unavailable";
  $("repos").innerHTML =
    '<a href="https://github.com/wignn">View repositories on GitHub ↗</a>';
});
