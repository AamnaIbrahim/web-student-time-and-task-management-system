import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Core middleware
app.use(cors());
app.use(express.json()); // parses incoming JSON request bodies

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/subjects", subjectRoutes);
// app.use("/api/tasks", taskRoutes);

// 404 fallback for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Basic centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
});

export default app;