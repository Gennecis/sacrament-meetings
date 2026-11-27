# Sacrament Meeting Planner

A Next.js (App Router) app for viewing, navigating and printing sacrament meeting programs. Built with TypeScript and Tailwind CSS for WDD 430 by Pascal Okezie.

## Features

- Typed meeting data (`lib/types.ts`) stored in a Neon Postgres database (`lib/meetings-db.ts`)
- Meeting search with a debounced input and URL-based pagination (5 meetings per page)
- Route groups: `(public)` for member pages and `(admin)` for bishopric pages
- Meeting list, meeting detail and a `/meetings/current` route that redirects to the most recent Sunday's meeting
- Print-friendly program view
- API routes for meetings with an optional date filter
- Create, edit and delete meetings with Server Actions (`lib/actions.ts`), validated on the server with Zod
- Accessible forms: labelled fields, field-level errors announced to screen readers, and a pending state while saving
- Error boundaries for the meetings routes and a not-found page for missing meetings

## Routes

| Route | Description |
| --- | --- |
| `/` | Home |
| `/meetings` | All meetings, newest first. Supports `?query=` and `?page=` |
| `/meetings/[id]` | Program for one meeting, with a print button |
| `/meetings/current` | Redirects to the most recent Sunday's meeting |
| `/meetings/new` | Create a meeting |
| `/meetings/[id]/edit` | Edit a meeting. Shows a not-found page for an unknown id |
| `/api/meetings` | Meetings as JSON. Optional `?date=YYYY-MM-DD` filter, or `?query=` and `?page=` |
| `/api/meetings/[id]` | One meeting as JSON. Returns 400 for a non-numeric id and 404 when not found |

## Run locally

The app reads `DATABASE_URL` from `.env.local`. With the Vercel project linked, pull it with:

```bash
npx vercel env pull .env.local
```

Then:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
