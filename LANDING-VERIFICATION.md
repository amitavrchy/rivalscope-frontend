# Landing page verification — 2026-11-09

- `npm run build`: passed; `/` is `○ (Static)`.
- `npm run lint` and `npm run typecheck`: passed.
- `npm run test:marketing`: 7 passed. Checks the 90% content rail at all four requested widths, no horizontal scrolling or JavaScript errors, no API requests, keyboard FAQs, visible HTML with JavaScript disabled, social metadata/image, the existing reset-token form, scroll-only motion, idle stability, reversal, pause/resume, and live reduced-motion changes.
- Chromium screenshots reviewed at 360, 768, 1280 and 1920px, including reduced-motion rendering.
- Lighthouse 13.6.0, mobile defaults, production server: performance 99, accessibility 100, best practices 100, SEO 100. Local lab measurements, not deployed-site measurements.
- `npm run test:e2e`: attempted; the existing suite could not start its backend without `DATABASE_URL` and `REDIS_URL`. Authenticated API integration was not verified.

## Deployment and design

The landing page renders from static content without server data, cookies or headers. Existing client-side verification, invitation and password-reset actions are retained inside their Suspense boundary. API proxy configuration, `netlify.toml` and `API_INTERNAL_URL` behavior are unchanged. Netlify's built-in `URL` supplies the social-image origin at build time; local builds fall back to localhost. No backend code changed and no deployment was performed.

The design preserves RivalScope's established teal brand in a dark intelligence-console setting, with a research dashboard, comparison and monitoring examples, a bento feature layout, workflow, personas and keyboard-accessible FAQs. All example research is labeled; no customer claims, pricing or social proof were invented. Motion uses CSS custom properties and a requestAnimationFrame-batched passive scroll handler, honors live reduced-motion preferences, and keeps text at full contrast during scroll reveals. No runtime dependencies were added.

## Scroll motion and width

All primary content rails use 90% of the viewport. Radar rotation, signal scale, the hero parallax and console scan are tied directly to scroll position. Sections and cards scrub into position as they enter the viewport and reverse when scrolling up. There are no autoplay loops, animation timers or continuously running frames; layout bounds are cached and remeasured on resize and font readiness. Pause/resume and live reduced-motion changes are supported. Static HTML remains fully readable without JavaScript and no runtime dependency was added.
