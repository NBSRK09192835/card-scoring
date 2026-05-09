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
- Guest-only auth flow: `enterAsGuest()` from home
- Guest state in sessionStorage for current session
- Optional local persistence via guest save helper

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
### Shared card style (all auth + home pages)
- wrapper uses `display: flex`, `align-items: center`, `justify-content: center`, `min-height: 100vh`
- card width: `min(460px, 90vw)` + `max-width: 90vw`
- card height: `min-height: 320px`, `max-height: 90vh`
- overflow: `auto` so long forms can scroll inside card
- page-wrapper alignment: title on top plus 1.2rem gap to content
- form fields and buttons use `gap` and `margin` spacing for readability

### Home component
- route: `/home`
- welcome title is card heading
- single action: `Enter as Guest`
- clear stored app data option available

### Guest entry
- guest is started directly from the home screen
- guest state is persisted in sessionStorage and optionally in localStorage
- player setup continues at `/:username`
- home screen also supports clearing stored app data

## 10) Testing and lint
- `npm run test` runs all unit tests with Jest via Nx
- `npm run test:coverage` generates detailed coverage report in `./coverage/index.html`

### Test Coverage Summary
- **Overall Coverage: 97.26% statements, 100% functions, 97.8% lines**
- **Total Tests: 147 passing across 12 test suites**

### Test Suite Breakdown
1. **Core Services (100% coverage)**
   - `session.service.spec.ts` - Session state management (get/set operations, data persistence)
   - `toast.service.spec.ts` - Toast notification system (timing, message display)
   - `game.service.spec.ts` - Game logic (player management, round tracking, scoring)
   - `session-facade.service.spec.ts` - Session data facade layer

2. **Components (98.33% - 100% coverage)**
   - `app.component.spec.ts` - Root app component initialization
   - `home.component.spec.ts` - Home page navigation and session management
   - `score.component.spec.ts` - Score tracking, player management, image export, sharing
   - `player-setup.component.spec.ts` - Player configuration and game setup
   - `guest.component.spec.ts` - Guest entry flow
   - `dialog-host.component.spec.ts` - Dialog confirmation/cancel logic
   - `toast.component.spec.ts` - Toast notification UI rendering

3. **Shared Services & Utilities (100% coverage)**
   - `storage.service.spec.ts` - localStorage/sessionStorage mocking and operations
   - `session-keys.const.spec.ts` - Session storage key constants

### Running Tests
```bash
# Run all unit tests
npm run test

# Run unit tests with coverage report
npm run test:coverage

# Run specific test file
npm run test -- --testPathPattern=score.component.spec.ts

# Run in watch mode
npm run test -- --watch

# View coverage report (HTML)
# Open ./coverage/index.html in browser after running test:coverage
```

### Test Configuration
- Jest configured via `jest.config.js` and `tsconfig.spec.json`
- TypeScript: `jest-preset-angular` for Angular testing utilities
- Mocking: `jest.mock()` for external dependencies (html2canvas, HTTP, etc.)
- Async: `fakeAsync`, `async`, and `jest.fn()` for timer and promise handling

### Coverage Gaps
- **Score Component (91.3%):** Complex async logic in image export and sharing edge cases
- **Player Setup Component (98.33%):** Minor branch coverage for specific error paths

## 11) Linting
- `npm run lint` runs ESLint on all TypeScript source files
- Configuration: `.eslintrc.json` at project root

## 12) GitHub Actions CI notes
- `.github/workflows/ci.yml` runs frontend tests and build on every commit
- **Test Reporting:**
  - Full test suite runs as part of CI pipeline
  - Coverage reports generated and stored in artifacts
  - Failures block merge until tests pass
- **Commands in CI:**
  - `npm install` (clean dependency install)
  - `npm run lint` (ESLint validation)
  - `npm run test` (Jest unit tests — all 147 tests must pass)
  - `npm run build:frontend` (production build verification)

## 13) Integrating Coverage to GitHub
To display coverage badges and reports on GitHub:

### Option 1: Static Badge (Simple)
Add to README.md (already done):
```markdown
[![Test Coverage: 97.26%](https://img.shields.io/badge/Test%20Coverage-97.26%25-brightgreen)](./coverage/index.html)
```

### Option 2: Codecov Integration (Advanced)
1. Sign up at [codecov.io](https://codecov.io)
2. Add Codecov action to `.github/workflows/ci.yml`:
   ```yaml
   - name: Upload coverage to Codecov
     uses: codecov/codecov-action@v3
     with:
       files: ./coverage/lcov.info
       flags: unittests
   ```
3. Codecov will comment on PRs with coverage changes

### Option 3: GitHub Pages (Coverage Report Hosting)
1. Add workflow to deploy coverage report:
   ```yaml
   - name: Deploy coverage report to GitHub Pages
     if: github.ref == 'refs/heads/main'
     uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./coverage
   ```
2. Coverage HTML report will be available at `https://username.github.io/card-scoring/coverage/`

## 14) Next improvements
- Replace mock guest state with a backend session API
- Add real database for persistent user data
- Improve local storage cleanup and multi-session guest flows

## 15) Current scoring feature additions
- `/home` is the main entry screen with a single `Enter as Guest` button
- player setup is available at `/:username`
  - welcome message: `Welcome {{username}}`
  - multi-select player list
  - custom player input plus add button
  - loss-per-head choices: 10, 20, 50, 100, 200, 300, 500
  - continue button navigates to `/score`
- `/score` route shows:
  - `Welcome {{ username }}` from `session.getUsername()`
  - sample score display and back navigation

