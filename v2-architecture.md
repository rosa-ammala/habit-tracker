# Habit Tracker v2

Habit Tracker v2 is the current main version of the application. It replaced the earlier full-stack implementation with a revised architecture where backend responsibilities, API caching, optimistic updates, date handling, and UI state are separated more clearly.

The frontend is responsible for presentation, view state, modal state, filtering, date navigation, and optimistic UI updates. Server state is fetched and cached with RTK Query.

## What changed from legacy-main

- Reworked the full-stack architecture to separate backend data responsibilities, frontend UI state, and server-state caching more clearly.
- Replaced the earlier frontend data flow with Redux Toolkit UI state and RTK Query server-state management.
- Made RTK Query responsible for habit/category fetching, cache invalidation, and optimistic habit log updates.
- Kept persisted habit data, habit logs, and category data behind backend API endpoints.
- Centralized current and best streak calculation in the backend response.
- Improved date handling with date-only strings and timezone-aware future-date validation.
- Updated the habit detail page to use RTK Query caching and optimistic log updates.
- Expanded automated testing across backend route behavior, backend date/streak logic, frontend components, utility logic, RTK Query cache behavior, Playwright flows, and accessibility checks.

## Current technical stack

- Backend: Node.js, Express, TypeScript, Prisma, MySQL
- Frontend: React, TypeScript, Vite, Tailwind CSS
- State: Redux Toolkit for UI state, RTK Query for server state
- Tests: Vitest, Testing Library, Supertest, Playwright, axe

## Current data model

Habit:
- id
- title
- categoryId
- createdAt
- category
- logs
- currentStreak
- bestStreak

HabitLog:
- id
- habitId
- date

Category:
- id
- name
- icon

Future model ideas:
- User
- HabitSchedule
- HabitGoal

## Current API

```text
GET    /api/health

GET    /api/categories
POST   /api/categories

GET    /api/habits
GET    /api/habits/:id
POST   /api/habits
PATCH  /api/habits/:id
DELETE /api/habits/:id

POST   /api/habits/:id/logs
DELETE /api/habits/:id/logs/:date
```

Habit responses include:
- `category`
- `logs`
- `currentStreak`
- `bestStreak`

Example response shape:

```ts
type HabitResponse = {
  id: number;
  title: string;
  categoryId: number;
  category: Category;
  logs: HabitLog[];
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
};
```

Categories are currently seeded by the backend and fetched through the API. Category management through the UI is intentionally left for future development.

## State responsibilities

RTK Query owns server state:
- habit list
- habit detail
- categories
- create, update, and delete habit mutations
- add and delete habit log mutations

Redux UI slice owns UI state:
- selected view: day, week, or month
- selected date
- active modal
- selected habit id for edit/delete modals

React local state owns component-local state:
- form fields
- form errors
- selected category filter
- local pending state for day-cell interactions

## Cache and optimistic updates

RTK Query caches backend responses. Normal habit changes use tag invalidation, while habit log toggles use optimistic cache updates for immediate UI feedback.

Tags:
- `Habits` for the habit list
- `Habit:{id}` for a single habit
- `Categories` for categories

Rules:
- `createHabit` invalidates `Habits`
- `updateHabit` invalidates `Habits` and `Habit:{id}`
- `deleteHabit` invalidates `Habits` and `Habit:{id}`
- `addHabitLog` and `deleteHabitLog` optimistically update `getHabits` and `getHabitById`
- successful log mutations replace cached habit data with the backend response
- failed log mutations roll back the optimistic cache patch

This keeps the UI responsive while the backend remains the source of truth for persisted logs and calculated streaks.

## Date and timezone strategy

The app tracks habits by local calendar day, not by exact timestamp.

The frontend sends date-only strings in `YYYY-MM-DD` format. For log mutations and habit fetching, it also sends the user's timezone from `Intl.DateTimeFormat().resolvedOptions().timeZone`.

The backend stores habit log dates as date-only values. The timezone is used to decide the user's current local day and to reject future log dates.

Rules:
- users cannot log future dates
- habit logs are tied to calendar dates
- stored logs do not shift if the user's timezone later changes
- week views start on Monday
- day, week, and month navigation cannot move into the future
- the frontend displays backend-provided streak values instead of calculating streaks locally

## Current known limitations

- The app does not yet include user accounts or authentication.
- Habits and categories are not user-owned yet.
- Categories are seeded by the backend instead of being managed through the UI.
- Habit logs are currently fetched as full history instead of year-based API queries.
- Form validation and error handling are intentionally lightweight for the MVP.

## Future development

- User accounts and authentication.
- User-owned habits and categories.
- Category management in the UI.
- Habit schedules and habit goals.
- Analytics and insights for longer-term habit trends.
- Year-based habit log queries, for example `GET /api/habits?year=2026`.
- Stronger shared validation between frontend and backend.
- Continued mobile UX and accessibility improvements.
