import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects any route it's added to. Reads the JWT from the
// "Authorization: Bearer <token>" header, verifies it, and attaches the
// matching user to req.user so controllers can use it. This is what
// subjectRoutes/taskRoutes will also use to scope data to
// the logged-in user only.
export async function protect(req, res, next) {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token." });
  }
}