import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";


function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are all required.", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({ user: sanitizeUser(user), token });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  // .select("+password") because the schema hides it by default
  const user = await User.findOne({ email }).select("+password");
  const isMatch = user && (await user.comparePassword(password));

  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken(user._id);
  res.status(200).json({ user: sanitizeUser(user), token });
});

// GET /api/auth/me 
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(sanitizeUser(req.user));
});

// PUT /api/auth/profile — requires the `protect` middleware
// Handles name/email updates AND password changes.
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  await user.save();

  res.status(200).json(sanitizeUser(user));
});