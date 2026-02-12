# MONFFY Demo Video Script (3 min)

## 준비물
- OBS 또는 화면 녹화 프로그램
- 에이전트 지갑에 MON 충전 (최소 0.5 MON)
- 터미널 + 브라우저 2개 창

---

## Scene 1: 인트로 (0:00 - 0:20)

**화면**: 브라우저에서 https://monffy.vercel.app 오픈

**보여줄 것**:
- 메인 페이지 (Daily Luck + 질문 카드들)
- 하단 네비게이션에서 "에이전트" 탭 클릭
- /agent 페이지 진입

**나레이션 (자막)**:
> "MONFFY is an autonomous AI Game Master on Monad.
> It creates prediction markets, makes its own predictions,
> and writes narrative recaps — 24/7, zero human intervention."

---

## Scene 2: 에이전트 시작 (0:20 - 0:50)

**화면**: 터미널 (왼쪽) + 브라우저 /agent (오른쪽) 분할

**터미널에서 실행**:
```bash
cd monffy
pnpm dev:agent
```

**보여줄 것**:
- 에이전트 부팅 로그:
  - "MONFFY Claw Agent - Game Master AI"
  - "Verifying infrastructure..."
  - "Configuration loaded"
  - "Brain starting autonomous loop..."
  - "MONFFY Claw Agent is LIVE!"
- Pyth 가격 폴링 시작 (MON/USD 가격 스트리밍)

**나레이션**:
> "The agent connects to Pyth Network for real-time MON/USD prices,
> Supabase for data storage, and Monad mainnet for on-chain operations."

---

## Scene 3: 마켓 생성 (0:50 - 1:30)

**화면**: 터미널 로그 + 브라우저 동시

**기다릴 것**: 가격 2%+ 변동 또는 15분 후 자동 QUIET 질문 생성

> TIP: 빨리 보려면 `PRICE_THRESHOLD_PCT=0.5`로 낮춰서 실행

**터미널에서 보여줄 것**:
- "Signal received from price monitor" (가격 변동 감지)
- "Creating market..." (질문 생성)
- "MONFFY prediction made" (자체 예측 - UP 또는 DOWN)
- "Market created + prediction published" (완료)
- tx hash 로그

**브라우저에서 보여줄 것**:
- /agent 페이지에서 "진행 중인 예측" 섹션에 새 질문 등장
- 몬플러피 예측 표시 (⬆️ UP 또는 ⬇️ DOWN)
- 활동 피드에 🎯 MARKET_CREATED + 🐰 PREDICTION_MADE

**나레이션**:
> "When the agent detects a significant price move,
> it autonomously creates a prediction market and publishes its own prediction.
> MONFFY is intentionally ~60% accurate — beatable by humans."

---

## Scene 4: 온체인 검증 (1:30 - 2:00)

**화면**: 새 탭에서 Monadscan 오픈

**보여줄 것**:
1. Agent 지갑 주소 검색: `0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8`
   - 최근 트랜잭션 목록 (MicroMarket + ClawLog 호출)
2. ClawLog 컨트랙트 클릭: `0x73559F1E246D04BA7835ACEC9003348506F5FC8e`
   - Events 탭 → AgentAction 이벤트들
3. MicroMarket 컨트랙트: `0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0`
   - Market 생성/해결 트랜잭션

**나레이션**:
> "Every decision is logged on-chain via ClawLog.
> Markets are created and resolved on MicroMarket.
> Fully verifiable on Monad mainnet."

---

## Scene 5: 해결 + 내러티브 (2:00 - 2:40)

**화면**: 터미널 + 브라우저

**기다릴 것**: 5분 후 마켓 만료 → 자동 해결

**터미널에서 보여줄 것**:
- "Resolving expired market..."
- "Market resolved" (outcome: UP/DOWN, agentCorrect: true/false)
- "Narrative generated"

**브라우저에서 보여줄 것**:
- "몬플러피의 이야기" 섹션에 내러티브 등장
- ✅ 적중 또는 ❌ 실패 표시
- 전적 업데이트 (승/패/적중률)

**나레이션**:
> "After 5 minutes, the agent resolves the market using Pyth oracle data,
> checks if its prediction was correct, and writes a personality-driven narrative.
> The agent's win/loss record is tracked publicly."

---

## Scene 6: 아웃로 (2:40 - 3:00)

**화면**: /agent 페이지 전체 화면

**보여줄 것**:
- 전적 카드 (승/패/적중률)
- 활동 피드 (여러 건)
- "LIVE" 표시 (실시간)

**나레이션**:
> "MONFFY ran for 12 hours straight: 120 markets, 59.2% accuracy, zero crashes.
> An autonomous Game Master on Monad — not a cron job, but a living agent.
> Built for Moltiverse Hackathon, Agent Track."

**끝에 표시**:
```
MONFFY Claw Agent
https://monffy.vercel.app
Monad Mainnet (chainId 143)
Moltiverse Hackathon - Agent Track
```

---

## 녹화 팁

1. **해상도**: 1920x1080 권장
2. **폰트 크기**: 터미널 폰트 16pt 이상 (가독성)
3. **배경음악**: Lo-fi 또는 없음
4. **자막**: 영어 (심사위원용)
5. **속도**: 대기 시간은 2x 배속 편집
6. **시간**: 총 3분 이내 (해커톤 권장)

## 빠른 데모 설정 (대기 시간 단축)

에이전트 실행 전 `.env`에서:
```
PRICE_THRESHOLD_PCT=0.3        # 0.3% 변동으로 낮춤
MARKET_DURATION_SECS=120       # 2분으로 단축
BRAIN_TICK_INTERVAL_MS=5000    # 5초로 단축
```

이렇게 하면 ~2분 안에 전체 사이클 촬영 가능.
