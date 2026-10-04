import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate("/dashboard");
        toast.success("Login Successfull");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* ================= LEFT PANEL ================= */}
      <section className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full flex flex-col justify-between p-12 xl:p-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-lg font-bold">AI</span>
            </div>

            <span className="text-xl font-bold tracking-tight">
              ResumeMatch
            </span>
          </div>

          {/* Main content */}
          <div className="max-w-xl">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-5">
              Smarter recruitment
            </p>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight">
              Build your
              <br />
              <span className="text-blue-500">best team.</span>
            </h1>

            <p className="mt-7 text-lg leading-8 text-slate-400 max-w-lg">
              Create jobs, upload candidate resumes, and let AI identify the
              strongest candidates based on skills, experience, and education.
            </p>

            {/* Steps */}
            <div className="mt-12 space-y-7">
              {/* Step 1 */}
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-sm font-bold text-blue-400">
                  01
                </div>

                <div>
                  <p className="font-semibold text-white">Create your job</p>

                  <p className="text-sm text-slate-500 mt-1">
                    Define skills and requirements
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-sm font-bold text-blue-400">
                  02
                </div>

                <div>
                  <p className="font-semibold text-white">Upload resumes</p>

                  <p className="text-sm text-slate-500 mt-1">
                    Let AI analyze candidate profiles
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-sm font-bold text-blue-400">
                  03
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Find top candidates
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Compare and rank candidates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Intelligent hiring made simple.
          </p>
        </div>
      </section>

      {/* ================= RIGHT PANEL ================= */}
      <section className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <span className="font-bold">AI</span>
            </div>

            <span className="text-xl font-bold text-slate-900">
              ResumeMatch
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>

            <p className="mt-3 text-slate-500">
              Start building your candidate pipeline today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-2.5"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2.5"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2.5"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full h-12 px-4 pr-20 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Use at least 6 characters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-slate-500 mt-9">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-8">
            AI-powered candidate matching platform
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
