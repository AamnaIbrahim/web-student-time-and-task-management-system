// A custom error class for expected, intentional failures — "email
// already exists", "task not found", "title is required". Controllers
// just `throw new AppError("message", statusCode)` instead of manually
// writing res.status(...).json({ message: ... }) everywhere; the
// centralized errorHandler (see errorHandler.js) reads statusCode/message
// straight off the error.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes "expected" errors from real bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;