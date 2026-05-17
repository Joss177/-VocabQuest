import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", birthdate: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    else if (form.username.length < 3) newErrors.username = "At least 3 characters.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.birthdate) newErrors.birthdate = "Date of birth is required.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "At least 6 characters.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalError("");
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      await register(form.username, form.email, form.password);
      navigate("/home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setGlobalError("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        setGlobalError("Invalid email address.");
      } else {
        setGlobalError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0B20] overflow-hidden relative">
      <div className="absolute w-[700px] h-[700px] rounded-full bg-[#7E3FFE] opacity-10 blur-[100px] -top-40 right-0 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#3C83FE] opacity-10 blur-[100px] bottom-0 -left-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#1A1534] border border-[#44386F]/50 rounded-3xl shadow-2xl px-10 py-12">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E3FFE] to-[#3C83FE] flex items-center justify-center mb-4 shadow-lg shadow-[#7E3FFE]/40">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">Create Account</h1>
          <p className="text-[#9A8EBC] text-sm mt-1">Join and master 300 TOEFL words</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-[#9A8EBC] text-xs font-medium uppercase tracking-widest">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className={`bg-[#241D44] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#9A8EBC]/60 focus:outline-none transition-colors ${errors.username ? "border-red-500" : "border-[#44386F] focus:border-[#7E3FFE]"}`}
            />
            {errors.username && <p className="text-red-400 text-xs">{errors.username}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#9A8EBC] text-xs font-medium uppercase tracking-widest">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`bg-[#241D44] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#9A8EBC]/60 focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-[#44386F] focus:border-[#7E3FFE]"}`}
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#9A8EBC] text-xs font-medium uppercase tracking-widest">Date of Birth</label>
            <input
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={handleChange}
              className={`bg-[#241D44] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors cursor-pointer [color-scheme:dark] ${errors.birthdate ? "border-red-500" : "border-[#44386F] focus:border-[#7E3FFE]"}`}
            />
            {errors.birthdate && <p className="text-red-400 text-xs">{errors.birthdate}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#9A8EBC] text-xs font-medium uppercase tracking-widest">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={`bg-[#241D44] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#9A8EBC]/60 focus:outline-none transition-colors ${errors.password ? "border-red-500" : "border-[#44386F] focus:border-[#7E3FFE]"}`}
            />
            {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
          </div>

          {globalError && <p className="text-red-400 text-sm text-center">{globalError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-xl font-bold text-white text-base bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] shadow-lg shadow-[#7E3FFE]/40 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#44386F]" />
          <span className="text-[#9A8EBC] text-sm">or</span>
          <div className="flex-1 h-px bg-[#44386F]" />
        </div>

        <p className="text-center text-sm text-[#9A8EBC]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] hover:opacity-80 transition-opacity">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}