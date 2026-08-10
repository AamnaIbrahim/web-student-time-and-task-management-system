# Student Time & Task Management System — Frontend Documentation

A single-role (student) academic productivity web app for managing subjects, tasks, deadlines, and progress. Built with React, Tailwind CSS, and a real Node.js/Express/MongoDB backend.


## Overview

The app lets a student:

- Register and log in securely (JWT-based auth)
- See an at-a-glance **Dashboard** — today's tasks, upcoming deadlines, pending/completed counts, and a filterable productivity summary
- Manage **Subjects** (courses) — add, edit, delete, color-coded
- Manage **Tasks** — add, edit, delete, mark complete, filter by subject/priority/date range, sort by due date or priority
- Visualize deadlines on a **Calendar** (month view)
- Update **Profile** — name, email, password

The frontend is fully connected to a real backend (Node.js + Express + MongoDB). All data is permanently stored per user account. No mock data is in use.



## Tech Stack

|                 Tool                 |                                        Why                                         |
|--------------------------------------|------------------------------------------------------------------------------------|
| **React (Vite)**                     | Component-based UI; Vite gives instant dev-server startup and fast HMR             |
| **JavaScript**                       | Kept simple per project requirements                                               |
| **Tailwind CSS v4**                  | Utility-first styling; one shared design-token palette defined once in `index.css` |
| **React Router DOM**                 | Client-side routing without full page reloads                                      |
| **React Hook Form**                  | Form state + validation for every form in the app                                  |
| **React Context API + `useReducer`** | Global state for auth, subjects, and tasks — predictable, action-based updates     |
| **Axios**                            | HTTP client; one configured instance (`apiClient.js`) used by every service file   |
| **lucide-react**                     | Icon set — consistent, no hand-drawn SVGs                                          |

No calendar library, modal library, or charting library was added. The month-view calendar, popup dialogs, and progress bar are all custom-built with plain Tailwind, since the app's needs were simple enough not to justify the extra dependency weight.



## Folder Structure

```
student-task-manager/
└── src/
    ├── main.jsx                 → app entry point
    ├── App.jsx                  → wraps the app in AuthProvider/SubjectProvider/TaskProvider
    ├── index.css                → design tokens, global styles, animations
    │
    ├── components/
    │   ├── common/              → Modal, ConfirmDialog, SuccessDialog, LoadingState,
    │   │                            Spinner, GlassBackdrop, CharCount — shared across pages
    │   ├── layout/               → Sidebar (self-contained: desktop sidebar, mobile icon
    │   │                            rail, expandable drawer), MainLayout, AuthLayout
    │   ├── dashboard/            → StatCard, TaskListCard, ProductivitySummary
    │   ├── subjects/             → SubjectCard, SubjectFormModal, SubjectDetailDialog
    │   ├── tasks/                → TaskCard, TaskFormModal (includes a custom
    │   │                            multi-line subject picker, not a native <select>)
    │   └── calendar/             → CalendarGrid
    │
    ├── pages/                    → one folder per route/screen
    │   ├── landing/, auth/, dashboard/, subjects/, tasks/, calendar/, profile/, shared/
    │
    ├── context/                  → AuthContext, SubjectContext, TaskContext
    │                                (each with its own reducer + action types file)
    ├── hooks/                    → useAuth, useSubjects, useTasks, useLockBodyScroll
    ├── routes/                   → AppRoutes, ProtectedRoute, GuestRoute, OnboardingGate
    ├── services/                 → apiClient.js (Axios instance) + authService,
    │                                subjectService, taskService (all real API calls)
    ├── constants/                 → routePaths, navItems, apiConfig
    └── utils/                    → dateHelpers, calendarHelpers, stringHelpers
```



## Getting Started

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the dev server (make sure the backend is running too):

```bash
npm run dev
```



## Environment Variables

|      Variable       |                                     Purpose                                      |
|---------------------|----------------------------------------------------------------------------------|
| `VITE_API_BASE_URL` | Base URL of the backend API. Defaults to `http://localhost:5000/api` if not set. |



## Core Architecture

### Context + `useReducer` (shared state)

Three contexts hold the app's shared data, each following the same pattern: an action-types file, a reducer, and a provider component that exposes CRUD functions built on top of a service file.

- **`AuthContext`** — `user`, `isAuthenticated`, `isInitializing` (one-time app-boot check, separate from per-action `loading`), `login`, `register`, `logout`, `updateProfile`
- **`SubjectContext`** — subjects list + `addSubject`, `editSubject`, `removeSubject`. Only fetches once `isAuthenticated` is true.
- **`TaskContext`** — tasks list + `addTask`, `editTask`, `removeTask`, `toggleTaskStatus`. Same auth-gated fetch behavior.

Every change goes through a named action (e.g. `ADD_TASK`, `AUTH_SUCCESS`) handled by a single reducer function — there's always exactly one place to look if some piece of state looks wrong.

### Service layer (`services/`)

`authService.js`, `subjectService.js`, and `taskService.js` are the **only** place the app talks to the backend. Every function returns a promise resolving to `{ data: ... }` (Axios's natural shape). Pages and components never fetch data directly — they always go through Context, which goes through these services.

`apiClient.js` is the single configured Axios instance:
- Attaches the stored JWT to every request automatically
- On a `401` (expired/invalid token), clears the token and dispatches a custom `auth:unauthorized` browser event — `AuthContext` listens for this and resets auth state through normal React state, so the user is redirected to Login via smooth client-side routing (no hard page reload).



## Routing & Access Control

|     Route guard      |                                                Purpose                                                  |
|----------------------|---------------------------------------------------------------------------------------------------------|
| **`ProtectedRoute`** | Blocks logged-out users from Dashboard/Subjects/Tasks/Calendar/Profile; redirects to Login              |
| **`GuestRoute`**     | Blocks already-logged-in users from seeing Login/Register; redirects to Dashboard                       |
| **`OnboardingGate`** | Safety net for direct URL access before a subject/task exists. The primary UX is handled by the Sidebar |

Both `ProtectedRoute` and `GuestRoute` gate on `isInitializing` (the one-time app-boot session check), **not** the per-action `loading` flag — this was a deliberate fix: using the shared `loading` flag was causing Login/Register to unmount mid-submission (wiping success dialogs and error messages) because that flag also toggles during every login/register call.



## Onboarding Flow

New accounts are guided through a specific order:

1. **Register** → account created, but the user is **not** auto-logged-in. A success dialog appears; clicking through sends them to **Login**.
2. **Login with 0 subjects** → the Sidebar disables **Dashboard** and **Tasks** (grayed out, with a hover tooltip: *"Add your first subject to get started"*). **Calendar** and **Profile** are always accessible.
3. **First subject added** → a success dialog appears, offering to jump to Tasks.
4. **Subjects exist, 0 tasks** → only **Dashboard** stays disabled (tooltip: *"Add your first task to unlock the dashboard"*). Tasks itself is now unlocked.
5. **First task added** → a success dialog appears, offering to jump to Dashboard.

This is enforced primarily through disabled/tooltip nav items (not redirects) so it never feels like a jarring bounce — `OnboardingGate` only kicks in as a fallback if someone directly types a restricted URL.



## Feature Modules

### Dashboard
- 4 stat cards: Today's Tasks, Upcoming Deadlines, Pending Tasks, Completed Tasks
- **Today's Tasks** / **Upcoming Deadlines** lists cap at ~3 visible rows, scrolling internally beyond that (so one list's length never affects the sibling card's height)
- **Upcoming Deadlines** shows tasks due in the next 7 days; if none, falls back to the next 30 days (labeled "Next 30 Days" so it's never confused with Productivity Summary's calendar-month filter)
- **Productivity Summary**: completed-vs-total percentage, filterable by **This Week** (current Sun–Sat calendar week) / **This Month** (current calendar month) / **All Time**

### Subjects
- Grid of cards (name, code, instructor, color swatch)
- Long name/code/instructor truncate with an ellipsis on the card; clicking the card opens a detail dialog with the full, untruncated values
- Add/Edit via a modal form (React Hook Form), with character-count hints under each field

### Tasks
- Filterable/sortable list: status tabs (All/Pending/Completed), subject filter, priority filter, due-date range filter (Any Time/This Week/This Month), sort by nearest due date or priority
- Status toggle (circular checkbox) marks a task Pending ⇄ Completed inline
- Long titles truncate with a native hover tooltip; descriptions wrap fully across multiple lines instead of being clipped (cards are vertically stacked, so a taller card never affects its neighbors)
- Add/Edit form uses a **custom dropdown** for the subject picker (not a native `<select>`) — native `<option>` elements can't wrap long text across multiple lines under any CSS, so a small custom listbox was built instead
- Due date cannot be set in the past (`min` attribute + form validation)

### Calendar
- Custom month-grid (no calendar library) — prev/next navigation, "Today" shortcut
- Each day shows up to 3 small colored dots matching subject colors
- Selecting a day shows that day's tasks in a side panel (same `TaskListCard` component used on Dashboard)
- Never gated by onboarding state — always viewable

### Profile
- Summary header (avatar, name, email) — long values truncate instead of overflowing
- **Profile Information**: update name (max 50 characters, with a live character count) and email
- **Change Password**: same strength rules as Registration (see below) — kept consistent so there's no confusing mismatch between the two forms
- Both forms surface the actual backend error message on failure, not a generic fallback



## Design System

- **Palette**: custom `primary` (blue) and `surface` (neutral) scales defined once via Tailwind v4's `@theme` in `index.css`
- **Glassmorphism**: soft blurred gradient blobs (`GlassBackdrop`) behind every authenticated page; frosted `.glass-panel`/`.glass-card` utility classes for cards and dialogs
- **Layout pattern**: every page has a fixed header (title + actions/filters) and an independently scrollable body beneath it — the header never scrolls away, and one page's scroll never affects the sidebar
- **Responsive sidebar**: full labeled sidebar on desktop (`lg`+); below that, a slim icon-only rail (always visible, not hidden) with its own hamburger that expands a full sliding drawer
- **Modals**: rendered via a React portal directly into `document.body`, so `position: fixed` always resolves against the real viewport — this avoids a subtle bug where an ancestor's CSS transform (e.g. the page-transition wrapper) would otherwise trap the modal inside a smaller area



## Form Validation Rules

|            Field             |                        Rule                                       |
|------------------------------|-------------------------------------------------------------------|
| Registration password        | 8+ characters, at least one uppercase letter, at least one number |
| Profile change-password      | Same rule as registration (kept in sync)                          |
| Full name (Register/Profile) | Required, max 50 characters                                       |
| Subject name                 | Required, max 80 characters                                       |
| Subject code                 | Required, max 15 characters                                       |
| Instructor                   | Required, max 60 characters                                       |
| Task title                   | Required, max 100 characters                                      |
| Task description             | Optional, max 500 characters                                      |
| Task due date                | Required, cannot be in the past                                   |

Every length-limited field shows a live "current/max characters" hint (`CharCount` component).



## Known Limitations

- No file/image uploads (e.g. profile picture) — out of scope for the current spec
- No email verification or password-reset-via-email flow
- No real-time sync across multiple open tabs/devices (data refetches on next navigation, not pushed live)