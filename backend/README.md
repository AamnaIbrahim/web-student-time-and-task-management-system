# Student Time & Task Management System — Backend Documentation

REST API for the Student Time and Task Management System. Node.js + Express + MongoDB (Mongoose), with JWT authentication.


## Overview

This API backs the STMS frontend (React). Every route except `/api/health`, `/api/auth/register`, and `/api/auth/login` requires a valid JWT. All Subject and Task data is scoped per-user — one student can never see or modify another's data, enforced at the database-query level, not just the UI.



## Tech Stack

|          Tool          |                                       Why                                             |
|------------------------|---------------------------------------------------------------------------------------|
| **Node.js + Express**  | Minimal, well-understood REST framework                                               |
| **MongoDB + Mongoose** | Schema-based document store; Mongoose gives validation, hooks, and a clean query API  |
| **jsonwebtoken (JWT)** | Stateless auth; no server-side session store needed                                   |
| **bcryptjs**           | Password hashing                                                                      |
| **helmet**             | Sensible default security headers                                                     |
| **cors**               | Restricts which frontend origin(s) may call the API                                   |
| **morgan**             | Request logging, development only                                                     |
| **dotenv**             | Environment variable loading                                                          |

Rate limiting (`express-rate-limit`) was deliberately **not** included — it protects against realistic production attack patterns that don't apply to a local/demo project, and was removed to keep the codebase simple. See [Known Limitations](#known-limitations).



## Folder Structure

```
stms-backend/
├── server.js                → entry point: loads .env, connects DB, starts listening
├── package.json
├── .env.example
└── src/
    ├── app.js                → Express app: middleware, route mounting, error handling
    ├── config/
    │   └── db.js             → Mongoose connection
    ├── models/
    │   ├── User.js
    │   ├── Subject.js
    │   └── Task.js
    ├── controllers/
    │   ├── authController.js
    │   ├── subjectController.js
    │   └── taskController.js
    ├── routes/
    │   ├── healthRoutes.js
    │   ├── authRoutes.js
    │   ├── subjectRoutes.js
    │   └── taskRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js  → protect() — verifies JWT, attaches req.user
    │   ├── asyncHandler.js    → wraps async controllers, forwards errors to next()
    │   ├── notFound.js        → 404 handler
    │   └── errorHandler.js    → centralized error → JSON response
    └── utils/
        ├── AppError.js        → custom error class (message + statusCode)
        └── generateToken.js   → JWT signing helper
```



## Getting Started

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, CLIENT_URL
npm run dev
```

Confirm it's running:

```
GET http://localhost:5000/api/health
→ { "status": "ok", "message": "STMS API is running", "timestamp": "..." }
```



## Environment Variables

|     Variable     |                 Required                 |                                           Purpose                                              |
|------------------|------------------------------------------|------------------------------------------------------------------------------------------------|
| `PORT`           | No (defaults to `5000`)                  | Port the server listens on                                                                     |
| `NODE_ENV`       | No                                       | `development` enables `morgan` request logging; anything else disables it                      |
| `MONGO_URI`      | **Yes**                                  | MongoDB connection string (local or Atlas)                                                     |
| `JWT_SECRET`     | **Yes**                                  | Secret used to sign/verify JWTs; any long random string in dev, must stay secret in production |
| `JWT_EXPIRES_IN` | No (defaults to `7d`)                    | How long an issued token stays valid                                                           |
| `CLIENT_URL`     | No (defaults to `http://localhost:5173`) | Comma-separated list of frontend origin(s) allowed by CORS                                     |



## Architecture

### Error handling

Every controller function is wrapped in `asyncHandler`, so any thrown error (or rejected promise) is forwarded to `next()` automatically — no repetitive `try/catch` in controllers. Controllers throw `new AppError("message", statusCode)` for expected failures (validation, not-found, duplicate, etc.).

`errorHandler.js` is the single place that turns any error into a consistent JSON response, recognizing several error types beyond plain `AppError`:

| Error type | Resulting status | Example |
|---|---|---|
| `AppError` | Whatever `statusCode` it was thrown with | `throw new AppError("Task not found.", 404)` |
| Mongoose `CastError` | `400` | Malformed MongoDB ID in a URL param |
| Mongoose `ValidationError` | `400` (with an `errors` array) | Missing/invalid required schema field |
| MongoDB duplicate key (`code === 11000`) | `409` | Registering an email that already exists |
| `JsonWebTokenError` | `401` | Malformed/tampered JWT |
| `TokenExpiredError` | `401` | Expired JWT |
| Anything else | `500` | Unexpected server error |

`notFound.js` catches any request that doesn't match a defined route and hands it to the same error handler as a `404 AppError`.

### Authentication

`authMiddleware.js`'s `protect()` function:
1. Reads the `Authorization: Bearer <token>` header
2. Verifies the JWT against `JWT_SECRET`
3. Loads the matching `User` and attaches it to `req.user`
4. Calls `next()` — or throws a `401 AppError` at any failed step

Every Subject/Task route runs `router.use(protect)` once at the top of the route file, rather than repeating it per-route.



## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercased |
| `password` | String | Required, min 8 chars, hashed via a `pre("save")` hook (bcrypt), **never returned by default queries** (`select: false`) |
| `createdAt` / `updatedAt` | Date | Auto (timestamps) |

### Subject

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `code` | String | Required |
| `instructor` | String | Optional |
| `color` | String | Hex color, defaults to `#4672d1` |
| `user` | ObjectId → User | Required — every query is scoped to `req.user._id` |

### Task

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Optional |
| `subject` | ObjectId → Subject | Required. **Note:** stored as `subject`, but the API renames it to `subjectId` in responses/requests to match the frontend's naming |
| `priority` | String enum | `Low` \| `Medium` \| `High`, defaults to `Medium` |
| `dueDate` | String | `"YYYY-MM-DD"` — stored as a plain string, not a `Date`, to avoid timezone-shift bugs and match exactly what the frontend sends |
| `dueTime` | String | `"HH:mm"`, optional |
| `status` | String enum | `Pending` \| `Completed`, defaults to `Pending` |
| `user` | ObjectId → User | Required — every query is scoped to `req.user._id` |



## API Reference

Base URL: `{VITE_API_BASE_URL}` (e.g. `http://localhost:5000/api`)

🔒 = requires `Authorization: Bearer <token>`

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Returns `{ status, message, timestamp }` |

### Auth

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/auth/register` | — | `{ name, email, password }` | `201` → `{ user: {id, name, email}, token }` |
| POST | `/auth/login` | — | `{ email, password }` | `200` → `{ user, token }` |
| GET | `/auth/me` | 🔒 | — | `200` → `{ id, name, email }` |
| PUT | `/auth/profile` | 🔒 | `{ name?, email?, password? }` | `200` → updated `{ id, name, email }` |

### Subjects

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/subjects` | 🔒 | — | `200` → array of subjects, oldest first |
| GET | `/subjects/:id` | 🔒 | — | `200` → single subject |
| POST | `/subjects` | 🔒 | `{ name, code, instructor?, color? }` | `201` → created subject |
| PUT | `/subjects/:id` | 🔒 | any subset of the above fields | `200` → updated subject |
| DELETE | `/subjects/:id` | 🔒 | — | `200` → `{ id }` |

### Tasks

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/tasks` | 🔒 | — | `200` → array of tasks, soonest due date first |
| GET | `/tasks/:id` | 🔒 | — | `200` → single task |
| POST | `/tasks` | 🔒 | `{ title, description?, subjectId, priority?, dueDate, dueTime?, status? }` | `201` → created task |
| PUT | `/tasks/:id` | 🔒 | any subset of the above fields (also used for the status toggle: `{ status: "Completed" }`) | `200` → updated task |
| DELETE | `/tasks/:id` | 🔒 | — | `200` → `{ id }` |

All list/single Subject and Task responses are automatically scoped to the authenticated user — there is no way to fetch another user's data through these endpoints.



## Security

- Passwords hashed with `bcrypt` (10 salt rounds), never stored or returned in plaintext
- JWTs signed with `JWT_SECRET`, expire after `JWT_EXPIRES_IN` (default 7 days)
- `helmet` sets standard security-related HTTP headers
- `cors` restricts API access to the origin(s) listed in `CLIENT_URL`
- Every Subject/Task query filters by `user: req.user._id` at the database level — ownership isn't just checked, it's baked into the query itself
- Mongoose schema validation (required fields, min lengths, email format, enum values) runs server-side regardless of what the frontend already validated



## Frontend Integration Contract

The API's response shapes were designed to match the frontend's mock-service layer exactly, so the frontend's Context/Component code never needed to change when the real backend was connected:

- Every function-equivalent in `authService.js` / `subjectService.js` / `taskService.js` maps 1:1 to one of these endpoints
- `Task.subject` (Mongoose ref) is renamed to `subjectId` in every response, matching the frontend's field name
- Error responses are always `{ message: string, errors?: string[] }` — the frontend's Axios interceptor reads `error.response.data.message` and re-throws it as a plain `Error`, so every existing `catch (err) { err.message }` block in the frontend works unmodified



## Known Limitations

- No rate limiting
- No email verification or password-reset flow
- No refresh tokens — a JWT simply expires and the user must log in again (frontend handles this gracefully via a `401` → auto-redirect-to-Login flow)
- No pagination on `GET /subjects` or `GET /tasks` — acceptable at the scale of a single student's personal data, would need addressing before any multi-tenant/heavier-scale use