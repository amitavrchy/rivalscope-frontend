# RivalScope web application

Next.js 16 App Router, React 19, TypeScript, TanStack Query, Recharts and shadcn components. Shared typography uses local licensed fonts with a 14px minimum. Routes connect to the RivalScope API through the server-side `/api` proxy.

Use Node 24 and run the backend on port 4000:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. `.env.example` documents the optional server-only `API_INTERNAL_URL`. Provider credentials belong in the backend environment.

```bash
npm run lint
npm run build
```

The Dockerfile packages the standalone output and static assets. Stop a local standalone preview before rebuilding its output directory on Windows.

The complete workspace, backend submodule, Compose configuration, CI, operational documentation and Bengali user/owner/admin manuals are at [rivalscope-ai](https://github.com/amitavrchy/rivalscope-ai). Clone it with `--recurse-submodules` to run the integrated product. AI research executes in the backend worker.

Google login, automatic discovery and payments require operator configuration. Local tests use clearly labeled fixtures; the product never silently substitutes demonstration market data.
