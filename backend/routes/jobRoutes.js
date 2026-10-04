import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
  getDashboardStats,
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create job
router.post("/", authMiddleware, createJob);

// Get dashboard statistics
// IMPORTANT: This must come before /:jobId
router.get("/dashboard/stats", authMiddleware, getDashboardStats);

// Get all jobs
router.get("/", authMiddleware, getJobs);

// Get one job
router.get("/:jobId", authMiddleware, getJobById);

// Delete job
router.delete("/:jobId", authMiddleware, deleteJob);

export default router;
