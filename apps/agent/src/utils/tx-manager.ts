/**
 * Transaction Manager - Balance guard, gas limit, nonce queue
 * Monad charges gas_limit (not gas_used), so explicit limits are critical.
 */
import type { Hex } from "viem";
import { publicClient, walletClient, agentAddress } from "./monad-client.js";
import { chainLog } from "./logger.js";

// Gas limits per operation (based on 12h stability test observations)
export const GAS_LIMITS = {
  CREATE_MARKET: 200_000n,
  RESOLVE_MARKET: 100_000n,
  CLAW_LOG: 60_000n,
} as const;

// Minimum balance to keep operating (in wei) = 0.005 MON
const MIN_BALANCE_WEI = 5_000_000_000_000_000n;

let paused = false;
let txQueue: Promise<void> = Promise.resolve();

/**
 * Check if agent has sufficient balance for a tx.
 * If below threshold, pause on-chain operations.
 */
export async function ensureSufficientBalance(
  gasLimit: bigint
): Promise<boolean> {
  const balance = await publicClient.getBalance({ address: agentAddress });

  if (balance < MIN_BALANCE_WEI) {
    if (!paused) {
      paused = true;
      chainLog.warn(
        {
          balance: `${(Number(balance) / 1e18).toFixed(6)} MON`,
          threshold: `${(Number(MIN_BALANCE_WEI) / 1e18).toFixed(6)} MON`,
        },
        "Balance below threshold - pausing on-chain operations"
      );
    }
    return false;
  }

  if (paused) {
    paused = false;
    chainLog.info("Balance recovered - resuming on-chain operations");
  }

  return true;
}

export function isOnchainPaused(): boolean {
  return paused;
}

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1_000;

/**
 * Serial tx queue with retry + exponential backoff.
 * Prevents nonce conflicts by ensuring only one tx is in flight at a time.
 * Retries transient failures (nonce conflicts, RPC timeouts) up to MAX_RETRIES.
 */
export async function enqueueTx<T>(
  label: string,
  gasLimit: bigint,
  fn: () => Promise<T>
): Promise<T | null> {
  return new Promise((resolve) => {
    txQueue = txQueue.then(async () => {
      const hasFunds = await ensureSufficientBalance(gasLimit);
      if (!hasFunds) {
        chainLog.debug({ label }, "Skipping tx - insufficient balance");
        resolve(null);
        return;
      }

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await fn();
          resolve(result);
          return;
        } catch (err) {
          const isLastAttempt = attempt === MAX_RETRIES;
          const errMsg = err instanceof Error ? err.message : String(err);
          const isRetryable =
            errMsg.includes("nonce") ||
            errMsg.includes("priority") ||
            errMsg.includes("timeout") ||
            errMsg.includes("ETIMEDOUT") ||
            errMsg.includes("replacement underpriced");

          if (isLastAttempt || !isRetryable) {
            chainLog.warn(
              { err, label, attempt },
              `Tx failed after ${attempt + 1} attempt(s)`
            );
            resolve(null);
            return;
          }

          const delay = BASE_DELAY_MS * 2 ** attempt;
          chainLog.info(
            { label, attempt: attempt + 1, delayMs: delay, error: errMsg },
            "Retrying tx with backoff..."
          );
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      resolve(null);
    });
  });
}
