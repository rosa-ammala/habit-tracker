# Goal

Habit Tracker v2 separates server state from UI state. Backend owns habit logic such as logs, dates and streaks. Frontend uses RTK Query to fetch, cache and update backend data predictably.

## V2 technical decisions

- Backend: Node + Express + TypeScript + Prisma + MySQL
- Frontend: React + TypeScript + Vite
- State: Redux Toolkit + RTK Query
- Styling: Tailwind CSS
- Tests: backend unit tests for streak/date logic first

## Data

Habit
- id
- title
- categoryId
- createdAt DateTime

HabitLog
- id
- habitId
- date Date

Category
- id
- name
- icon

In the future: User, HabitSchedule, HabitGoal (won't be built yet!)

## API

```
GET    /api/habits
GET    /api/habits/:id
POST   /api/habits
PATCH  /api/habits/:id
DELETE /api/habits/:id

POST   /api/habits/:id/logs
DELETE /api/habits/:id/logs/:date

GET    /api/categories
POST   /api/categories
```

In the future: DELETE /api/categories/:id, user will be able to manage their own habits through UI (won't be built yet!)

### Important

Habit response always contains:
- logs
- currentStreak
- bestStreak
- category

For Example:

```
type HabitResponse = {
  id: number;
  title: string;
  categoryId: number;
  category: Category;
  logs: HabitLog[];
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
  updatedAt: string;
};
```

## State responsibilities

RTK Query:
- habits
- habit detail
- categories
- create/update/delete habit
- add/delete log

Redux slice:
- selectedView
- selectedDate
- selectedCategory
- modal state

React local state:
- form fields
- small UI states of a single component

## Cache invalidation
RTK Query caches data fetched from the backend. Normal habit changes can use tag invalidation, but habit log toggles need immediate UI feedback. For log changes the UI updates optimistically first and then replaces cached data with the backend response.

Tags:
- `Habits` for the habit list
- `Habit:{id}` for a single habit
- `Categories` for categories

Rules:
- createHabit invalidates `Habits`
- updateHabit invalidates `Habits` and `Habit:{id}`
- deleteHabit invalidates `Habits`
- addLog/deleteLog update `getHabits` and `getHabitById` optimistically with `onQueryStarted`
- addLog/deleteLog replace the cached habit with the backend response after the request succeeds
- addLog/deleteLog roll back the optimistic cache update if the request fails
- createCategory invalidates `Categories`

This keeps log toggles visually immediate while the backend remains the source of truth for persisted logs and calculated streaks.

## Date and timezone strategy

The app tracks habits by local calendar day, not by exact timestamp.

The frontend detects the user's current timezone with `Intl.DateTimeFormat().resolvedOptions().timeZone` and sends it with log requests. Dates are sent as `YYYY-MM-DD`.

The backend stores habit log dates as date-only values. The timezone is used only to validate whether a date is in the future and to determine the user's current local day.

Stored habit logs do not shift if the user later changes timezone. For example, a log saved as `2026-06-09` remains `2026-06-09`.

This keeps habit history stable while still allowing "today" and future-date validation to follow the user's current timezone.

Initial timezone:
- Europe/Helsinki

Rules:
- users cannot log future dates
- habit logs are tied to a calendar date, not a time of day
- streaks are calculated using the same timezone rules on the backend
- frontend uses backend-provided streak values instead of calculating them locally

Future consideration:
- if user accounts are added, each user may have their own timezone setting

## View strategy: day / week / month

The frontend owns view state because it is UI state.

Redux slice:
- selectedView: `day | week | month`
- selectedDate
- selectedCategory

The backend does not need to know which view is currently selected for the MVP. It returns habit data and logs, and the frontend decides how to display them in day, week, or month view.

Rules:
- day view shows one selected date
- week view starts on Monday
- month view shows the full visible calendar grid
- navigation cannot go into the future
- future dates are disabled in the UI
- date range generation is handled in reusable frontend date utilities

Future consideration:
- if the number of logs grows large, the API may later support date range queries, for example:
  `GET /api/habits?from=2026-06-01&to=2026-06-30`

## V2 MVP

- habit list
- create/edit/delete habit
- categories created with a seed file
- day/week/month view
- habit detail
- add/delete log
- backend-counted streaks
- RTK Query cache works

Later:
- users
- users own categories
- analytics
- habit schedules
- auth
