import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Monad Mainnet chain definition
export const monad = defineChain({
  id: 143,
  name: "Monad",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monadscan",
      url: "https://monadscan.com",
    },
  },
});

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// With WalletConnect project ID: full RainbowKit config (WC + injected wallets)
// Without: injected wallets only (MetaMask, etc.) - no WalletConnect
export const config = projectId
  ? getDefaultConfig({
      appName: "MONFFY",
      projectId,
      chains: [monad],
      transports: {
        [monad.id]: http(),
      },
      ssr: true,
    })
  : createConfig({
      chains: [monad],
      connectors: [injected()],
      transports: {
        [monad.id]: http(),
      },
      ssr: true,
    });
