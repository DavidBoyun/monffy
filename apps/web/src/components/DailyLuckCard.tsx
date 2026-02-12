"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const LUCK_MESSAGES = [
  { emoji: "🌟", title: "Jackpot Fortune!", desc: "Everything will go your way today" },
  { emoji: "✨", title: "Lucky Day!", desc: "Good news is on its way" },
  { emoji: "🍀", title: "Four-Leaf Clover!", desc: "Unexpected luck awaits you" },
  { emoji: "🎯", title: "Bullseye Fortune!", desc: "Your predictions will be spot-on today" },
  { emoji: "💎", title: "Gem Fortune!", desc: "A precious opportunity is coming" },
];

export function DailyLuckCard() {
  const { isConnected } = useAccount();
  const [revealed, setRevealed] = useState(false);
  const [luck, setLuck] = useState<(typeof LUCK_MESSAGES)[0] | null>(null);

  const handleReveal = () => {
    if (!isConnected) return;

    // Random luck selection (will be deterministic based on wallet + date later)
    const randomLuck =
      LUCK_MESSAGES[Math.floor(Math.random() * LUCK_MESSAGES.length)];
    setLuck(randomLuck);
    setRevealed(true);
  };

  // Reset at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeout = setTimeout(() => {
      setRevealed(false);
      setLuck(null);
    }, tomorrow.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-500/30 p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>🐰</span>
            Daily Luck
          </h2>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!isConnected}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              isConnected
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 monad-glow cursor-pointer"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isConnected ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">🎲</span>
                Draw Luck
              </span>
            ) : (
              "Connect Wallet"
            )}
          </button>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
            <span className="text-5xl mb-3 block">{luck?.emoji}</span>
            <h3 className="text-xl font-bold gradient-text mb-2">
              {luck?.title}
            </h3>
            <p className="text-gray-300">{luck?.desc}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-400">
              <span>+10 Points Earned!</span>
              <span className="animate-ping">✨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
