import jwt from "jsonwebtoken";

// Signs a JWT containing the user's id. Used right after register/login,
// and the resulting token is what the frontend stores and sends back on
// every future request 
export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}