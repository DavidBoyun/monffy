import { z } from "zod";

// Load .env file for local development
// tsx + Node 20+ supports --env-file, but we also handle .env manually
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(): void {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // No .env file - that's fine, use system env vars
  }
}

loadEnvFile();

const envSchema = z.object({
  // Monad
  MONAD_RPC_URL: z.string().url().default("https://rpc.monad.xyz"),

  // Agent wallet
  AGENT_PRIVATE_KEY: z.string().startsWith("0x").min(66),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(10),

  // Contracts (optional until deployed)
  BADGE_CONTRACT_ADDRESS: z.string().startsWith("0x").optional(),
  MARKET_CONTRACT_ADDRESS: z.string().startsWith("0x").optional(),
  CLAW_LOG_CONTRACT_ADDRESS: z.string().startsWith("0x").optional(),

  // Pyth
  PYTH_HERMES_URL: z
    .string()
    .url()
    .default("https://hermes.pyth.network"),

  // Agent tuning
  PRICE_CHECK_INTERVAL_MS: z.coerce.number().int().positive().default(5000),
  BRAIN_TICK_INTERVAL_MS: z.coerce.number().int().positive().default(10000),
  PRICE_THRESHOLD_PCT: z.coerce.number().positive().default(2.0),
  MARKET_DURATION_SECS: z.coerce.number().int().positive().default(300),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),

  // Demo mode (for hackathon video recording)
  DEMO_MODE: z.coerce.boolean().default(false),
  DEMO_MARKET_DURATION_SECS: z.coerce.number().int().positive().default(60),
});

export type EnvConfig = z.infer<typeof envSchema>;

function loadConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${missing}`);
  }

  return result.data;
}

export const config = loadConfig();

// Effective market duration (demo mode overrides)
export const EFFECTIVE_MARKET_DURATION = config.DEMO_MODE
  ? config.DEMO_MARKET_DURATION_SECS
  : config.MARKET_DURATION_SECS;

// Pyth price feed IDs
export const PYTH_FEEDS = {
  MON_USD:
    "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1",
  BTC_USD:
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ETH_USD:
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
} as const;

// Monad mainnet chain config
export const MONAD_CHAIN = {
  id: 143,
  name: "Monad",
  nativeCurrency: { decimals: 18, name: "MON", symbol: "MON" },
  rpcUrls: {
    default: { http: [config.MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Monadscan",
      url: "https://monadscan.com",
    },
  },
} as const;
