import { encodePacked, keccak256, type Hex } from "viem";
import { config } from "../config.js";
import { publicClient, walletClient, agentAddress } from "../utils/monad-client.js";
import { MICRO_MARKET_ABI, CLAW_LOG_ABI } from "../utils/contract-abis.js";
import { chainLog } from "../utils/logger.js";
import { enqueueTx, GAS_LIMITS, isOnchainPaused } from "../utils/tx-manager.js";

function getMarketAddress(): Hex {
  if (!config.MARKET_CONTRACT_ADDRESS) {
    throw new Error("MARKET_CONTRACT_ADDRESS not set");
  }
  return config.MARKET_CONTRACT_ADDRESS as Hex;
}

function getClawLogAddress(): Hex {
  if (!config.CLAW_LOG_CONTRACT_ADDRESS) {
    throw new Error("CLAW_LOG_CONTRACT_ADDRESS not set");
  }
  return config.CLAW_LOG_CONTRACT_ADDRESS as Hex;
}

export async function createOnchainMarket(
  priceId: Hex,
  strikePrice: bigint,
  durationSecs: number
): Promise<{ marketId: number; txHash: Hex } | null> {
  return enqueueTx("createMarket", GAS_LIMITS.CREATE_MARKET, async () => {
    chainLog.info(
      { strikePrice: strikePrice.toString(), duration: durationSecs },
      "Creating on-chain market..."
    );

    const txHash = await walletClient.writeContract({
      address: getMarketAddress(),
      abi: MICRO_MARKET_ABI,
      functionName: "createMarket",
      args: [priceId, strikePrice, BigInt(durationSecs)],
      gas: GAS_LIMITS.CREATE_MARKET,
    });

    chainLog.info({ txHash }, "Market creation tx sent");

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 60_000,
    });

    const marketCount = await publicClient.readContract({
      address: getMarketAddress(),
      abi: MICRO_MARKET_ABI,
      functionName: "marketCount",
    });

    const marketId = Number(marketCount) - 1;

    chainLog.info(
      { marketId, txHash, gasUsed: receipt.gasUsed.toString() },
      "Market created on-chain"
    );

    return { marketId, txHash };
  });
}

export async function resolveOnchainMarket(
  marketId: number,
  finalPrice: bigint
): Promise<{ txHash: Hex } | null> {
  return enqueueTx("resolveMarket", GAS_LIMITS.RESOLVE_MARKET, async () => {
    chainLog.info(
      { marketId, finalPrice: finalPrice.toString() },
      "Resolving on-chain market..."
    );

    const txHash = await walletClient.writeContract({
      address: getMarketAddress(),
      abi: MICRO_MARKET_ABI,
      functionName: "resolveMarket",
      args: [BigInt(marketId), finalPrice],
      gas: GAS_LIMITS.RESOLVE_MARKET,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 60_000,
    });

    chainLog.info(
      { marketId, txHash, gasUsed: receipt.gasUsed.toString() },
      "Market resolved on-chain"
    );

    return { txHash };
  });
}

export async function logAgentAction(
  actionType: number,
  data: string
): Promise<Hex | null> {
  if (!config.CLAW_LOG_CONTRACT_ADDRESS) {
    chainLog.debug("ClawLog not deployed, skipping on-chain log");
    return null;
  }

  if (isOnchainPaused()) {
    chainLog.debug({ actionType }, "Skipping ClawLog - on-chain paused");
    return null;
  }

  return enqueueTx("clawLog", GAS_LIMITS.CLAW_LOG, async () => {
    const dataHash = keccak256(
      encodePacked(["string"], [data])
    );

    const txHash = await walletClient.writeContract({
      address: getClawLogAddress(),
      abi: CLAW_LOG_ABI,
      functionName: "log",
      args: [actionType, dataHash],
      gas: GAS_LIMITS.CLAW_LOG,
    });

    chainLog.debug({ actionType, txHash }, "Agent action logged on-chain");
    return txHash;
  });
}

// Action type constants matching ClawLog.sol
export const ONCHAIN_ACTION = {
  MARKET_CREATED: 1,
  PREDICTION_MADE: 2,
  MARKET_RESOLVED: 3,
  NARRATIVE_POSTED: 4,
} as const;
