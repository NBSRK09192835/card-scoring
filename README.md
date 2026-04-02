# NBS-Card-Scoring
A frontend-only card scoring Angular app with local/session storage auth flows.

## Table of Contents
- [Overview](#overview)
- [User flows](#user-flows)
- [Routing](#routing)
- [Styling](#styling)
- [Storage behavior](#storage-behavior)
- [Local setup (Nx Angular)](#local-setup-nx-angular)
- [Projects](#projects)
- [Serve locally](#serve-locally)
- [Testing](#testing)
- [Linting](#linting)
- [Build](#build)
- [CI/CD base (GitHub Actions)](#cicd-base-github-actions)
- [Documentation](#documentation)

## Overview
- UI: Angular 18 (Nx 18 workspace)
- Auth flows: Login, Signup, Guest mode
- Storage: localStorage + sessionStorage
- Testing: Jest (via Nx)
- Lint: ESLint
- CI/CD: GitHub Actions; deploy to Vercel

## User flows
1. **Login**: username + password (username unique)
2. **Signup**: username, password, confirm password, email
3. **Guest Mode**: session-based with optional local-space save

## Routing
- base `/` and wildcard `/**` route to `/home`
- `/home` welcome screen
- `/login`, `/signup`, `/guest` pages
- home card centered (max 460px)

## Styling
- component styles use SCSS (`*.component.scss`)

## Storage behavior
- User accounts in localStorage
- Guest session in sessionStorage, optional local persistence

## Local setup (Nx Angular)
1. `cd card-scoring`
2. `npm install`
3. `npm run start`

## Projects
- frontend app: workspace root (with `src/`)

## Serve locally
- `npm run start` (frontend at `http://localhost.shankar.com:1928`)

## Testing
- `npm test` runs frontend tests

## Linting
- `npm run lint`

## Build
- `npm run build:frontend`

## CI/CD base (GitHub Actions)
- `npm install`, lint, tests, build
- Vercel deploy from `dist` directory

## Documentation
See `DEVELOPER_GUIDE.md` for implementation details and architecture notes.

## New flow: Player setup + scoring
- login path now redirects to `/<username>` for setup.
- guest mode now initiates to `/<guestname>` too.
- setup screen at `/<username>` includes:
  - welcome message: `Welcome {{username}}`
  - multi-select player list
  - add custom player input
  - loss-per-head radio choices: 10, 20, 50, 100, 200, 300, 500
  - continue button navigates to `/score`
- score page at `/score` includes:
  - `Welcome {{username}}`
  - sample player score table
  - `Apply Scores` and `Back to Home` buttons

