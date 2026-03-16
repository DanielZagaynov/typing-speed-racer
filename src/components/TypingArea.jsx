import { useState, useEffect, useRef, useCallback } from "react";
import { playKeystroke, playError, playComplete } from "../utils/sound";
import { getSoundEnabled } from "../utils/storage";

export default function TypingArea({ quote, onComplete, timeLimit, difficulty }) {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const containerRef = useRef(null);
  const soundEnabled = getSoundEnabled();

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!timeLimit || !startTime || isFinished) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [timeLimit, startTime, isFinished]);

  // Finish when time runs out
  useEffect(() => {
    if (isFinished && startTime) {
      finishGame();
    }
  }, [isFinished]);

  const finishGame = useCallback(() => {
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const wpm = elapsed > 0 ? Math.round(typed.length / 5 / elapsed) : 0;
    const accuracy =
      typed.length > 0
        ? Math.round(
            (typed.split("").filter((ch, i) => ch === quote.content[i]).length /
              typed.length) *
              100
          )
        : 0;

    let finalWpm = wpm;
    if (difficulty === "hard") {
      const errors = typed.split("").filter((ch, i) => ch !== quote.content[i]).length;
      finalWpm = Math.max(0, wpm - errors * 2);
    }

    if (soundEnabled) playComplete();
    onComplete({
      wpm: finalWpm,
      accuracy,
      time: ((Date.now() - startTime) / 1000).toFixed(1),
      bestStreak,
      difficulty,
    });
  }, [startTime, typed, quote, bestStreak, difficulty, soundEnabled, onComplete]);

  const handleKeyDown = useCallback(
    (e) => {
      if (isFinished) return;
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta" || e.key === "Tab") return;
      e.preventDefault();

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length !== 1) return;

      if (!startTime) {
        setStartTime(Date.now());
      }

      const nextIndex = typed.length;
      const isCorrect = e.key === quote.content[nextIndex];

      if (isCorrect) {
        setCurrentStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        setCorrectCount((c) => c + 1);
        if (soundEnabled) playKeystroke();
      } else {
        setCurrentStreak(0);
        if (soundEnabled) playError();
      }

      const newTyped = typed + e.key;
      setTyped(newTyped);

      if (newTyped.length >= quote.content.length) {
        setIsFinished(true);
      }
    },
    [typed, quote, startTime, isFinished, soundEnabled]
  );

  // Live stats
  const elapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 0;
  const liveWpm = elapsed > 0 ? Math.round(typed.length / 5 / elapsed) : 0;
  const liveAccuracy =
    typed.length > 0
      ? Math.round((correctCount / typed.length) * 100)
      : 100;

  // Force re-render for live stats
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!startTime || isFinished) return;
    const interval = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Timer bar for timed modes */}
      {timeLimit && startTime && (
        <div className="mb-4">
          <div className="flex justify-between text-sm font-mono text-gray-400 mb-1">
            <span>Time Remaining</span>
            <span className={timeLeft < 10 ? "text-neon-red animate-pulse" : ""}>
              {Math.ceil(timeLeft)}s
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-200 rounded-full"
              style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Typing area */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 font-mono text-lg md:text-xl leading-relaxed tracking-wide cursor-text focus:outline-none focus:border-neon-green/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all"
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-gray-500 font-mono">
            typing-racer ~ {difficulty}
          </span>
        </div>

        {/* Quote display */}
        <div className="text-left select-none">
          {quote.content.split("").map((char, i) => {
            let colorClass = "text-gray-600";
            let bgClass = "";

            if (i < typed.length) {
              if (typed[i] === char) {
                colorClass = "text-neon-green";
              } else {
                colorClass = "text-neon-red";
                bgClass = "bg-red-500/20";
              }
            }

            const isCursor = i === typed.length;

            return (
              <span
                key={i}
                className={`char-transition ${colorClass} ${bgClass} ${
                  isCursor
                    ? "border-l-2 border-neon-green animate-blink"
                    : ""
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Author */}
        <div className="text-right mt-4 text-sm text-gray-500 italic">
          — {quote.author}
        </div>
      </div>

      {/* Live stats bar */}
      <div className="mt-4 flex justify-between items-center bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 font-mono text-sm">
        <div className="flex gap-6">
          <div>
            <span className="text-gray-500">WPM </span>
            <span className="text-neon-green font-semibold">{liveWpm}</span>
          </div>
          <div>
            <span className="text-gray-500">ACC </span>
            <span className="text-neon-blue font-semibold">{liveAccuracy}%</span>
          </div>
          <div>
            <span className="text-gray-500">STREAK </span>
            <span className="text-neon-yellow font-semibold">{currentStreak}</span>
          </div>
        </div>
        <div className="text-gray-500">
          {typed.length} / {quote.content.length} chars
        </div>
      </div>

      {/* Hint if not started */}
      {!startTime && (
        <p className="mt-4 text-gray-500 text-sm animate-pulse">
          Click the box above and start typing...
        </p>
      )}
    </div>
  );
}
