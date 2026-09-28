# Paddock Pass

Your all-access pass to Formula 1 data — sessions, drivers, results, and lap times powered by the [OpenF1 API](https://openf1.org).

## Features

- **Home** — Season overview, next race, and recent results
- **Calendar** — Full race weekend schedule grouped by Grand Prix
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

## Design System

Reusable `pp-*` components live in `src/app/design-system/`:

| Component | Purpose |
|-----------|---------|
| `pp-button` | Primary, secondary, ghost actions |
| `pp-card` | Surface container with optional team colour stripe |
| `pp-badge` | Session type and status labels |
| `pp-driver-avatar` | Driver headshot with number badge |
| `pp-stat-block` | Metric display block |
| `pp-spinner` | Loading indicator |
| `pp-empty-state` | Empty/error states |
| `pp-page-header` | Consistent page titles |

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
