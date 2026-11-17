# Aevor Frontend

## Setup

```sh
npm ci
npm run dev
```

The app uses `http://localhost:8080` as the API base URL by default. To use
another API, create `.env.local` and set `VITE_API_BASE_URL`. Set
`VITE_USE_MOCKS=true` to run the frontend without an API.

## Validation

```sh
npm run lint
npm run test:run
npm run build
```
