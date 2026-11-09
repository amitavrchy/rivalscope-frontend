# Landing page verification — 2026-11-09

- `npm run build`: passed; `/` is `○ (Static)`.
- `npm run lint` and `npm run typecheck`: passed.
- `npm run test:marketing`: 6 passed. Checks all four requested widths, no horizontal scrolling or JavaScript errors, no API requests, keyboard FAQs, visible HTML with JavaScript disabled, social metadata/image, and the existing reset-token form.
- Chromium screenshots reviewed at 360, 768, 1280 and 1920px, including reduced-motion rendering.
- Lighthouse 13.6.0, mobile defaults, production server: performance 98, accessibility 100, best practices 100, SEO 100. Local lab measurements, not deployed-site measurements.
- `npm run test:e2e`: attempted; the existing suite could not start its backend without `DATABASE_URL` and `REDIS_URL`. Authenticated API integration was not verified.

## Deployment and design

The landing page renders from static content without server data, cookies or headers. Existing client-side verification, invitation and password-reset actions are retained inside their Suspense boundary. API proxy configuration, `netlify.toml` and `API_INTERNAL_URL` behavior are unchanged. Netlify's built-in `URL` supplies the social-image origin at build time; local builds fall back to localhost. No backend code changed and no deployment was performed.

The design preserves RivalScope's established teal brand in a dark intelligence-console setting, with a research dashboard, comparison and monitoring examples, a bento feature layout, workflow, personas and keyboard-accessible FAQs. All example research is labeled; no customer claims, pricing or social proof were invented. Motion uses CSS, honors reduced-motion preferences, and keeps text at full contrast during scroll reveals. No runtime dependencies were added.
