import { useState, useEffect } from "react";

export default function Countdown({ onComplete }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
      <div key={count} className="animate-count-pulse">
        <span className="text-9xl font-bold font-mono text-neon-green drop-shadow-[0_0_30px_rgba(57,255,20,0.5)]">
          {count}
        </span>
      </div>
    </div>
  );
}
