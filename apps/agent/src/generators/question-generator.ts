import { config, PYTH_FEEDS } from "../config.js";
import type { PriceSignal, AgentQuestion } from "../utils/types.js";

const SPIKE_TEMPLATES = [
  "{symbol} just surged {pct}%! Will it keep climbing in 5 min?",
  "{symbol} is pumping! {pct}% UP! Will the momentum hold?",
  "Whoa! {symbol} jumped {pct}%! More room to run?",
  "{symbol} rocket launch! {pct}% UP! Still going in 5 min?",
];

const DUMP_TEMPLATES = [
  "{symbol} just dropped {pct}%! Will it bounce back?",
  "{symbol} is dumping! {pct}% DOWN! Is the bottom in?",
  "Ouch! {symbol} fell {pct}%! Dead cat bounce or more pain?",
  "{symbol} flash crash! {pct}% DOWN! Recovery incoming?",
];

const QUIET_TEMPLATES = [
  "Market's quiet... {symbol} — where will it be in 1 hour?",
  "{symbol} is flat. Calm before the storm or just a nap?",
  "MONFFY is bored... {symbol} — what's the next move?",
  "Nothing happening! {symbol} — predict the next direction!",
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatTemplate(template: string, signal: PriceSignal): string {
  return template
    .replace("{symbol}", signal.symbol)
    .replace("{pct}", Math.abs(signal.changePct).toFixed(1));
}

export function generateQuestion(signal: PriceSignal): AgentQuestion {
  const templates =
    signal.type === "SPIKE"
      ? SPIKE_TEMPLATES
      : signal.type === "DUMP"
        ? DUMP_TEMPLATES
        : QUIET_TEMPLATES;

  const questionText = formatTemplate(pickRandom(templates), signal);
  const durationSecs = config.MARKET_DURATION_SECS;
  const expiresAt = new Date(Date.now() + durationSecs * 1000);

  // Determine feed ID based on symbol
  const feedId = signal.symbol.startsWith("MON")
    ? PYTH_FEEDS.MON_USD
    : signal.symbol.startsWith("ETH")
      ? PYTH_FEEDS.ETH_USD
      : PYTH_FEEDS.BTC_USD;

  return {
    id: "", // Will be set after DB insert
    questionText,
    options: ["UP", "DOWN"],
    lane: "prediction",
    category: `${signal.symbol} Price Prediction`,
    pythPriceId: feedId,
    strikePrice: signal.currentPrice,
    expiresAt,
    triggerType: signal.type,
  };
}

export function generateQuietSignal(
  symbol: string,
  currentPrice: number
): PriceSignal {
  return {
    type: "QUIET",
    symbol,
    currentPrice,
    previousPrice: currentPrice,
    changePct: 0,
    timestamp: Date.now(),
  };
}
