import { useState, useEffect } from "react";
import Header from "../components/Header";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const MEDAL = ["🥇", "🥈", "🥉"];
const PODIUM_COLORS = {
  0: { bar: "bg-gradient-to-t from-yellow-600 to-yellow-400", text: "text-yellow-400", shadow: "shadow-yellow-500/30", height: "h-48" },
  1: { bar: "bg-gradient-to-t from-gray-500 to-gray-300",     text: "text-gray-300",   shadow: "shadow-gray-400/30",   height: "h-36" },
  2: { bar: "bg-gradient-to-t from-orange-700 to-orange-500", text: "text-orange-400", shadow: "shadow-orange-500/30", height: "h-24" },
};
const PODIUM_ORDER = [1, 0, 2];

export default function Statistics() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const today = new Date().toISOString().split("T")[0];
      const q = query(
        collection(db, "leaderboard"),
        where("date", "==", today),
        orderBy("score", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => d.data());
      setBoard(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  return (
    <div className="min-h-screen bg-[#0E0B20] flex flex-col">
      <Header />
      <div className="fixed w-[800px] h-[600px] rounded-full bg-[#7E3FFE] opacity-[0.06] blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <main className="flex-1 flex flex-col items-center px-6 py-10 relative z-10 max-w-4xl mx-auto w-full">
        <h1 className="text-white font-bold text-4xl mb-1">Today's Leaderboard</h1>
        <p className="text-[#9A8EBC] text-sm mb-12">🔄 Resets every day at midnight</p>

        {loading ? (
          <p className="text-[#9A8EBC]">Loading scores...</p>
        ) : board.length === 0 ? (
          <div className="text-[#9A8EBC] text-center mt-20">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-xl font-semibold text-white">No scores yet today!</p>
            <p className="text-sm mt-2">Be the first to play and claim the top spot.</p>
          </div>
        ) : (
          <>
            {/* PODIUM */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-4 mb-14 w-full max-w-lg">
                {PODIUM_ORDER.map((rankIdx) => {
                  const player = top3[rankIdx];
                  if (!player) return <div key={rankIdx} className="flex-1" />;
                  const c = PODIUM_COLORS[rankIdx];
                  return (
                    <div key={rankIdx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-2xl">{MEDAL[rankIdx]}</span>
                      <span className="text-white font-semibold text-sm text-center truncate w-full text-center">
                        {player.username}
                      </span>
                      <span className={`font-bold text-sm ${c.text}`}>
                        {player.score.toLocaleString()} pts
                      </span>
                      <div className={`w-full ${c.height} ${c.bar} rounded-t-xl shadow-lg ${c.shadow} flex items-start justify-center pt-3`}>
                        <span className="text-white/80 font-black text-xl">#{rankIdx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TABLE */}
            {rest.length > 0 && (
              <div className="w-full">
                <div className="grid grid-cols-12 text-[#9A8EBC] text-xs font-semibold uppercase tracking-widest px-4 mb-2">
                  <span className="col-span-2">Rank</span>
                  <span className="col-span-7">Player</span>
                  <span className="col-span-3 text-right">Score</span>
                </div>
                <div className="flex flex-col gap-2">
                  {rest.map((entry, i) => (
                    <div key={entry.uid} className="grid grid-cols-12 items-center bg-[#1A1534] border border-[#44386F]/40 rounded-xl px-4 py-3 hover:border-[#7E3FFE]/40 transition-all">
                      <span className="col-span-2 text-[#9A8EBC] font-bold text-base">#{i + 4}</span>
                      <span className="col-span-7 text-white font-medium text-sm">{entry.username}</span>
                      <span className="col-span-3 text-right text-white font-bold text-sm">{entry.score.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}