# MONFFY Demo Video — FINAL v3 (1:55, Shot-by-Shot)

> **Hard rule**: 2:00 MAX (Moltiverse Rules Section 6). Target 1:55.
> **Track**: Agent (Open) — $60K
> **DEMO_MODE**: 30s market, 0.5% threshold, 15s cooldown

---

## Pre-Flight Checklist (촬영 전 필수)

### 환경 준비

| # | 체크 | 내용 | 검증 방법 |
|---|------|------|----------|
| 1 | ☐ | MON 충전 (0.1+ MON) | `cast balance 0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8 --rpc-url https://rpc.monad.xyz` |
| 2 | ☐ | 에이전트 리허설 1회 | `pnpm dev:agent:demo` → 마켓 1개 완료 → Ctrl+C |
| 3 | ☐ | Monadscan에 최신 tx 확인 | https://monadscan.com/address/0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8 |
| 4 | ☐ | monffy.xyz/agent 로드 확인 | LIVE 뱃지 깜빡임, 숫자 표시 확인 |
| 5 | ☐ | chainId 143 = 메인넷 확인 | 터미널 부팅 로그에서 `chain: Monad (143)` |

### OBS 설정

| # | 체크 | 내용 |
|---|------|------|
| 6 | ☐ | 해상도 1920x1080, 30fps, CBR 8000kbps |
| 7 | ☐ | 장면 3개 생성: `Terminal Full`, `Split 60/40`, `Browser Full` |
| 8 | ☐ | 엔딩 카드 이미지 준비 (검정 배경 + 텍스트) |

### 터미널 설정

| # | 체크 | 내용 |
|---|------|------|
| 9 | ☐ | 폰트 18pt, 다크 배경 (순수 검정 or 매우 어두운 회색) |
| 10 | ☐ | 터미널 줄 간격 넓게 (가독성) |
| 11 | ☐ | 경로를 `monffy/apps/agent`로 미리 cd |

### 브라우저 설정

| # | 체크 | 내용 |
|---|------|------|
| 12 | ☐ | 탭 3개만: (1) monffy.xyz/agent (2) Monadscan 에이전트 주소 (3) 빈 탭(tx용) |
| 13 | ☐ | 북마크바 숨기기 (Ctrl+Shift+B) |
| 14 | ☐ | 다크 모드 (Monadscan은 자동 다크) |
| 15 | ☐ | 줌 100% (Ctrl+0) |

---

## DEMO_MODE 타이밍 (v3 설정값)

```
Market Duration:    30초 (생성 → 만료)
Signal Threshold:   0.5% in 30s (실제 2%의 1/4)
Signal Cooldown:    15초 (연속 시그널 방지)
Quiet Fallback:     20초 (시그널 없으면 QUIET 마켓 자동 생성)
Brain Tick:         10초
Price Check:        5초
```

**예상 사이클**: 부팅(8s) → 시그널(20s) → 마켓 만료(30s) → 해결(10s) → 내러티브(10s) = **~78초**
→ 2분 안에 **전체 사이클 1회 + 대시보드 증거 + 엔딩**이 편집 없이 들어감

---

## Master Timeline (1:55)

| Shot | Time | Sec | Layout | What Happens |
|------|------|-----|--------|-------------|
| A | 0:00-0:03 | 3s | Terminal Full | 커맨드 타이핑 + Enter |
| B | 0:03-0:10 | 7s | Terminal Full | 부팅 시퀀스 (배너→DEMO MODE→인프라→LIVE) |
| C | 0:10-0:25 | 15s | Terminal Full | 가격 틱 + **시그널 감지 + Reason Trace** |
| D | 0:25-0:35 | 10s | Split 60/40 | 마켓 생성 + /agent에 카드 등장 |
| E | 0:35-0:50 | 15s | **Browser Full** | **Monadscan tx 증거 (풀스크린)** |
| F | 0:50-1:10 | 20s | Split 60/40 | 마켓 만료 → 해결 → 내러티브 생성 |
| G | 1:10-1:35 | 25s | **Browser Full** | 대시보드 증거 (전적+활동+내러티브) |
| H | 1:35-1:47 | 12s | Terminal Full | Status Report + Reason Trace 클로즈업 |
| I | 1:47-1:55 | 8s | Ending Card | 엔딩 텍스트 |

---

## Shot-by-Shot Instructions

### Shot A: HOOK (0:00–0:03) — Terminal Full

**화면**: 깨끗한 터미널, 커서만 깜빡임

**행동**:
```
$ pnpm dev:agent:demo     ← 천천히 타이핑 (2초) → Enter
```

**나레이션 시작**:
> "What if an AI could run a prediction game — 24/7, on-chain, zero human help?"

**편집 노트**: 타이핑 소리가 들리면 더 좋음 (기계적 키보드 ASMR)

---

### Shot B: BOOT (0:03–0:10) — Terminal Full

**화면**: 로그가 빠르게 올라옴

**터미널에 나타나는 것** (실제 로그 순서):
```
===========================================
🐰 MONFFY Claw Agent - Game Master AI
===========================================
🎬 DEMO MODE — accelerated cycles for live demonstration
    marketDuration: "30s"
    signalThreshold: "0.5%"
    signalCooldown: "15s"
Verifying infrastructure...
Configuration loaded
    priceInterval: "5000ms"
    brainInterval: "10000ms"
🧠 Brain starting autonomous loop...
🐰 MONFFY Claw Agent is LIVE! Monitoring markets...
```

**나레이션** (이어서):
> "Meet MONFFY — an autonomous Game Master on Monad. One command. Pyth connected. Brain active."

**핵심**: DEMO MODE 배너가 설정값을 정직하게 보여줌 → 심사위원 신뢰

---

### Shot C: SIGNAL + REASON TRACE (0:10–0:25) — Terminal Full

**화면**: 가격 틱이 흐르다가 시그널 감지

**터미널에 나타나는 것**:
```
Price update    symbol: "MON/USD"  price: "0.412847"
Price update    symbol: "MON/USD"  price: "0.414201"
Price update    symbol: "MON/USD"  price: "0.415882"

⚡ Price signal detected!
    type: "SPIKE"  change: "+0.73%"  price: "0.415882"

Signal received from price monitor
    type: "SPIKE"  change: "+0.73%"

📊 Reason Trace — why MONFFY decided        ← ★ 핵심 장면
    signal: "SPIKE (+0.73%)"
    momentum:      "+0.150"
    meanReversion: "-0.200"
    emaDeviation:  "-0.018"
    noise:         "+0.062"
    rawScore:       "0.494"
    clampedScore:   "0.494"
    prediction:     "DOWN"
    confidence:     "1%"
```

**나레이션**:
> "Price signal detected. Not a timer — signal-driven. The agent's Reason Trace shows exactly why it decided: momentum, mean-reversion, EMA deviation, calibrated noise. Transparent decision-making, not a black box."

**핵심**: 📊 Reason Trace가 화면에 크게 보여야 함. 이것이 "scripted if/then이 아니다"의 증거.

**마우스 가이드**: Reason Trace 로그가 나오면 마우스를 그 영역으로 천천히 이동 (시선 유도)

---

### Shot D: MARKET CREATION (0:25–0:35) — Split 60/40

**전환**: OBS 장면 `Split 60/40` (좌: 터미널 / 우: monffy.xyz/agent)

**좌 터미널**:
```
Creating market...
    text: "Will MON/USD go UP in the next 30 seconds?"

MONFFY prediction made
    prediction: "DOWN"  confidence: "1%"  upScore: "0.494"

Market created + prediction published
    questionId: "xxx"  prediction: "DOWN"  onchainMarketId: 42

[ONCHAIN] MicroMarket.createMarket
    tx: 0xabc123...
    monadscan: https://monadscan.com/tx/0xabc123...
```

**우 브라우저** (/agent):
- 새 예측 카드가 등장 (10초 자동 새로고침 or F5)
- 카운트다운 타이머: `00:28` → 실시간 감소
- MONFFY 예측: DOWN 표시

**나레이션**:
> "Market created. MONFFY predicts DOWN with low confidence. On-chain transaction confirmed — let's verify."

---

### Shot E: ON-CHAIN PROOF (0:35–0:50) — Browser FULLSCREEN

**전환**: OBS 장면 `Browser Full`

**행동** (정확한 순서):
1. 터미널의 Monadscan URL 클릭 (또는 탭2로 이동)
2. tx 상세 페이지가 풀스크린으로 보임:

```
Transaction Details
━━━━━━━━━━━━━━━━━━
Status:     ✅ Success
Block:      12345678
From:       0x07eAC2...245f8  (Agent Wallet)
To:         0xDb3a5B...7Eee0  (MicroMarket)
Value:      0 MON
Gas Used:   142,891
```

3. **마우스로 천천히 가리키기**: Status → From → To → Block

**나레이션**:
> "Every decision goes on-chain. Monadscan — Monad mainnet. Status: Success. From: agent wallet. To: MicroMarket contract. Created seconds ago. Immutable."

**핵심**:
- 반드시 **풀스크린**. Split 하면 글씨가 작아서 안 보임.
- "방금 만든 tx"의 타임스탬프가 보여야 함 (X seconds ago)
- From/To 주소가 에이전트 지갑/컨트랙트와 일치

---

### Shot F: RESOLUTION + NARRATIVE (0:50–1:10) — Split 60/40

**전환**: OBS 장면 `Split 60/40`

**편집 팁**: 30초 마켓이므로 실시간으로 기다려도 됨. 편집 불필요!

**좌 터미널** (마켓 만료 후):
```
Resolving expired market...
    questionId: "xxx"  text: "Will MON/USD go UP..."

📊 Final price: $0.414501
    Outcome: DOWN
    Agent correct: true ✅

[ONCHAIN] MicroMarket.resolveMarket
    tx: 0xdef456...

Narrative generated
    questionId: "xxx"
```

**우 브라우저**:
- 예측 카드: 카운트다운 `00:00` → 🔒 **CLOSED** 배지로 변환
- 전적 숫자 업데이트 (Wins +1)
- Narrative Feed에 새 이야기 등장

**나레이션**:
> "30 seconds pass. Market expires. Agent auto-resolves with Pyth oracle data. Outcome: DOWN. Agent correct. Then MONFFY writes its own narrative — a personality-driven story for every single market. Win or lose, the agent has a voice."

---

### Shot G: DASHBOARD EVIDENCE (1:10–1:35) — Browser FULLSCREEN

**전환**: OBS 장면 `Browser Full` — monffy.xyz/agent

**행동** (천천히, 증거를 보여주듯):

1. **(1:10–1:17)** 상단 전적 클로즈업:
   - Accuracy: XX.X%
   - Wins: XX
   - Losses: XX
   - Markets: XXX
   - **LIVE 뱃지** 깜빡임

2. **(1:17–1:22)** On-chain Proof 섹션:
   - "Agent Wallet 0x07eA..." → Monadscan 링크
   - "MicroMarket 0xDb3a..." → Monadscan 링크
   - "ClawLog 0x7355..." → Monadscan 링크

3. **(1:22–1:28)** Active Predictions + Narrative Feed 스크롤:
   - 방금 생성된 내러티브 강조
   - 내러티브 텍스트가 "캐릭터"가 말하는 것처럼 보임

4. **(1:28–1:35)** Live Activity 사이드바:
   - MARKET_CREATED, PREDICTION_MADE, MARKET_RESOLVED, NARRATIVE_POSTED
   - 각각 tx_hash 링크 포함
   - 타임스탬프: "just now", "1 min ago"

**나레이션**:
> "The dashboard shows everything. Live accuracy. Win/loss record. On-chain proof links verified on Monadscan. Activity feed with every action timestamped. Narrative stories generated automatically. All data pulled from Supabase in real-time."

---

### Shot H: TERMINAL EVIDENCE (1:35–1:47) — Terminal Full

**전환**: OBS 장면 `Terminal Full`

**행동**: 터미널을 약간 위로 스크롤하여 전체 사이클 로그를 한 화면에 보여줌

**보여줄 것**:
```
(한 화면에 보이는 전체 사이클)

⚡ Price signal detected!  type: "SPIKE"
📊 Reason Trace — why MONFFY decided
    momentum: +0.150  meanReversion: -0.200  ...
Creating market...
MONFFY prediction made  prediction: "DOWN"
[ONCHAIN] tx: 0xabc...
Resolving expired market...
Agent correct: true ✅
[ONCHAIN] tx: 0xdef...
Narrative generated

📊 MONFFY Status Report            ← 1분 Status Report
    state: "MONITORING"
    uptime: "1m"
    questions: 121
    predictions: 121
    accuracy: "59.5%"
    activeMarkets: 0
```

**나레이션**:
> "12 hours. 120 markets. 59.2% accuracy. Zero crashes. A 5-phase state machine. Signal-driven, not time-driven. Not a cron job — a decision policy with transparent reasoning. Built by one person. Runs by itself."

**핵심**: Status Report의 숫자가 화면에 **크게** 보여야 함. 이것이 "Actually works" 25점의 핵심 증거.

---

### Shot I: ENDING CARD (1:47–1:55) — OBS 장면 전환

**화면**: 검정 배경 + 흰색 텍스트 (OBS 이미지 소스 or 편집)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        MONFFY Claw Agent
   Autonomous Game Master on Monad

        monffy.xyz

   Monad Mainnet · chainId 143
   3 Contracts · Pyth Oracle · Supabase

   Built solo. Runs 24/7. Verified on-chain.

   Moltiverse Hackathon — Agent Track

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**나레이션**:
> "MONFFY. Autonomous Game Master on Monad. Built by one. Runs by itself. Verified on-chain."

---

## Narration Script (Full Read-Through, 1:55)

읽기 속도: 분당 ~140단어 (느긋하고 자신감 있게)

```
[0:00] What if an AI could run a prediction game —
       24/7, on-chain, zero human help?

[0:05] Meet MONFFY — an autonomous Game Master on Monad.
       One command. Pyth connected. Brain active.

[0:13] Price signal detected.
       Not a timer — signal-driven.
       The agent's Reason Trace shows exactly why it decided:
       momentum, mean-reversion, EMA deviation, calibrated noise.
       Transparent decision-making, not a black box.

[0:28] Market created. MONFFY predicts DOWN with low confidence.
       On-chain transaction confirmed — let's verify.

[0:35] Every decision goes on-chain.
       Monadscan — Monad mainnet.
       Status: Success. From: agent wallet. To: MicroMarket contract.
       Created seconds ago. Immutable.

[0:50] 30 seconds pass. Market expires.
       Agent auto-resolves with Pyth oracle data.
       Outcome: DOWN. Agent correct.

[1:00] Then MONFFY writes its own narrative —
       a personality-driven story for every single market.
       Win or lose, the agent has a voice.

[1:10] The dashboard shows everything.
       Live accuracy. Win/loss record.
       On-chain proof links. Activity feed.
       Narrative stories generated automatically.
       All real-time.

[1:30] 12 hours. 120 markets. 59.2% accuracy. Zero crashes.
       A 5-phase state machine.
       Signal-driven, not time-driven.
       Not a cron job — a decision policy with transparent reasoning.

[1:43] Built by one person. Runs by itself.

[1:47] MONFFY. Autonomous Game Master on Monad.
       Verified on-chain.
```

---

## 심사위원이 이 영상에서 체크하는 5가지

영상의 모든 장면은 이 5개 점수 항목에 1:1 매핑됩니다:

| 항목 (각 20%) | 영상에서 증명하는 장면 |
|--------------|---------------------|
| **Agent Intelligence** | Shot C: Reason Trace (다중 시그널 가중 결합, 투명한 의사결정) |
| **Technical Excellence** | Shot E: Monadscan tx 증거, Shot H: Status Report (12h/120/0 crash) |
| **Monad Integration** | Shot E: mainnet chainId 143, 400ms 블록에서 즉시 확인 |
| **Virality** | Shot G: "Can you beat the bunny?" 프레이밍, 내러티브 공유 |
| **Innovation** | Shot F: 전체 사이클 완주 (생성→예측→해결→내러티브, 사람 개입 0) |

---

## Emergency Plan (시그널이 안 뜰 때)

DEMO_MODE는 20초 후 자동으로 QUIET 시그널을 생성합니다.
최악의 경우에도 부팅 후 ~25초 이내에 마켓이 생성됩니다.

| 상황 | 대응 |
|------|------|
| 0.5% 시그널이 20초 안에 안 뜸 | → QUIET 시그널 자동 생성 (20s). 정상 진행. |
| tx가 실패 | → balance guard 로그 나옴. 녹화 중단 → MON 충전 → 재촬영 |
| /agent 카드가 안 나타남 | → F5 (10초 자동 새로고침이지만 타이밍 놓치면 수동) |
| 해결 후 내러티브 안 뜸 | → 다음 brain tick (10초) 기다리기. 반드시 나옴. |

---

## OBS 장면 전환 타이밍

| 시간 | 장면 | 전환 방법 |
|------|------|----------|
| 0:00 | Terminal Full | 시작 |
| 0:25 | Split 60/40 | 단축키 (Ctrl+1 등) |
| 0:35 | Browser Full | 단축키 |
| 0:50 | Split 60/40 | 단축키 |
| 1:10 | Browser Full | 단축키 |
| 1:35 | Terminal Full | 단축키 |
| 1:47 | Ending Card | 단축키 |

OBS 단축키 설정 권장: Ctrl+1~4로 장면 전환

---

*v3 — 2026-02-14 (30s 마켓 + Reason Trace + Shot-by-Shot + 심사위원 매핑)*
