import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    candidateName: {
      type: String,
      default: "Unknown",
    },

    score: {
      type: Number,
      default: 0,
    },

    skillMatch: {
      type: Number,
      default: 0,
    },

    experienceMatch: {
      type: Number,
      default: 0,
    },

    educationMatch: {
      type: Number,
      default: 0,
    },

    matchedSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
