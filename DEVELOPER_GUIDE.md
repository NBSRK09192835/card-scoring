# Developer Guide: NBS-Card-Scoring (Frontend-only)

## Table of Contents
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Environments](#environments)
- [Storage and auth logic](#storage-and-auth-logic)
- [Nx targets](#nx-targets)
- [Workflow commands](#workflow-commands)
- [Git branches + CI updates](#git-branches--ci-updates)
- [Local cleanup](#local-cleanup)
- [Vercel config](#vercel-config)
- [UI component behavior](#ui-component-behavior)
- [Testing and lint](#testing-and-lint)
- [GitHub Actions CI notes](#github-actions-ci-notes)

## Tech stack
- Angular 18 frontend (Nx 18)
- No backend project

## 1) Project structure
- frontend: `src/app/`
  - `app.module.ts`
  - `app.component.ts` / `.html` / `.scss`
  - `shared/` (services)

## 2) Environments
- `src/environments/environment.ts`
- `src/environments/environment.staging.ts`
- `src/environments/environment.prod.ts`

## 3) Storage and auth logic
- frontend `shared/storage.service.ts` and `auth.service.ts`
- User state in localStorage, guest session in sessionStorage

## 4) Nx targets
- `project.json`
- Root scripts in `package.json`:
  - `npm run start`
  - `npm run build:frontend`
  - `npm run lint`
  - `npm test`

## 5) Workflow commands
- `npm install`
- `npm run start` (frontend at `http://localhost.shankar.com:1928`)
- `npx nx build nbs-card-scoring-frontend --configuration=production`

## 6) Git branches + CI updates
- GitHub Actions runs on every commit for all branches
- Node 20
- `npm install` (fresh dependency install in CI)

## 7) Local cleanup
- `.gitignore` includes `/.nx`, `/dist`, `/out-tsc`, `/coverage`

## 8) Vercel config
- `vercel.json` build command: `npm run build:frontend:prod`
- `outputDirectory`: `dist`

## 9) UI component behavior
### Home component
- route: `/home`
- card center, 460px max width, login/signup/guest actions

### Login component
- form controls: `username`, `password`
- on submit: `AuthService.login()`
- navigate to `/home` or username route

### Signup component
- form controls: `username`, `email`, `password`, `confirmPassword`
- password matching, localStorage user store

### Guest component
- optional guest username
- `AuthService.startGuest()` uses sessionStorage

## 10) Testing and lint
- `npm test`
- `npm run lint`

## 11) GitHub Actions CI notes
- `.github/workflows/ci.yml` runs frontend tests and build only

## 11) Next improvements
- Replace mock auth with backend API + JWT
- Add real database for users (`POST /api/register`, `POST /api/login`)
- Encrypt stored credentials and session tokens

## 12) Current scoring feature additions
- `/login`, `/signup`, `/guest` exist and authenticate via `AuthService`.
- `/home` base flow remains as current landing page.
- `/username` route (PlayerSetupComponent) now handles player selection:
  - `availablePlayers` and multi-select list
  - custom player input plus add button
  - `lossPerHead` radio options
  - continue triggers navigation to `/score`
- `/score` route (ScoreComponent) shows:
  - `Welcome {{ username }}` from `AuthService.getActiveUsername()`
  - basic score table and buttons for apply/back

