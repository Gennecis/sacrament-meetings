# Sacrament Meeting Planner

A Next.js (App Router) app for viewing, navigating and printing sacrament meeting programs. Built with TypeScript and Tailwind CSS for WDD 430 by Pascal Okezie.

## Features

- Typed meeting data (`lib/types.ts`) served from an in-memory store (`lib/meetings-db.ts`)
- Meeting list, meeting detail and a `/meetings/current` route that redirects to the most recent Sunday's meeting
- Print-friendly program view
- API routes for meetings with an optional date filter

## Routes

| Route | Description |
| --- | --- |
| `/` | Home |
| `/meetings` | All meetings, newest first |
| `/meetings/[id]` | Program for one meeting, with a print button |
| `/meetings/current` | Redirects to the most recent Sunday's meeting |
| `/api/meetings` | All meetings as JSON. Optional `?date=YYYY-MM-DD` filter |
| `/api/meetings/[id]` | One meeting as JSON. Returns 400 for a non-numeric id and 404 when not found |

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
