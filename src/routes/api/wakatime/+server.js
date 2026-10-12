import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const noStore = { headers: { "cache-control": "no-store" } };

export async function GET() {
  const apiKey = env.WAKATIME_API_KEY;

  if (!apiKey) {
    return json({ error: "WakaTime is not configured" }, { ...noStore, status: 503 });
  }

  try {
    const response = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: {
          authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
          accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      return json({ error: "WakaTime is unavailable" }, { ...noStore, status: 502 });
    }

    return json(await response.json(), noStore);
  } catch {
    return json({ error: "WakaTime is unavailable" }, { ...noStore, status: 502 });
  }
}
