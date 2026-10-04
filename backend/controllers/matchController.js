import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import Match from "../models/Match.js";
import calculateMatch from "../services/matchingService.js";

export const analyzeMatches = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check job
    const job = await Job.findOne({
      _id: jobId,
      recruiterId: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Get all resumes for this job
    const resumes = await Resume.find({ jobId });

    if (resumes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No resumes found for this job",
      });
    }

    // Remove old matches
    await Match.deleteMany({ jobId });

    const matches = [];

    for (const resume of resumes) {
      const result = calculateMatch(job, resume);

      const match = await Match.create({
        jobId,
        resumeId: resume._id,
        candidateName: resume.candidateName,
        score: result.score,
        skillMatch: result.skillMatch,
        experienceMatch: result.experienceMatch,
        educationMatch: result.educationMatch,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        explanation: result.explanation,
      });

      matches.push(match);
    }

    // Highest score first
    matches.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      message: "Candidates analyzed successfully",
      matches,
    });
  } catch (error) {
    console.error("Analyze matches error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to analyze candidates",
    });
  }
};

export const getMatchesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { search, minScore } = req.query;

    const job = await Job.findOne({
      _id: jobId,
      recruiterId: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const query = {
      jobId,
    };

    // Search candidate by name
    if (search) {
      query.candidateName = {
        $regex: search,
        $options: "i",
      };
    }

    // Minimum score filter
    if (minScore) {
      query.score = {
        $gte: Number(minScore),
      };
    }

    const matches = await Match.find(query).sort({ score: -1 });

    res.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Get matches error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get matches",
    });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const job = await Job.findOne({
      _id: match.jobId,
      recruiterId: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.json({
      success: true,
      match,
    });
  } catch (error) {
    console.error("Get match error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get match",
    });
  }
};
