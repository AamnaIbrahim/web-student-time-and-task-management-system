import Subject from "../models/Subject.js";

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
export async function getSubjects(req, res, next) {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json(subjects.map(sanitizeSubject));
  } catch (error) {
    next(error);
  }
}

// GET /api/subjects/:id
export async function getSubjectById(req, res, next) {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json(sanitizeSubject(subject));
  } catch (error) {
    next(error);
  }
}

// POST /api/subjects
export async function createSubject(req, res, next) {
  try {
    const { name, code, instructor, color } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Subject name and code are required." });
    }

    const subject = await Subject.create({
      name,
      code,
      instructor,
      color: color || "#4672d1",
      user: req.user._id,
    });

    res.status(201).json(sanitizeSubject(subject));
  } catch (error) {
    next(error);
  }
}

// PUT /api/subjects/:id
export async function updateSubject(req, res, next) {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const { name, code, instructor, color } = req.body;
    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (instructor !== undefined) subject.instructor = instructor;
    if (color !== undefined) subject.color = color;

    await subject.save();

    res.status(200).json(sanitizeSubject(subject));
  } catch (error) {
    next(error);
  }
}

// DELETE /api/subjects/:id
export async function deleteSubject(req, res, next) {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
}