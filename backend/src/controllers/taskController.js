import Task from "../models/Task.js";

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
export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.status(200).json(tasks.map(sanitizeTask));
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks/:id
export async function getTaskById(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(sanitizeTask(task));
  } catch (error) {
    next(error);
  }
}

// POST /api/tasks
export async function createTask(req, res, next) {
  try {
    const { title, description, subjectId, priority, dueDate, dueTime, status } = req.body;

    if (!title || !subjectId || !dueDate) {
      return res.status(400).json({ message: "Title, subject, and due date are required." });
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
  } catch (error) {
    next(error);
  }
}

// PUT /api/tasks/:id — also used for the status-toggle (Pending ⇄ Completed)
export async function updateTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
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
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}