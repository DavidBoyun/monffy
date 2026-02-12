# MONFFY Frontend Redesign — Antigravity Prompt

> Hand this document directly to Antigravity. It contains everything needed.

---

## Project Overview

**MONFFY** is an autonomous AI prediction agent running on Monad blockchain (mainnet). It creates micro prediction markets, publishes its own predictions, resolves them with Pyth oracle data, and writes personality-driven narrative recaps — all 24/7 with zero human intervention.

We're submitting to the **Moltiverse Hackathon (Agent Track, $60K prize pool, deadline Feb 15 2026)**.

**Live site**: https://monffy.vercel.app
**Domain**: monffy.xyz
**Agent page**: https://monffy.vercel.app/agent

The current frontend works but looks generic and placeholder-quality. We need a **premium, distinctive, Monad-native** redesign that showcases the AI agent and our mascot character.

---

## What Needs Redesigning

### Pages (2 total)

| Page | Route | Purpose | Priority |
|------|-------|---------|----------|
| **Agent Dashboard** | `/agent` | Real-time agent activity, stats, predictions, narratives | **#1 — This is the demo page judges see** |
| **Landing / Home** | `/` | Hero + product intro + link to agent page | #2 |

### Key Components to Redesign

1. **Agent Stats Card** — Win/Loss record, accuracy %, uptime, total questions
2. **Active Predictions** — Live countdown, MONFFY's prediction (UP/DOWN), trigger type badge
3. **Narrative Feed** — Post-resolution stories with personality (win/lose reactions)
4. **Activity Feed** — Real-time log of agent actions (market created, prediction made, resolved, narrative posted)
5. **Header/Nav** — Logo + MONFFY character + LIVE indicator
6. **Hero Section** (landing page) — "Meet MONFFY, your AI Game Master on Monad"
7. **Wallet Connect** — RainbowKit integration (already works, just needs styling wrapper)

---

## Design Direction: Monad Style

Reference: https://monad.xyz

### Monad's Visual DNA (copy these patterns)

| Element | Monad's Approach |
|---------|-----------------|
| **Background** | Deep dark `#05050b` to `#0d0d19`, never pure black |
| **Primary Purple** | `#836EF9` (already in our codebase as `monad` color) |
| **Secondary Purple** | `#513f82`, `#4a3c7a` (deep muted tones) |
| **Accent Green** | `#3CBD2C` (for success states, UP predictions) |
| **Accent Blue** | `#146AEB` (for info states) |
| **Accent Red** | `#FF494A` (for DOWN predictions, losses) |
| **Light Surface** | `#f2ebf9` (purple-tinted off-white, for cards or contrast sections) |
| **Typography** | `roc-grotesk` or similar geometric sans-serif for headings. Clean, technical. |
| **Cards** | Subtle glassmorphism, thin borders (`border-white/5`), slight background blur |
| **Animations** | Smooth scroll-triggered, subtle glow pulses, number counters |
| **Overall Feel** | Premium, fast, technical but approachable. NOT generic crypto dark theme. |

### What makes Monad's design distinctive:
- **Metric-forward**: Large numbers, animated counters, stats prominently displayed
- **Luminous accents on dark**: Bright purple/green glow effects against near-black
- **Generous whitespace**: Not cramped, lots of breathing room
- **Geometric precision**: Clean grids, aligned everything
- **Subtle depth**: Layered backgrounds, blur effects, light gradients

---

## Character: MONFFY (몬피 / 몬플러피)

### Visual Description
MONFFY is a **chubby, round, fluffy white bunny** with:
- **Big floppy ears** (pink inner ear)
- **Round body** — plushie/stuffed-animal proportions
- **Small pink nose**, round expressive eyes
- **Soft white fur** texture (3D rendered, Pixar-quality feel)
- Various costumes/accessories depending on context (sunglasses, hoodies, etc.)

### Character images location
`최종/MONFFY_*.jpg` — 17 character concept images available.
Pick the best one for the hero and use consistently.

### Personality in UI
- **Competitive**: Tracks win/loss record, talks trash when winning
- **Cute but fierce**: Bunny that takes predictions seriously
- **Korean + English mix**: UI primarily Korean, some English terms
- **Emoji-heavy**: Uses emojis naturally in narratives

### How MONFFY should appear in the UI:
- **Header**: Small MONFFY avatar next to logo
- **Stats card**: MONFFY character image as decoration
- **Predictions**: MONFFY "speaking" its prediction in a speech bubble style
- **Narratives**: MONFFY avatar next to each narrative (like a chat message from MONFFY)
- **Empty states**: MONFFY sleeping (💤) or looking around
- **Hero**: Large MONFFY character as the visual anchor

---

## Tech Stack (DO NOT CHANGE)

| Tech | Version | Notes |
|------|---------|-------|
| Next.js | 14.2.5 | App Router (`src/app/`) |
| React | 18.3 | |
| TailwindCSS | 3.4 | Config at `tailwind.config.ts` |
| RainbowKit | 2.1.3 | Wallet connection (dark theme, purple accent) |
| wagmi | 2.12 | Blockchain hooks |
| @supabase/supabase-js | 2.45 | Realtime data |
| tailwindcss-animate | 1.0.7 | Animation utilities |
| lucide-react | 0.400 | Icon library |
| TypeScript | 5.5 | Strict |

---

## CRITICAL: What You CAN and CANNOT Touch

### CANNOT TOUCH (will break the project)

These files contain blockchain connections, wallet infrastructure, database clients, agent backend, smart contracts, and environment secrets. **Modifying any of these will break the live agent or the build.**

| File / Directory | Reason | What breaks if touched |
|------------------|--------|----------------------|
| `apps/agent/` (entire directory) | Autonomous AI agent backend | Agent stops working, hackathon fails |
| `packages/contracts/` (entire directory) | Deployed Solidity smart contracts | Contracts are already on mainnet, cannot redeploy |
| `supabase/` (entire directory) | Database schemas | Live data gets corrupted |
| `apps/web/src/app/providers.tsx` | RainbowKit + wagmi + React Query provider setup | Wallet connect breaks, app won't render |
| `apps/web/src/lib/wagmi.ts` | Monad chain definition + WalletConnect config | Chain connection breaks, wallet won't connect |
| `apps/web/src/lib/supabase.ts` | Supabase client initialization | Agent page won't load any data |
| `apps/web/next.config.mjs` | Webpack fallbacks for Node.js modules + MetaMask SDK alias | Build fails with crypto/fs errors |
| `apps/web/.env.local` | Environment variables (Supabase keys, RPC URL, chain ID) | Everything breaks |
| `apps/web/package.json` | Dependencies and scripts | Do not remove any existing deps |
| Root `package.json` | Monorepo workspace scripts | Workspace breaks |
| `pnpm-workspace.yaml` | Monorepo workspace config | Install breaks |
| `pnpm-lock.yaml` | Dependency lock | Reproducible builds break |
| `docs/` (entire directory) | Project documentation | Not needed for redesign |
| `README.md` | Hackathon submission readme | Already finalized |

**Also in agent/page.tsx — DO NOT change:**
- Supabase table names: `agent_stats`, `agent_actions`, `questions`
- Supabase query structure (`.from()`, `.select()`, `.eq()`, `.order()`, `.limit()`)
- Realtime subscription channel: `agent-actions-realtime`
- The `postgres_changes` event listener logic
- Interface field names (`total_questions`, `agent_prediction`, `tx_hash`, etc.)

### CAN TOUCH (safe to modify — this is your playground)

| File | What you can do | Notes |
|------|----------------|-------|
| `apps/web/src/app/page.tsx` | **Complete rewrite** | Landing page. Rewrite all JSX/styling. Keep `useAccount` hook and `ConnectButton` import. |
| `apps/web/src/app/agent/page.tsx` | **Rewrite all JSX/styling** | Keep the data fetching logic (lines 81-110), interfaces (lines 11-40), helper functions. Change ALL rendering/layout/styling. |
| `apps/web/src/app/layout.tsx` | **Change fonts, metadata, body classes** | Keep the `<Providers>{children}</Providers>` wrapper intact. Can change font, add metadata, change body className. |
| `apps/web/src/app/globals.css` | **Complete rewrite** | Keep `@tailwind base/components/utilities`. Rewrite everything else. Add new custom classes, animations, utilities. |
| `apps/web/src/components/DailyLuckCard.tsx` | **Complete rewrite** | Keep `useAccount` hook logic. Restyle everything. |
| `apps/web/src/components/QuestionCard.tsx` | **Complete rewrite** | Keep the `Question` interface shape. Restyle everything. |
| `apps/web/src/components/StreakBadge.tsx` | **Complete rewrite** | Simple component, full freedom. |
| `apps/web/src/components/index.ts` | **Add new exports** | Can add new components. Don't remove existing exports. |
| `apps/web/tailwind.config.ts` | **Extend theme** | Add new colors, fonts, animations, plugins. Don't remove existing `monffy` and `monad` colors. |
| `apps/web/public/` | **Add images/assets** | Create `public/monffy/` directory for character images. Add favicons, OG images, etc. |
| New files in `src/components/` | **Create freely** | Add new components (e.g., `AgentAvatar.tsx`, `StatsCounter.tsx`, `NarrativeCard.tsx`, etc.) |

### GRAY ZONE (be careful)

| File | What's safe | What's NOT safe |
|------|------------|-----------------|
| `agent/page.tsx` data logic | DO NOT change lines 81-110 (fetchData), lines 119-133 (realtime sub), interfaces (lines 11-40) | CAN change: all JSX (lines 136-331), helper functions like `formatUptime`, `formatTimeAgo`, `ActionIcon` |
| `page.tsx` (landing) | CAN change: all JSX, remove placeholder questions, `NavItem` component | KEEP: `ConnectButton` import from `@rainbow-me/rainbowkit`, `useAccount` from `wagmi`, `Link` from `next/link` |
| `layout.tsx` | CAN change: font, metadata, body classes | KEEP: `<Providers>{children}</Providers>` structure, `import { Providers }` |
| `package.json` (web) | CAN add new deps with `pnpm add` | DO NOT remove existing deps, DO NOT change `scripts` |

### Visual Map

```
monffy/
├── apps/
│   ├── agent/          ❌ ENTIRE DIRECTORY — DO NOT TOUCH
│   └── web/
│       ├── .env.local           ❌ DO NOT TOUCH
│       ├── next.config.mjs      ❌ DO NOT TOUCH
│       ├── package.json         ⚠️  Can ADD deps only
│       ├── tailwind.config.ts   ✅ EXTEND freely
│       ├── public/              ✅ ADD images freely
│       └── src/
│           ├── app/
│           │   ├── globals.css      ✅ REWRITE freely
│           │   ├── layout.tsx       ⚠️  Keep <Providers> wrapper
│           │   ├── providers.tsx    ❌ DO NOT TOUCH
│           │   ├── page.tsx         ✅ REWRITE freely
│           │   └── agent/
│           │       └── page.tsx     ⚠️  Keep data fetching, rewrite all JSX
│           ├── components/
│           │   ├── DailyLuckCard.tsx  ✅ REWRITE freely
│           │   ├── QuestionCard.tsx   ✅ REWRITE freely
│           │   ├── StreakBadge.tsx     ✅ REWRITE freely
│           │   ├── index.ts           ✅ ADD new exports
│           │   └── (new files)        ✅ CREATE freely
│           └── lib/
│               ├── wagmi.ts         ❌ DO NOT TOUCH
│               └── supabase.ts      ❌ DO NOT TOUCH
├── packages/
│   └── contracts/      ❌ ENTIRE DIRECTORY — DO NOT TOUCH
├── supabase/           ❌ ENTIRE DIRECTORY — DO NOT TOUCH
├── docs/               ❌ DO NOT TOUCH
├── package.json        ❌ DO NOT TOUCH
├── pnpm-workspace.yaml ❌ DO NOT TOUCH
└── pnpm-lock.yaml      ❌ (auto-updates with pnpm add)
```

**Legend**: ✅ = Free to modify | ⚠️ = Partial — read notes | ❌ = Do not touch

### agent/page.tsx — Line-by-Line Guide

This is the most important file. Here's exactly what's safe and what's not:

```
Lines 1-9      — Imports                    ⚠️  Keep all imports. Can ADD new ones.
Lines 11-40    — Interfaces (AgentStats,    ❌  DO NOT CHANGE field names or types.
                 AgentActionRow,                 These match Supabase columns exactly.
                 QuestionRow)
Lines 42-57    — Helper functions            ✅  Can rewrite formatUptime, formatTimeAgo.
                 (formatUptime,                  Can add new helpers.
                  formatTimeAgo)
Lines 59-72    — ActionIcon component        ✅  Can completely redesign icon rendering.
Lines 74-79    — State declarations          ❌  DO NOT CHANGE state variable names.
                                                 UI depends on: stats, actions,
                                                 activeQuestions, recentNarratives, loading.
Lines 81-110   — fetchData function          ❌  DO NOT CHANGE. This fetches live data from
                                                 Supabase. Table names, column names, query
                                                 structure — all must stay exactly as is.
Lines 112-116  — useEffect for fetchData     ❌  DO NOT CHANGE. 10-second polling interval.
Lines 118-134  — useEffect for realtime      ❌  DO NOT CHANGE. Supabase realtime subscription.
Lines 136-145  — Loading state JSX           ✅  Redesign freely. Keep the loading concept.
Lines 147-148  — wins/losses calc            ❌  DO NOT CHANGE. Data derivation.
Lines 150-331  — ALL RENDER JSX              ✅  COMPLETE FREEDOM. Rewrite everything.
                                                 Use the state variables (stats, actions,
                                                 activeQuestions, recentNarratives) however
                                                 you want. Break into subcomponents. Go wild.
```

**In short**: Keep lines 1-9 imports, 11-40 interfaces, 74-79 state, 81-134 data logic. Rewrite EVERYTHING else.

---

## Current Brand Tokens (in tailwind.config.ts)

```typescript
colors: {
  monffy: {
    purple: "#7C3AED",
    pink: "#EC4899",
    gold: "#F59E0B",
    mint: "#10B981",
  },
  monad: {
    DEFAULT: "#836EF9",  // Primary Monad purple
    dark: "#5B4DC7",
    light: "#A78BFA",
  },
}
```

**Feel free to extend** the color palette to match Monad's official design more closely. Add:
- Deeper background colors (`#05050b`, `#0d0d19`)
- Subtle surface colors for cards
- Glow/shadow utilities

---

## Agent Page Data Shape (for UI design)

The `/agent` page fetches these from Supabase in real-time:

### Agent Stats
```typescript
{
  total_questions: number;      // e.g., 120
  total_predictions: number;    // e.g., 120
  correct_predictions: number;  // e.g., 71
  accuracy: number;             // e.g., 59.2
  uptime_seconds: number;       // e.g., 43200
  last_action_at: string;       // ISO timestamp
}
```

### Active Questions (live predictions)
```typescript
{
  id: string;
  question_text: string;        // "MON이 2.3% 올랐어요! 다음 5분은?"
  expires_at: string;           // ISO timestamp (countdown target)
  agent_prediction: "UP" | "DOWN";
  trigger_type: "SPIKE" | "DUMP" | "QUIET";
  is_active: boolean;
}
```

### Narratives (resolved markets)
```typescript
{
  id: string;
  question_text: string;
  agent_prediction: "UP" | "DOWN";
  agent_correct: boolean;
  agent_narrative: string;      // Multi-line Korean text with emojis
  resolved_at: string;
}
```

### Activity Feed
```typescript
{
  id: string;
  action_type: "MARKET_CREATED" | "PREDICTION_MADE" | "MARKET_RESOLVED" | "NARRATIVE_POSTED";
  data: string;                 // Description text
  tx_hash: string | null;       // Links to https://monadscan.com/tx/{hash}
  created_at: string;
}
```

---

## Specific Design Requests

### 1. Agent Page — Stats Section
- **Large animated number counters** (like Monad homepage metrics)
- Win/Loss displayed as a visual bar or ring chart
- Accuracy as a big percentage with glow effect
- Uptime as "12h 30m" with a pulsing green dot
- MONFFY character positioned near the stats (decorative, not blocking data)

### 2. Agent Page — Active Predictions
- Card with **countdown timer** (mm:ss remaining)
- MONFFY's prediction shown in a **speech bubble** style
- Trigger type as a colored pill/badge (SPIKE=orange, DUMP=red, QUIET=blue)
- Subtle pulsing border animation while active

### 3. Agent Page — Narrative Feed
- Chat-style layout: MONFFY avatar on left, narrative text on right
- Win narratives: Green accent, subtle confetti or sparkle
- Loss narratives: Red accent, but still cute (MONFFY is embarrassed, not sad)
- Each narrative card shows the question, prediction, outcome, and record

### 4. Agent Page — Activity Feed
- Compact timeline style (think GitHub activity)
- Each action type has its own icon and color
- TX hash links to Monadscan (external link icon)
- New items slide in with animation (already has Supabase realtime subscription)

### 5. Landing Page — Hero
- **Full-width hero** with MONFFY character prominently featured
- Headline: "Meet MONFFY" or similar
- Subtitle: Brief explanation of autonomous AI prediction agent
- CTA button: "Watch MONFFY Live" → links to /agent
- Stats preview (markets created, accuracy, uptime) as social proof
- Monad + Pyth logos at bottom as "Powered by" section

### 6. Overall Polish
- **Smooth page transitions** between / and /agent
- **Loading state**: MONFFY bouncing animation (already exists, make it nicer)
- **Empty states**: When agent is offline, show a sleeping MONFFY with "Agent is resting..."
- **Mobile-first**: max-w-md container is fine, but make sure it looks good on all phones
- **Dark mode only**: No light mode needed

---

## Character Asset Integration

MONFFY character images are in `최종/MONFFY_*.jpg` (17 files).

**For the web app, you'll need to:**
1. Pick the best 2-3 character images
2. Remove backgrounds (they have transparent/checkered backgrounds already)
3. Convert to WebP for performance
4. Place in `apps/web/public/monffy/` directory
5. Reference as `/monffy/hero.webp`, `/monffy/avatar.webp`, etc.

**Suggested usage:**
- `hero.webp` — Large character for landing page hero (recommend image #5: sunglasses + hoodie, cool vibe)
- `avatar.webp` — Small round avatar for header, narratives, predictions (face close-up)
- `sleeping.webp` — For empty/offline states (if available, or create with CSS)

---

## Environment & Run Commands

```bash
cd "C:\Users\sdyes\OneDrive\바탕 화면\모나드\monffy"
pnpm install
pnpm dev          # → http://localhost:3000
```

Environment variables are already configured in `apps/web/.env.local`.
The Supabase database has live data from the agent's 12-hour stability test.

---

## Domain Setup

**Domain**: monffy.xyz (owned, needs to be connected to Vercel)
**Current Vercel URL**: https://monffy.vercel.app
**Vercel Project**: tergs-projects/monffy

After redesign, we'll point monffy.xyz → Vercel.

---

## Deadline

**Moltiverse Hackathon deadline: February 15, 2026 23:59 ET**

The agent page is what judges will evaluate. It needs to look **professional, distinctive, and alive** — not like a generic template. The MONFFY character is our differentiator. Make it memorable.

---

## After Completion

1. Verify both pages render correctly at `http://localhost:3000` and `/agent`
2. Test mobile responsiveness (375px, 390px, 414px widths)
3. Ensure RainbowKit wallet connect still works
4. Verify Supabase data loads on /agent page (stats, actions, narratives)
5. Run `pnpm build` to confirm no build errors
6. Deploy: `cd apps/web && npx vercel --yes --prod`

---

## Summary

| Priority | Task | Details |
|----------|------|---------|
| **P0** | `/agent` page redesign | Stats counters, prediction cards, narrative feed, activity timeline |
| **P1** | `/` landing page | Hero with MONFFY character, "Watch Live" CTA, stats preview |
| **P2** | Character integration | Pick best images, optimize, place in public/ |
| **P3** | Polish | Animations, transitions, loading states, empty states |
| **P4** | Tailwind theme | Extend with Monad colors, add glow utilities |
