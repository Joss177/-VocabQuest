import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/home");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0B20] overflow-hidden relative">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#7E3FFE] opacity-10 blur-[100px] -top-32 -left-32 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#3C83FE] opacity-10 blur-[100px] bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#1A1534] border border-[#44386F]/50 rounded-3xl shadow-2xl px-10 py-12">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E3FFE] to-[#3C83FE] flex items-center justify-center mb-4 shadow-lg shadow-[#7E3FFE]/40">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">VocabQuest</h1>
          <p className="text-[#9A8EBC] text-sm mt-1">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-[#9A8EBC] text-xs font-medium uppercase tracking-widest">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-[#241D44] border border-[#44386F] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#9A8EBC]/60 focus:outline-none focus:border-[#7E3FFE] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#9A8EBC] text-xs font-medium uppercase tracking-widest">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-[#241D44] border border-[#44386F] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#9A8EBC]/60 focus:outline-none focus:border-[#7E3FFE] transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] shadow-lg shadow-[#7E3FFE]/40 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#44386F]" />
          <span className="text-[#9A8EBC] text-sm">or</span>
          <div className="flex-1 h-px bg-[#44386F]" />
        </div>

        <p className="text-center text-sm text-[#9A8EBC]">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] hover:opacity-80 transition-opacity">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}