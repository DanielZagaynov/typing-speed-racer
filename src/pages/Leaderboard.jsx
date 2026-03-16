import { useState, useMemo } from "react";
import { getLeaderboard, getUsername } from "../utils/storage";
import { getRank } from "../utils/ranks";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("wpm");
  const board = getLeaderboard();
  const currentUser = getUsername();

  const filtered = useMemo(() => {
    let items =
      filterDifficulty === "all"
        ? board
        : board.filter((e) => e.difficulty === filterDifficulty);

    items.sort((a, b) => {
      if (sortBy === "wpm") return b.wpm - a.wpm;
      if (sortBy === "accuracy") return b.accuracy - a.accuracy;
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      return 0;
    });

    return items;
  }, [board, filterDifficulty, sortBy]);

  // Find personal best
  const personalBest = useMemo(() => {
    const userEntries = board.filter((e) => e.name === currentUser);
    if (!userEntries.length) return null;
    return userEntries.reduce((best, e) => (e.wpm > best.wpm ? e : best));
  }, [board, currentUser]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="pt-8 pb-4 px-4">
        <Link
          to="/"
          className="text-gray-500 hover:text-neon-green text-sm font-mono transition-colors"
        >
          &larr; Back to Racing
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow via-neon-green to-neon-blue mt-4">
          Leaderboard
        </h1>
      </header>

      <main className="flex-1 px-4 pb-8 max-w-4xl mx-auto w-full">
        {/* Personal best highlight */}
        {personalBest && (
          <div className="mb-6 bg-neon-green/5 border border-neon-green/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                Your Personal Best
              </div>
              <div className="text-2xl font-bold font-mono text-neon-green">
                {personalBest.wpm} WPM
              </div>
            </div>
            <div className="text-4xl">{getRank(personalBest.wpm).emoji}</div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all cursor-pointer ${
                filterDifficulty === d
                  ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                  : "border-gray-700 text-gray-500 hover:text-gray-300"
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            {["wpm", "accuracy", "date"].map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-2 rounded-lg font-mono text-xs border transition-all cursor-pointer ${
                  sortBy === s
                    ? "border-neon-blue/50 bg-neon-blue/10 text-neon-blue"
                    : "border-gray-700 text-gray-500 hover:text-gray-300"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 font-mono py-16">
            No scores yet. Start racing!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left py-3 px-3">#</th>
                  <th className="text-left py-3 px-3">Name</th>
                  <th className="text-right py-3 px-3">WPM</th>
                  <th className="text-right py-3 px-3">ACC</th>
                  <th className="text-center py-3 px-3">Difficulty</th>
                  <th className="text-center py-3 px-3">Rank</th>
                  <th className="text-right py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => {
                  const rank = getRank(entry.wpm);
                  const isPersonalBest =
                    personalBest && entry.id === personalBest.id;
                  const isCurrentUser = entry.name === currentUser;

                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-gray-800/50 transition-colors ${
                        isPersonalBest
                          ? "bg-neon-green/5"
                          : isCurrentUser
                          ? "bg-gray-900/50"
                          : "hover:bg-gray-900/30"
                      }`}
                    >
                      <td className="py-3 px-3 text-gray-500">{i + 1}</td>
                      <td className="py-3 px-3">
                        <span
                          className={
                            isCurrentUser ? "text-neon-green" : "text-gray-300"
                          }
                        >
                          {entry.name}
                        </span>
                        {isPersonalBest && (
                          <span className="ml-2 text-xs text-neon-yellow">
                            PB
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-neon-green">
                        {entry.wpm}
                      </td>
                      <td className="py-3 px-3 text-right text-neon-blue">
                        {entry.accuracy}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            entry.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : entry.difficulty === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {entry.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {rank.emoji}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-500 text-xs">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
