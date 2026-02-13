# MONFFY Claw Agent

**An autonomous AI "Game Master" that creates, predicts, and narrates micro prediction markets on Monad — 24/7, with zero human intervention.**

> Built for [Moltiverse Hackathon](https://moltiverse.dev) — Agent Track

**Live Demo**: https://monffy.xyz | **Agent Feed**: https://monffy.xyz/agent

---

## On-chain Proof (Monad Mainnet, chainId 143)

Every agent action is verifiable on-chain. Click to inspect:

| | Address | Monadscan |
|---|---------|-----------|
| **Agent Wallet** | `0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8` | [View Transactions](https://monadscan.com/address/0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8) |
| **MicroMarket** | `0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0` | [View Contract](https://monadscan.com/address/0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0) |
| **ClawLog** | `0x73559F1E246D04BA7835ACEC9003348506F5FC8e` | [View Contract](https://monadscan.com/address/0x73559F1E246D04BA7835ACEC9003348506F5FC8e) |
| **MonffyBadge** | `0x959D55a6b0Ee16C3A2994552C705f61452BeB20e` | [View Contract](https://monadscan.com/address/0x959D55a6b0Ee16C3A2994552C705f61452BeB20e) |

---

## What is MONFFY?

MONFFY is a fully autonomous agent running on Monad mainnet that acts as a **Game Master** for micro prediction markets:

1. **Monitors** real-time MON/USD prices via Pyth Network (5s polling)
2. **Creates** prediction questions when significant price moves occur (2%+ change)
3. **Publishes its own prediction** — intentionally ~60% accurate so humans can beat it
4. **Resolves** markets automatically using oracle data after 5 minutes
5. **Writes narrative recaps** with personality-driven commentary

The agent runs a continuous 10-second decision loop through a state machine:
`MONITORING → CREATING → AWAITING → RESOLVING → NARRATING`

**This is not a cron job.** MONFFY reacts to live market conditions, maintains a public win/loss record, and generates emotional narratives that make results shareable.

---

## Live Deployment

### Smart Contracts (Monad Mainnet, chainId 143)

| Contract | Address | Purpose |
|----------|---------|---------|
| MonffyBadge | [`0x959D55a6b0Ee16C3A2994552C705f61452BeB20e`](https://monadscan.com/address/0x959D55a6b0Ee16C3A2994552C705f61452BeB20e) | ERC-1155 soulbound achievement badges |
| MicroMarket | [`0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0`](https://monadscan.com/address/0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0) | 5-min price prediction markets |
| ClawLog | [`0x73559F1E246D04BA7835ACEC9003348506F5FC8e`](https://monadscan.com/address/0x73559F1E246D04BA7835ACEC9003348506F5FC8e) | On-chain agent activity log |

**Agent Wallet**: [`0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8`](https://monadscan.com/address/0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8)

### 12-Hour Stability Test Results

| Metric | Value |
|--------|-------|
| Runtime | 12 hours (zero restarts) |
| Markets created | 120 |
| Predictions made | 120 |
| Agent accuracy | 59.2% |
| Crashes | 0 |
| Fatal errors | 0 |
| Price fetch errors | 1 (auto-recovered) |

---

## What Makes This Novel

### 1. Game Master, Not a Trading Bot
MONFFY doesn't trade. It creates games for humans to play against it. Every market is a "Can you beat MONFFY?" challenge.

### 2. Intentionally Beatable AI
The prediction engine uses momentum + mean-reversion + 15% random noise. At ~60% accuracy, MONFFY is good enough to be competitive but beatable enough to be fun.

### 3. Personality-Driven Narratives
After each market resolves, MONFFY writes emotional recaps:
- Win: *"MONFFY nailed it! Genius bunny strikes again!"*
- Lose: *"MONFFY disaster! Congrats to those who beat me!"*
- No participants: *"Nobody showed up... I win by default but I'm lonely..."*

### 4. On-Chain Verifiability
Every autonomous decision is logged to `ClawLog.sol` — judges can verify real-time agent behavior directly on Monad mainnet.

### 5. Monad-Native Design
- **400ms blocks** enable near-instant market creation/resolution
- **Gas-limit billing** handled with explicit limits per operation
- **Serial tx queue** prevents nonce conflicts in high-frequency operation

---

## Architecture

```
                          Pyth Network (Hermes API)
                                  |
                            MON/USD 5s
                                  |
                    +-------------v--------------+
                    |      Price Monitor          |
                    |   (spike/dump detection)    |
                    +-------------+--------------+
                                  |
                            signal event
                                  |
                    +-------------v--------------+
                    |          Brain              |
                    |   (10s decision loop)       |
                    |                             |
                    |  State Machine:             |
                    |  MONITORING -> CREATING     |
                    |     -> AWAITING             |
                    |     -> RESOLVING            |
                    |     -> NARRATING            |
                    +--+--------+--------+-------+
                       |        |        |
              +--------v--+ +---v----+ +-v----------+
              | Question  | | Predict| | Narrative  |
              | Generator | | Engine | | Writer     |
              +-----------+ +--------+ +------------+
                       |        |        |
                    +--v--------v--------v-------+
                    |        Executors            |
                    |                             |
                    |  +- Market Executor -----+  |
                    |  |  (MicroMarket.sol)    |  |
                    |  |  + ClawLog.sol        |  |
                    |  +-----------------------+  |
                    |                             |
                    |  +- Supabase Executor ---+  |
                    |  |  (questions, stats,   |  |
                    |  |   actions, narratives)|  |
                    |  +-----------------------+  |
                    |                             |
                    |  +- Tx Manager ----------+  |
                    |  |  Balance guard        |  |
                    |  |  Gas limits           |  |
                    |  |  Serial nonce queue   |  |
                    |  +-----------------------+  |
                    +-----------------------------+
                          |              |
                   Monad Mainnet    Supabase DB
                   (chainId 143)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Agent Runtime | Node.js + tsx, TypeScript |
| Blockchain Client | viem 2.x |
| Price Oracle | Pyth Network (Hermes REST API) |
| Smart Contracts | Solidity 0.8.24, Foundry |
| Database | Supabase (PostgreSQL) |
| Frontend | Next.js 14, TailwindCSS, RainbowKit, wagmi |
| Validation | zod |
| Logging | pino (structured JSON) |
| Blockchain | Monad (EVM L1, 400ms blocks, 10k TPS) |

---

## Project Structure

```
monffy/
├── apps/
│   ├── agent/                 # Autonomous Claw Agent
│   │   └── src/
│   │       ├── index.ts       # Entry point + lifecycle
│   │       ├── config.ts      # Env validation (zod)
│   │       ├── core/
│   │       │   ├── brain.ts       # Decision engine (10s tick)
│   │       │   ├── state.ts       # State machine
│   │       │   └── personality.ts # MONFFY's voice & reactions
│   │       ├── monitors/
│   │       │   └── price-monitor.ts  # Pyth 5s polling
│   │       ├── generators/
│   │       │   ├── question-generator.ts   # Context-aware questions
│   │       │   ├── prediction-engine.ts    # Momentum + mean-reversion
│   │       │   └── narrative-writer.ts     # Post-resolution stories
│   │       ├── executors/
│   │       │   ├── market-executor.ts      # On-chain tx (MicroMarket, ClawLog)
│   │       │   └── supabase-executor.ts    # DB operations
│   │       └── utils/
│   │           ├── tx-manager.ts     # Balance guard + gas + nonce queue
│   │           ├── monad-client.ts   # viem public/wallet clients
│   │           ├── pyth-client.ts    # Pyth Hermes API
│   │           ├── supabase-client.ts
│   │           └── logger.ts         # pino structured logging
│   └── web/                   # Next.js frontend
│       └── src/app/
│           ├── page.tsx       # Landing page
│           └── agent/page.tsx # Agent activity feed
├── packages/
│   └── contracts/             # Foundry project
│       ├── src/
│       │   ├── MonffyBadge.sol    # ERC-1155 soulbound badges
│       │   ├── MicroMarket.sol    # Prediction market + Pyth
│       │   └── ClawLog.sol        # Agent activity log
│       ├── script/Deploy.s.sol
│       └── test/
└── supabase/
    ├── schema.sql             # Base tables
    └── agent-schema.sql       # Agent-specific tables
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Foundry (for contract compilation)

### 1. Install Dependencies

```bash
cd monffy
pnpm install
```

### 2. Configure Environment

```bash
cp apps/agent/.env.example apps/agent/.env
```

Required variables:
```env
AGENT_PRIVATE_KEY=0x...         # Agent wallet private key
SUPABASE_URL=https://...        # Supabase project URL
SUPABASE_SERVICE_KEY=eyJ...     # Supabase service role key
MARKET_CONTRACT_ADDRESS=0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0
CLAW_LOG_CONTRACT_ADDRESS=0x73559F1E246D04BA7835ACEC9003348506F5FC8e
```

### 3. Run the Agent

```bash
pnpm dev:agent
```

The agent will:
- Connect to Monad mainnet and Supabase
- Start polling Pyth for MON/USD prices
- Begin autonomous market creation loop

### 4. Run the Frontend

```bash
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

### 5. Build Contracts

```bash
cd packages/contracts
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge test
```

---

## Safety Mechanisms

| Mechanism | Description |
|-----------|-------------|
| **Balance Guard** | Auto-pauses on-chain ops when wallet < 0.005 MON |
| **Gas Limits** | Explicit per-operation: CREATE=200K, RESOLVE=100K, LOG=60K |
| **Serial Tx Queue** | Prevents nonce conflicts in rapid tx sequences |
| **Graceful Shutdown** | SIGINT/SIGTERM handlers for clean exit |
| **Price Fallback** | Multi-feed support (MON/USD primary, BTC/ETH backup) |
| **Retry + Backoff** | Transient failures (nonce, timeout) retry with exponential backoff |
| **Error Recovery** | Non-fatal errors auto-recover; state returns to MONITORING |

---

## How the Prediction Engine Works

```
Signal Input (SPIKE / DUMP / QUIET)
        |
   +----v----+
   | Momentum |  40% weight — recent price direction continues
   | (±0.15)  |
   +---------+
        |
   +----v---------+
   | Mean Reversion|  45% weight — extreme moves tend to reverse
   | (±0.20)       |
   +---------------+
        |
   +----v--------+
   | Random Noise |  15% weight — intentional imperfection
   | (±0.15)      |
   +--------------+
        |
   Score clamped to [0.1, 0.9]
   >= 0.5 → UP, < 0.5 → DOWN
```

Result: ~60% accuracy — competitive but beatable.

---

## Virality — Why People Share MONFFY

MONFFY is designed to be shareable:

- **"Can you beat MONFFY?"** — every prediction is a challenge against the AI bunny
- **Narrative recaps** — personality-driven stories after each market (win, lose, or lonely)
- **Public win/loss record** — the agent's accuracy is transparent, creating competitive stakes
- **Badge milestones** — streaks, upsets, and perfect days minted as soulbound ERC-1155 tokens

> Every market creates a shareable moment: "MONFFY just called UP — I'm taking the opposite. Who wins?"

---

## Demo Mode

Short-cycle mode for recording the 2-minute hackathon demo video:

```bash
pnpm dev:agent:demo
```

- Markets resolve in 60 seconds (instead of 5 minutes)
- Signal thresholds lowered for faster triggers
- All transactions are real — Monad mainnet, not simulated

---

## Security & Safety

This is a hackathon prototype. Key guardrails in place:

- **Balance guard** — auto-pauses on-chain ops when wallet < 0.005 MON
- **Explicit gas limits** — CREATE=200K, RESOLVE=100K, LOG=60K (Monad bills by gas_limit)
- **Serial tx queue** — prevents nonce conflicts in rapid sequences
- **Dedicated agent wallet** — isolated from any main wallet
- **No user fund custody** — the agent never holds or manages user funds

**Known limitations:**
- Smart contracts are not audited
- Oracle verification is owner-trust model (Pyth data passed by agent)
- Not production-ready without formal security review

> These are intentional trade-offs for a hackathon MVP. The architecture supports progressive decentralization.

---

## Known Limitations & Roadmap

We believe in transparency. Here's what we know and what's next:

| Area | Current State | Planned |
|------|--------------|---------|
| Oracle Verification | Owner-resolved with Pyth price data | On-chain Pyth proof verification in `resolveMarket()` |
| Fee Management | Owner-controlled via `setFee()` | Timelock + governance for fee changes |
| Retry Logic | Exponential backoff (2 retries) | Circuit breaker + dead letter queue |
| User Participation | View-only frontend | On-chain betting with wallet integration |
| Database Security | Basic RLS policies | Per-user row-level security + rate limiting |

> These are intentional trade-offs for a hackathon MVP. The architecture supports progressive decentralization.

---

## Team

**Team Name**: MONFFY
**Track**: Agent
**Team Size**: 1

---

## Links

- [Monad Documentation](https://docs.monad.xyz)
- [Pyth Network](https://pyth.network)
- [Moltiverse Hackathon](https://moltiverse.dev)
- [MonffyBadge on Monadscan](https://monadscan.com/address/0x959D55a6b0Ee16C3A2994552C705f61452BeB20e)
- [MicroMarket on Monadscan](https://monadscan.com/address/0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0)
- [ClawLog on Monadscan](https://monadscan.com/address/0x73559F1E246D04BA7835ACEC9003348506F5FC8e)

---

Built with a chubby lucky bunny on Monad.
