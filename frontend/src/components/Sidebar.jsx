import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isCandidatesActive = () => {
    return location.pathname.startsWith("/candidates/");
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
          <span className="text-sm font-bold text-white">AI</span>
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            ResumeMatch
          </h1>

          <p className="text-[11px] text-slate-400">AI Recruitment</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <nav className="mt-4 space-y-1">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive("/dashboard")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <span className="text-lg">⌂</span>
            Dashboard
          </Link>

          {/* Create Job */}
          <Link
            to="/jobs/create"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive("/jobs/create")
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <span className="text-lg">＋</span>
            Create Job
          </Link>

          {/* Candidates */}
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              isCandidatesActive()
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-slate-600"
            }`}
          >
            <span className="text-lg">♙</span>
            Candidates
          </div>
        </nav>

        {/* Account */}
        <p className="mt-9 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Account
        </p>

        <nav className="mt-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500"
          >
            <span className="text-lg">↪</span>
            Logout
          </button>
        </nav>
      </div>

      {/* User */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "Recruiter"}
            </p>

            <p className="truncate text-xs text-slate-400">Recruiter</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
