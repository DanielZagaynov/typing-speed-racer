import { useState, useCallback } from "react";
import DifficultySelect from "../components/DifficultySelect";
import Countdown from "../components/Countdown";
import TypingArea from "../components/TypingArea";
import Results from "../components/Results";
import NamePrompt from "../components/NamePrompt";
import { getRandomQuote } from "../data/quotes";
import {
  saveAttempt,
  saveToLeaderboard,
  getUsername,
  setUsername,
} from "../utils/storage";
import { getSoundEnabled, setSoundEnabled } from "../utils/storage";

const TIME_LIMITS = { easy: null, medium: 60, hard: 45 };

export default function Home() {
  const [difficulty, setDifficulty] = useState("medium");
  const [phase, setPhase] = useState("select"); // select | countdown | typing | results
  const [quote, setQuote] = useState(null);
  const [result, setResult] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(!getUsername());
  const [soundOn, setSoundOn] = useState(getSoundEnabled());

  const startGame = useCallback(() => {
    const q = getRandomQuote(difficulty);
    setQuote(q);
    const timeLimit = TIME_LIMITS[difficulty];
    if (timeLimit) {
      setPhase("countdown");
    } else {
      setPhase("typing");
    }
  }, [difficulty]);

  const handleCountdownComplete = useCallback(() => {
    setPhase("typing");
  }, []);

  const handleComplete = useCallback(
    (res) => {
      setResult(res);
      setPhase("results");
      saveAttempt(res);
      const name = getUsername();
      if (name) {
        saveToLeaderboard({ name, ...res });
      }
    },
    []
  );

  const handleTryAgain = useCallback(() => {
    const timeLimit = TIME_LIMITS[difficulty];
    if (timeLimit) {
      setPhase("countdown");
    } else {
      setPhase("typing");
    }
  }, [difficulty, quote]);

  const handleNewQuote = useCallback(() => {
    const q = getRandomQuote(difficulty);
    setQuote(q);
    const timeLimit = TIME_LIMITS[difficulty];
    if (timeLimit) {
      setPhase("countdown");
    } else {
      setPhase("typing");
    }
  }, [difficulty]);

  const handleNameSubmit = useCallback((name) => {
    setUsername(name);
    setShowNamePrompt(false);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNamePrompt && <NamePrompt onSubmit={handleNameSubmit} />}
      {phase === "countdown" && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      {/* Header */}
      <header className="pt-8 pb-4 px-4">
        <div className="flex items-center justify-center gap-3 mb-1">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple">
            Typing Speed Racer
          </h1>
        </div>
        <p className="text-gray-500 text-sm font-mono">
          Race to type. Track your speed. Climb the board.
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 gap-6">
        {phase === "select" && (
          <>
            <DifficultySelect
              selected={difficulty}
              onSelect={setDifficulty}
            />
            <button
              onClick={startGame}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 text-neon-green border border-neon-green/30 rounded-xl font-mono text-lg font-bold hover:from-neon-green/30 hover:to-neon-blue/30 hover:shadow-[0_0_30px_rgba(57,255,20,0.2)] transition-all cursor-pointer"
            >
              Start Race
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors cursor-pointer"
            >
              Sound: {soundOn ? "ON" : "OFF"}
            </button>
          </>
        )}

        {phase === "typing" && quote && (
          <TypingArea
            key={quote.content}
            quote={quote}
            onComplete={handleComplete}
            timeLimit={TIME_LIMITS[difficulty]}
            difficulty={difficulty}
          />
        )}

        {phase === "results" && result && (
          <Results
            result={result}
            onTryAgain={handleTryAgain}
            onNewQuote={handleNewQuote}
          />
        )}
      </main>
    </div>
  );
}
