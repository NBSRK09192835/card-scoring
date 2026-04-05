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
- Auth flows: Guest-only entry
- Storage: localStorage + sessionStorage
- Testing: Jest (via Nx)
- Lint: ESLint
- CI/CD: GitHub Actions; deploy to Vercel

## User flows
1. **Enter as Guest**: a single guest entry point from the home screen
2. **Local storage persistence** for guest state and player setup
3. **Delete stored data** from the home screen

## Routing
- base `/` and wildcard `/**` route to `/home`
- `/home` welcome screen with guest entry
- `/score` scoring screen
- `/:username` player setup screen

## Styling
- component styles use SCSS (`*.component.scss`)
- cards: width `min(460px, 90vw)`, max-width `90vw`
- cards: min-height `320px`, max-height `90vh`; internal scrolling when needed
- title + content + actions have clear gap spacing

## Storage behavior
- Guest state and current user state in localStorage
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

## New flow: Guest-only entry
- home screen shows a single `Enter as Guest` button
- guest state is persisted using localStorage/sessionStorage
- user can clear stored app data from the home screen
- player setup screen is available at `/:username`
- score page remains at `/score`

