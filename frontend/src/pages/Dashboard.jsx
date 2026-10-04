import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const StatCard = ({ icon, label, value, description }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400">
            {label}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">{value}</h2>

          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);

  const [stats, setStats] = useState({
    jobs: 0,
    resumes: 0,
    matches: 0,
    averageScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [jobsResponse, statsResponse] = await Promise.all([
        api.get("/jobs", {
          headers: {
            token,
          },
        }),

        api.get("/jobs/dashboard/stats", {
          headers: {
            token,
          },
        }),
      ]);

      if (jobsResponse.data.success) {
        setJobs(jobsResponse.data.jobs);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }
    } catch (error) {
      console.error(
        "Dashboard data error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobTitle}"?\n\nThis will also delete all resumes and matches related to this job.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingJobId(jobId);

      const token = localStorage.getItem("token");

      const response = await api.delete(`/jobs/${jobId}`, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        // Remove deleted job from the screen immediately
        setJobs((previousJobs) =>
          previousJobs.filter((job) => job._id !== jobId),
        );

        // Refresh dashboard statistics
        const statsResponse = await api.get("/jobs/dashboard/stats", {
          headers: {
            token,
          },
        });

        if (statsResponse.data.success) {
          setStats(statsResponse.data.stats);
        }

        alert("Job deleted successfully.");
      }
    } catch (error) {
      console.error("Delete job error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to delete job.");
    } finally {
      setDeletingJobId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {user?.name || "Recruiter"}
              </h1>
            </div>

            <Link
              to="/jobs/create"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              + Create Job
            </Link>
          </div>
        </header>

        {/* Content */}
        <section className="px-6 py-8 lg:px-10">
          {/* Hero */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl shadow-blue-600/10">
            <p className="text-sm font-medium text-blue-100">
              AI Resume & Job Matching
            </p>

            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">
              Find the right candidates faster.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Create a job, upload candidate resumes, and let AI analyze and
              rank candidates based on their skills, experience, and education.
            </p>

            <Link
              to="/jobs/create"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Create New Job →
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon="💼"
              label="JOBS"
              value={loading ? "..." : stats.jobs}
              description="Job postings created"
            />

            <StatCard
              icon="📄"
              label="RESUMES"
              value={loading ? "..." : stats.resumes}
              description="Resumes uploaded"
            />

            <StatCard
              icon="👥"
              label="MATCHES"
              value={loading ? "..." : stats.matches}
              description="Candidates analyzed"
            />

            <StatCard
              icon="⭐"
              label="AVG SCORE"
              value={loading ? "..." : `${stats.averageScore}%`}
              description="Average candidate score"
            />
          </div>

          {/* Jobs */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your Jobs</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your job postings and candidates.
                </p>
              </div>

              <Link
                to="/jobs/create"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                + New Job
              </Link>
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm text-slate-500">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <div className="text-4xl">💼</div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No jobs created yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Create your first job to start matching candidates.
                  </p>

                  <Link
                    to="/jobs/create"
                    className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Create Job
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5">
                        {/* Job information */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {job.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {job.company}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.requiredSkills?.map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                          <button
                            onClick={() => handleDeleteJob(job._id, job.title)}
                            disabled={deletingJobId === job._id}
                            className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingJobId === job._id
                              ? "Deleting..."
                              : "Delete Job"}
                          </button>

                          <Link
                            to={`/candidates/${job._id}`}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            View Candidates →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
