import express from "express";

import {
  uploadResume,
  getResumesByJob,
} from "../controllers/resumeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload/:jobId",
  authMiddleware,
  upload.single("resume"),
  uploadResume,
);

router.get("/job/:jobId", authMiddleware, getResumesByJob);

export default router;
