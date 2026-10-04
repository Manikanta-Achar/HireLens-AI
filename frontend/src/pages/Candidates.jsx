import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api.js";
import Sidebar from "../components/Sidebar";

const Candidates = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);

  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // --------------------------------
  // Get job information
  // --------------------------------
  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setJob(response.data.job);
      }
    } catch (error) {
      console.error("Job fetch error:", error.response?.data || error.message);

      setError(
        error.response?.data?.message || "Failed to load job information.",
      );
    }
  };

  // --------------------------------
  // Get uploaded resumes
  // --------------------------------
  const fetchResumes = async () => {
    try {
      const response = await api.get(`/resumes/job/${jobId}`, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setResumes(response.data.resumes || []);
      }
    } catch (error) {
      console.error(
        "Resume fetch error:",
        error.response?.data || error.message,
      );
    }
  };

  // --------------------------------
  // Get matches
  // --------------------------------
  const fetchMatches = async () => {
    try {
      let url = `/matches/job/${jobId}`;

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (minScore !== "") {
        params.append("minScore", minScore);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setMatches(response.data.matches || []);
      }
    } catch (error) {
      console.error(
        "Match fetch error:",
        error.response?.data || error.message,
      );
    }
  };

  // --------------------------------
  // Load page data
  // --------------------------------
  const loadPage = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([fetchJob(), fetchResumes(), fetchMatches()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [jobId]);

  // --------------------------------
  // Search/filter matches
  // --------------------------------
  useEffect(() => {
    if (!loading) {
      fetchMatches();
    }
  }, [search, minScore]);

  // --------------------------------
  // Select PDF
  // --------------------------------
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("PDF file size must be less than 5 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // --------------------------------
  // Upload resume
  // --------------------------------
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF resume first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const response = await api.post(`/resumes/upload/${jobId}`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess("Resume uploaded and analyzed successfully.");

        setSelectedFile(null);

        // Reset file input
        const fileInput = document.getElementById("resume-upload");

        if (fileInput) {
          fileInput.value = "";
        }

        await fetchResumes();
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);

      setError(error.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  // --------------------------------
  // Analyze candidates
  // --------------------------------
  const handleAnalyze = async () => {
    if (resumes.length === 0) {
      setError("Please upload at least one resume before analyzing.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/matches/analyze/${jobId}`,
        {},
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        setMatches(response.data.matches || []);

        setSuccess("Candidates analyzed and ranked successfully.");
      }
    } catch (error) {
      console.error("Analyze error:", error.response?.data || error.message);

      setError(
        error.response?.data?.message || "Failed to analyze candidates.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // --------------------------------
  // Score color
  // --------------------------------
  const getScoreStyle = (score) => {
    if (score >= 80) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (score >= 60) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (score >= 40) {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="lg:ml-64">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

              <p className="mt-4 text-sm text-slate-500">
                Loading candidates...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="px-6 py-6 lg:px-10">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              ← Back to Dashboard
            </Link>

            <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Candidate Management
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  {job?.title || "Job Candidates"}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {job?.company || "Company"}
                </p>
              </div>

              <div className="flex gap-3">
                <label
                  htmlFor="resume-upload"
                  className={`cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${
                    uploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  + Select Resume
                </label>

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="px-6 py-8 lg:px-10">
          {/* Job requirements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Required Skills
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job?.requiredSkills?.length > 0 ? (
                    job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No specific skills added.
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 rounded-xl bg-slate-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Experience
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {job?.experienceRequired || 0} years
                </p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Upload area */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Resume Upload
                </p>

                {selectedFile ? (
                  <div className="mt-2">
                    <p className="font-semibold text-slate-900">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Select a PDF resume to upload and analyze.
                  </p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Uploading & Analyzing..." : "Upload Resume"}
              </button>
            </div>
          </div>

          {/* Resume / analysis summary */}
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Resumes
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {resumes.length}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Uploaded for this job
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Matches
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {matches.length}
              </p>

              <p className="mt-1 text-sm text-slate-500">Candidates analyzed</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Top Score
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {matches.length > 0 ? `${matches[0].score}%` : "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Highest candidate match
              </p>
            </div>
          </div>

          {/* Analyze button */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Ready to rank candidates?
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Analyze all uploaded resumes against this job and generate match
                scores.
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={resumes.length === 0 || analyzing}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing ? "Analyzing Candidates..." : "Analyze Candidates →"}
            </button>
          </div>

          {/* Search and filter */}
          <div className="mt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Candidate Ranking
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Candidates are ranked by their overall match score.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search candidate..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />

                <select
                  value={minScore}
                  onChange={(event) => setMinScore(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Scores</option>

                  <option value="80">80% and above</option>

                  <option value="70">70% and above</option>

                  <option value="60">60% and above</option>

                  <option value="50">50% and above</option>

                  <option value="40">40% and above</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="mt-5">
            {matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="text-4xl">👥</div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No candidates found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Upload resumes and analyze candidates to generate the ranking.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div
                    key={match._id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                      {/* Candidate */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                          #{index + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {match.candidateName || "Unknown Candidate"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Candidate Match Analysis
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {match.matchedSkills?.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                              >
                                ✓ {skill}
                              </span>
                            ))}

                            {match.missingSkills?.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                              >
                                ✕ {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Match Score
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-xl border px-4 py-2 text-xl font-bold ${getScoreStyle(
                              match.score,
                            )}`}
                          >
                            {match.score}%
                          </span>
                        </div>

                        <Link
                          to={`/candidate/${match._id}`}
                          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>

                    {/* Explanation */}
                    {match.explanation && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <p className="text-sm leading-6 text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Why this score?
                          </span>{" "}
                          {match.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Candidates;
