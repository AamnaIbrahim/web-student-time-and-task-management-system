import AppError from "../utils/AppError.js";

// Runs when a request doesn't match any route above it in app.js.
export function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}