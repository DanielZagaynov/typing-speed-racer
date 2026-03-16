const HISTORY_KEY = "typing-racer-history";
const LEADERBOARD_KEY = "typing-racer-leaderboard";
const USERNAME_KEY = "typing-racer-username";
const SOUND_KEY = "typing-racer-sound";

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt) {
  const history = getHistory();
  history.push({ ...attempt, id: Date.now(), date: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry) {
  const board = getLeaderboard();
  board.push({ ...entry, id: Date.now(), date: new Date().toISOString() });
  board.sort((a, b) => b.wpm - a.wpm);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board.slice(0, 100)));
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

export function setUsername(name) {
  localStorage.setItem(USERNAME_KEY, name);
}

export function getSoundEnabled() {
  const val = localStorage.getItem(SOUND_KEY);
  return val === null ? true : val === "true";
}

export function setSoundEnabled(enabled) {
  localStorage.setItem(SOUND_KEY, String(enabled));
}
