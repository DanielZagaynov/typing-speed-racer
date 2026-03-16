export function getRank(wpm) {
  if (wpm >= 120) return { label: "Lightning", emoji: "\u26a1", color: "text-neon-purple" };
  if (wpm >= 90) return { label: "Cheetah", emoji: "\ud83d\udc06", color: "text-neon-yellow" };
  if (wpm >= 60) return { label: "Rabbit", emoji: "\ud83d\udc07", color: "text-neon-green" };
  if (wpm >= 35) return { label: "Turtle", emoji: "\ud83d\udc22", color: "text-neon-blue" };
  return { label: "Snail", emoji: "\ud83d\udc0c", color: "text-gray-400" };
}

export function getWpmColor(wpm) {
  if (wpm >= 80) return "text-green-400";
  if (wpm >= 45) return "text-yellow-400";
  return "text-red-400";
}
