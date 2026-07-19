import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "./asyncHandler.js";

// Protects any route it's added to. Reads the JWT from the
// "Authorization: Bearer <token>" header, verifies it, and attaches the
// matching user to req.user so controllers can use it. This is what
// subjectRoutes/taskRoutes will also use to scope data to
// the logged-in user only.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided.", 401);
  }

  // jwt.verify throws JsonWebTokenError/TokenExpiredError on failure —
  // asyncHandler catches it and errorHandler.js already knows how to
  // turn those into a proper 401 response.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }

  req.user = user;
  next();
});;