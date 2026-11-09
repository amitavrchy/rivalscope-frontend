# RivalScope frontend

Next.js/React frontend for the RivalScope API. Public marketing renders without the API. Authenticated workspaces use real server responses and private in-memory React Query data with background revalidation; no private seed records are statically bundled or persisted in localStorage.

Use Node 24 and this repository's independent lockfile:

```sh
npm ci
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm audit
```

The frontend forwards `/api` to the server-only `API_INTERNAL_URL` build destination. Set it before building; rebuild after changing it. Local development defaults to the local backend. Netlify builds reject a missing/non-HTTPS destination. Never put provider/database secrets into frontend variables.

For Netlify, import this repository with base/package directory at its root, build `npm run build`, publish `.next`, Node 24 and the adapter configured in `netlify.toml`. `NETLIFY` selects adapter-compatible output; Docker/local builds use standalone output. `scripts/start.mjs` serves that standalone build with static assets. Configure the backend's exact HTTPS origin allowlist to the actual frontend domain. Same-origin proxy requests retain HttpOnly, Secure production, SameSite Lax cookies and Origin checks.

Loading states explain backend startup delays. Fetches time out with an honest error; writes are never automatically retried or reported successful on a network failure. Successful login clears the prior in-memory query cache.

`npm run test:e2e` runs the real API/proxy/browser flow after both production builds. It starts the sibling backend and this frontend on a dedicated local port, using an isolated database/Redis supplied through `DATABASE_URL`, `REDIS_URL`, `APP_ORIGIN`, `ALLOWED_ORIGINS`, `ENCRYPTION_KEY`. The config uses a local SMTP queue configuration; it does not run a mail-delivery worker. Never use production credentials/database for these tests. Browser artifacts are ignored because traces can contain synthetic credentials/session data.

Deployment approval, persistent services, provider credentials, seed provenance and full verification are documented in the sibling backend's `DEPLOYMENT.md`, `SEED-DATA.md` and this repository's [verification report](VERIFICATION.md). Historical hosting URLs are not verified current-account deployments. No public deployment was performed.

`npm run test:marketing` checks the static public landing page at 360, 768, 1280 and 1920px, no-JavaScript HTML, keyboard FAQs and account-token entry without a backend. Netlify?s built-in `URL` supplies the social-image origin; local builds use localhost.
