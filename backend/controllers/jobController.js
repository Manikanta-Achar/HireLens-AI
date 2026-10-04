import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import Match from "../models/Match.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, company, description, requiredSkills, experienceRequired } =
      req.body;

    // Check required fields
    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, company and description are required",
      });
    }

    // Create job
    const job = await Job.create({
      recruiterId: req.userId,
      title,
      company,
      description,
      requiredSkills: requiredSkills || [],
      experienceRequired: experienceRequired || 0,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// Get all jobs created by logged-in recruiter
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiterId: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get jobs",
    });
  }
};

// Get one job
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

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

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get job",
    });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check that the job belongs to the logged-in recruiter
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

    // Delete all resumes belonging to this job
    await Resume.deleteMany({
      jobId,
    });

    // Delete all matches belonging to this job
    await Match.deleteMany({
      jobId,
    });

    // Finally delete the job
    await Job.deleteOne({
      _id: jobId,
    });

    res.json({
      success: true,
      message: "Job and related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get all jobs created by the logged-in recruiter
    const jobs = await Job.find({
      recruiterId: req.userId,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Total jobs
    const jobCount = jobs.length;

    // Total resumes uploaded for these jobs
    const resumeCount = await Resume.countDocuments({
      jobId: { $in: jobIds },
    });

    // Total analyzed matches
    const matchCount = await Match.countDocuments({
      jobId: { $in: jobIds },
    });

    // Average match score
    const averageResult = await Match.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$score",
          },
        },
      },
    ]);

    const averageScore =
      averageResult.length > 0 ? Math.round(averageResult[0].averageScore) : 0;

    res.json({
      success: true,
      stats: {
        jobs: jobCount,
        resumes: resumeCount,
        matches: matchCount,
        averageScore,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
    });
  }
};
