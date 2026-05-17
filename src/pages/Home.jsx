import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ best: 0, games: 0 });

  useEffect(() => {
    async function fetchStats() {
      if (!user?.uid) return;
      const snap = await getDoc(doc(db, "stats", user.uid));
      if (snap.exists()) setStats(snap.data());
    }
    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0E0B20] flex flex-col">
      <Header />
      <div className="fixed w-[700px] h-[700px] rounded-full bg-[#7E3FFE] opacity-[0.07] blur-[120px] top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <p className="text-[#9A8EBC] text-base mb-2">
          Welcome back, <span className="text-white font-semibold">{user?.username} 👋</span>
        </p>
        <h1 className="text-white font-bold text-5xl md:text-6xl mb-4 text-center">Ready to Play?</h1>
        <p className="text-[#9A8EBC] text-lg mb-12 text-center max-w-xl">
          Test your knowledge of 300 essential TOEFL words. Play as long as you want!
        </p>

        <div className="flex gap-6 mb-12 flex-wrap justify-center">
          {[
            { label: "Total Words", value: "300" },
            { label: "Your Best Score", value: stats.best.toLocaleString() },
            { label: "Games Played", value: stats.games },
          ].map((s) => (
            <div key={s.label} className="bg-[#241D44] border border-[#44386F]/50 rounded-2xl px-10 py-6 flex flex-col items-center gap-1 min-w-[180px]">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE]">{s.value}</span>
              <span className="text-[#9A8EBC] text-sm">{s.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/game")}
          className="px-14 py-5 rounded-full font-bold text-white text-xl bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] shadow-2xl shadow-[#7E3FFE]/40 hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
        >
          ▶&nbsp;&nbsp;Start Game
        </button>
        <p className="text-[#9A8EBC]/60 text-sm mt-5">Infinite mode — play until you stop or all 300 words are shown</p>
      </main>
    </div>
  );
}