"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

interface Question {
  id: string;
  lane: "luck" | "prediction" | "sponsor";
  category: string;
  question: string;
  options: string[];
  sponsor: { name: string; logo: string } | null;
}

interface QuestionCardProps {
  question: Question;
}

const LANE_STYLES = {
  luck: {
    bg: "from-blue-900/40 to-cyan-900/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    icon: "🍀",
  },
  prediction: {
    bg: "from-orange-900/40 to-yellow-900/20",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300",
    icon: "📈",
  },
  sponsor: {
    bg: "from-purple-900/40 to-pink-900/20",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300",
    icon: "🎁",
  },
};

export function QuestionCard({ question }: QuestionCardProps) {
  const { isConnected } = useAccount();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const style = LANE_STYLES[question.lane];

  const handleSubmit = (optionIndex: number) => {
    if (!isConnected || submitted) return;
    setSelectedOption(optionIndex);
    setSubmitted(true);
    // TODO: Submit to Supabase and trigger badge check
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${style.bg} border ${style.border} p-4 card-hover`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>{style.icon}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
            {question.category}
          </span>
        </div>
        {question.sponsor && (
          <span className="text-xs text-gray-400">
            by {question.sponsor.name}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="font-medium mb-4">{question.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSubmit(index)}
            disabled={!isConnected || submitted}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              submitted && selectedOption === index
                ? "bg-monad text-white ring-2 ring-monad ring-offset-2 ring-offset-gray-900"
                : submitted
                ? "bg-gray-800/50 text-gray-500"
                : isConnected
                ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-xs">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Submitted state */}
      {submitted && (
        <div className="mt-4 text-center text-sm text-green-400 animate-in fade-in">
          Answered! +5 Points
        </div>
      )}

      {/* Prediction countdown (only for prediction lane) */}
      {question.lane === "prediction" && !submitted && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-orange-400">
          <span className="animate-pulse">⏱️</span>
          Results in 5 minutes
        </div>
      )}
    </div>
  );
}
