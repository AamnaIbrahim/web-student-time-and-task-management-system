// Every error in the app ends up here — either thrown as an AppError, or
// something unexpected from Mongoose/JWT/Node itself.
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong on the server.";
  let errors; 

  // Mongoose: malformed ObjectId (e.g. GET /api/tasks/not-a-real-id)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: schema validation failed (missing/invalid required fields)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.values(err.errors).map((fieldError) => fieldError.message);
  }

  // Mongoose: duplicate key (e.g. registering an email that already exists)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `That ${field} is already in use.` : "Duplicate value.";
  }

  // JWT: token is malformed / signature doesn't match
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  // JWT: token was valid but has expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message,
    ...(errors ? { errors } : {}),
  });
}