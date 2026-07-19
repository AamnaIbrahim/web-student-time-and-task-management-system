import Task from "../models/Task.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";

function sanitizeTask(task) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    subjectId: task.subject,
    priority: task.priority,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    status: task.status,
  };
}

// GET /api/tasks 
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.status(200).json(tasks.map(sanitizeTask));
});

// GET /api/tasks/:id
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  res.status(200).json(sanitizeTask(task));
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, subjectId, priority, dueDate, dueTime, status } = req.body;

  if (!title || !subjectId || !dueDate) {
    throw new AppError("Title, subject, and due date are required.", 400);
  }

  const task = await Task.create({
    title,
    description,
    subject: subjectId,
    priority: priority || "Medium",
    dueDate,
    dueTime,
    status: status || "Pending",
    user: req.user._id,
  });

  res.status(201).json(sanitizeTask(task));
});

// PUT /api/tasks/:id — also used for the status-toggle (Pending ⇄ Completed)
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  const { title, description, subjectId, priority, dueDate, dueTime, status } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (subjectId !== undefined) task.subject = subjectId;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (dueTime !== undefined) task.dueTime = dueTime;
  if (status !== undefined) task.status = status;

  await task.save();

  res.status(200).json(sanitizeTask(task));
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  res.status(200).json({ id: req.params.id });
});