import Subject from "../models/Subject.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";

function sanitizeSubject(subject) {
  return {
    id: subject._id,
    name: subject.name,
    code: subject.code,
    instructor: subject.instructor,
    color: subject.color,
  };
}

// GET /api/subjects 
export const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.status(200).json(subjects.map(sanitizeSubject));
});

// GET /api/subjects/:id
export const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });

  if (!subject) {
    throw new AppError("Subject not found.", 404);
  }

  res.status(200).json(sanitizeSubject(subject));
});

// POST /api/subjects
export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, instructor, color } = req.body;

  if (!name || !code) {
    throw new AppError("Subject name and code are required.", 400);
  }

  const subject = await Subject.create({
    name,
    code,
    instructor,
    color: color || "#4672d1",
    user: req.user._id,
  });

  res.status(201).json(sanitizeSubject(subject));
});

// PUT /api/subjects/:id
export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });

  if (!subject) {
    throw new AppError("Subject not found.", 404);
  }

  const { name, code, instructor, color } = req.body;
  if (name !== undefined) subject.name = name;
  if (code !== undefined) subject.code = code;
  if (instructor !== undefined) subject.instructor = instructor;
  if (color !== undefined) subject.color = color;

  await subject.save();

  res.status(200).json(sanitizeSubject(subject));
});

// DELETE /api/subjects/:id
export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!subject) {
    throw new AppError("Subject not found.", 404);
  }

  res.status(200).json({ id: req.params.id });
});