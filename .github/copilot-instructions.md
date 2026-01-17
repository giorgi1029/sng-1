# Copilot / AI Agent Instructions — Spotless (sng-1)

Purpose: Short, actionable guidance to help an AI coding agent be immediately productive in this repo.

## Quick start (developer commands) ✅
- Install deps: `npm install`
- Start dev server: `npm run dev` (Vite — default: http://localhost:5173)
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Linting: `npm run lint` (ESLint configured via `eslint.config.js`)

## Big picture architecture 🔧
- Frontend SPA built with **React + Vite** (entry: `src/main.jsx`, app router: `src/App.jsx`).
- Client-side routing via **react-router-dom** (Routes + Route components under `src/pages/`).
- Global state: `src/context/BusinessContext.jsx` — simple provider with `businesses` and `addBusiness`.
- Pages: `src/pages/` (LandingPage, Dashboard, signin folder containing `Signup`, `Log-in`, `BusinessForm`).
- Small presentational components in `src/components/` (e.g., `Header.jsx`, `Card.jsx`).
- Styling uses **Tailwind CSS** — `src/index.css` imports Tailwind; plugin present in `package.json`.
- Map functionality uses **react-leaflet** with a repeated icon fix applied in map components.

## Data flows & integration points 🔗
- External API base (hard-coded in code): `https://car4wash-back.vercel.app/api/carwash`
  - `Dashboard.jsx` fetches all carwashes from `GET /api/carwash` and renders markers.
  - `BusinessForm.jsx` posts registration to `POST /api/carwash/auth/register`.
  - `Dashboard.jsx` sends `DELETE /api/carwash/:id` with `Authorization: Bearer <token>` (token comes from `localStorage`).
- GeoJSON expected shape when creating businesses:
  - payload.location.coordinates = [lng, lat] (note: API expects coordinates in `[lng, lat]` order)
  - `Dashboard` reads coordinates as `coords[1]` (lat) and `coords[0]` (lng) when rendering markers.
- Local persistence: files reference `localStorage` keys `userData`, `token`, and `businesses`. Be careful when changing these keys — they are used across pages.

## Project-specific conventions & patterns 📋
- Components: PascalCase and default-exported functional components.
- Files organized by role: `components/` (reusable UI), `pages/` (route-level pages), `context/` (providers).
- API calls are made directly with `fetch` scattered in pages — there is no centralized API client module.
- Leaflet marker icon fix is duplicated in multiple files; when modifying map code, ensure icon URL merge stays consistent.
- Forms: `BusinessForm.jsx` stores `lat`/`lng` in component state and requires selecting location on map before submission.

## What to check when making changes ⚠️
- When updating API endpoints or request payloads, update both `BusinessForm.jsx` (POST) and `Dashboard.jsx` (GET/DELETE) and verify localStorage reads/writes.
- Coordinate order is critical — backend stores coordinates as GeoJSON (`[lng, lat]`) while Leaflet uses `[lat, lng]` when rendering.
- Search repo for localStorage keys before renaming them to avoid breaking persisted user state.
- No tests currently present — add focused unit / integration tests when adding critical logic (e.g., API integration, business data transformations).

## Debugging tips 🐞
- Run dev server (`npm run dev`) and use browser DevTools Network tab to inspect API requests and bodies.
- If map markers don't show, check that the response objects have `location.coordinates.coordinates` present and in expected order.
- Console and network errors in `Dashboard.jsx` and `BusinessForm.jsx` provide direct clues (fetch errors are caught and logged).

## Suggested small refactors for contributor clarity (not enforced) 💡
- Centralize API base URL and fetch helpers (e.g., `src/lib/api.js`) to avoid duplicated hard-coded URLs.
- Consolidate the Leaflet icon patch into a single module imported by map-using pages.
- Normalize `workingHours` fields in `BusinessForm.jsx` (currently `open/close` values are stored directly on `form`) so payloads are predictable.

---

If any of these items are unclear or you'd like the doc expanded with examples (e.g., exact payload shapes or a proposed `api.js`), tell me which areas to expand and I will iterate. 
