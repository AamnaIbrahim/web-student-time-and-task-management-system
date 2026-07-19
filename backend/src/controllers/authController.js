import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are all required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // .select("+password") because the schema hides it by default
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    res.status(200).json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me 
export async function getMe(req, res, next) {
  try {
    res.status(200).json(sanitizeUser(req.user));
  } catch (error) {
    next(error);
  }
}

// PUT /api/auth/profile — requires the `protect` middleware
// Handles name/email updates AND password changes (the same endpoint the
// frontend's authService.updateProfile() already calls for both forms).
export async function updateProfile(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // re-hashed automatically by the pre-save hook

    await user.save();

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
}