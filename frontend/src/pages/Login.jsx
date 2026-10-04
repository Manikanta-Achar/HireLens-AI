import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
      const response = await api.post("/auth/login", formData);

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
              AI-powered recruitment
            </p>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight">
              Find the right
              <br />
              talent,
              <span className="text-blue-500"> faster.</span>
            </h1>

            <p className="mt-7 text-lg leading-8 text-slate-400 max-w-lg">
              Analyze resumes, match candidates with job requirements, and
              identify the strongest candidates using intelligent matching.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <p className="text-2xl font-bold text-white">AI</p>

                <p className="text-sm text-slate-500 mt-2">Resume Analysis</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">60%</p>

                <p className="text-sm text-slate-500 mt-2">Skill Weight</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">24/7</p>

                <p className="text-sm text-slate-500 mt-2">Candidate Search</p>
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
              Welcome back
            </h2>

            <p className="mt-3 text-slate-500">
              Sign in to continue to your recruiter dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
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
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-9">
            <div className="h-px bg-slate-200 flex-1" />

            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              New here?
            </span>

            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Register */}
          <Link
            to="/register"
            className="w-full h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Create recruiter account
          </Link>

          <p className="text-center text-xs text-slate-400 mt-8">
            AI-powered candidate matching platform
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
