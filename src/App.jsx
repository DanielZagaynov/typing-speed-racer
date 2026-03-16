import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";

function NavBar() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur border-t border-gray-800 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 px-4 py-3">
        <Link
          to="/"
          className={`font-mono text-sm transition-colors ${
            location.pathname === "/"
              ? "text-neon-green"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Race
        </Link>
        <Link
          to="/leaderboard"
          className={`font-mono text-sm transition-colors ${
            location.pathname === "/leaderboard"
              ? "text-neon-green"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="pt-0 md:pt-12 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
