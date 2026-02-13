import { config, EFFECTIVE_PRICE_THRESHOLD, EFFECTIVE_SIGNAL_COOLDOWN } from "../config.js";

const SIGNAL_LOOKBACK_SECS = config.DEMO_MODE ? 10 : 30;
import { fetchPriceWithFallback } from "../utils/pyth-client.js";
import { priceLog } from "../utils/logger.js";
import type { PriceData, PriceSignal } from "../utils/types.js";

interface PriceHistory {
  readonly prices: readonly PriceData[];
  readonly lastSignalTime: number;
}

const MAX_HISTORY = 120; // ~10 min at 5s intervals
const SIGNAL_COOLDOWN_MS = EFFECTIVE_SIGNAL_COOLDOWN;

export function createPriceMonitor() {
  let history: PriceHistory = { prices: [], lastSignalTime: 0 };
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let onSignalCallback: ((signal: PriceSignal) => void) | null = null;
  let onPriceCallback: ((price: PriceData) => void) | null = null;

  function getLatestPrice(): PriceData | null {
    const { prices } = history;
    return prices.length > 0 ? prices[prices.length - 1] : null;
  }

  function getPriceNSecondsAgo(seconds: number): PriceData | null {
    const { prices } = history;
    const targetTime = Date.now() / 1000 - seconds;

    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i].publishTime <= targetTime) {
        return prices[i];
      }
    }
    return null;
  }

  function detectSignal(current: PriceData): PriceSignal | null {
    // Need enough price history for meaningful comparison
    const previous = getPriceNSecondsAgo(SIGNAL_LOOKBACK_SECS);
    if (!previous || previous.price === 0) return null;

    // Reject if symbols don't match (fallback feed switched)
    if (current.symbol !== previous.symbol) {
      priceLog.warn(
        { current: current.symbol, previous: previous.symbol },
        "Symbol mismatch — skipping signal (fallback feed transition)"
      );
      return null;
    }

    const changePct =
      ((current.price - previous.price) / previous.price) * 100;
    const threshold = EFFECTIVE_PRICE_THRESHOLD;

    // Reject absurd values (> 20% in 30s is impossible for real markets)
    if (Math.abs(changePct) > 20) {
      priceLog.warn(
        { changePct: changePct.toFixed(2) },
        "Abnormal price change detected — skipping signal"
      );
      return null;
    }

    // Cooldown check
    const now = Date.now();
    if (now - history.lastSignalTime < SIGNAL_COOLDOWN_MS) {
      return null;
    }

    if (changePct >= threshold) {
      return {
        type: "SPIKE",
        symbol: current.symbol,
        currentPrice: current.price,
        previousPrice: previous.price,
        changePct,
        timestamp: now,
      };
    }

    if (changePct <= -threshold) {
      return {
        type: "DUMP",
        symbol: current.symbol,
        currentPrice: current.price,
        previousPrice: previous.price,
        changePct,
        timestamp: now,
      };
    }

    return null;
  }

  async function tick(): Promise<void> {
    try {
      const price = await fetchPriceWithFallback();

      // Update history immutably
      const updatedPrices = [...history.prices, price].slice(-MAX_HISTORY);
      history = { ...history, prices: updatedPrices };

      priceLog.debug(
        { symbol: price.symbol, price: price.price.toFixed(6) },
        "Price update"
      );

      if (onPriceCallback) {
        onPriceCallback(price);
      }

      // Detect signals
      const signal = detectSignal(price);
      if (signal) {
        priceLog.info(
          {
            type: signal.type,
            symbol: signal.symbol,
            change: `${signal.changePct.toFixed(2)}%`,
            price: signal.currentPrice.toFixed(6),
          },
          "Price signal detected!"
        );

        history = { ...history, lastSignalTime: signal.timestamp };

        if (onSignalCallback) {
          onSignalCallback(signal);
        }
      }
    } catch (err) {
      priceLog.error({ err }, "Price fetch failed");
    }
  }

  return {
    start(): void {
      priceLog.info(
        { intervalMs: config.PRICE_CHECK_INTERVAL_MS },
        "Price monitor starting"
      );
      // Immediate first tick
      tick();
      intervalId = setInterval(tick, config.PRICE_CHECK_INTERVAL_MS);
    },

    stop(): void {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        priceLog.info("Price monitor stopped");
      }
    },

    onSignal(callback: (signal: PriceSignal) => void): void {
      onSignalCallback = callback;
    },

    onPrice(callback: (price: PriceData) => void): void {
      onPriceCallback = callback;
    },

    getLatestPrice,
    getPriceNSecondsAgo,

    getHistory(): readonly PriceData[] {
      return history.prices;
    },

    getLastSignalTime(): number {
      return history.lastSignalTime;
    },
  };
}

export type PriceMonitor = ReturnType<typeof createPriceMonitor>;
