import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-[#1A1534] border-b border-[#44386F]/40 px-8 h-16 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7E3FFE] to-[#3C83FE] flex items-center justify-center shadow-lg shadow-[#7E3FFE]/30">
          <span className="text-white font-bold text-base">V</span>
        </div>
        <span className="text-white font-bold text-lg">VocabQuest</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-8">
        <Link
          to="/home"
          className={`text-sm font-medium transition-all pb-1 ${
            isActive("/home")
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] border-b-2 border-[#7E3FFE]"
              : "text-[#9A8EBC] hover:text-white"
          }`}
        >
          Home
        </Link>
        <Link
          to="/statistics"
          className={`text-sm font-medium transition-all pb-1 ${
            isActive("/statistics")
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] border-b-2 border-[#7E3FFE]"
              : "text-[#9A8EBC] hover:text-white"
          }`}
        >
          Statistics
        </Link>
      </nav>

      {/* User + Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-[#9A8EBC] text-sm">
            👋 <span className="text-white font-medium">{user.username}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-[#241D44] border border-[#44386F] text-[#9A8EBC] text-sm hover:text-white hover:border-[#7E3FFE] transition-all"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}