import express from "express";

import {
  analyzeMatches,
  getMatchesByJob,
  getMatchById,
} from "../controllers/matchController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze/:jobId", authMiddleware, analyzeMatches);

router.get("/job/:jobId", authMiddleware, getMatchesByJob);

router.get("/:matchId", authMiddleware, getMatchById);

export default router;
