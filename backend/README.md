# STMS Backend

Backend API for the Student Time and Task Management System. Node.js + Express + MongoDB (Mongoose).

## Backend Phase 1 — Project Setup

What was created:

- Express app (`src/app.js`) with `cors`, JSON body parsing, a 404 fallback, and a basic centralized error handler
- MongoDB connection helper (`src/config/db.js`) using Mongoose
- Server entry point (`server.js`) — connects to the database, then starts listening
- Health-check route: `GET /api/health`
- Empty, ready-to-fill folders for the next phases: `models/`, `controllers/`, `middleware/`, `utils/`

## Folder structure

```
stms-backend/
├── server.js
├── package.json
├── .env.example
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── models/          # Mongoose schemas 
    ├── controllers/      # Route handler logic 
    ├── routes/
    │   └── healthRoutes.js
    ├── middleware/        # auth checks, error handling 
    └── utils/             # small backend helpers
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template and fill in your MongoDB connection string:
   ```bash
   cp .env.example .env
   ```
   - **Local MongoDB**: `MONGO_URI=mongodb://127.0.0.1:27017/stms`
   - **MongoDB Atlas**: create a free cluster at mongodb.com/atlas, get the connection string from "Connect → Drivers", and paste it in as `MONGO_URI`.

3. Run the dev server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```

4. Confirm it's working — open in your browser or curl:
   ```
   http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   { "status": "ok", "message": "STMS API is running", "timestamp": "..." }
   ```

