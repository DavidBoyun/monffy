import type {
  PriceData,
  PriceSignal,
  AgentPrediction,
  ReasonTrace,
} from "../utils/types.js";
import { brainLog } from "../utils/logger.js";

/**
 * MONFFY's prediction engine - intentionally imperfect (~60% accuracy)
 *
 * Strategy:
 * 1. Momentum (40%): Recent price direction continues
 * 2. Mean reversion (45%): Extreme moves tend to reverse
 * 3. Random noise (15%): Makes agent beatable by humans
 */
export function makePrediction(
  signal: PriceSignal,
  priceHistory: readonly PriceData[]
): { prediction: AgentPrediction; reasonTrace: ReasonTrace } {
  let upScore = 0.5; // Start neutral

  // --- Momentum component (40% weight) ---
  let momentumScore = 0;
  const recentPrices = priceHistory.slice(-6); // Last 30s
  if (recentPrices.length >= 2) {
    const first = recentPrices[0].price;
    const last = recentPrices[recentPrices.length - 1].price;
    const momentum = (last - first) / first;
    momentumScore = momentum > 0 ? 0.15 : -0.15;
    upScore += momentumScore;
  }

  // --- Mean reversion component (45% weight) ---
  let meanReversionScore = 0;
  if (signal.type === "SPIKE") {
    meanReversionScore = -0.2;
  } else if (signal.type === "DUMP") {
    meanReversionScore = 0.2;
  }
  upScore += meanReversionScore;

  // EMA comparison (if available)
  let emaDeviation = 0;
  if (priceHistory.length > 0) {
    const latest = priceHistory[priceHistory.length - 1];
    if (latest.emaPrice > 0) {
      emaDeviation = (latest.price - latest.emaPrice) / latest.emaPrice;
      upScore -= emaDeviation * 2;
    }
  }

  // --- Random noise (15% weight) ---
  const noise = (Math.random() - 0.5) * 0.3;
  const rawScore = upScore + noise;

  // Clamp to [0.1, 0.9] - never be 100% sure
  const clampedScore = Math.max(0.1, Math.min(0.9, rawScore));

  const prediction: "UP" | "DOWN" = clampedScore >= 0.5 ? "UP" : "DOWN";
  const confidence = Math.abs(clampedScore - 0.5) * 2; // 0 to 0.8

  const reasoning = buildReasoning(signal, prediction, clampedScore);

  // Build reason trace
  const reasonTrace: ReasonTrace = {
    timestamp: Date.now(),
    signal: {
      type: signal.type,
      symbol: signal.symbol,
      priceChangePct: signal.changePct,
      currentPrice: signal.currentPrice,
    },
    components: {
      momentumScore,
      meanReversionScore,
      emaDeviation,
      noise,
    },
    decision: {
      rawScore,
      clampedScore,
      prediction,
      confidence,
    },
  };

  brainLog.info(
    {
      prediction,
      confidence: (confidence * 100).toFixed(0) + "%",
      upScore: clampedScore.toFixed(3),
    },
    "MONFFY prediction made"
  );

  return {
    prediction: {
      questionId: "", // Set by caller
      prediction,
      confidence,
      reasoning,
    },
    reasonTrace,
  };
}

function buildReasoning(
  signal: PriceSignal,
  prediction: "UP" | "DOWN",
  score: number
): string {
  const emoji = prediction === "UP" ? "⬆️" : "⬇️";
  const confText =
    Math.abs(score - 0.5) > 0.3
      ? "High confidence!"
      : Math.abs(score - 0.5) > 0.15
        ? "Likely..."
        : "50/50 but...";

  if (signal.type === "SPIKE") {
    return prediction === "UP"
      ? `${emoji} Strong upward momentum! ${confText}`
      : `${emoji} Already pumped hard — correction incoming! ${confText}`;
  }

  if (signal.type === "DUMP") {
    return prediction === "DOWN"
      ? `${emoji} Downtrend looks like it'll continue... ${confText}`
      : `${emoji} Oversold! Bounce time! ${confText}`;
  }

  // QUIET
  return prediction === "UP"
    ? `${emoji} Quiet market... sensing an uptrend! ${confText}`
    : `${emoji} Quiet market... feeling bearish! ${confText}`;
}
