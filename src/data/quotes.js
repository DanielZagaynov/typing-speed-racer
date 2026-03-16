export const fallbackQuotes = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { content: "Act as if what you do makes a difference. It does.", author: "William James" },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { content: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { content: "You miss one hundred percent of the shots you never take.", author: "Wayne Gretzky" },
  { content: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb" },
  { content: "I have not failed. I've just found ten thousand ways that won't work.", author: "Thomas Edison" },
  { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { content: "The mind is everything. What you think you become.", author: "Buddha" },
  { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { content: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { content: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { content: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "We become what we think about most of the time, and that is the strangest secret.", author: "Earl Nightingale" },
  { content: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { content: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { content: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { content: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
  { content: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
  { content: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { content: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.", author: "Henry Ford" },
  { content: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { content: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { content: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { content: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { content: "There is nothing permanent except change.", author: "Heraclitus" },
  { content: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { content: "The best revenge is massive success.", author: "Frank Sinatra" },
  { content: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { content: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { content: "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
  { content: "I attribute my success to this: I never gave or took any excuse.", author: "Florence Nightingale" },
  { content: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
  { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { content: "If you can dream it, you can do it.", author: "Walt Disney" },
  { content: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { content: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { content: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
];

export function getQuotesByDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      return fallbackQuotes.filter((q) => q.content.length < 100);
    case "medium":
      return fallbackQuotes.filter(
        (q) => q.content.length >= 50 && q.content.length <= 200
      );
    case "hard":
      return fallbackQuotes.filter((q) => q.content.length > 80);
    default:
      return fallbackQuotes;
  }
}

export function getRandomQuote(difficulty) {
  const quotes = getQuotesByDifficulty(difficulty);
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export async function fetchQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    if (!res.ok) throw new Error("API failed");
    const data = await res.json();
    return { content: data.content, author: data.author };
  } catch {
    return getRandomQuote("medium");
  }
}
