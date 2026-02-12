# MONFFY 전체 코드베이스 스냅샷

> **생성일**: 2026-02-07
> **Phase**: 0 완료 (Phase 1 진입 준비)
> **총 소스 파일**: 27개
> **총 코드 라인**: ~1,750줄 (설정 포함)

---

## 목차

1. [프로젝트 구조](#1-프로젝트-구조)
2. [루트 설정 파일](#2-루트-설정-파일)
3. [프론트엔드 (apps/web/)](#3-프론트엔드-appsweb)
4. [스마트 컨트랙트 (packages/contracts/)](#4-스마트-컨트랙트-packagescontracts)
5. [데이터베이스 (supabase/)](#5-데이터베이스-supabase)
6. [이전 세션 작업 이력](#6-이전-세션-작업-이력)

---

## 1. 프로젝트 구조

```
monffy/
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── README.md
├── CLAUDE.md
│
├── docs/
│   └── FULL_CODEBASE_SNAPSHOT.md    ← 이 파일
│
├── apps/
│   └── web/
│       ├── .env.example
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       ├── next.config.mjs
│       ├── next-env.d.ts
│       │
│       └── src/
│           ├── app/
│           │   ├── globals.css
│           │   ├── layout.tsx
│           │   ├── page.tsx
│           │   └── providers.tsx
│           │
│           ├── components/
│           │   ├── index.ts
│           │   ├── DailyLuckCard.tsx
│           │   ├── QuestionCard.tsx
│           │   └── StreakBadge.tsx
│           │
│           └── lib/
│               ├── supabase.ts
│               └── wagmi.ts
│
├── packages/
│   └── contracts/
│       ├── .gitignore
│       ├── package.json
│       ├── foundry.toml
│       │
│       ├── src/
│       │   ├── MonffyBadge.sol
│       │   └── MicroMarket.sol
│       │
│       ├── script/
│       │   └── Deploy.s.sol
│       │
│       └── test/
│           └── MonffyBadge.t.sol
│
└── supabase/
    └── schema.sql
```

---

## 2. 루트 설정 파일

### 2-1. `package.json`

```json
{
  "name": "monffy",
  "version": "0.1.0",
  "private": true,
  "description": "MONFFY - Daily Luck + Micro Predictions + NFT on Monad",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "lint": "pnpm --filter web lint",
    "contracts:build": "pnpm --filter contracts build",
    "contracts:test": "pnpm --filter contracts test"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 2-2. `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2-3. `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
out/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Foundry
cache/
broadcast/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/

# Misc
*.tsbuildinfo
```

### 2-4. `README.md`

```markdown
# MONFFY - Daily Luck on Monad

> 오늘의 행운 퀴즈 & 마이크로 예측 on Monad

## Overview

MONFFY는 Monad 블록체인 기반의 하이브리드 일일 퀴즈 + 예측 플랫폼입니다.

### 3-Lane 구조
- **Lane 1: Daily Luck** - 무료 문화 퀴즈 (한국 문화, K-POP, 역사 등)
- **Lane 2: Micro Predictions** - 5분 단위 MON 가격 예측 (킬러 피처)
- **Lane 3: Sponsored Questions** - B2B 스폰서 퀴즈 (수익원)

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, RainbowKit, wagmi
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Blockchain**: Monad (EVM L1, 400ms blocks, 10k TPS)
- **Contracts**: Solidity 0.8.24 + Foundry
- **Oracle**: Pyth Network

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Foundry (for contracts)

### Installation

\`\`\`bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
\`\`\`

### Smart Contracts

\`\`\`bash
cd packages/contracts
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge test
\`\`\`

## Roadmap

- [x] Phase 0: Foundation (monorepo, contracts, schema)
- [ ] Phase 1: MVP (3 screens, badge minting)
- [ ] Phase 2: Predictions (Pyth integration)
- [ ] Phase 3: Sponsors (B2B dashboard)
- [ ] Phase 4: NFT (5k Genesis drop)
- [ ] Phase 5: Launch (Momentum Wave 3)
```

---

## 3. 프론트엔드 (apps/web/)

### 3-1. `apps/web/package.json`

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.45.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.400.0",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "viem": "^2.17.0",
    "wagmi": "^2.12.0",
    "@rainbow-me/rainbowkit": "^2.1.3"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.2"
  }
}
```

### 3-2. `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# Contracts (Monad Mainnet)
NEXT_PUBLIC_BADGE_CONTRACT=0x...
NEXT_PUBLIC_MARKET_CONTRACT=0x...
NEXT_PUBLIC_SPONSOR_REGISTRY=0x...

# Chain
NEXT_PUBLIC_CHAIN_ID=143
NEXT_PUBLIC_RPC_URL=https://rpc.monad.xyz

# Admin (server-side only)
MINTER_PRIVATE_KEY=0x...
ADMIN_KEY=your-admin-key
```

### 3-3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3-4. `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MONFFY Brand Colors
        monffy: {
          purple: "#7C3AED",
          pink: "#EC4899",
          gold: "#F59E0B",
          mint: "#10B981",
        },
        // Monad Purple
        monad: {
          DEFAULT: "#836EF9",
          dark: "#5B4DC7",
          light: "#A78BFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.8)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

### 3-5. `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

### 3-6. `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Handle react-native modules for MetaMask SDK
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
};

export default nextConfig;
```

### 3-7. `next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

---

### 3-8. `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(131, 110, 249, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(131, 110, 249, 0.7);
}

/* Monad glow effect */
.monad-glow {
  box-shadow: 0 0 20px rgba(131, 110, 249, 0.4),
    0 0 40px rgba(131, 110, 249, 0.2);
}

/* Card hover effect */
.card-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(131, 110, 249, 0.3);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #836ef9 0%, #ec4899 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 3-9. `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MONFFY - Daily Luck on Monad",
  description: "오늘의 행운 퀴즈 & 마이크로 예측 on Monad",
  keywords: ["Monad", "Prediction", "NFT", "Daily Luck", "Blockchain"],
  openGraph: {
    title: "MONFFY - Daily Luck on Monad",
    description: "오늘의 행운 퀴즈 & 마이크로 예측 on Monad",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${inter.variable} font-sans bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 min-h-screen text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3-10. `src/app/providers.tsx`

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { useState, type ReactNode } from "react";

import "@rainbow-me/rainbowkit/styles.css";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#836EF9", // Monad purple
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 3-11. `src/app/page.tsx`

```typescript
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { DailyLuckCard } from "@/components/DailyLuckCard";
import { QuestionCard } from "@/components/QuestionCard";
import { StreakBadge } from "@/components/StreakBadge";

// Placeholder questions (will come from Supabase)
const todayQuestions = [
  {
    id: "1",
    lane: "luck" as const,
    category: "한국 문화",
    question: "한국의 전통 명절 중 음력 1월 1일을 무엇이라 부르나요?",
    options: ["추석", "설날", "한식", "단오"],
    sponsor: null,
  },
  {
    id: "2",
    lane: "prediction" as const,
    category: "크립토",
    question: "5분 뒤 MON 가격이 지금보다?",
    options: ["오른다", "내린다"],
    sponsor: null,
  },
  {
    id: "3",
    lane: "sponsor" as const,
    category: "스폰서 퀴즈",
    question: "Monad의 초당 트랜잭션 처리량(TPS)은?",
    options: ["1,000", "5,000", "10,000", "50,000"],
    sponsor: {
      name: "Monad Foundation",
      logo: "/sponsors/monad.png",
    },
  },
];

export default function HomePage() {
  const { isConnected, address } = useAccount();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐰</span>
            <h1 className="text-xl font-bold gradient-text">MONFFY</h1>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && <StreakBadge streak={3} />}
            <ConnectButton
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Daily Luck Card */}
        <DailyLuckCard />

        {/* Today's Questions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📝</span>
            오늘의 질문
          </h2>
          <div className="space-y-4">
            {todayQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>

        {/* Not Connected State */}
        {!isConnected && (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              지갑을 연결하고 오늘의 행운을 확인하세요!
            </p>
            <div className="animate-bounce-slow">
              <span className="text-4xl">🐰</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-gray-900/90 border-t border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-around">
          <NavItem icon="🏠" label="홈" active />
          <NavItem icon="📊" label="순위" />
          <NavItem icon="🏆" label="뱃지" />
          <NavItem icon="👤" label="프로필" />
        </div>
      </nav>

      {/* Bottom padding for nav */}
      <div className="h-20" />
    </main>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
        active
          ? "text-monad bg-monad/10"
          : "text-gray-400 hover:text-gray-200"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
```

---

### 3-12. `src/lib/wagmi.ts`

```typescript
import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
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
      name: "Monad Explorer",
      url: "https://explorer.monad.xyz",
    },
  },
});

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "development-placeholder";

export const config = getDefaultConfig({
  appName: "MONFFY",
  projectId,
  chains: [monad],
  transports: {
    [monad.id]: http(),
  },
  ssr: true,
});
```

### 3-13. `src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (generated from Supabase schema)
export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          lane: "luck" | "prediction" | "sponsor";
          category: string;
          question_text: string;
          options: string[];
          correct_answer: number | null;
          sponsor_id: string | null;
          created_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["questions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
      };
      responses: {
        Row: {
          id: string;
          question_id: string;
          wallet_address: string;
          selected_option: number;
          is_correct: boolean | null;
          points_earned: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["responses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["responses"]["Insert"]>;
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          tier: "basic" | "premium" | "exclusive";
          monthly_fee: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sponsors"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sponsors"]["Insert"]>;
      };
      daily_streaks: {
        Row: {
          wallet_address: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string;
          total_points: number;
        };
        Insert: Database["public"]["Tables"]["daily_streaks"]["Row"];
        Update: Partial<Database["public"]["Tables"]["daily_streaks"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          wallet_address: string;
          badge_type: string;
          token_id: number;
          minted_at: string;
          tx_hash: string;
        };
        Insert: Omit<Database["public"]["Tables"]["badges"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
    };
  };
}
```

---

### 3-14. `src/components/index.ts`

```typescript
export { DailyLuckCard } from "./DailyLuckCard";
export { QuestionCard } from "./QuestionCard";
export { StreakBadge } from "./StreakBadge";
```

### 3-15. `src/components/DailyLuckCard.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const LUCK_MESSAGES = [
  { emoji: "🌟", title: "대박 운세!", desc: "오늘은 모든 일이 잘 풀릴 거예요" },
  { emoji: "✨", title: "행운 가득!", desc: "좋은 소식이 찾아올 거예요" },
  { emoji: "🍀", title: "네잎클로버!", desc: "예상치 못한 행운이 기다려요" },
  { emoji: "🎯", title: "적중 운세!", desc: "오늘의 예측이 정확할 거예요" },
  { emoji: "💎", title: "보석 운세!", desc: "소중한 기회가 찾아올 거예요" },
];

export function DailyLuckCard() {
  const { isConnected } = useAccount();
  const [revealed, setRevealed] = useState(false);
  const [luck, setLuck] = useState<(typeof LUCK_MESSAGES)[0] | null>(null);

  const handleReveal = () => {
    if (!isConnected) return;

    // Random luck selection (will be deterministic based on wallet + date later)
    const randomLuck =
      LUCK_MESSAGES[Math.floor(Math.random() * LUCK_MESSAGES.length)];
    setLuck(randomLuck);
    setRevealed(true);
  };

  // Reset at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeout = setTimeout(() => {
      setRevealed(false);
      setLuck(null);
    }, tomorrow.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-500/30 p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>🐰</span>
            오늘의 행운
          </h2>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!isConnected}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              isConnected
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 monad-glow cursor-pointer"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isConnected ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">🎲</span>
                행운 뽑기
              </span>
            ) : (
              "지갑 연결 필요"
            )}
          </button>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
            <span className="text-5xl mb-3 block">{luck?.emoji}</span>
            <h3 className="text-xl font-bold gradient-text mb-2">
              {luck?.title}
            </h3>
            <p className="text-gray-300">{luck?.desc}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-400">
              <span>+10 포인트 획득!</span>
              <span className="animate-ping">✨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3-16. `src/components/QuestionCard.tsx`

```typescript
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

interface Question {
  id: string;
  lane: "luck" | "prediction" | "sponsor";
  category: string;
  question: string;
  options: string[];
  sponsor: { name: string; logo: string } | null;
}

interface QuestionCardProps {
  question: Question;
}

const LANE_STYLES = {
  luck: {
    bg: "from-blue-900/40 to-cyan-900/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    icon: "🍀",
  },
  prediction: {
    bg: "from-orange-900/40 to-yellow-900/20",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300",
    icon: "📈",
  },
  sponsor: {
    bg: "from-purple-900/40 to-pink-900/20",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300",
    icon: "🎁",
  },
};

export function QuestionCard({ question }: QuestionCardProps) {
  const { isConnected } = useAccount();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const style = LANE_STYLES[question.lane];

  const handleSubmit = (optionIndex: number) => {
    if (!isConnected || submitted) return;
    setSelectedOption(optionIndex);
    setSubmitted(true);
    // TODO: Submit to Supabase and trigger badge check
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${style.bg} border ${style.border} p-4 card-hover`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>{style.icon}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
            {question.category}
          </span>
        </div>
        {question.sponsor && (
          <span className="text-xs text-gray-400">
            by {question.sponsor.name}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="font-medium mb-4">{question.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSubmit(index)}
            disabled={!isConnected || submitted}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              submitted && selectedOption === index
                ? "bg-monad text-white ring-2 ring-monad ring-offset-2 ring-offset-gray-900"
                : submitted
                ? "bg-gray-800/50 text-gray-500"
                : isConnected
                ? "bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-xs">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Submitted state */}
      {submitted && (
        <div className="mt-4 text-center text-sm text-green-400 animate-in fade-in">
          답변 완료! +5 포인트
        </div>
      )}

      {/* Prediction countdown (only for prediction lane) */}
      {question.lane === "prediction" && !submitted && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-orange-400">
          <span className="animate-pulse">⏱️</span>
          5분 후 결과 확인
        </div>
      )}
    </div>
  );
}
```

### 3-17. `src/components/StreakBadge.tsx`

```typescript
"use client";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const getStreakEmoji = (s: number) => {
    if (s >= 30) return "🔥";
    if (s >= 14) return "⚡";
    if (s >= 7) return "✨";
    if (s >= 3) return "🌟";
    return "💫";
  };

  const getStreakColor = (s: number) => {
    if (s >= 30) return "from-red-500 to-orange-500";
    if (s >= 14) return "from-yellow-500 to-orange-500";
    if (s >= 7) return "from-purple-500 to-pink-500";
    if (s >= 3) return "from-blue-500 to-purple-500";
    return "from-gray-500 to-gray-400";
  };

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getStreakColor(
        streak
      )} text-white text-xs font-medium`}
    >
      <span>{getStreakEmoji(streak)}</span>
      <span>{streak}일</span>
    </div>
  );
}
```

---

## 4. 스마트 컨트랙트 (packages/contracts/)

### 4-1. `packages/contracts/package.json`

```json
{
  "name": "@monffy/contracts",
  "version": "0.1.0",
  "description": "MONFFY Smart Contracts on Monad",
  "scripts": {
    "build": "forge build",
    "test": "forge test",
    "test:gas": "forge test --gas-report",
    "deploy:testnet": "forge script script/Deploy.s.sol --rpc-url $MONAD_TESTNET_RPC --broadcast",
    "deploy:mainnet": "forge script script/Deploy.s.sol --rpc-url $MONAD_MAINNET_RPC --broadcast --verify"
  },
  "keywords": ["monad", "nft", "prediction-market", "solidity"]
}
```

### 4-2. `foundry.toml`

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.24"
optimizer = true
optimizer_runs = 200
via_ir = true

[profile.default.fuzz]
runs = 256
max_test_rejects = 65536

[rpc_endpoints]
monad_mainnet = "${MONAD_MAINNET_RPC}"
monad_testnet = "${MONAD_TESTNET_RPC}"

[etherscan]
monad = { key = "${MONAD_EXPLORER_KEY}", url = "https://explorer.monad.xyz/api" }
```

### 4-3. `packages/contracts/.gitignore`

```gitignore
# Compiler files
cache/
out/

# Broadcast
broadcast/

# Environment
.env

# Ignores development broadcast logs
!/broadcast
/broadcast/*/31337/
/broadcast/**/dry-run/
```

### 4-4. `src/MonffyBadge.sol` (ERC-1155 소울바운드 뱃지)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MonffyBadge
 * @notice ERC-1155 badge collection for MONFFY achievements
 * @dev Soulbound (non-transferable) badges for streaks, predictions, and milestones
 */
contract MonffyBadge is ERC1155, Ownable {
    using Strings for uint256;

    // Badge type IDs
    uint256 public constant STREAK_3 = 1;
    uint256 public constant STREAK_7 = 2;
    uint256 public constant STREAK_14 = 3;
    uint256 public constant STREAK_30 = 4;
    uint256 public constant FIRST_PREDICTION = 10;
    uint256 public constant PREDICTION_MASTER = 11;
    uint256 public constant EARLY_ADOPTER = 100;

    // Authorized minters (backend service)
    mapping(address => bool) public minters;

    // Track minted badges per user (for soulbound)
    mapping(address => mapping(uint256 => bool)) public hasBadge;

    // Badge metadata
    mapping(uint256 => string) public badgeNames;

    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event BadgeMinted(address indexed to, uint256 indexed badgeId, string badgeName);

    constructor(string memory baseUri) ERC1155(baseUri) Ownable(msg.sender) {
        // Initialize badge names
        badgeNames[STREAK_3] = "3-Day Streak";
        badgeNames[STREAK_7] = "Weekly Warrior";
        badgeNames[STREAK_14] = "Fortnight Fighter";
        badgeNames[STREAK_30] = "Monthly Master";
        badgeNames[FIRST_PREDICTION] = "First Prediction";
        badgeNames[PREDICTION_MASTER] = "Prediction Master";
        badgeNames[EARLY_ADOPTER] = "Early Adopter";
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }

    /**
     * @notice Add a new minter address
     * @param minter Address to grant minting rights
     */
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @notice Remove a minter address
     * @param minter Address to revoke minting rights
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @notice Mint a badge to a user (soulbound - only once per badge type)
     * @param to Recipient address
     * @param badgeId Badge type ID
     */
    function mint(address to, uint256 badgeId) external onlyMinter {
        require(!hasBadge[to][badgeId], "Badge already owned");
        require(bytes(badgeNames[badgeId]).length > 0, "Invalid badge type");

        hasBadge[to][badgeId] = true;
        _mint(to, badgeId, 1, "");

        emit BadgeMinted(to, badgeId, badgeNames[badgeId]);
    }

    /**
     * @notice Batch mint multiple badges
     * @param to Recipient address
     * @param badgeIds Array of badge type IDs
     */
    function mintBatch(address to, uint256[] calldata badgeIds) external onlyMinter {
        uint256[] memory amounts = new uint256[](badgeIds.length);

        for (uint256 i = 0; i < badgeIds.length; i++) {
            require(!hasBadge[to][badgeIds[i]], "Badge already owned");
            require(bytes(badgeNames[badgeIds[i]]).length > 0, "Invalid badge type");
            hasBadge[to][badgeIds[i]] = true;
            amounts[i] = 1;
        }

        _mintBatch(to, badgeIds, amounts, "");
    }

    /**
     * @notice Update base URI for metadata
     * @param newUri New base URI
     */
    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
    }

    /**
     * @notice Get URI for a specific badge
     * @param badgeId Badge type ID
     */
    function uri(uint256 badgeId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(badgeId), badgeId.toString(), ".json"));
    }

    // ========== SOULBOUND OVERRIDES ==========
    // Disable transfers to make badges soulbound

    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override {
        revert("Soulbound: transfers disabled");
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert("Soulbound: transfers disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: approvals disabled");
    }
}
```

### 4-5. `src/MicroMarket.sol` (5분 가격 예측 마켓)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MicroMarket
 * @notice Micro prediction market for short-term price predictions
 * @dev Uses Pyth oracle for price resolution
 */
contract MicroMarket is Ownable, ReentrancyGuard {
    // Pyth oracle interface (simplified)
    address public pythOracle;

    // Market struct
    struct Market {
        bytes32 priceId;        // Pyth price feed ID
        int64 strikePrice;      // Price at market creation (scaled by 10^8)
        uint64 createdAt;
        uint64 expiresAt;
        uint64 resolvedAt;
        bool resolved;
        bool outcome;           // true = price went up
        uint256 upPool;         // Total MON bet on UP
        uint256 downPool;       // Total MON bet on DOWN
    }

    // User position
    struct Position {
        uint256 upAmount;
        uint256 downAmount;
        bool claimed;
    }

    // State
    uint256 public marketCount;
    uint256 public protocolFee = 100; // 1% = 100 basis points
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;

    // Events
    event MarketCreated(uint256 indexed marketId, bytes32 priceId, int64 strikePrice, uint64 expiresAt);
    event PositionOpened(uint256 indexed marketId, address indexed user, bool isUp, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome, int64 finalPrice);
    event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);

    constructor(address _pythOracle) Ownable(msg.sender) {
        pythOracle = _pythOracle;
    }

    /**
     * @notice Create a new micro prediction market
     * @param priceId Pyth price feed ID (e.g., MON/USD)
     * @param strikePrice Current price at market creation
     * @param duration Market duration in seconds (e.g., 300 for 5min)
     */
    function createMarket(
        bytes32 priceId,
        int64 strikePrice,
        uint64 duration
    ) external onlyOwner returns (uint256 marketId) {
        marketId = marketCount++;

        markets[marketId] = Market({
            priceId: priceId,
            strikePrice: strikePrice,
            createdAt: uint64(block.timestamp),
            expiresAt: uint64(block.timestamp) + duration,
            resolvedAt: 0,
            resolved: false,
            outcome: false,
            upPool: 0,
            downPool: 0
        });

        emit MarketCreated(marketId, priceId, strikePrice, uint64(block.timestamp) + duration);
    }

    /**
     * @notice Place a prediction on a market
     * @param marketId Market ID
     * @param isUp true for UP prediction, false for DOWN
     */
    function predict(uint256 marketId, bool isUp) external payable nonReentrant {
        Market storage market = markets[marketId];
        require(block.timestamp < market.expiresAt, "Market expired");
        require(!market.resolved, "Market resolved");
        require(msg.value > 0, "Must send MON");

        Position storage pos = positions[marketId][msg.sender];

        if (isUp) {
            pos.upAmount += msg.value;
            market.upPool += msg.value;
        } else {
            pos.downAmount += msg.value;
            market.downPool += msg.value;
        }

        emit PositionOpened(marketId, msg.sender, isUp, msg.value);
    }

    /**
     * @notice Resolve a market with Pyth oracle price
     * @param marketId Market ID
     * @param finalPrice Final price from Pyth oracle
     */
    function resolveMarket(uint256 marketId, int64 finalPrice) external onlyOwner {
        Market storage market = markets[marketId];
        require(block.timestamp >= market.expiresAt, "Market not expired");
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.resolvedAt = uint64(block.timestamp);
        market.outcome = finalPrice > market.strikePrice;

        emit MarketResolved(marketId, market.outcome, finalPrice);
    }

    /**
     * @notice Claim winnings from a resolved market
     * @param marketId Market ID
     */
    function claim(uint256 marketId) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.resolved, "Not resolved");

        Position storage pos = positions[marketId][msg.sender];
        require(!pos.claimed, "Already claimed");

        uint256 userStake = market.outcome ? pos.upAmount : pos.downAmount;
        require(userStake > 0, "No winning position");

        pos.claimed = true;

        uint256 winningPool = market.outcome ? market.upPool : market.downPool;
        uint256 losingPool = market.outcome ? market.downPool : market.upPool;
        uint256 totalPool = winningPool + losingPool;

        // Calculate winnings: stake + proportional share of losing pool (minus fee)
        uint256 grossWinnings = (userStake * totalPool) / winningPool;
        uint256 fee = (grossWinnings * protocolFee) / FEE_DENOMINATOR;
        uint256 netWinnings = grossWinnings - fee;

        (bool success, ) = msg.sender.call{value: netWinnings}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(marketId, msg.sender, netWinnings);
    }

    /**
     * @notice Withdraw protocol fees
     */
    function withdrawFees() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    /**
     * @notice Update protocol fee
     * @param newFee New fee in basis points (max 500 = 5%)
     */
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high");
        protocolFee = newFee;
    }

    /**
     * @notice Update Pyth oracle address
     */
    function setPythOracle(address _pythOracle) external onlyOwner {
        pythOracle = _pythOracle;
    }

    receive() external payable {}
}
```

### 4-6. `script/Deploy.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MonffyBadge.sol";
import "../src/MicroMarket.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MonffyBadge
        string memory baseUri = "https://api.monffy.xyz/metadata/badges/";
        MonffyBadge badge = new MonffyBadge(baseUri);
        console.log("MonffyBadge deployed at:", address(badge));

        // Deploy MicroMarket
        // Pyth on Monad: https://docs.pyth.network/price-feeds/contract-addresses/evm
        address pythOracle = 0x2880aB155794e7179c9eE2e38200202908C17B43; // Pyth on Monad
        MicroMarket market = new MicroMarket(pythOracle);
        console.log("MicroMarket deployed at:", address(market));

        // Add MicroMarket as badge minter (for achievement badges)
        badge.addMinter(address(market));

        vm.stopBroadcast();
    }
}
```

### 4-7. `test/MonffyBadge.t.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MonffyBadge.sol";

contract MonffyBadgeTest is Test {
    MonffyBadge public badge;
    address public owner = address(1);
    address public minter = address(2);
    address public user = address(3);

    function setUp() public {
        vm.prank(owner);
        badge = new MonffyBadge("https://api.monffy.xyz/metadata/badges/");
    }

    function test_InitialState() public view {
        assertEq(badge.owner(), owner);
        assertEq(badge.badgeNames(badge.STREAK_3()), "3-Day Streak");
        assertEq(badge.badgeNames(badge.EARLY_ADOPTER()), "Early Adopter");
    }

    function test_AddMinter() public {
        vm.prank(owner);
        badge.addMinter(minter);
        assertTrue(badge.minters(minter));
    }

    function test_MintBadge() public {
        vm.prank(owner);
        badge.addMinter(minter);

        vm.prank(minter);
        badge.mint(user, badge.STREAK_3());

        assertEq(badge.balanceOf(user, badge.STREAK_3()), 1);
        assertTrue(badge.hasBadge(user, badge.STREAK_3()));
    }

    function test_RevertDoubleMint() public {
        vm.prank(owner);
        badge.addMinter(minter);

        vm.prank(minter);
        badge.mint(user, badge.STREAK_3());

        vm.prank(minter);
        vm.expectRevert("Badge already owned");
        badge.mint(user, badge.STREAK_3());
    }

    function test_SoulboundTransferReverts() public {
        vm.prank(owner);
        badge.mint(user, badge.STREAK_3());

        vm.prank(user);
        vm.expectRevert("Soulbound: transfers disabled");
        badge.safeTransferFrom(user, address(4), badge.STREAK_3(), 1, "");
    }

    function test_SoulboundApprovalReverts() public {
        vm.prank(user);
        vm.expectRevert("Soulbound: approvals disabled");
        badge.setApprovalForAll(minter, true);
    }

    function test_BatchMint() public {
        vm.prank(owner);
        badge.addMinter(minter);

        uint256[] memory badgeIds = new uint256[](3);
        badgeIds[0] = badge.STREAK_3();
        badgeIds[1] = badge.STREAK_7();
        badgeIds[2] = badge.FIRST_PREDICTION();

        vm.prank(minter);
        badge.mintBatch(user, badgeIds);

        assertEq(badge.balanceOf(user, badge.STREAK_3()), 1);
        assertEq(badge.balanceOf(user, badge.STREAK_7()), 1);
        assertEq(badge.balanceOf(user, badge.FIRST_PREDICTION()), 1);
    }
}
```

---

## 5. 데이터베이스 (supabase/)

### 5-1. `supabase/schema.sql`

```sql
-- MONFFY Database Schema
-- Supabase PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== TABLES ====================

-- Questions table (all 3 lanes: luck, prediction, sponsor)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lane VARCHAR(20) NOT NULL CHECK (lane IN ('luck', 'prediction', 'sponsor')),
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- ["option1", "option2", ...]
    correct_answer INTEGER, -- NULL for predictions (resolved later)
    sponsor_id UUID REFERENCES sponsors(id),
    pyth_price_id VARCHAR(66), -- For prediction markets
    strike_price BIGINT, -- For prediction markets (scaled by 10^8)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_outcome BOOLEAN, -- For predictions: true=UP, false=DOWN
    is_active BOOLEAN DEFAULT true,

    CONSTRAINT valid_prediction CHECK (
        (lane = 'prediction' AND pyth_price_id IS NOT NULL AND strike_price IS NOT NULL)
        OR (lane != 'prediction')
    )
);

-- User responses
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL,
    selected_option INTEGER NOT NULL,
    is_correct BOOLEAN, -- NULL until question resolved
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (question_id, wallet_address) -- One response per user per question
);

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'premium', 'exclusive')),
    monthly_fee_krw INTEGER NOT NULL, -- Korean Won
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Daily streaks (wallet-based)
CREATE TABLE IF NOT EXISTS daily_streaks (
    wallet_address VARCHAR(42) PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    total_points INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_predictions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge minting records (mirrors on-chain data)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    token_id INTEGER NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    minted_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (wallet_address, badge_type)
);

-- Daily metrics (analytics)
CREATE TABLE IF NOT EXISTS daily_metrics (
    date DATE PRIMARY KEY,
    total_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    predictions_made INTEGER DEFAULT 0,
    sponsor_impressions INTEGER DEFAULT 0,
    total_volume_mon NUMERIC(20, 8) DEFAULT 0,
    protocol_fees_mon NUMERIC(20, 8) DEFAULT 0
);

-- Leaderboard cache (refreshed periodically)
CREATE TABLE IF NOT EXISTS leaderboard (
    wallet_address VARCHAR(42) PRIMARY KEY,
    rank INTEGER,
    total_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    prediction_accuracy NUMERIC(5, 2), -- percentage
    badges_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================

CREATE INDEX idx_questions_lane ON questions(lane);
CREATE INDEX idx_questions_active ON questions(is_active, expires_at);
CREATE INDEX idx_questions_sponsor ON questions(sponsor_id) WHERE sponsor_id IS NOT NULL;

CREATE INDEX idx_responses_wallet ON responses(wallet_address);
CREATE INDEX idx_responses_question ON responses(question_id);
CREATE INDEX idx_responses_created ON responses(created_at);

CREATE INDEX idx_badges_wallet ON badges(wallet_address);

CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX idx_leaderboard_points ON leaderboard(total_points DESC);

-- ==================== FUNCTIONS ====================

-- Update streak on response
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    current_date_val DATE := CURRENT_DATE;
BEGIN
    -- Get or create streak record
    INSERT INTO daily_streaks (wallet_address, current_streak, last_activity_date)
    VALUES (NEW.wallet_address, 0, NULL)
    ON CONFLICT (wallet_address) DO NOTHING;

    SELECT last_activity_date INTO last_date
    FROM daily_streaks
    WHERE wallet_address = NEW.wallet_address;

    -- Update streak
    IF last_date IS NULL OR last_date < current_date_val - INTERVAL '1 day' THEN
        -- Streak broken or first activity
        UPDATE daily_streaks
        SET current_streak = 1,
            last_activity_date = current_date_val,
            total_questions_answered = total_questions_answered + 1,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    ELSIF last_date = current_date_val - INTERVAL '1 day' THEN
        -- Consecutive day
        UPDATE daily_streaks
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = current_date_val,
            total_questions_answered = total_questions_answered + 1,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    ELSIF last_date = current_date_val THEN
        -- Same day, just increment questions
        UPDATE daily_streaks
        SET total_questions_answered = total_questions_answered + 1,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update points on correct answer
CREATE OR REPLACE FUNCTION update_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_correct = true AND NEW.points_earned > 0 THEN
        UPDATE daily_streaks
        SET total_points = total_points + NEW.points_earned,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

CREATE TRIGGER trigger_update_streak
AFTER INSERT ON responses
FOR EACH ROW
EXECUTE FUNCTION update_streak();

CREATE TRIGGER trigger_update_points
AFTER UPDATE OF is_correct ON responses
FOR EACH ROW
EXECUTE FUNCTION update_points();

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Public read access for questions
CREATE POLICY "Questions are viewable by everyone"
ON questions FOR SELECT
USING (is_active = true);

-- Users can view their own responses
CREATE POLICY "Users can view own responses"
ON responses FOR SELECT
USING (true);

-- Users can insert their own responses
CREATE POLICY "Users can insert own responses"
ON responses FOR INSERT
WITH CHECK (true);

-- Public read for sponsors
CREATE POLICY "Sponsors are viewable by everyone"
ON sponsors FOR SELECT
USING (is_active = true);

-- Users can view their own streaks
CREATE POLICY "Users can view all streaks"
ON daily_streaks FOR SELECT
USING (true);

-- Badges are public
CREATE POLICY "Badges are viewable by everyone"
ON badges FOR SELECT
USING (true);

-- Leaderboard is public
CREATE POLICY "Leaderboard is viewable by everyone"
ON leaderboard FOR SELECT
USING (true);

-- ==================== SEED DATA (SAMPLE) ====================

-- Sample culture questions
INSERT INTO questions (lane, category, question_text, options, correct_answer) VALUES
('luck', '한국 문화', '한국의 전통 명절 중 음력 1월 1일을 무엇이라 부르나요?', '["추석", "설날", "한식", "단오"]', 1),
('luck', 'K-POP', 'BTS의 공식 팬클럽 이름은?', '["ARMY", "BLINK", "ONCE", "STAY"]', 0),
('luck', '한국 역사', '조선의 4대 임금으로, 한글을 창제한 왕은?', '["태조", "태종", "세종", "성종"]', 2);

-- Note: Prediction questions are created dynamically by the backend
-- Note: Sponsor questions require sponsors to be added first
```

---

## 6. 이전 세션 작업 이력

### 마지막 세션 (2026-02-07) 진행 중이던 작업

1. **폰트 에러 수정**: `layout.tsx`에서 로컬 Pretendard 폰트 → Google Font (Inter)로 변경
2. **MetaMask SDK 에러 수정**: `next.config.mjs`에 `crypto: false`, `@react-native-async-storage` alias 추가
3. **WalletConnect Project ID 에러**: 컴파일은 성공, 런타임에서 `No projectId found` 에러 → `wagmi.ts`에 개발용 placeholder 추가 중 (끊김)

### 남은 에러/미완료 사항

| 항목 | 상태 | 설명 |
|------|------|------|
| WalletConnect Project ID | 미완료 | cloud.walletconnect.com에서 발급 필요 |
| Supabase 프로젝트 | 미생성 | supabase.com에서 프로젝트 생성 + schema.sql 실행 |
| tailwind.config.ts 폰트 | 불일치 | `--font-pretendard` → `--font-inter`로 변경 필요 |
| 컨트랙트 배포 | 미완료 | Monad 테스트넷 배포 대기 |
| .env.local | 미생성 | .env.example 기반으로 생성 필요 |

---

## 통계 요약

| 항목 | 수치 |
|------|------|
| 총 소스 파일 | 27개 |
| TypeScript/TSX | 10개 (~900줄) |
| Solidity | 3개 (~360줄) |
| SQL | 1개 (~250줄) |
| CSS | 1개 (~50줄) |
| 설정 파일 (JSON/TOML/YAML/MJS) | 12개 (~200줄) |
| 테스트 파일 | 1개 (7 test cases) |
| React 컴포넌트 | 3개 (DailyLuckCard, QuestionCard, StreakBadge) |
| 스마트 컨트랙트 | 2개 (MonffyBadge, MicroMarket) |
| DB 테이블 | 7개 |
| DB 인덱스 | 9개 |
| DB 함수/트리거 | 2+2개 |
| RLS 정책 | 7개 |

---

*이 문서는 2026-02-07 기준 monffy/ 모노레포의 전체 코드 스냅샷입니다.*
*다음 세션에서 이 파일을 참조하면 전체 코드를 다시 읽지 않아도 됩니다.*
