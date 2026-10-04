import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const CandidateDetails = () => {
  const { matchId } = useParams();
  const { token } = useAuth();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatch = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/matches/${matchId}`, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setMatch(response.data.match);
      }
    } catch (error) {
      console.error("Get candidate details error:", error);

      setError(
        error.response?.data?.message || "Failed to load candidate details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && matchId) {
      fetchMatch();
    }
  }, [token, matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">
        <Sidebar />

        <main className="lg:ml-64">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

              <p className="mt-4 text-sm text-slate-500">
                Loading candidate...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">
        <Sidebar />

        <main className="lg:ml-64">
          <div className="p-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-bold text-red-700">Candidate not found</h2>

              <p className="mt-2 text-sm text-red-600">
                {error || "This candidate could not be found."}
              </p>

              <Link
                to="/dashboard"
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Weighted contribution
  const skillContribution = Math.round(match.skillMatch * 0.6);

  const experienceContribution = Math.round(match.experienceMatch * 0.25);

  const educationContribution = Math.round(match.educationMatch * 0.15);

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Sidebar />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex h-20 items-center gap-4 px-5 sm:px-8">
            <button
              onClick={() => window.history.back()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
            >
              ←
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                CANDIDATE DETAILS
              </p>

              <h1 className="mt-1 text-xl font-bold text-slate-900">
                {match.candidateName || "Unknown Candidate"}
              </h1>
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-8">
          {/* Candidate profile */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white">
                {match.candidateName?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {match.candidateName || "Unknown Candidate"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Candidate match analysis
                </p>
              </div>
            </div>
          </section>

          {/* Match score cards */}
          <section className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Overall */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                Overall Match
              </p>

              <p className="mt-2 text-4xl font-bold text-blue-600">
                {match.score}%
              </p>

              <p className="mt-2 text-sm text-blue-600">
                Final candidate score
              </p>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                Skills
              </p>

              <p className="mt-2 text-4xl font-bold text-emerald-600">
                {match.skillMatch}%
              </p>

              <p className="mt-2 text-sm text-emerald-600">
                Required skills matched
              </p>
            </div>

            {/* Experience */}
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                Experience
              </p>

              <p className="mt-2 text-4xl font-bold text-violet-600">
                {match.experienceMatch}%
              </p>

              <p className="mt-2 text-sm text-violet-600">
                Experience requirement
              </p>
            </div>

            {/* Education */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
                Education
              </p>

              <p className="mt-2 text-4xl font-bold text-amber-600">
                {match.educationMatch}%
              </p>

              <p className="mt-2 text-sm text-amber-600">Education match</p>
            </div>
          </section>

          {/* Explanation */}
          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">
              AI Match Explanation
            </h2>

            <div className="mt-5 rounded-xl bg-blue-50 p-5">
              <p className="text-sm leading-7 text-slate-700">
                {match.explanation || "No explanation available."}
              </p>
            </div>
          </section>

          {/* Matched and missing skills */}
          <section className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
            {/* Matched */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  ✓
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Matched Skills</h2>

                  <p className="text-sm text-slate-500">
                    Skills found in the candidate resume
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {match.matchedSkills?.length > 0 ? (
                  match.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No matched skills.</p>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  !
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Missing Skills</h2>

                  <p className="text-sm text-slate-500">
                    Required skills not found in the resume
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {match.missingSkills?.length > 0 ? (
                  match.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                    >
                      ✕ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-emerald-600">
                    ✓ No missing skills
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Score explanation */}
          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                How the Score Was Calculated
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Each factor has a different weight in the final candidate score.
              </p>
            </div>

            <div className="mt-7 space-y-7">
              {/* Skills */}
              <ScoreBar
                title="Skills"
                weight="60%"
                matchValue={match.skillMatch}
                contribution={skillContribution}
                barColor="bg-emerald-500"
              />

              {/* Experience */}
              <ScoreBar
                title="Experience"
                weight="25%"
                matchValue={match.experienceMatch}
                contribution={experienceContribution}
                barColor="bg-violet-500"
              />

              {/* Education */}
              <ScoreBar
                title="Education"
                weight="15%"
                matchValue={match.educationMatch}
                contribution={educationContribution}
                barColor="bg-amber-500"
              />
            </div>

            {/* Final calculation */}
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Final Match Score
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Skills + Experience + Education
                  </p>
                </div>

                <p className="text-3xl font-bold text-blue-600">
                  {skillContribution} + {experienceContribution} +{" "}
                  {educationContribution} = {match.score}%
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

/* Score Bar Component */
const ScoreBar = ({ title, weight, matchValue, contribution, barColor }) => {
  return (
    <div>
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-800">{title}</span>

          <span className="ml-2 text-xs font-medium text-slate-400">
            Weight: {weight}
          </span>
        </div>

        <div className="text-sm">
          <span className="font-semibold text-slate-700">
            {matchValue}% match
          </span>

          <span className="mx-2 text-slate-300">→</span>

          <span className="font-bold text-slate-900">
            {contribution}% contribution
          </span>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{
            width: `${contribution}%`,
          }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>0%</span>
        <span>Maximum contribution: {weight}</span>
      </div>
    </div>
  );
};

export default CandidateDetails;
