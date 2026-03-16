import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getRank, getWpmColor } from "../utils/ranks";
import { getHistory } from "../utils/storage";

export default function Results({ result, onTryAgain, onNewQuote }) {
  const rank = getRank(result.wpm);
  const wpmColorClass = getWpmColor(result.wpm);
  const history = getHistory();

  const chartData = useMemo(() => {
    return history.slice(-10).map((entry, i) => ({
      attempt: `#${history.length - 9 + i > 0 ? history.length - 9 + i : i + 1}`,
      wpm: entry.wpm,
      accuracy: entry.accuracy,
    }));
  }, [history]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Results card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        {/* Rank badge */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{rank.emoji}</div>
          <div className={`text-2xl font-bold font-mono ${rank.color}`}>
            {rank.label}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="WPM"
            value={result.wpm}
            colorClass={wpmColorClass}
          />
          <StatCard
            label="Accuracy"
            value={`${result.accuracy}%`}
            colorClass={
              result.accuracy >= 95
                ? "text-green-400"
                : result.accuracy >= 80
                ? "text-yellow-400"
                : "text-red-400"
            }
          />
          <StatCard
            label="Time"
            value={`${result.time}s`}
            colorClass="text-neon-blue"
          />
          <StatCard
            label="Best Streak"
            value={result.bestStreak}
            colorClass="text-neon-yellow"
          />
        </div>

        {/* Difficulty badge */}
        <div className="text-center mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${
              result.difficulty === "easy"
                ? "bg-green-500/20 text-green-400"
                : result.difficulty === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {result.difficulty}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onTryAgain}
            className="px-6 py-3 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg font-mono font-semibold hover:bg-neon-green/20 transition-all cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={onNewQuote}
            className="px-6 py-3 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg font-mono font-semibold hover:bg-neon-blue/20 transition-all cursor-pointer"
          >
            New Quote
          </button>
        </div>
      </div>

      {/* Performance chart */}
      {chartData.length > 1 && (
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-mono text-gray-400 mb-4">
            Performance History (Last 10)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="attempt"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={{ stroke: "#333" }}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={{ stroke: "#333" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontFamily: "JetBrains Mono",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="wpm" fill="#39ff14" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, colorClass }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold font-mono ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
