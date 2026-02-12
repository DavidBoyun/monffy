import {
  createPublicClient,
  createWalletClient,
  http,
  defineChain,
  type PublicClient,
  type WalletClient,
  type Transport,
  type Chain,
  type Account,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config, MONAD_CHAIN } from "../config.js";
import { chainLog } from "./logger.js";

const monadChain = defineChain({
  id: MONAD_CHAIN.id,
  name: MONAD_CHAIN.name,
  nativeCurrency: MONAD_CHAIN.nativeCurrency,
  rpcUrls: MONAD_CHAIN.rpcUrls,
  blockExplorers: MONAD_CHAIN.blockExplorers,
});

const transport = http(config.MONAD_RPC_URL, {
  retryCount: 3,
  retryDelay: 1000,
  timeout: 30_000,
});

export const publicClient: PublicClient<Transport, Chain> = createPublicClient({
  chain: monadChain,
  transport,
});

const account = privateKeyToAccount(config.AGENT_PRIVATE_KEY as `0x${string}`);

export const walletClient: WalletClient<Transport, Chain, Account> =
  createWalletClient({
    account,
    chain: monadChain,
    transport,
  });

export const agentAddress = account.address;

export async function getAgentBalance(): Promise<bigint> {
  return publicClient.getBalance({ address: agentAddress });
}

export async function logAgentInfo(): Promise<void> {
  const balance = await getAgentBalance();
  const balanceMon = Number(balance) / 1e18;

  chainLog.info(
    {
      address: agentAddress,
      balance: `${balanceMon.toFixed(4)} MON`,
      chain: monadChain.name,
      rpc: config.MONAD_RPC_URL,
    },
    "Agent wallet connected"
  );

  if (balanceMon < 0.01) {
    chainLog.warn(
      "Low balance! Agent needs MON from faucet: https://faucet.monad.xyz"
    );
  }
}
