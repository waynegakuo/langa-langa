# Langa Langa

Live sessions, driver grids, race results, and lap times — powered by the [OpenF1 API](https://openf1.org).

## Features

- **Home** — Season overview, team carousel, next race, and recent results
- **Calendar** — Full race weekend schedule grouped by Grand Prix with round navigation
- **Drivers** — Current grid organized by team with live team colours
- **Session Detail** — Classification, fastest laps, and gap times

## Tech Stack

- Angular 19 (standalone components, lazy-loaded routes)
- SCSS design system with shared tokens and mixins
- Tailwind CSS v4 for layout utilities
- OpenF1 REST API (no auth required for historical data)

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Deploy

```bash
npm run deploy
```

Builds the app and deploys to Firebase Hosting.

## Design System

Reusable `langa-*` components live in `src/app/design-system/`:

| Component | Purpose |
|-----------|---------|
| `langa-button` | Primary, secondary, ghost actions |
| `langa-card` | Surface container with optional team colour stripe |
| `langa-badge` | Session type and status labels |
| `langa-driver-avatar` | Driver headshot with number badge |
| `langa-stat-block` | Metric display block |
| `langa-spinner` | Loading indicator |
| `langa-empty-state` | Empty/error states |
| `langa-page-header` | Consistent page titles |

Design tokens and mixins are in `src/styles/_tokens.scss` and `src/styles/_mixins.scss`.

## Project Structure

```
src/app/
├── core/           # API service, models, constants
├── design-system/  # Reusable UI components
├── features/       # Route-level pages
├── layout/         # Shell and header
└── shared/         # Pipes and utilities
```
