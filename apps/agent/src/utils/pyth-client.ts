import { config, PYTH_FEEDS } from "../config.js";
import { priceLog } from "./logger.js";
import type { PriceData } from "./types.js";

interface HermesPriceResponse {
  readonly parsed: ReadonlyArray<{
    readonly id: string;
    readonly price: {
      readonly price: string;
      readonly conf: string;
      readonly expo: number;
      readonly publish_time: number;
    };
    readonly ema_price: {
      readonly price: string;
      readonly conf: string;
      readonly expo: number;
      readonly publish_time: number;
    };
  }>;
}

const FEED_SYMBOLS: Record<string, string> = {
  [PYTH_FEEDS.MON_USD]: "MON/USD",
  [PYTH_FEEDS.BTC_USD]: "BTC/USD",
  [PYTH_FEEDS.ETH_USD]: "ETH/USD",
};

function parsePythPrice(
  rawPrice: string,
  expo: number
): number {
  return Number(rawPrice) * Math.pow(10, expo);
}

// Hermes rate limit: 30 req/10s per IP. 429 → 60s block.
let rateLimitedUntil = 0;

export async function fetchPrices(
  feedIds: readonly string[] = [PYTH_FEEDS.MON_USD]
): Promise<readonly PriceData[]> {
  // Respect 429 cooldown
  const now = Date.now();
  if (now < rateLimitedUntil) {
    const waitSec = Math.ceil((rateLimitedUntil - now) / 1000);
    priceLog.debug({ waitSec }, "Hermes rate-limit cooldown active, skipping");
    throw new Error(`Hermes rate-limited, ${waitSec}s remaining`);
  }

  const idsParam = feedIds.map((id) => `ids[]=${id}`).join("&");
  const url = `${config.PYTH_HERMES_URL}/v2/updates/price/latest?${idsParam}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 429) {
    rateLimitedUntil = Date.now() + 60_000;
    priceLog.warn("Hermes 429 rate-limited — backing off 60s");
    throw new Error("Pyth Hermes 429 rate-limited");
  }

  if (!response.ok) {
    throw new Error(`Pyth Hermes error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as HermesPriceResponse;

  return data.parsed.map((entry) => ({
    feedId: `0x${entry.id}`,
    symbol: FEED_SYMBOLS[`0x${entry.id}`] ?? entry.id.slice(0, 8),
    price: parsePythPrice(entry.price.price, entry.price.expo),
    confidence: parsePythPrice(entry.price.conf, entry.price.expo),
    publishTime: entry.price.publish_time,
    emaPrice: parsePythPrice(entry.ema_price.price, entry.ema_price.expo),
  }));
}

export async function fetchMonPrice(): Promise<PriceData> {
  const prices = await fetchPrices([PYTH_FEEDS.MON_USD]);

  if (prices.length === 0) {
    throw new Error("No MON/USD price data from Pyth");
  }

  return prices[0];
}

export async function fetchPriceWithFallback(): Promise<PriceData> {
  // Try MON/USD first
  try {
    return await fetchMonPrice();
  } catch (err) {
    priceLog.warn({ err }, "MON/USD feed failed, trying fallback feeds");
  }

  // Fallback to ETH/USD
  try {
    const prices = await fetchPrices([PYTH_FEEDS.ETH_USD]);
    if (prices.length > 0) {
      priceLog.info("Using ETH/USD as fallback price feed");
      return prices[0];
    }
  } catch (err) {
    priceLog.warn({ err }, "ETH/USD fallback also failed");
  }

  // Final fallback: BTC/USD
  const prices = await fetchPrices([PYTH_FEEDS.BTC_USD]);
  if (prices.length > 0) {
    priceLog.info("Using BTC/USD as fallback price feed");
    return prices[0];
  }

  throw new Error("All Pyth price feeds unavailable");
}
