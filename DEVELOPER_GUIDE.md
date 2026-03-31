# Developer Guide: NBS-Card-Scoring Monorepo

## Tech stack
- Angular 18 frontend (Nx 18)
- NestJS 10 backend with Fastify adapter

## 1) Project structure
- frontend: `apps/nbs-card-scoring-frontend/src/app/`
  - `app.module.ts`
  - `app.component.ts` / `.html` / `.css`
  - `shared/` (models, services)
- backend: `apps/nbs-card-scoring-backend/src/`
  - `main.ts`
  - `app.ts`

## 2) Environments
- `apps/nbs-card-scoring-frontend/src/environments/environment.ts` (local/dev)
- `apps/nbs-card-scoring-frontend/src/environments/environment.staging.ts`
- `apps/nbs-card-scoring-frontend/src/environments/environment.prod.ts`

## 3) Storage and auth logic
- frontend `shared/storage.service.ts` and `auth.service.ts`
- User state: localStorage for registered user, sessionStorage for guest
- Guest flow: session first, optional local save before unload

## 4) Backend Node service (in-memory, for local dev)
- Express with routes:
  - `POST /api/signup`
  - `POST /api/login`
  - `GET /api/users`
- Use `apps/nbs-card-scoring-backend/project.json` with Node target
- `tsconfig` for Node: `apps/nbs-card-scoring-backend/tsconfig.app.json`

## 5) Nx targets
- Frontend project: `apps/nbs-card-scoring-frontend/project.json`
- Backend project: `apps/nbs-card-scoring-backend/project.json`
- Root scripts in `package.json`:
  - `npm run start`
  - `npm run build:frontend`
  - `npm run build:backend`
  - `npm run lint`
  - `npm test`

## 6) Workflow commands
- `npm install`
- `npm run start` (front end on `localhost.shankar.com:1928`)
- `npx nx serve nbs-card-scoring-backend`
- `npx nx build nbs-card-scoring-frontend --configuration=production`
- `npx nx build nbs-card-scoring-backend --configuration=production`

## 6.1) Git branches + CI updates
- GitHub Actions now runs on every commit for all branches
- Node 20 for frontend/backend (explicit setup-node 20)
- no Nx cache in CI; `npm install` for fresh dependency install each run

## 6.2) Local cleanup
- `.gitignore` includes `/.nx`, `/dist`, `/out-tsc`, `/coverage`
- remove build outputs and `.nx` if previously checked in: `git rm -r --cached .nx dist out-tsc coverage`

## 7) Github Actions template notes
- path: `.github/workflows/ci.yml`
- Steps: checkout, setup-node, npm ci, lint, test, build(frontend+backend), optional deploy
- Use matrix for environments (local/dev, staging, prod)

## 8) Next improvements
- Add real backend DB for user auth
- Add JWT-based auth for API
- Add e2e tests for flows (Cypress/vitest)
- Add backend env config via `process.env` with `dotenv`

## 2) Auth data model
- `User`:
  - `username: string`
  - `password: string` (for demo only; hash in real app)
  - `name: string`
  - `email: string`
  - `phone?: string`

## 3) Storage helpers (local/session)
- Create `src/app/shared/storage.service.ts`:
  - `getUsers(): User[]`
  - `saveUsers(users: User[]): void`
  - `getCurrentUser(): User | null`
  - `setCurrentUser(user: User | null): void`
  - `getGuestState(): GuestState | null`
  - `setGuestState(state: GuestState): void`
  - `clearGuestState()`


## 4) Auth Service (mock backend)
- `src/app/auth/auth.service.ts`:
  - `login(username, password)` checks localStorage user list
  - `signUp(userDto)` validates unique username and adds to localStorage
  - `guestStart(guestName?)` creates temporary fields in sessionStorage

## 5) UI component behavior
### Home component
- route: `/home`
- welcoming card at center with same style as login/signup (`max-width: 460px`, border `1px solid #ddd`, radius `8px`, `padding: 24px`)
- actions: login, signup, guest buttons

### Login component
- form controls: `username`, `password`
- on submit: call `AuthService.login()`
- navigate to `dashboard` on success

### Signup component
- form controls: `username`, `password`, `confirmPassword`, `name`, `email`, `phone?`
- validation: password match, email format
- on submit: call `AuthService.signUp()`

### Guest component
- prompt optional username
- call `AuthService.guestStart(name)`
- create session item: `sessionStorage.setItem('card-scoring-guest', JSON.stringify({username, progress}))`
- add `beforeunload` listener to ask save to local:
  - if accepted: `localStorage.setItem('card-scoring-guest', ...)`

## 6) Session recovery
- app init in `app.component.ts`:
  - check `localStorage.getItem('card-scoring-guest')` first
  - else `sessionStorage.getItem('card-scoring-guest')`
  - set app state accordingly

## 7) Jest tests
- `apps/ui/src/app/app.component.spec.ts`
  - `it('should register a user', async ... )`
  - `it('should login with registered user')`
  - `it('should fail login with invalid password')`
  - `it('should start and save guest session')`

## 8) ESLint rules
- extend with `@nrwl/nx/angular`, `@typescript-eslint/recommended`, `plugin:@angular-eslint/recommended`

## 9) GitHub Actions CI template
- Path: `.github/workflows/ci.yml`
- Steps:
  1. checkout
  2. setup-node
  3. npm ci
  4. npx nx lint ui
  5. npx nx test ui --watch=false --codeCoverage
  6. npx nx build ui --prod
  7. optional: deploy to Vercel/Netlify via CLI

## 10) Mobile support path
- Use PWA support + responsive design
- For native shell (Capacitor): map to `Capacitor.Storage` if `localStorage` unavailable

## 11) Next improvements
- Replace mock auth with backend API + JWT
- Add real database for users (`POST /api/register`, `POST /api/login`)
- Encrypt stored credentials and session tokens
