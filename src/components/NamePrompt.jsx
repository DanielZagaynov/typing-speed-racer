import { useState } from "react";

export default function NamePrompt({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md animate-slide-up"
      >
        <h2 className="text-2xl font-bold font-mono text-neon-green mb-2">
          Welcome, Racer!
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter your name for the leaderboard.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          maxLength={20}
          autoFocus
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-neon-green/50 mb-4"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg font-mono font-semibold hover:bg-neon-green/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Start Racing
        </button>
      </form>
    </div>
  );
}
