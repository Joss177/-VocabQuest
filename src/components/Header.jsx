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
    <header className="w-full bg-[#1A1534] border-b border-[#44386F]/40 px-4 md:px-8 h-14 md:h-16 flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#7E3FFE] to-[#3C83FE] flex items-center justify-center shadow-lg shadow-[#7E3FFE]/30 shrink-0">
          <span className="text-white font-bold text-sm md:text-base">V</span>
        </div>
        <span className="text-white font-bold text-base md:text-lg">VocabQuest</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-4 md:gap-8">
        <Link
          to="/home"
          className={`text-xs md:text-sm font-medium transition-all pb-1 ${
            isActive("/home")
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] border-b-2 border-[#7E3FFE]"
              : "text-[#9A8EBC] hover:text-white"
          }`}
        >
          Home
        </Link>
        <Link
          to="/statistics"
          className={`text-xs md:text-sm font-medium transition-all pb-1 ${
            isActive("/statistics")
              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] border-b-2 border-[#7E3FFE]"
              : "text-[#9A8EBC] hover:text-white"
          }`}
        >
          Stats
        </Link>
      </nav>

      {/* User + Logout */}
      <div className="flex items-center gap-2 md:gap-4">
        {user && (
          <span className="hidden sm:block text-[#9A8EBC] text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
            👋 <span className="text-white font-medium">{user.username}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-[#241D44] border border-[#44386F] text-[#9A8EBC] text-xs md:text-sm hover:text-white hover:border-[#7E3FFE] transition-all whitespace-nowrap"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}