# NBS-Card-Scoring
A full-stack card scoring app with Angular UI, local/session storage progress management, and optional backend API.

## Overview
- UI: Angular 18 (Nx 18 workspace)
- Backend: NestJS 10 + Fastify adapter
- Auth flows: Login, Signup, Guest mode
- Storage: localStorage + sessionStorage
- Testing: Jest (via Nx)
- Lint: ESLint
- CI/CD: GitHub Actions; deploy to Vercel/Netlify

## User flows
1. **Login**: username + password (username unique)
2. **Signup**: username, password, confirm password, name, email, optional phone
3. **Guest Mode**: session based, optional local persist on exit

## Routing
- base `/` and wildcard `/**` route to `/home`
- `/home` with a welcome screen and sign-out reset
- `/login`, `/signup`, `/guest` pages
- home layout: `Login` and `Sign Up` aligned at left/right, plus `Guest login`
- home card appears in the center and matches signup/login card size/style (max 460px)

## Styling
- component styles now use SCSS (`*.component.scss`) instead of CSS

## Storage behavior
- Auth data and user profile stored in localStorage (for registered users)
- Guest progress in sessionStorage first, then prompt to save to localStorage before exiting

## Local setup (Nx Angular)
1. `cd card-scoring`
2. `npm install`
3. `npm run start`

## Projects
- frontend app: `apps/nbs-card-scoring-frontend`
- backend app: `apps/nbs-card-scoring-backend`

## Serve locally
- `npm run start` (frontend at `http://localhost.shankar.com:1928`)
- `npx nx serve nbs-card-scoring-backend` (backend at `http://localhost:3333`)

## Testing
- `npm test` runs frontend tests
- `npx nx test nbs-card-scoring-backend` for backend tests

## Linting
- `npm run lint`

## Build
- `npm run build:frontend`
- `npm run build:backend`

## CI/CD base (GitHub Actions)
- `npm ci`, lint, tests, build
- Deploy `dist/apps/ui` to Vercel/Netlify

## Documentation
See `DEVELOPER_GUIDE.md` for the development implementation plan and architecture details.

