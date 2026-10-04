import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import extractTextFromPDF from "../services/pdfService.js";
import analyzeResume from "../services/aiService.js";

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // Extract text
    const extractedText = await extractTextFromPDF(req.file.buffer);

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    const candidateInfo = await analyzeResume(extractedText);

    if (
      !candidateInfo ||
      !candidateInfo.candidateName ||
      !candidateInfo.email ||
      !candidateInfo.skills ||
      candidateInfo.skills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract candidate information from this resume. Please upload a valid resume PDF.",
      });
    }

    // Save Resume
    const resume = await Resume.create({
      jobId,
      candidateName: candidateInfo.candidateName || "",
      email: candidateInfo.email || "",
      fileName: req.file.originalname,
      filePath: "",
      extractedText,
      skills: candidateInfo.skills || [],
      education: candidateInfo.education || "",
      experience: candidateInfo.experience || 0,
    });

    res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        candidateName: resume.candidateName,
        email: resume.email,
        skills: resume.skills,
        education: resume.education,
        experience: resume.experience,
      },
    });
  } catch (error) {
    console.error("Upload resume error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

// Get resumes for a job
export const getResumesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check job ownership
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

    const resumes = await Resume.find({
      jobId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get resumes",
    });
  }
};
