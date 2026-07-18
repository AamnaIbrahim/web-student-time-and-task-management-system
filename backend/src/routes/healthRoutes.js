import { Router } from "express";

const router = Router();

// GET /api/health
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;