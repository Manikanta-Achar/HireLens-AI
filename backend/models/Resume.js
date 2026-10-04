import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateName: {
      type: String,
      default: "Unknown",
    },

    email: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    education: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
