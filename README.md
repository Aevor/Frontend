# Aevor frontend

The React client for Aevor. It talks to the Go API in [Aevor/platform](https://github.com/Aevor/platform); this repository contains the browser application, not the API or the separate AI service.

The current UI includes the landing and OAuth callback flows, a protected application shell, dashboard, repository selection, repository workspace, issue details, skills, recommendations and profile views. API calls go through `src/api/client.js`, so the base URL and bearer-token handling stay in one place.

## Run locally

Requirements: Node.js 22.12 or newer and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The Vite dev server uses `http://localhost:5173` by default. The local API default is `http://localhost:8080`.

Set `VITE_API_BASE_URL` in `.env.local` when the API is running somewhere else:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the API separately by following the setup instructions in [Aevor/platform](https://github.com/Aevor/platform).

## Checks

```sh
npm run lint
npm run test:run
npm run build
```

Vitest runs the component and API-client tests in jsdom. The production build writes to `dist/`.

## Project layout

- `src/api/` — API client and endpoint modules.
- `src/components/` — shared application components.
- `src/hooks/` — session, resource and sync hooks.
- `src/pages/` — landing, dashboard, repository and issue screens.
- `src/routes/` — protected-route handling.

There is no production deployment URL documented yet. The frontend should be treated as an actively developed client, not as a hosted product.
