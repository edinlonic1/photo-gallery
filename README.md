# Important

## Improvements & Additions

Since I had some free time, I decided to go a bit beyond what was asked in the task. Below is a list of improvements and additions I made:

1. In the wireframe, Gallery and Favorites are positioned in the middle of the screen. Since I only received a wireframe and not actual Figma mockups, I took the liberty to position them in a way that I felt provides better UX and is more visually pleasing.

2. Added a dark and light theme — it felt like a natural improvement.

3. Added the ability to download a photo from the details view, since a user might want to save an image they like.

4. Added the ability to open the photo details view directly from the gallery/timeline. This allows users to preview a larger version before deciding to add it to favorites, instead of having to save it first and then open it from the favorites page.

5. Made the header sticky. Initially, it would disappear when scrolling, so users had to scroll back to the top to switch to Favorites, which wasn’t ideal.

6. Added a “scroll to top” feature, improving usability when browsing long lists of photos.

7. Mocked a hardcoded list of authors and displayed it under each photo. This was mainly to make the UI feel more complete and realistic.

---

## Possible Improvements

1. I’m not fully satisfied with the details view being a separate page. The issue is that when a user scrolls down, opens a photo, and then presses back, they lose their previous scroll position. A better approach would be using an auxiliary route or a modal. This way, the route can still be accessed directly while keeping the timeline rendered in the background.

2. Mobile gestures could be added, allowing users to swipe between photos in the details view.

3. A masonry (Pinterest-like) layout could be implemented. I experimented with it briefly, but didn’t like the result enough to include it.

**Angular 21** photo gallery app featuring infinite scrolling, favorites management, dark/light theming, and a fully zoneless, signal-driven architecture.

![Angular](https://img.shields.io/badge/Angular-21.2.7-dd0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
![Material](https://img.shields.io/badge/Angular%20Material-21.2.5-673ab7?logo=material-design&logoColor=white)
![Tests](https://img.shields.io/badge/Unit%20Tests-41%20passing-brightgreen)
![E2E](https://img.shields.io/badge/E2E%20Tests-47%20passing-brightgreen)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Running Tests](#running-tests)
- [End-to-End Tests (Cypress)](#end-to-end-tests-cypress)
- [Deployment (GitHub Pages)](#deployment-github-pages)
- [Architecture](#architecture)
- [Routes](#routes)
- [Theming](#theming)
- [Configuration](#configuration)
- [Test Coverage](#test-coverage)

---

## Features

- **Infinite Scroll Gallery** — Browse photos with automatic pagination using `IntersectionObserver` (pre-fetches 200px before you reach the bottom)
- **Favorites Management** — Toggle favorites with a heart button, view saved photos on a dedicated page, and inspect full-size details
- **LocalStorage Persistence** — Favorites and theme preference survive browser refreshes
- **Dark / Light Mode** — Instant theme switching via CSS custom properties, no re-render needed
- **Zoneless Architecture** — No `zone.js` in production; Angular Signals drive all change detection
- **Responsive Design** — Fluid CSS grid adapts from mobile to desktop
- **Material Design 3** — Angular Material with M3 violet/rose palette

---

## Tech Stack

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| Framework        | Angular 21.2.7 (standalone components, zoneless)                 |
| UI Library       | Angular Material 21.2.5 (M3 theming)                            |
| State Management | Signal-based stores (`signal()`, `computed()`, `effect()`)       |
| Language         | TypeScript ~5.9 (strict mode)                                   |
| Styling          | SCSS + CSS custom properties (`--app-*`)                         |
| Build System     | `@angular/build` (esbuild + Vite)                                |
| Unit Tests       | Karma + Jasmine (ChromeHeadless)                                 |
| E2E Tests        | Cypress 15.13 (Chrome)                                           |
| Photo Source     | [Lorem Picsum](https://picsum.photos) (deterministic seed URLs)  |

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool         | Minimum Version | Check Command        |
| ------------ | --------------- | -------------------- |
| **Node.js**  | 18.19+          | `node --version`     |
| **npm**      | 9+              | `npm --version`      |
| **Angular CLI** | 21.x        | `ng version`         |
| **Chrome**   | Any recent      | Required for tests   |

> **Note:** If you don't have the Angular CLI installed globally, all commands below use the local `ng` binary via `npm` scripts, so global installation is optional.

---

## Installation

1. **Clone the repository** (or navigate to the project directory):

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This installs all packages defined in `package.json`, including Angular, Angular Material, RxJS, Karma, and TypeScript.

3. **Verify the installation:**

   ```bash
   npx ng version
   ```

   You should see Angular CLI 21.x and Angular 21.x in the output.

---

## Running the App

Start the development server:

```bash
npm start
```

This runs `ng serve` under the hood. Once compiled, open your browser to:

```
http://localhost:4200
```

The app supports **hot module replacement** — changes to source files will automatically reload in the browser.

### Additional dev commands

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `npm start`      | Start dev server at `http://localhost:4200`           |
| `npm run watch`  | Build in watch mode (development configuration)      |

---

## Building for Production

Generate an optimized, minified production build:

```bash
npm run build
```

Build artifacts are output to:

```
dist/gallery-template/
```

### Production build characteristics

- **Tree-shaken & minified** with esbuild
- **Output hashing** on all files for cache-busting
- **Budget limits:** 500 KB warning / 2 MB error for the initial bundle
- **Typical bundle size:** ~284 KB initial

To preview the production build locally, serve the `dist/gallery-template/browser` folder with any static file server:

```bash
npx http-server dist/gallery-template/browser -o
```

---

## Running Tests

The project uses **Karma** with **Jasmine** and runs tests in **ChromeHeadless**.

### On Windows

Chrome must be discoverable. If Karma cannot find Chrome automatically, set the `CHROME_BIN` environment variable:

```powershell
# PowerShell
$env:CHROME_BIN = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm test
```

```cmd
# Command Prompt
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test
```

### On macOS / Linux

Chrome is typically detected automatically:

```bash
npm test
```

If not, set `CHROME_BIN`:

```bash
export CHROME_BIN=$(which google-chrome || which chromium-browser)
npm test
```

### What `npm test` does

Runs `ng test --no-watch --no-progress --browsers=ChromeHeadless`, which:

1. Compiles all `*.spec.ts` files
2. Launches a headless Chrome instance
3. Executes all 30 test cases
4. Prints results to the terminal
5. Exits with code 0 on success, non-zero on failure

### Running tests in watch mode

For development, you may want tests to re-run on file changes:

```bash
npx ng test --browsers=ChromeHeadless
```

(Omitting `--no-watch` enables watch mode.)

---

### Path Aliases

The project configures TypeScript path aliases in `tsconfig.json` for clean imports:

| Alias          | Maps To               |
| -------------- | ---------------------- |
| `@core/*`      | `src/app/core/*`       |
| `@shared/*`    | `src/app/shared/*`     |
| `@features/*`  | `src/app/features/*`   |
| `@layout/*`    | `src/app/layout/*`     |

---

## Architecture

### Zoneless Change Detection

The app uses `provideZonelessChangeDetection()` instead of `zone.js`. All components use `ChangeDetectionStrategy.OnPush`, and Angular Signals (`signal()`, `computed()`) drive reactivity. This eliminates zone.js monkey-patching and reduces the production bundle.

### Signal-Based Stores

State is managed through two injectable signal stores:

- **`PhotosStore`** — Manages the paginated gallery (`photos`, `loading`, `hasMore`, `isEmpty`). Exposes `loadMore()` for infinite scroll and `reset()` to clear state.
- **`FavoritesStore`** — Manages favorite photos (`favorites`, `count`). Exposes `addFavorite()`, `removeFavorite()`, `toggleFavorite()`, `isFavorite()`, and `getById()`. Uses `effect()` to reactively persist to `localStorage` whenever favorites change.

### Infinite Scroll

The `GalleryComponent` uses the browser's `IntersectionObserver` API with a sentinel `<div>` at the bottom of the grid. When the sentinel enters the viewport (with a `rootMargin` of `200px`), the next page of photos is fetched automatically.

### Photo Generation

`PhotoApiService` generates deterministic photo URLs using [Lorem Picsum's](https://picsum.photos) seed-based scheme (`picsum.photos/seed/{seed}/width/height`). Each page produces 20 unique photos with varied aspect ratios and author names. A simulated 200–300ms delay mimics real API latency.

### Component Architecture

| Type            | Example                | Responsibility                              |
| --------------- | ---------------------- | ------------------------------------------- |
| **Smart/Page**  | `GalleryComponent`     | Injects stores, orchestrates data flow      |
| **Dumb/UI**     | `PhotoCardComponent`   | Receives data via inputs, emits events      |
| **Layout**      | `ShellComponent`       | Structural wrapper for header + router      |

---

## Routes

All routes are **lazy-loaded** via dynamic `import()`:

| Path           | Component              | Title          | Description                       |
| -------------- | ---------------------- | -------------- | --------------------------------- |
| `/`            | `GalleryComponent`     | Photo Gallery  | Infinite scroll gallery           |
| `/favorites`   | `FavoritesPageComponent` | My Favorites | Grid of saved favorite photos     |
| `/photos/:id`  | `PhotoDetailsComponent` | Photo Details | Full-size image with metadata     |
| `**`           | —                      | —              | Redirects to `/`                  |

Route parameters (`:id`) are automatically bound to component inputs via `withComponentInputBinding()`.

---

## Theming

### Material Design 3

The app uses Angular Material's M3 theming system with a **violet primary** and **rose tertiary** palette.

### CSS Custom Properties

All components reference `--app-*` CSS variables defined in `src/styles.scss`. This enables instant theme switching without triggering Angular change detection:

| Variable                    | Purpose                              |
| --------------------------- | ------------------------------------ |
| `--app-bg`                  | Page background                      |
| `--app-surface`             | Card / surface background            |
| `--app-text-primary`        | Primary text color                   |
| `--app-text-secondary`      | Secondary / muted text               |
| `--app-header-bg`           | Header background                    |
| `--app-favorite-color`      | Heart icon color (`#e53935`)         |
| `--app-card-radius`         | Card border radius (`12px`)          |
| `--app-shadow-card`         | Card elevation shadow                |
| `--app-shadow-hover`        | Hover-state shadow                   |
| `--app-transition-fast`     | Quick transitions (`0.2s`)           |
| `--app-transition-normal`   | Standard transitions (`0.3s`)        |

### Dark Mode

Toggling the dark theme adds a `dark-theme` class to `<body>`, which overrides the CSS variables with dark values. The preference is persisted to `localStorage` under the key `photo_library_theme`.

---

## Configuration

Application constants are defined in `src/app/core/config/app.config.ts`:

```typescript
export const environment = {
  production: false,
  picsumApiBase: 'https://picsum.photos',
  pageSize: 20,            // Photos per page
  apiDelayMin: 200,        // Minimum simulated API delay (ms)
  apiDelayMax: 300,        // Maximum simulated API delay (ms)
};
```

### Data Model

```typescript
export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  width: number;
  height: number;
}
```

### LocalStorage Keys

| Key                        | Purpose                     |
| -------------------------- | --------------------------- |
| `photo_library_favorites`  | Persisted favorites array   |
| `photo_library_theme`      | Theme preference (`dark`)   |

---

## Test Coverage

The project includes **30 unit tests** across 7 spec files:

| Spec File                          | Tests | What's Covered                                              |
| ---------------------------------- | :---: | ----------------------------------------------------------- |
| `app.component.spec.ts`           |   1   | App bootstraps successfully                                 |
| `photo-api.service.spec.ts`       |   4   | Photo count, unique IDs across pages, valid picsum URLs     |
| `photos.store.spec.ts`            |   5   | Empty initial state, loading flag, append on load, no duplicate loads, reset |
| `favorites.store.spec.ts`         |   8   | Add, remove, toggle, duplicates guard, localStorage persist & restore, getById |
| `photo-card.component.spec.ts`    |   5   | Card click event, favorite toggle event, heart icon states  |
| `gallery.component.spec.ts`         |   3   | Component creation, card rendering, favorite toggle         |
| `favorites-page.component.spec.ts`|   4   | Component creation, card rendering, removal, navigation     |


### Quick test commands reference

```bash
# Run all tests (headless, single run)
npm test

# Run tests in watch mode
npx ng test --browsers=ChromeHeadless

# Run tests with code coverage report
npx ng test --no-watch --code-coverage
```

---

## End-to-End Tests (Cypress)

The project includes **47 Cypress e2e tests** across 6 spec files that cover all core user flows.

### Prerequisites

The dev server must be running before executing e2e tests:

```bash
# Terminal 1 — start the app
npm start

# Terminal 2 — run e2e tests
npm run e2e
```

### Running e2e tests

| Command | Description |
| --- | --- |
| `npm run e2e` | Run all e2e tests headless in Chrome |
| `npm run e2e:open` | Open the interactive Cypress UI |
| `npx cypress run --spec "cypress/e2e/gallery.cy.ts"` | Run a single spec file |

### Test suites

| Spec File | Tests | What's Covered |
| --- | :---: | --- |
| `routing.cy.ts` | 6 | Route navigation, back navigation, unknown route redirect |
| `gallery.cy.ts` | 7 | Photo grid rendering, infinite scroll, loading states, card navigation |
| `favorites.cy.ts` | 8 | Add/remove favorites, toggle from gallery, persistence across reloads, empty state |
| `photo-details.cy.ts` | 12 | Full-size image, metadata, favorite toggle, download trigger, downloading state, not-found |
| `theme.cy.ts` | 6 | Light/dark toggle, persistence across reloads, correct theme icons |
| `header.cy.ts` | 8 | Sticky header, active nav highlighting, favorites badge, scroll-to-top |

### Test isolation

Each test starts with a clean state — `localStorage` is cleared in `cypress/support/e2e.ts` before every test run to prevent cross-test contamination.

### Configuration

The Cypress config is in `cypress.config.ts`:

- **Base URL:** `http://localhost:4200`
- **Viewport:** 1280 × 800
- **Timeout:** 10 seconds per command
- **Retries:** 1 retry in headless mode, 0 in interactive mode
- **Video/Screenshots:** Disabled for speed

---

## Deployment (GitHub Pages)

The app is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Automatic deployment (CI/CD)

Every push to the `main` branch triggers a GitHub Actions workflow that:

1. Installs dependencies (`npm ci`)
2. Builds the app with the correct base href (`/photo-gallery/`)
3. Copies `index.html` to `404.html` for SPA client-side routing
4. Deploys to GitHub Pages

**Setup steps:**

1. Push this repo to GitHub as `photo-gallery`
2. Go to **Settings → Pages** in your repository
3. Under **Build and deployment → Source**, select **GitHub Actions**
4. Push to `main` — the workflow runs automatically

Your app will be live at:

```
https://<your-username>.github.io/photo-gallery/
```

### Manual deployment (local build)

To build locally and inspect the output before pushing:

```bash
npm run build:gh-pages
```

This builds the production bundle with `--base-href /photo-gallery/`. Output is in `dist/gallery-template/browser/`.

### SPA routing on GitHub Pages

GitHub Pages is a static file host and doesn't support server-side rewrites. When a user navigates to `/photo-gallery/photos/42` directly, GitHub returns a 404. The workflow solves this by copying `index.html` to `404.html` — GitHub serves this page for unknown routes, which bootstraps Angular and lets the client-side router handle the path.

### Changing the repository name

If your repository name is different from `photo-gallery`, update two places:

1. **`package.json`** — change the `build:gh-pages` script base href:
   ```json
   "build:gh-pages": "ng build --base-href /YOUR-REPO-NAME/"
   ```

2. **`.github/workflows/deploy.yml`** — change the `--base-href` in the build step:
   ```yaml
   - run: npx ng build --base-href /YOUR-REPO-NAME/
   ```

---

## Scripts Reference

| npm Script     | Command                                                    | Purpose                    |
| -------------- | ---------------------------------------------------------- | -------------------------- |
| `npm start`    | `ng serve`                                                 | Dev server on port 4200    |
| `npm run build`| `ng build`                                                 | Production build           |
| `npm run watch`| `ng build --watch --configuration development`             | Build in watch mode        |
| `npm test`     | `ng test --no-watch --no-progress --browsers=ChromeHeadless` | Run unit tests (single run) |
| `npm run e2e`  | `cypress run`                                              | Run e2e tests headless     |
| `npm run e2e:open` | `cypress open`                                         | Open Cypress interactive UI |
| `npm run build:gh-pages` | `ng build --base-href /photo-gallery/`           | Build for GitHub Pages     |

---

## License

This project is private and not published to npm.
