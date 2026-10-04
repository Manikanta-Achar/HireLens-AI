import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const CreateJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requiredSkills: "",
    experienceRequired: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const skills = formData.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const response = await api.post(
        "/jobs",
        {
          title: formData.title.trim(),
          company: formData.company.trim(),
          description: formData.description.trim(),
          requiredSkills: skills,
          experienceRequired: Number(formData.experienceRequired) || 0,
        },
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Create job error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create job. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Sidebar />

      <main className="lg:ml-64">
        {/* TOP BAR */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex h-20 items-center gap-4 px-5 sm:px-8">
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
            >
              ←
            </Link>

            <div>
              <p className="text-xs font-medium text-slate-400">
                JOB MANAGEMENT
              </p>

              <h1 className="mt-1 text-xl font-bold text-slate-900">
                Create New Job
              </h1>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          {/* INTRO */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Create a job posting
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add the job requirements so our AI can compare candidates against
              this position.
            </p>
          </div>

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* BASIC INFORMATION */}
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900">Basic Information</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us about the position.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* JOB TITLE */}
                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Title
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* COMPANY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Tech Solutions Pvt Ltd"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* EXPERIENCE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Experience Required
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      name="experienceRequired"
                      value={formData.experienceRequired}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      placeholder="e.g. 2"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      years
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* JOB DESCRIPTION */}
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900">
                  Job Description
                  <span className="ml-1 text-red-500">*</span>
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Describe the role, responsibilities and requirements.
                </p>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                placeholder="Example:

We are looking for a Full Stack Developer to build and maintain modern web applications.

Responsibilities:
- Build React applications
- Develop REST APIs using Node.js and Express
- Work with MongoDB
- Collaborate with the development team

Requirements:
- Strong JavaScript knowledge
- React.js
- Node.js
- Express.js
- MongoDB"
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* SKILLS */}
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900">Required Skills</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Enter skills separated by commas.
                </p>
              </div>

              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="React.js, Node.js, Express.js, MongoDB, JavaScript"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              {formData.requiredSkills && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.requiredSkills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:mx-8">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <Link
                to="/dashboard"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Job..." : "Create Job →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
