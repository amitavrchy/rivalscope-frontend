# RivalScope

Evidence-backed competitor research, market intelligence, and monitoring for product and strategy teams.

**Live app:** [https://rivalscope-132.netlify.app](https://rivalscope-132.netlify.app)  
**Live API:** [https://rivalscope-api.onrender.com](https://rivalscope-api.onrender.com)  
**API source:** [github.com/amitavrchy/rivalscope-backend](https://github.com/amitavrchy/rivalscope-backend)

## Overview

RivalScope is the web client for a competitive-intelligence workspace. A team describes a business, points research at public pages, and reads findings that stay attached to quotations and source URLs. SWOT, opportunities, PESTLE, Five Forces, and recommendations are presented as interpretation. Where a fact was not extracted, the interface says so.

This repository is the frontend only. Accounts, research jobs, billing, and monitoring run in the API above. Next.js proxies browser calls from `/api/*` to that service, so the app and the API share one origin in the browser. The proxy target is `API_INTERNAL_URL`, or `http://127.0.0.1:4000` when that variable is unset. Provider secrets stay in the backend environment.

## Key features

- **Workspace.** Projects, an overview of sources and reports, evidence coverage, and a light or dark theme.
- **Research.** Objectives, standard or deep runs, a competitor count, public URLs or web discovery, source freshness, optional countries, a credit estimate before the run starts, and a cancellable pipeline: plan, search, extract, analyze, catalog, verify, report.
- **Evidence.** Competitor profiles, quoted findings, an evidence-backed comparison matrix, published pricing with history, and a positioning chart that plots only documented monthly prices.
- **Monitoring and alerts.** Scheduled checks of public pages, before-and-after snapshots, alert rules, and in-app notifications.
- **Copilot.** Questions answered from saved project evidence, with citations and stated limitations.
- **Reports.** Export to JSON, Markdown, PDF, and Word. Expiring workspace or public links, with an optional password, open at `/shared/[token]`.
- **Collaboration.** Invitations and roles (owner, admin, analyst, editor, viewer, billing manager), team notes, personal bookmarks, and project participants.
- **Account and billing.** Email and password, email verification, MFA, optional Google sign-in, plans, a credit ledger, and Stripe checkout and the billing portal when an operator has configured them.
- **Operator tools.** Integration status, workspace API keys, webhooks, notification channels, and a platform administration console for plans, credits, jobs, flags, and audit data.

Google sign-in, automatic source discovery, and payments appear when the API reports them as configured. Password sign-in remains available either way.

## Tech stack

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 App Router, Cache Components, partial prefetching |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Lucide |
| Data | TanStack Query, route handlers proxied with a rewrite in `next.config.ts` |
| Forms | React Hook Form and Zod |
| Charts | Recharts |
| Type | Local Geist, Geist Mono, and Noto Sans Bengali. Interface text uses a 14px minimum. |

## Project structure

One Next.js application. Application code is under `src/`. Toolchain and deploy files stay at the repository root, which is where Next.js, npm, Docker, and Netlify expect them.

```
src/app/            routes, global styles, favicon
src/components/     marketing, auth, workspace, and UI
src/fonts/          local licensed fonts
src/lib/            typed API client
public/             static files
next.config.ts      /api proxy; standalone output outside Netlify
netlify.toml        Netlify build command and publish directory
Dockerfile          production image (Node.js 24)
components.json     shadcn/ui
.env.example        optional API_INTERNAL_URL
```

| Path | Purpose |
| --- | --- |
| `/` | Marketing site |
| `/login`, `/register` | Sign in and create a workspace |
| `/workspace` | Redirects to `/workspace/overview` |
| `/workspace/[section]` | Authenticated workspace |
| `/shared/[token]` | Shared report |

Workspace sections: overview, projects, research, competitors, comparisons, SWOT and opportunities, monitoring, alerts, copilot, reports, team, billing, integrations, settings, and administration.

## Getting started

Node.js 22 or newer, and npm. The Docker image uses Node.js 24. The Netlify build uses Node.js 22.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To point the proxy at an API other than `http://127.0.0.1:4000`:

```bash
cp .env.example .env.local
```

Set `API_INTERNAL_URL` in that file. It is read by the Next.js server, not by client code.

```bash
npm run lint
npm run build
npm start
```

`npm run build` typechecks the project and writes the production output. `npx tsc --noEmit` passes once Next.js has generated `.next/types` (a build or a dev session does that). On a completely fresh tree, before those files exist, `tsc` cannot see the generated `LayoutProps` type.

### Docker

The image builds standalone output and listens on port 3000.

```bash
docker build --build-arg API_INTERNAL_URL=http://api:4000 -t rivalscope-frontend .
docker run --rm -p 3000:3000 rivalscope-frontend
```

## Deployment

The live app is on Netlify, published with the Netlify CLI. `netlify.toml` is the source of those settings:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npx next build` |
| Publish directory | `.next` |
| Node.js | 22 |
| Plugin | `@netlify/plugin-nextjs` |

`next.config.ts` leaves `output` unset when `NETLIFY` is set, which the Next.js plugin provides, and uses `standalone` for Docker and other hosts. This repository layout matches that deploy. No Netlify dashboard change is required.

## Author

**Amitav Roy Chowdhury**  
[github.com/amitavrchy](https://github.com/amitavrchy)
