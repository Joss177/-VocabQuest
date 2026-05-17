import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import WORDS from "../data/words";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const COLORS = [
  { bg: "bg-[#1E2E6E]", border: "border-[#3C83FE]", glow: "shadow-[#3C83FE]/30", label: "A" },
  { bg: "bg-[#1A5C2A]", border: "border-[#2DCB6E]", glow: "shadow-[#2DCB6E]/30", label: "B" },
  { bg: "bg-[#5C4A0A]", border: "border-[#F9CC17]", glow: "shadow-[#F9CC17]/30", label: "C" },
  { bg: "bg-[#5C1A1A]", border: "border-[#F54242]", glow: "shadow-[#F54242]/30", label: "D" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getWrongOptions(correct, allWords, key) {
  const others = allWords.filter((w) => w[key] !== correct);
  return shuffle(others).slice(0, 3).map((w) => w[key]);
}

function buildQuestion(wordObj, allWords) {
  const rand = Math.random();
  let mode;
  if (rand < 0.50) mode = 0;
  else if (rand < 0.70) mode = 1;
  else if (rand < 0.85) mode = 2;
  else mode = 3;

  if (mode === 0) {
    const correct = wordObj.meaning;
    const options = shuffle([correct, ...getWrongOptions(correct, allWords, "meaning")]);
    return { prompt: wordObj.word, promptLabel: "What is the meaning of this word?", promptTag: "EN", optionTag: "EN", options, correct, type: "word-en" };
  } else if (mode === 1) {
    const correct = wordObj.word;
    const options = shuffle([correct, ...getWrongOptions(correct, allWords, "word")]);
    return { prompt: wordObj.meaning, promptLabel: "Which word matches this definition?", promptTag: "EN", optionTag: "EN", options, correct, type: "meaning-en" };
  } else if (mode === 2) {
    const correct = wordObj.es;
    const options = shuffle([correct, ...getWrongOptions(correct, allWords, "es")]);
    return { prompt: wordObj.word, promptLabel: "¿Cuál es el significado en español?", promptTag: "EN", optionTag: "ES", options, correct, type: "word-en-to-es" };
  } else {
    const correct = wordObj.meaning;
    const options = shuffle([correct, ...getWrongOptions(correct, allWords, "meaning")]);
    return { prompt: wordObj.es, promptLabel: "Select the English meaning of this word:", promptTag: "ES", optionTag: "EN", options, correct, type: "word-es-to-en" };
  }
}

function initGame() {
  const shuffled = shuffle(WORDS);
  return { queue: shuffled, queueIndex: 0, question: buildQuestion(shuffled[0], WORDS) };
}

export default function Game() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState(() => initGame());
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [countdown, setCountdown] = useState(null);

  const { queue, queueIndex, question } = gameState;

  function handleAnswer(option) {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === question.correct;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 100 + streak * 10);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setWordCount((c) => c + 1);

    // 1 segundo si correcto, 5 segundos si incorrecto
    const delay = correct ? 1 : 5;
    setCountdown(correct ? null : delay); // solo muestra countdown si se equivocó

    let remaining = delay;
    const interval = correct ? null : setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    setTimeout(() => {
      if (interval) clearInterval(interval);
      setCountdown(null);
      const nextIdx = queueIndex + 1;
      let newQueue = queue;
      let realIdx = nextIdx;
      if (nextIdx >= queue.length) {
        newQueue = shuffle(WORDS);
        realIdx = 0;
      }
      setGameState({ queue: newQueue, queueIndex: realIdx, question: buildQuestion(newQueue[realIdx], WORDS) });
      setSelected(null);
      setIsCorrect(null);
    }, delay * 1000);
  }

  async function saveAndExit() {
    const today = new Date().toISOString().split("T")[0];

    const statsRef = doc(db, "stats", user.uid);
    const statsSnap = await getDoc(statsRef);
    const prevStats = statsSnap.exists() ? statsSnap.data() : { best: 0, games: 0 };
    await setDoc(statsRef, {
      username: user.username,
      best: score > prevStats.best ? score : prevStats.best,
      games: prevStats.games + 1,
    });

    const leaderRef = doc(db, "leaderboard", `${today}_${user.uid}`);
    const leaderSnap = await getDoc(leaderRef);
    const prevScore = leaderSnap.exists() ? leaderSnap.data().score : 0;
    await setDoc(leaderRef, {
      uid: user.uid,
      username: user.username,
      score: score > prevScore ? score : prevScore,
      date: today,
    });

    navigate("/home");
  }

  const progress = Math.min((wordCount / WORDS.length) * 100, 100);
  const isLargePrompt = question.type === "word-en" || question.type === "word-en-to-es" || question.type === "word-es-to-en";

  return (
    <div className="min-h-screen bg-[#0E0B20] flex flex-col">
      <Header />
      <div className="fixed w-[600px] h-[600px] rounded-full bg-[#7E3FFE] opacity-[0.06] blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10 max-w-5xl mx-auto w-full">

        {/* Progress */}
        <div className="w-full flex items-center gap-4 mb-2">
          <div className="flex-1 h-2 bg-[#241D44] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[#9A8EBC] text-sm whitespace-nowrap">Word {wordCount} · All 300</span>
        </div>

        {/* Score + streak */}
        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-white font-bold text-lg">
            Score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FFE] to-[#3C83FE]">{score.toLocaleString()}</span>
          </span>
          {streak >= 2 && (
            <span className="text-yellow-400 font-semibold text-sm animate-pulse">🔥 {streak} streak! +{streak * 10} bonus</span>
          )}
        </div>

        {/* Question label + language tags */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-[#7E3FFE]/20 border border-[#7E3FFE]/40 text-[#9A8EBC] text-xs font-semibold">{question.promptTag}</span>
          <p className="text-[#9A8EBC] text-sm">{question.promptLabel}</p>
          <span className="px-2 py-0.5 rounded-md bg-[#3C83FE]/20 border border-[#3C83FE]/40 text-[#9A8EBC] text-xs font-semibold">{question.optionTag}</span>
        </div>

        {/* Prompt card */}
        <div className="w-full bg-[#241D44] border-2 border-[#7E3FFE]/40 rounded-2xl px-8 py-8 flex items-center justify-center mb-8 shadow-xl shadow-[#7E3FFE]/10 min-h-[130px]">
          <span className={`text-white font-bold text-center leading-tight ${isLargePrompt ? "text-5xl md:text-6xl" : "text-2xl md:text-3xl"}`}>
            {question.prompt}
          </span>
        </div>

        {/* Answer options 2x2 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {question.options.map((option, i) => {
            const c = COLORS[i];
            const isSelected = selected === option;
            const isRight = option === question.correct;
            let extraStyle = "";
            if (selected !== null) {
              if (isRight) extraStyle = "ring-2 ring-green-400 brightness-110";
              else if (isSelected) extraStyle = "ring-2 ring-red-500 opacity-70";
              else extraStyle = "opacity-40";
            }
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selected !== null}
                className={`${c.bg} border ${c.border} rounded-2xl px-6 py-5 flex items-center gap-4 text-left shadow-lg ${c.glow} hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:cursor-default ${extraStyle}`}
              >
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 border ${c.border} bg-white/10`}>
                  {c.label}
                </span>
                <span className="text-white font-semibold text-base leading-snug">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className={`text-lg font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
              {isCorrect
                ? `✓ Correct! +${100 + (streak - 1) * 10} pts`
                : `✗ Correct answer: "${question.correct}"`}
            </div>
            {/* Countdown solo si se equivocó */}
            {countdown !== null && (
              <div className="flex items-center gap-2 text-red-400/70 text-sm font-medium">
                <div className="w-7 h-7 rounded-full border-2 border-red-400/50 flex items-center justify-center font-bold text-base text-red-400">
                  {countdown}
                </div>
                <span>Read the answer carefully...</span>
              </div>
            )}
          </div>
        )}

        {/* Stop */}
        <button
          onClick={saveAndExit}
          className="mt-8 px-6 py-2 rounded-lg bg-[#241D44] border border-red-500/40 text-red-400/80 text-sm hover:border-red-500 hover:text-red-400 transition-all"
        >
          ⏹ Stop Game
        </button>
      </main>
    </div>
  );
}