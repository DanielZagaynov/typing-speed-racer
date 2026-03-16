const difficulties = [
  {
    key: "easy",
    label: "Easy",
    desc: "Short quotes, no timer",
    color: "border-green-500/30 hover:border-green-500 hover:bg-green-500/10",
    activeColor: "border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]",
    textColor: "text-green-400",
  },
  {
    key: "medium",
    label: "Medium",
    desc: "Medium quotes, 60s timer",
    color: "border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10",
    activeColor: "border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
    textColor: "text-yellow-400",
  },
  {
    key: "hard",
    label: "Hard",
    desc: "Long quotes, 45s, errors penalized",
    color: "border-red-500/30 hover:border-red-500 hover:bg-red-500/10",
    activeColor: "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    textColor: "text-red-400",
  },
];

export default function DifficultySelect({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
      {difficulties.map((d) => (
        <button
          key={d.key}
          onClick={() => onSelect(d.key)}
          className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
            selected === d.key ? d.activeColor : d.color
          }`}
        >
          <div className={`text-xl font-bold font-mono ${d.textColor}`}>
            {d.label}
          </div>
          <div className="text-sm text-gray-400 mt-1">{d.desc}</div>
        </button>
      ))}
    </div>
  );
}
