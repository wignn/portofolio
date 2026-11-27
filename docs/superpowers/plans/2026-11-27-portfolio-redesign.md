# Engineering Editorial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio around backend/full-stack work, DevOps, and technical architecture, using Anime.js plus existing Lenis without losing current projects or live integrations.

**Architecture:** Keep SvelteKit and its component boundaries. Separate project content from presentation, preserve runtime DOM contracts, replace the accumulated portfolio stylesheet with a coherent editorial system, and make motion an onMount-owned disposable enhancement. Existing data integrations remain in place; only theme initialization changes where needed.

**Tech Stack:** Svelte 5, SvelteKit 3, Vite 8, TypeScript/JavaScript, Tailwind CSS 4 utilities, Anime.js, locally vendored Lenis 1.3.26, Bun, Node test runner, Playwright through the Orca browser workflow.

**Spec:** `docs/superpowers/specs/2026-11-27-portfolio-redesign-design.md`

## Global Constraints

- Keep SvelteKit, Svelte, Vite, and the server-only WakaTime endpoint.
- Add Anime.js as the explicitly approved runtime dependency, using the current documented API and a reproducible lockfile entry.
- Retain the locally vendored Lenis 1.3.26 rather than adding a second copy.
- Design Read: a personal engineering portfolio in an editorial visual language, ENERGY 2 / RHYTHM 3 / MOTION 2.
- No LinkedIn URL, link, icon, embed, or integration is introduced into the portfolio.
- All six existing projects remain accessible through working source/demo links.
- No new project entry appears without supplied or verified details.
- Preserve existing English content, Wign identity, working GitHub/Discord links, and server-only secrets.
- Respect reduced motion, restore visible content if animation fails, clean up observers/listeners/animations on unmount, and preserve native touch scrolling and anchor keyboard focus.
- No third-party design-service source uploads without explicit authorization. Do not commit, push, deploy, or publish the portfolio without a separate request.
- This plan is not authorization to invent the unavailable LinkedIn Projects content.

## Review Focus

- Cold browser storage or blocked storage: warm light default remains readable and theme switching works without throwing (Task 3).
- Missing/delayed Lenis, failed animation startup, or runtime reduced-motion changes: content stays visible and native anchor navigation remains usable (Task 4).
- Narrow phones, zoom, and long repo/technology labels: no page overflow and all project destinations remain reachable (Tasks 2 and 5).
- Slow/failed upstream APIs and empty search results: preserved loading/error/fallback/empty states stay readable after DOM rearrangement (Tasks 3 and 5).
- Svelte teardown/remount and back-forward restoration: no duplicate motion listeners, observers, or RAF loops; UI remains usable (Tasks 4 and 5).

---

## File map

- Modify `src/lib/components/{SiteHeader,HeroSection,WorkSection,AboutSection,ActivitySection,ContactSection,SiteFooter}.svelte`: editorial structure, accurate copy, retained IDs and destinations.
- Create `src/lib/components/PresencePanel.svelte`: move existing complete Discord presence markup here, preserving every runtime ID; render it exactly once in ActivitySection.
- Create `src/lib/data/projects.js`: six current project records and their existing links, no guessed personal-role/deployment claims.
- Create `src/lib/data/projects.test.js`: Node tests for data order, identity, links, and content constraints.
- Modify `src/portfolio.css`: consolidated theme tokens, layout, component states, responsive rules, and reduced-motion behavior.
- Modify `src/app.html`: theme bootstrap before first paint and synchronized metadata, retaining local Lenis script/CSS.
- Modify `src/interactions.js`: theme synchronization only where required; preserve API rendering, fallback, presence, search, filters, and clipboard behavior.
- Modify `src/motion.js` and `src/routes/+page.svelte`: Anime.js enhancement and lifecycle cleanup.
- Modify `package.json`, `bun.lock`: approved animation dependency and focused test command.
- Create `tests/motion.test.js`: isolated mocked-browser lifecycle tests using Node's test runner, no unrelated testing framework.
- Create `docs/superpowers/verification/2026-11-27-portfolio-redesign.md`: actual baseline, command results, browser checks, and remaining gaps.

### Task 1: Approve the visual draft and capture a verification baseline

**Files:** design spec; optional `.superdesign/` design context when external generation is authorized; verification record.

**Interfaces:** Consumes approved spec. Produces an approved visual reference, selected tokens/type direction, and recorded baseline failures.

- [ ] Step 1: Load required design/browser/run skills at execution time. Confirm current worktree and status; do not create a second checkout unnecessarily.
- [ ] Step 2: Run environment/version/dependency availability checks. Run existing `check`, `build`, and `lint` scripts with the available package manager. Record real results before edits, without fixing unrelated failures or installing unrelated tooling.
- [ ] Step 3: Follow the Superdesign visual-draft path only with explicit permission to send selected source/personal content externally. If not authorized, offer a local throwaway HTML preview instead. Read required local artifact/visual skills before authoring it; do not publish a branded personal preview. Do not treat service authentication as permission to upload source.
- [ ] Step 4: Show one selected Engineering Editorial composition, not additional paid variants. Include desktop and phone composition, both themes, hero, expanded projects, secondary list, focus, and activity. No new portrait/logo/artwork.
- [ ] Step 5: Obtain visual-draft approval before product implementation, or explicit permission to skip that draft. Capture the decision in the spec. A service or browser failure is not draft approval.

### Task 2: Build the project-first editorial layout

**Files:** components listed above; `src/lib/data/projects.js`; `src/lib/data/projects.test.js`; `src/portfolio.css`; `package.json`.

**Interfaces:** `projects` is an ordered exported array of `{ id, name, category, description, technologies: string[], links: {label, href}[], featured: boolean }`. Stable IDs are `pia-engine`, `novelhive`, `lyra`, `nio`, `crypt`, `pia-sdk`. Only the first two are featured. PresencePanel has no props and renders the existing presence IDs once.

- [ ] Step 1: Write a failing Node test importing `projects`; assert the six IDs/names and exactly two featured records; assert original source/demo/package destinations remain, all hrefs are real HTTPS URLs, and no record contains a LinkedIn destination or invented role/results fields.
- [ ] Step 2: Run `node --test src/lib/data/projects.test.js`; confirm failure because the content module is missing, not a test syntax error.
- [ ] Step 3: Extract accurate current content into the data module. Preserve existing destinations. Omit unsupported numeric/performance claims rather than elaborating them.
- [ ] Step 4: Rebuild WorkSection around two expanded rows and four compact entries. Retain `repo-search`, `repos`, `repo-source`, filter attributes, button state semantics, and search behavior. Use a visible search label.
- [ ] Step 5: Update hero to Backend & Full-Stack Developer, supporting DevOps & IT Technical Architecture. Retain a single h1, working work/contact actions, and no invented availability/experience claims. Extract presence markup and render it once in ActivitySection.
- [ ] Step 6: Update AboutSection with the four focus areas; retain sourced architecture and its accessible description. Keep existing contact/footer destinations and required runtime IDs.
- [ ] Step 7: Replace conflicting old portfolio CSS with organized token/base/layout/component/responsive/motion sections. Use warm off-white, graphite, and one green accent, system fonts with a distinct display hierarchy, readable metadata, 44px targets, pointer affordances, visible focus, and disabled/hover/active states. No fake screenshots, generic decorative dashboard, or rainbow project cards.
- [ ] Step 8: Run the data test and project check/build. Inspect widths 360/390/768/1440px including long project labels; fix overflow through source CSS rather than hiding page overflow. Record exact outcomes.

### Task 3: Keep both themes and live-data states functional

**Files:** `src/app.html`, `src/interactions.js`, `src/portfolio.css`, affected activity/header components, verification record.

**Interfaces:** Preserve `wign-theme` with values `light|dark`, `body.light`, `#theme`, and every current integration target ID. Default is light only when no valid saved preference exists; explicit dark wins. Storage may throw. No changes to `/api/wakatime` contract.

- [ ] Step 1: Before changing behavior, record browser checks for empty storage, saved light, saved dark, and blocked localStorage. Verify the existing dark default fails the approved no-preference light requirement.
- [ ] Step 2: Add a small defensive pre-paint theme bootstrap in app.html, preserving native page rendering and local vendor references. Update runtime theme handling to avoid overriding the chosen default, keep the control's accessible state/name synchronized, and tolerate unavailable storage. Avoid color interpolation that creates temporary contrast failures.
- [ ] Step 3: Verify all existing DOM IDs used by interactions.js exist once after rearrangement. Do not refactor unrelated integration lifecycle code as part of this task.
- [ ] Step 4: Exercise both themes with deterministic local browser request fixtures: successful GitHub payload, GitHub failure with snapshot, failed snapshot/live requests, WakaTime 503, unavailable Discord, and zero repository search matches. Use real available data as fixtures; never put fabricated records into shipped source.
- [ ] Step 5: Check visible loading/empty/error messages, search/filter aria-pressed state, clipboard success/fallback, source labels, and theme preference reload. Record any unavailable network/WebSocket interception rather than claiming it was tested.

### Task 4: Add Anime.js and lifecycle-safe Lenis motion

**Files:** `package.json`, `bun.lock`, `src/motion.js`, `src/routes/+page.svelte`, `src/portfolio.css`, `tests/motion.test.js`.

**Interfaces:** `initMotion(): () => void` initializes motion only in a browser and returns an idempotent disposer. `+page.svelte` returns that disposer from onMount. Keep existing local Lenis as `window.Lenis`; do not install another Lenis or add a second scrolling loop.

- [ ] Step 1: Verify Anime.js package documentation/current API with the developer-documentation skill. Pin the selected published version in runtime dependencies using Bun and update bun.lock. Use v4 named APIs only if the selected package version documents them; do not mix v3 global/timeline conventions with v4.
- [ ] Step 2: Write failing Node tests with mocked event targets, matchMedia, IntersectionObserver, RAF, and Lenis for: init returns a disposer; disposing twice is safe; registered callbacks/observers/RAF are removed; reduced motion avoids Lenis and hidden content; missing Lenis leaves anchors native; enabling reduced motion reveals all affected content.
- [ ] Step 3: Run `node --test tests/motion.test.js`; confirm failures correspond to missing cleanup/current behavior.
- [ ] Step 4: Replace global pointer tilt with a short Anime.js hero stagger and one-shot project reveals (roughly 450-650ms duration, 50-80ms stagger, small translation). Keep contents visible in baseline CSS; prepare animation only after setup succeeds. Cancel/revert animated inline styles and reveal everything on failure, reduced motion, or disposal. No continuously looping animation.
- [ ] Step 5: Keep native touch scrolling, existing anchor focus/hash behavior, nav state, page visibility pause/resume, and BFCache behavior. Register all handlers through removable named callbacks. Destroy Lenis, disconnect observers, cancel RAF/animations, and remove media/event listeners on dispose. Only instantiate after vendored Lenis is available; preserve native scrolling if it never loads.
- [ ] Step 6: Wire the disposer into onMount without making SSR access window/document. Add the focused test script to package.json and run data/motion tests plus check/build.
- [ ] Step 7: Browser-check normal motion, initially reduced motion, runtime preference changes, keyboard anchors, delayed/missing vendor script, hidden tab/resume, remount, and browser back/forward. Observe no invisible content or duplicate scrolling loops.

### Task 5: Verify the complete redesign and review the diff

**Files:** verification record; scoped fixes only as justified by evidence.

**Interfaces:** Consumes all tasks. Produces measured verification outcomes and a locally runnable implementation, not a deployment.

- [ ] Step 1: Run the focused tests, type check, production build, and lint. Record actual commands, exit status, baseline comparison, and relevant errors. Do not suppress hooks/checks or report a failure as passed.
- [ ] Step 2: Through the Orca browser workflow, check 360/390/768/1440px, both themes, 200% zoom, focus order, skip link, reduced motion, all navigation/project links, repository filtering/search, copy action, and live-data success/error/empty states. Record each changed control and result, and console/network errors.
- [ ] Step 3: Verify actual text/background token pairs meet WCAG AA, media dimensions reserve space, no essential content depends on motion, and there are no fabricated claims or LinkedIn UI links. Complete the antislop delivery gate with evidence, not a generic PASS statement.
- [ ] Step 4: Request one independent whole-diff code review using the review skill. Address verified issues, rerun affected checks, and keep unrelated cleanup out of scope.
- [ ] Step 5: Inspect git diff/status and summarize changes, verification, and the outstanding LinkedIn project-content gap. No automatic commit, push, deployment, external artifact publish, or paid extra design variants.

## Self-review

- Spec coverage: editorial layout, role positioning, six project destinations, content privacy, pending LinkedIn additions, both themes, live integrations, Anime.js/Lenis, accessibility, lifecycle, and verification each have an owning task.
- Interface consistency: body.light and wign-theme retained; motion returns a synchronous disposer; project IDs and link shapes defined once above.
- Review Focus coverage: theme storage cases in Task 3; motion failures and lifecycle in Task 4; width/data states in Tasks 2, 3, and 5.
- Scope: source generation, dependency installation, and implementation begin only after execution-method selection and the visual-draft gate. No git commits are authorized by this plan.
