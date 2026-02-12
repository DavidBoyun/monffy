"use client";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const getStreakEmoji = (s: number) => {
    if (s >= 30) return "🔥";
    if (s >= 14) return "⚡";
    if (s >= 7) return "✨";
    if (s >= 3) return "🌟";
    return "💫";
  };

  const getStreakColor = (s: number) => {
    if (s >= 30) return "from-red-500 to-orange-500";
    if (s >= 14) return "from-yellow-500 to-orange-500";
    if (s >= 7) return "from-purple-500 to-pink-500";
    if (s >= 3) return "from-blue-500 to-purple-500";
    return "from-gray-500 to-gray-400";
  };

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getStreakColor(
        streak
      )} text-white text-xs font-medium`}
    >
      <span>{getStreakEmoji(streak)}</span>
      <span>{streak}d</span>
    </div>
  );
}
