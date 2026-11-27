# Portfolio Redesign: Engineering Editorial

Status: approved revised direction on 2026-11-27. The first two static editorial drafts were rejected as too simple. The user approved motion-systems-v3-c93d.html and explicitly asked to retain its animations. Build the motion-first visual with Three.js, Anime.js, existing Lenis, and the six existing projects first. Additional LinkedIn projects remain pending supplied content.

## Intent

Present Wign as a Backend & Full-Stack Developer with a focus on DevOps and IT Technical Architecture. Make the work and system architecture more prominent than live activity widgets. The audience has not been specified; the proposed reading experience serves people evaluating technical work without assuming a particular hiring or commercial goal.

## Confirmed requirements

- Redesign the existing portfolio.
- Use the Engineering Editorial direction selected by the user.
- Apply antislop during design and implementation (session choice).
- Incorporate projects from the supplied LinkedIn profile when their details can be verified.
- Do not add the LinkedIn URL, icon, contact entry, embed, or tracking integration to the portfolio.
- Emphasize backend, full-stack, DevOps, and IT technical architecture.

## Source and content constraints

The public LinkedIn response exposes profile information and skills but no Projects section. Additional project names, descriptions, roles, technologies, and demo/source URLs remain unavailable. Request pasted project details or screenshots; do not invent project entries or interpret skills and employment as project evidence.

The repository already contains PIA Engine, NovelHive, Lyra, Nio, Crypt, and PIA SDK. Preserve their existing destinations and descriptions as the starting content. Their current presence is not independent verification of performance or security claims. Do not add unsupported numbers, ownership claims, production scale, results, uptime, or experience levels. If deployment or personal-role detail is unavailable, omit that field instead of filling it with assumptions. Keep an explicit pending-content item in development notes, not a fake public project card.

## Approaches considered

1. Engineering Editorial (selected): typography-led, warm light surfaces and graphite contrast, project narratives with architecture evidence. The main trade-off is less dashboard-like visual density.
2. Systems Workspace: dark, diagram-heavy, compact. Strong infrastructure emphasis but live widgets and panels could overshadow project explanations.
3. Minimal Case Studies: sparse, primarily light, almost entirely project-led. Easy to scan but gives existing live integrations less visibility.

## Proposed visual direction

Design Read: a motion-first personal engineering portfolio, ENERGY 3 / RHYTHM 3 / MOTION 3. Approved reference: local motion-systems-v3-c93d.html. Graphite opening, oversized Code / Connect / Operate typography, interactive Three.js NovelHive service model, olive project contrasts, Anime.js choreography, and Lenis scrolling. Continuous illustrative signal motion requires a pause control and stops for reduced motion, hidden tabs, or offscreen scenes. Preserve native touch scrolling. Do not ship the rejected simple static direction.

- Palette: warm off-white, graphite, neutral dividers, one restrained deep-green accent. Purpose: distinguish reading surfaces from key navigation and technical callouts without giving every project its own color scheme.
- Typography: a characterful, readable sans-serif for display and body; monospace only for technical metadata. Prefer available local/system fonts; any external font requires an explicit privacy/performance decision. Purpose: maintain a technical voice without a fake-terminal aesthetic.
- Layout: generous editorial columns with different compositions for hero, featured work, capabilities, and live activity. Purpose: project importance should dictate space rather than identical cards.
- Spacing: larger section breaks, tighter related metadata. Purpose: distinguish narrative groups from technical details.
- Motif: consistent thin rules, project numbering derived from actual entries, and aligned technical captions. Purpose: a coherent engineering-document identity, not decorative grids.
- Motion: Anime.js hero entrance with a short stagger and one-shot project reveals; Lenis smooth wheel and anchor scrolling; CSS hover/focus feedback. Respect reduced motion, restore visible content if animation fails, clean up observers/listeners/animations on unmount, and preserve native touch scrolling and anchor keyboard focus. Purpose: guide reading order without distracting from the work.
- Media: reuse existing relevant assets where appropriate. No generated logos, portraits, fake screenshots, or new visual assets without permission. Technical diagrams must reflect sourced architecture and have accessible text equivalents.

## Proposed page composition

### Header

Keep the Wign identity, working anchor navigation, skip link, and theme toggle. No LinkedIn destination. On narrow screens use a compact wrapping navigation, avoiding a new modal menu unless the content needs it.

### Hero

Primary role: Backend & Full-Stack Developer. Supporting line: DevOps & IT Technical Architecture. Short copy explains scope without claiming seniority or verified operational outcomes. Primary action opens selected work; secondary action goes to contact. Use an editorial text composition rather than a large status widget. Preserve the existing English content language unless the user requests Indonesian.

### Selected work

Give PIA Engine and NovelHive expanded editorial rows as a proposed prioritization because the existing descriptions show event-driven backend and microservice architecture. Each row presents the project purpose, implementation/architecture facts available in current content, technology stack, and real source/demo links. Do not assert personal roles or deployment details absent from the source.

Show Lyra, Nio, Crypt, and PIA SDK as a compact secondary project index with distinct readable descriptions and real links. Preserve every current project. Additional verified LinkedIn projects join this same content model when supplied; prioritization can change based on their actual detail.

### Engineering focus / About

Use four explicit focus areas: Backend, Full-Stack, DevOps, and Technical Architecture. Separate self-described interests/focus from demonstrated project facts. Keep the sourced NovelHive service architecture; do not invent cloud providers, CI pipelines, containers, or monitoring stacks for individual projects.

### Activity

Move Discord presence away from the hero into a secondary activity area alongside GitHub and WakaTime. Retain all DOM IDs required by runtime logic, loading/empty/error states, source labels, repository search, and All/Original/Fork filters. Keep charts functional with textual summaries rather than using them as decorative hero imagery.

### Contact and footer

Keep existing working GitHub/Discord destinations and copy-ID feedback. No invented email, availability status, client claims, or LinkedIn entry.

## Theme and responsive behavior

Retain the theme toggle and stored preference. Proposed initial theme: warm light; existing explicit saved preference wins. Both light and dark require verified tokens and legible states. At phone widths use one column, reflow project metadata, retain readable diagrams or their textual equivalents, and avoid page-level horizontal overflow. Interactive targets must be at least 44px, with visible keyboard focus, semantic controls, adequate contrast, and reduced-motion support.

## Implementation boundaries

Keep SvelteKit, Svelte, Vite, and the server-only WakaTime endpoint. Reuse existing GitHub fallback and Lanyard lifecycle logic. Add Anime.js as the explicitly approved runtime dependency, using the current documented API and a reproducible lockfile entry. Retain the locally vendored Lenis 1.3.26 rather than adding a second copy. No new backend, credentials, analytics, or unrelated runtime dependencies are required. Markup changes must preserve the interaction contract or update all matching selectors and verify behavior. Consolidate affected CSS instead of stacking another final override layer. Keep private keys out of public configuration and source.

## Goals and non-goals

Goals: a coherent editorial redesign, clear role positioning, project-first hierarchy, retained integrations, accurate additional projects when evidence arrives, and accessible phone/desktop behavior.

Non-goals: changing API providers, introducing a CMS, publishing the portfolio, committing/pushing, creating a resume, adding fabricated testimonials or metrics, and exposing LinkedIn.

## Design review and implementation sequence

1. Review this specification for buildability and resolve minor implementation choices without changing scope.
2. Obtain user approval of the design and acknowledge the missing project content.
3. Write an implementation plan.
4. Produce a visual draft for review before implementing product code, unless the user explicitly asks to skip the visual draft. Do not send repository source or personal data to a third-party design service without specific authorization.
5. Implement and verify. A draft or unavailable check must not be described as a verified deliverable.

## Acceptance criteria

- All four requested focus areas are visible, with backend/full-stack as the primary role.
- The selected editorial direction is clear in typography, composition, spacing, and palette.
- All six existing projects remain accessible through working source/demo links.
- No new project entry appears without supplied or verified details.
- No LinkedIn URL, link, icon, embed, or integration is introduced into the portfolio.
- GitHub fetch/fallback, search/filter, WakaTime, Discord presence, copy feedback, navigation, and theme remain functional.
- Verify build, type checking, and applicable lint checks; report pre-existing failures separately.
- Browser-check phone and desktop layouts, both themes, loading/empty/error paths, keyboard access, reduced motion, and changed interactive elements. Record actual outcomes; do not invent pass results.
- Run the relevant antislop delivery checks for changed UI before claiming completion.

## Outstanding input

The user approved starting with the six existing projects. Additional LinkedIn Projects content must still be supplied before those projects can be added. This content gap does not authorize fabricated portfolio content.
