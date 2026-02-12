역할: 당신은 Moltiverse Hackathon 심사관(Agent Track)입니다.

목표:

1\) 이 프로젝트가 "에이전트 해커톤" 요구사항을 충족하는지 평가하세요.

2\) 100점 만점으로 점수와 근거를 제시하세요.

3\) 48시간 안에 점수를 15점 올릴 수 있는 수정 5개를 제시하세요.

평가 기준(공식 문구를 반영):

\- Weird & creative

\- Actually works (데모가 아이디어보다 중요)

\- Pushes boundaries (사람이 못하는 걸 에이전트가 한다)

\- Bonus: A2A coordination, trading, community building

작업 지시:

\- 레포를 스캔하고, "에이전트"가 실제로 어떤 프로세스로 동작하는지(실행 방법 포함) 찾아서 요약하세요.

\- 데모/README/원클릭 실행이 가능한지 확인하고 부족하면 정확히 어떤 파일을 어떻게 고치면 되는지 제안하세요.

\- "이게 크론잡이랑 뭐가 달라?"라는 질문에, 현재 레포가 답하고 있는지/없는지 판단하세요.

\- 결과는 아래 포맷으로 출력하세요:

\[1\] 총평 (3줄)

\[2\] 점수표(항목별 점수)

\[3\] 수상 가능성: 낮음/중간/높음 (근거)

\[4\] 48시간 개선 Top 5 (각각: 예상 소요시간, 수정 파일 경로, 기대효과)

\[5\] 제출 패키지 체크리스트(데모 URL, 영상, README, 테스트, 라이선스 등)

  MONFFY는 실시간 가격 시그널 기반으로 마이크로 예측시장 생성·예측·해결·서사화를 자동 수행하는 에이전트로

“크론잡과의 차이”는 README에 선언되어 있고 실제로 상태머신+시그널 기반 이벤트 처리로 구현되어 있어 논리적

기록이며, 이 구조는 monffy/apps/agent/src/index.ts와 monffy/apps/agent/src/core/brain.ts에 명시되어 있습

\[2\] 점수표(항목별 점수)

\- Weird & creative: 22/25. 예측시장을 “게임 마스터”로 재해석하고 의도적 패배 확률까지 설계(monffy/

README.md:56-66).

\- Pushes boundaries: 24/30. 사람 대신 가격 시그널 감지→시장 생성→자동 해결→서사화를 전부 처리하는 루프가

\- Bonus (A2A coordination/trading/community): 2/10. 단일 에이전트 구조이며 A2A 협업/커뮤니티 메커니즘이

총점: 71/100

\[3\] 수상 가능성: 중간 (근거)

아이디어와 구현은 강하지만, “데모 우선” 기준에서 현재 제출물이 증빙에 약합니다. 48시간 내 데모 신뢰도/재

현성/멀티에이전트 보너스를 보강하면 중간→높음으로 충분히 상승 가능합니다.

\[4\] 48시간 개선 Top 5 (각각: 예상 소요시간, 수정 파일 경로, 기대효과)

1\. 데모 증빙 강화(영상 \+ 재현 로그 섹션 추가). 2-3시간. 수정: monffy/README.md. 기대효과: “Actually

works” 점수 즉시 상승, 심사관이 링크 클릭만으로 신뢰 확보.

2\. 원클릭 데모 모드 추가(모의 가격 피드/로컬 DB 옵션). 8-12시간. 수정: monffy/apps/agent/src/utils/pyth-

client.ts, monffy/apps/agent/src/executors/supabase-executor.ts, monffy/package.json(demo 스크립트),

신규 monffy/apps/agent/src/utils/mock-feed.ts. 기대효과: 심사관이 지갑/체인 없이도 실행 확인 가능.

3\. 메인넷/테스트넷 혼선 정리 및 설정 명시. 2-4시간. 수정: monffy/README.md, monffy/apps/

agent/.env.example, monffy/apps/web/.env.example, monffy/apps/agent/src/config.ts. 기대효과: 셋업 실패

감소, 데모 신뢰도 상승.

4\. A2A 보너스용 “Narrator Agent” 분리(큐 기반 협업). 10-14시간. 수정: monffy/supabase/agent-schema.sql,

monffy/apps/agent/src/executors/supabase-executor.ts, 신규 monffy/apps/agent/src/agents/narrator.ts,

monffy/apps/agent/src/core/brain.ts. 기대효과: A2A coordination 점수 확보.

5\. 온체인/에이전트 활동 증거 시각화 패널 추가. 6-8시간. 수정: monffy/apps/web/src/app/agent/page.tsx, 신

규 monffy/apps/web/src/components/ActivityProofPanel.tsx. 기대효과: “Actually works”와 “Pushes

boundaries” 동시 강화.

\[5\] 제출 패키지 체크리스트(데모 URL, 영상, README, 테스트, 라이선스 등)

\- 데모 URL: 있음(README에 명시) monffy/README.md:7

\- 에이전트 피드 URL: 있음 monffy/README.md:7

\- 데모 영상: 없음(추가 필요)

\- README: 있음(설계/실행 방법 포함) monffy/README.md

\- 원클릭 실행: 없음(다중 의존성 \+ 지갑/체인 필요)

\- 테스트: 계약 테스트는 언급됨, 에이전트 테스트는 없음 monffy/README.md:245-252

\- 라이선스: 루트 프로젝트 라이선스 없음(오픈소스 서브모듈만 존재)

\- 배포/컨트랙트 주소: 있음 monffy/README.md:30-38

원하면 위 Top 5 중 1\~2개부터 바로 수정 제안까지 이어서 진행하겠습니다.

\=======

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• 1\) 감사 결과 (코드 근거 기반 상세 리포트)

아래는 실제 소스(monffy/packages/contracts/src) 기준입니다.

\[CRITICAL\] 오라클 무검증 \+ 임의 결과 확정 가능

\- 파일: src/MicroMarket.sol:111, src/MicroMarket.sol:118, src/MicroMarket.sol:14

\- 근거: resolveMarket(uint256 marketId, int64 finalPrice)가 onlyOwner이고, finalPrice를 외부 입력으로 그대로 사용합니

다. pythOracle 변수는 저장만 되고 검증 호출이 전혀 없습니다.

\- 영향: 오너가 시장 결과를 임의로 조작 가능(정산 무결성 붕괴).

\- 재현:

1\. 오너가 시장 생성 후 특정 방향에 베팅 유도.

2\. 만기 후 오너가 원하는 finalPrice를 넣어 resolveMarket.

3\. 선택된 방향만 승리 처리됨.

\[CRITICAL\] withdrawFees가 “수수료”가 아니라 컨트랙트 전액 인출

\- 파일: src/MicroMarket.sol:157

\- 근거: owner().call{value: address(this).balance}("")로 잔액 전체 송금. 사용자 원금/당첨금과 프로토콜 수수료를 분리

추적하지 않음.

\- 영향: 오너가 즉시 전체 풀 인출 가능(실질적 rug vector). 이후 claim 실패 가능.

\- 재현:

1\. 유저들이 베팅해 컨트랙트 잔액 증가.

2\. 오너가 withdrawFees() 호출.

3\. 컨트랙트 잔액 0, 이후 승자가 claim 시 송금 실패.

\[HIGH\] 수수료율 시점 조작(사후 변경)

\- 파일: src/MicroMarket.sol:166, src/MicroMarket.sol:145

\- 근거: 수수료(protocolFee)가 시장별로 고정되지 않고 claim 시점 값 사용.

\- 영향: 베팅 종료/만기 이후 오너가 수수료 상향(최대 5%) 후 청구 시점에 적용 가능.

\- 재현:

1\. 유저 베팅 완료.

2\. 오너가 setProtocolFee(500) 호출.

3\. 승자 claim 시 높은 수수료 적용.

\[MED\] 모니터링 불충분한 관리자 이벤트 누락

\- 파일: src/MicroMarket.sol:157, src/MicroMarket.sol:166, src/MicroMarket.sol:174, src/MonffyBadge.sol:93

\- 근거: withdrawFees, setProtocolFee, setPythOracle 이벤트 없음. mintBatch는 개별 BadgeMinted 미발행.

\- 영향: 오프체인 감시/포렌식/알람 구성 어려움.

\[LOW\] 배지 민터 권한 입력 검증 약함(제로주소 허용)

\- 파일: src/MonffyBadge.sol:59

\- 근거: addMinter(address(0)) 방지 없음.

\- 영향: 직접적 탈취는 아니지만 운영 실수/권한 관리 품질 저하.

\[INFO\] EIP-712 서명 검증 경로 자체가 없음

\- 파일: src/MonffyBadge.sol, src/MicroMarket.sol, src/ClawLog.sol

\- 근거: ECDSA/EIP-712 검증 로직, nonce, deadline, domain separator 미구현.

\- 의미: “서명 기반 승인/민팅/스폰서 등록” 설계를 기대했다면 현재는 전부 온체인 권한자 신뢰 모델입니다.

———

역할: 당신은 Solidity 보안 감사자입니다.

목표:

\- 컨트랙트 취약점/권한/경제적 공격/재진입/승인/서명 검증(EIP-712) 위험을 찾고,

\- "해커톤 제출용 최소 보안 기준"과 "프로덕션 기준"을 분리해 제안하세요.

작업:

1\) contracts/ 이하를 전부 읽고, 다음을 체크하세요:

   \- AccessControl/Owner 권한이 과도하지 않은가?

   \- 민팅/스폰서 등록/수수료 분배가 조작될 여지가 없는가?

   \- reentrancy/unchecked call/erc777 hook/withdraw 패턴 위험

   \- 이벤트 로그가 충분해서 모니터링 가능한가?

2\) Foundry 테스트가 부족한 부분을 추가하세요:

   \- 실패 케이스(권한 없음/만료/잘못된 서명/중복 민팅)

   \- fuzz/invariant 테스트 2개 이상

3\) 결과는 아래 포맷으로 출력하세요:

   \- \[CRITICAL/HIGH/MED/LOW\] 취약점 목록 \+ 파일경로 \+ 라인 \+ 재현 방법

   \- 권장 패치(유니파이드 diff)

   \- 테스트 추가 PR 제안(파일/테스트명/시나리오)

추측하지 말고, 반드시 코드 근거로 말하세요.

해커톤 제출용 최소 보안 기준 vs 프로덕션 기준

해커톤 최소 기준(필수):

1\. resolveMarket에서 오너 임의 finalPrice 제거(실오라클 읽기 또는 최소한 commit/reveal).

2\. withdrawFees를 누적 수수료만 인출하도록 변경.

3\. 시장별 수수료 스냅샷(feeBpsAtCreate) 고정.

4\. 관리자 액션 이벤트 추가(ProtocolFeeUpdated, PythOracleUpdated, FeesWithdrawn).

5\. 실패 케이스 테스트 추가(무권한/만료/중복/잘못된 서명 시나리오는 현재 서명 미구현이므로 “미지원” 명시 테스트).

프로덕션 기준(권장):

1\. Pyth 공식 인터페이스 연동 \+ freshness/staleness 검증 \+ 가격 신뢰도(confidence) 기준.

2\. AccessControl로 역할 분리(OWNER, RESOLVER, TREASURY, PAUSER).

3\. 긴급정지(Pausable) \+ 시장 취소/환불 플로우.

4\. 수학/정산 invariant 테스트 및 포크 테스트.

5\. 서명기반 기능 도입 시 EIP-712 \+ nonce \+ deadline \+ 체인/컨트랙트 도메인 고정.

———

2\) 그래서 문제가 뭔지 / 지금 제가 시도하려던 것

문제 핵심:

1\. 시장 결과와 자금 흐름이 “오너 단일 키”에 과도하게 의존.

2\. 사용자 자금과 프로토콜 수익이 회계적으로 분리되지 않음.

3\. 테스트가 MonffyBadge 일부만 있고 MicroMarket 보안 회귀 방지가 사실상 없음.

제가 시도하려던 작업(코드 반영 전 초안):

1\. MicroMarket 패치

\- resolveMarket(marketId, finalPrice) → resolveMarket(marketId)로 변경, 온체인 오라클 조회로 결과 계산.

\- protocolFeesAccrued 누적 후 withdrawFees는 이 값만 출금.

\- createMarket 시 feeBpsAtCreate 저장, claim은 해당 값 사용.

\- 관리자 함수 이벤트 추가.

2\. 테스트 추가(Foundry)

\- test/MicroMarket.t.sol: 무권한 호출, 만료 전/후, 중복 클레임, 오너 전액출금 차단.

\- test/MicroMarketFuzz.t.sol: fuzz 1개 \+ invariant 1개 이상.

\- test/MonffyBadge.t.sol 보강: 무권한 민팅/배치 민팅 이벤트/잘못된 배지ID.

———

3\) 실제 파일 추가 전 검토용 권장 패치(유니파이드 diff 초안)

diff \--git a/src/MicroMarket.sol b/src/MicroMarket.sol

@@

contract MicroMarket is Ownable, ReentrancyGuard {

\- address public pythOracle;

\+ address public pythOracle;

\+ uint256 public protocolFeesAccrued;

@@

struct Market {

@@

\+ uint16 feeBpsAtCreate;

}

@@

\+ event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);

\+ event PythOracleUpdated(address indexed oldOracle, address indexed newOracle);

\+ event FeesWithdrawn(address indexed to, uint256 amount);

@@

function createMarket(...) external onlyOwner returns (uint256 marketId) {

@@

\+ feeBpsAtCreate: uint16(protocolFee)

});

@@

\- function resolveMarket(uint256 marketId, int64 finalPrice) external onlyOwner {

\+ function resolveMarket(uint256 marketId) external onlyOwner {

\+ int64 finalPrice \= \_readPythPrice(markets\[marketId\].priceId);

@@

function claim(uint256 marketId) external nonReentrant {

@@

\- uint256 fee \= (grossWinnings \* protocolFee) / FEE\_DENOMINATOR;

\+ uint256 fee \= (grossWinnings \* market.feeBpsAtCreate) / FEE\_DENOMINATOR;

\+ protocolFeesAccrued \+= fee;

@@

function withdrawFees() external onlyOwner {

\- (bool success, ) \= owner().call{value: address(this).balance}("");

\+ uint256 amount \= protocolFeesAccrued;

\+ protocolFeesAccrued \= 0;

\+ (bool success, ) \= owner().call{value: amount}("");

require(success, "Withdraw failed");

\+ emit FeesWithdrawn(owner(), amount);

}

@@

function setProtocolFee(uint256 newFee) external onlyOwner {

require(newFee \<= 500, "Fee too high");

\+ uint256 old \= protocolFee;

protocolFee \= newFee;

\+ emit ProtocolFeeUpdated(old, newFee);

}

@@

function setPythOracle(address \_pythOracle) external onlyOwner {

\+ address old \= pythOracle;

pythOracle \= \_pythOracle;

\+ emit PythOracleUpdated(old, \_pythOracle);

}

diff \--git a/test/MicroMarket.t.sol b/test/MicroMarket.t.sol

new file mode 100644

\+// 시나리오:

\+// \- test\_Revert\_NonOwnerCannotResolve

\+// \- test\_Revert\_ClaimBeforeResolve

\+// \- test\_Revert\_DoubleClaim

\+// \- test\_WithdrawFees\_OnlyAccruedFees

\+// \- test\_FeeSnapshot\_NotAffectedByLaterUpdate

diff \--git a/test/MicroMarketInvariant.t.sol b/test/MicroMarketInvariant.t.sol

new file mode 100644

\+// invariant 1: totalClaimed \+ protocolFeesAccrued \<= totalDeposited

\+// invariant 2: claimed(user, market) \=\> second claim always reverts

현재 상태:

\- 실제 파일 수정은 아직 하지 않았습니다.

\- 원하시면 위 초안을 기준으로 제가 바로 코드/테스트까지 적용하고 forge test 결과까지 정리해 드리겠습니다.

역할: 당신은 Agent Reliability Engineer(SRE)입니다.

컨텍스트:  
\- 이 프로젝트는 에이전트가 온체인 tx를 보내며, 로그상 nonce 충돌/WARN/가격조회 실패가 발생할 수 있습니다.  
\- Monad는 gas used가 아니라 gas limit 기준 과금될 수 있어 gasLimit 최적화가 중요합니다.

목표:  
1\) nonce 관리/tx 재시도/중복 실행(idempotency)/크론 중복 실행 방지(lock) 설계를 점검하세요.  
2\) gasLimit 설정을 "estimateGas 기반 \+ 단계적 증가" 방식으로 고치세요.  
3\) 잔액 부족/429/가격 API 장애 시 graceful degradation 전략을 제안하세요.  
4\) 결과는:  
   \- 문제 목록(증상/원인/영향)  
   \- 우선순위(P0/P1/P2)  
   \- 코드 패치(diff) \+ 테스트/시뮬레이션 방법  
형식으로 주세요.

• 롤백 완료: 제가 수정했던 monffy/apps/agent/src/utils/types.ts는 원복됐고 현재 해당 파일 git diff는 없습니다.

  문제 목록 (증상 / 원인 / 영향 / 우선순위)

  1\. P0 Nonce 충돌 가능

  \- 증상: 간헐적 nonce too low, replacement transaction underpriced, already known.  
  \- 원인: 큐가 프로세스 내부 Promise 체인만 사용 (monffy/apps/agent/src/utils/tx-manager.ts:20, monffy/apps/  
    agent/src/utils/tx-manager.ts:67), 분산/재시작 시 nonce 상태 없음.  
  \- 영향: tx 유실, 동일 작업 재실행, 상태 불일치.

  2\. P0 tx 재시도 정책 부재

  \- 증상: 일시적 RPC 실패/429 때 즉시 실패.  
  \- 원인: enqueueTx는 실패 시 null 반환만 하고 재시도 없음 (monffy/apps/agent/src/utils/tx-manager.ts:75\~81).  
  \- 영향: create/resolve 누락, 운영 안정성 저하.

  3\. P0 고정 gasLimit 과금 리스크

  \- 증상: Monad 특성상 과다 gasLimit 비용 낭비.  
  \- 원인: gas를 상수로 고정 (monffy/apps/agent/src/executors/market-executor.ts:38, 80, 121).  
  \- 영향: 비용 과다, 잔액 소진 가속.

  4\. P0 Brain tick 중복 실행 가능

  \- 증상: 동일 시점에 create/resolve 중복 실행 가능.  
  \- 원인: setInterval(async ...)에 re-entrancy guard 없음 (monffy/apps/agent/src/index.ts:50).  
  \- 영향: idempotency 깨짐, 중복 tx/중복 DB write.

  5\. P0 idempotency 키/유니크 제약 부재

  \- 증상: 동일 시그널/동일 만료 질문 중복 생성.  
  \- 원인: questions에 실행키 unique 없음, insertQuestion도 단순 insert (monffy/apps/agent/src/executors/  
    supabase-executor.ts:17).  
  \- 영향: 중복 시장 생성, 통계 오염.

  6\. P1 크론/멀티 인스턴스 락 부재

  \- 증상: 2개 프로세스 동시 구동 시 동시 실행.  
  \- 원인: 분산 락(예: Postgres advisory lock/lease table) 없음.  
  \- 영향: nonce 충돌, 중복 실행.

  7\. P1 가격 API 장애 시 잘못된 graceful degradation

  \- 증상: MON/USD 실패 시 ETH/BTC로 대체해 MON 시장 로직 진행.  
  \- 원인: fetchPriceWithFallback가 자산 전환 fallback (monffy/apps/agent/src/utils/pyth-client.ts:72\~98).  
  \- 영향: 잘못된 strike/resolution, 비즈니스 정확성 훼손.

  8\. P1 429/레이트리밋 처리 미흡

  \- 증상: burst 시 가격 조회/tx 전송 실패 증가.  
  \- 원인: fetch에 재시도/지수백오프/jitter 없음 (monffy/apps/agent/src/utils/pyth-client.ts:42\~48).  
  \- 영향: 신호 누락, resolution 지연.

  9\. P1 잔액 부족 대응이 단순 pause

  \- 증상: pause 후 자동 복구 외 대체 전략 부족.  
  \- 원인: ensureSufficientBalance는 skip만 수행 (monffy/apps/agent/src/utils/tx-manager.ts:31\~43).  
  \- 영향: resolve 지연 누적, 미해결 market 증가.

  10\. P2 코드 안정성 이슈 (컴파일/로깅 문자열 깨짐)

  \- 증상: 템플릿 문자열 깨짐.  
  \- 원인: brain.ts 문자열 구문 손상 (monffy/apps/agent/src/core/brain.ts:247).  
  \- 영향: 빌드 실패 가능, 런타임 리스크.

  ———

  제안 설계 (코드 수정 없이 제안만)

  1\. Nonce/재시도/중복 방지

  \- 단일 tx 송신 함수로 통합: estimateGas \-\> nonce 할당 \-\> write \-\> receipt.  
  \- nonce 소스: pending nonce 캐시 \+ 실패 시 강제 재동기화.  
  \- 재시도: nonce too low, 429, timeout, temporarily unavailable만 지수백오프 재시도.  
  \- idempotency key: action\_type \+ feed\_id \+ window\_start \+ strike\_price 해시를 DB unique.  
  \- create/resolve 전 사전조회: 이미 실행된 key면 skip.  
  \- tick lock: 프로세스 내 isTickRunning.  
  \- 분산 lock: Supabase(Postgres) lease row (locked\_until, owner\_id) heartbeat 갱신.

  2\. gasLimit 최적화 (Monad 맞춤)

  \- 각 tx마다 estimateContractGas 실행.  
  \- gasLimit \= max(fallbackMin, estimate \* 1.12).  
  \- 실패 시 단계적 증가: \+12%씩 최대 3\~4회.  
  \- 메트릭 기록: estimate, sentGasLimit, gasUsed, ratio(gasLimit/gasUsed).

  3\. graceful degradation

  \- 잔액 부족:  
      \- create 중지, resolve 우선 모드(필수 tx만).  
      \- DB에 degraded\_mode=LOW\_BALANCE 기록 및 알림.  
  \- 429:  
      \- price/tx 모두 jitter 백오프.  
      \- 일정 횟수 초과 시 폴링 간격 자동 증가.  
  \- 가격 API 장애:  
      \- 타 자산 fallback 금지(ETH/BTC 전환 금지).  
      \- 마지막 MON 가격을 TTL(예: 60초) 내에서만 stale 허용, 초과 시 create 중지 \+ resolve 보류 큐.

  ———

  제안 Diff (미적용, 참고용)

  \--- a/apps/agent/src/utils/tx-manager.ts  
  \+++ b/apps/agent/src/utils/tx-manager.ts  
  @@  
  \+export async function sendContractWithRetry(...) {  
  \+  // 1\) estimateGas with \+12% buffer  
  \+  // 2\) allocate nonce from pending nonce cache  
  \+  // 3\) writeContract(gas, nonce)  
  \+  // 4\) retriable errors only \-\> exponential backoff \+ nonce resync  
  \+}

  \--- a/apps/agent/src/index.ts  
  \+++ b/apps/agent/src/index.ts  
  @@  
  \+let isTickRunning \= false;  
   setInterval(async () \=\> {  
  \+  if (isTickRunning) return;  
  \+  isTickRunning \= true;  
     try { await brain.tick(); }  
  \+  finally { isTickRunning \= false; }  
   }, config.BRAIN\_TICK\_INTERVAL\_MS);

  \--- a/apps/agent/src/utils/pyth-client.ts  
  \+++ b/apps/agent/src/utils/pyth-client.ts  
  @@  
  \-export async function fetchPriceWithFallback() {  
  \-  // MON 실패시 ETH/BTC fallback  
  \-}  
  \+export async function fetchMonPriceWithDegrade() {  
  \+  // MON only, retry on 429/timeout  
  \+  // optional stale cache within TTL  
  \+  // no cross-asset fallback  
  \+}

  \--- a/supabase/agent-schema.sql  
  \+++ b/supabase/agent-schema.sql  
  @@  
  \+ALTER TABLE questions ADD COLUMN IF NOT EXISTS idempotency\_key TEXT;  
  \+CREATE UNIQUE INDEX IF NOT EXISTS uq\_questions\_idempotency\_key  
  \+  ON questions(idempotency\_key)  
  \+  WHERE idempotency\_key IS NOT NULL;  
  \+  
  \+CREATE TABLE IF NOT EXISTS agent\_locks (  
  \+  lock\_name TEXT PRIMARY KEY,  
  \+  owner\_id TEXT NOT NULL,  
  \+  locked\_until TIMESTAMPTZ NOT NULL,  
  \+  updated\_at TIMESTAMPTZ DEFAULT NOW()  
  \+);

  ———

  테스트/시뮬레이션 방법 (제안)

  1\. Nonce 충돌 테스트

  \- 동일 키로 에이전트 2개 동시 실행.  
  \- 기대: 1개만 락 획득, 다른 인스턴스는 create/resolve 미실행.

  2\. tx 재시도 테스트

  \- RPC mock으로 1\~2회 429/timeout 후 성공 응답.  
  \- 기대: 지수백오프 후 성공, 중복 tx 없음.

  3\. gasLimit 최적화 검증

  \- create/resolve 100회 샘플에서 gasLimit/gasUsed 분포 수집.  
  \- 목표: 기존 대비 평균 ratio 유의미 하락.

  4\. 잔액 부족 시나리오

  \- 잔액 임계치 이하 지갑으로 실행.  
  \- 기대: create 중단, resolve 우선 또는 큐 적재, 상태 LOW\_BALANCE 기록.

  5\. 가격 API 장애 시나리오

  \- MON feed 5xx/429 연속 주입.  
  \- 기대: 타 자산 전환 없이 stale TTL 내 동작, TTL 초과 시 안전 정지.

  원하시면 다음 답변에서 “실제 적용 없이” 위 제안을 기준으로 PR 템플릿 형태(체크리스트 \+ 장애대응 Runbook)로 정  
  리해드리겠습니다.

역할: 당신은 Supabase/Postgres 보안 전문가입니다.

목표:  
\- RLS 정책 누락/약함, 이벤트 스팸, 데이터 위변조 가능성을 찾고,  
\- "지갑 기반 서비스"에서 최소한의 무결성 레이어를 제안하세요.

작업:  
1\) schema.sql, migrations, API routes에서 DB 쓰기 경로를 전부 찾아 목록화하세요.  
2\) 테이블별로 RLS 정책이 필요한지 판단하고, 필요한 정책 SQL을 제시하세요.  
3\) events/responses에 대한 rate limiting/서명 검증/봇 방어 전략을 제안하세요.  
4\) 결과는:  
   \- 테이블별 위험도  
   \- 권장 RLS SQL  
   \- API 수정사항(diff 또는 의사코드)  
로 주세요.

• 코드 수정은 하지 않았고, 롤백할 변경도 없습니다. 현재 워크트리 변경은 기존 상태(monffy/.gitignore, monffy/CLAUDE.md,  
  monffy/nul)만 확인됐습니다.

  1\) DB 쓰기 경로 전수 목록  
  프로젝트에서 확인된 “실제 DB write 경로”는 아래입니다.

  \- questions INSERT: monffy/apps/agent/src/executors/supabase-executor.ts:18  
  \- questions UPDATE(예측값/해결/내러티브): monffy/apps/agent/src/executors/supabase-executor.ts:47, monffy/apps/agent/  
    src/executors/supabase-executor.ts:68, monffy/apps/agent/src/executors/supabase-executor.ts:112  
  \- responses UPDATE(정답/포인트 일괄반영): monffy/apps/agent/src/executors/supabase-executor.ts:86, monffy/apps/agent/  
    src/executors/supabase-executor.ts:92  
  \- agent\_stats UPSERT/UPDATE: monffy/apps/agent/src/executors/supabase-executor.ts:188, monffy/apps/agent/src/  
    executors/supabase-executor.ts:251, monffy/apps/agent/src/executors/supabase-executor.ts:256  
  \- agent\_actions INSERT: monffy/apps/agent/src/executors/supabase-executor.ts:264  
  \- 마이그레이션성 write(rpc('exec\_sql')): monffy/apps/agent/src/utils/run-migration.ts:75, monffy/apps/agent/src/utils/  
    run-migration.ts:135

  참고:

  \- agent는 서비스 키로 접속 중(monffy/apps/agent/src/utils/supabase-client.ts:6), service role은 RLS 우회.  
  \- 웹(anon key)은 현재 조회 중심이며 응답 제출은 TODO 상태(monffy/apps/web/src/components/QuestionCard.tsx:51).  
  \- apps/web/src/app 하위 API route 파일(route.ts)은 없음.

  2\) 테이블별 위험도 리포트  
  | 테이블 | 위험도 | 문제 |  
  |---|---|---|  
  | responses | 높음 | SELECT USING (true), INSERT WITH CHECK (true)로 지갑 위장/스팸/무결성 훼손 가능 (monffy/supabase/  
  schema.sql:211, monffy/supabase/schema.sql:217) |  
  | daily\_streaks | 높음 | 전원 조회 허용(USING true)으로 지갑 활동 데이터 노출 (monffy/supabase/schema.sql:226) |  
  | daily\_metrics | 높음 | RLS 자체 미적용 (monffy/supabase/schema.sql:85 존재, RLS enable 없음) |  
  | questions | 중간 | 조회 정책이 is\_active=true만 허용해 해결된 내러티브 조회 요구와 충돌 가능 (monffy/supabase/  
  schema.sql:206, monffy/apps/web/src/app/agent/page.tsx:79) |  
  | sponsors | 낮음 | active 공개 정책은 합리적 (monffy/supabase/schema.sql:221) |  
  | badges | 중간 | 전체 공개 정책, 개인정보 관점에서 최소화 검토 필요 (monffy/supabase/schema.sql:231) |  
  | leaderboard | 낮음 | 공개 의도와 일치 (monffy/supabase/schema.sql:236) |  
  | agent\_stats/agent\_actions/agent\_narratives | 낮음 | 읽기 전용 공개 \+ 쓰기는 service role로만 수행 (monffy/supabase/  
  agent-schema.sql:61) |

  핵심 취약점 요약

  \- responses는 현재 “누가 어떤 지갑으로도 insert 가능” 구조입니다.  
  \- 지갑 기반 서비스에서 반드시 필요한 서명검증/nonce/replay 방지 계층이 없습니다.  
  \- daily\_metrics는 RLS 누락으로 권한 오픈 리스크가 큽니다.

  3\) 권장 RLS SQL (제안안)

  \-- 0\) 공통: RLS 강제  
  alter table public.questions enable row level security;  
  alter table public.responses enable row level security;  
  alter table public.sponsors enable row level security;  
  alter table public.daily\_streaks enable row level security;  
  alter table public.badges enable row level security;  
  alter table public.leaderboard enable row level security;  
  alter table public.daily\_metrics enable row level security;  
  alter table public.agent\_stats enable row level security;  
  alter table public.agent\_actions enable row level security;  
  alter table public.agent\_narratives enable row level security;

  \-- 1\) 기존 과도 개방 정책 제거  
  drop policy if exists "Users can view own responses" on public.responses;  
  drop policy if exists "Users can insert own responses" on public.responses;  
  drop policy if exists "Users can view all streaks" on public.daily\_streaks;  
  drop policy if exists "Questions are viewable by everyone" on public.questions;

  \-- 2\) questions: active \+ (해결 내러티브 공개분)만 조회 허용  
  create policy "questions\_public\_read"  
  on public.questions  
  for select  
  to anon, authenticated  
  using (  
    is\_active \= true  
    or (lane \= 'prediction' and resolved\_at is not null and agent\_narrative is not null)  
  );

  \-- 3\) responses: 본인 지갑만 조회/삽입, 삽입 시 무결성 조건 강제  
  create policy "responses\_read\_own"  
  on public.responses  
  for select  
  to authenticated  
  using (lower(wallet\_address) \= lower(coalesce(auth.jwt() \-\>\> 'wallet\_address', '')));

  create policy "responses\_insert\_own\_strict"  
  on public.responses  
  for insert  
  to authenticated  
  with check (  
    lower(wallet\_address) \= lower(coalesce(auth.jwt() \-\>\> 'wallet\_address', ''))  
    and is\_correct is null  
    and points\_earned \= 0  
    and exists (  
      select 1  
      from public.questions q  
      where q.id \= responses.question\_id  
        and q.is\_active \= true  
        and (q.expires\_at is null or q.expires\_at \> now())  
        and responses.selected\_option \>= 0  
        and responses.selected\_option \< jsonb\_array\_length(q.options)  
    )  
  );

  \-- 4\) daily\_streaks: 본인만 조회  
  create policy "daily\_streaks\_read\_own"  
  on public.daily\_streaks  
  for select  
  to authenticated  
  using (lower(wallet\_address) \= lower(coalesce(auth.jwt() \-\>\> 'wallet\_address', '')));

  \-- 5\) sponsors/leaderboard/badges: 공개 범위 의도 유지  
  \-- 필요 시 badges도 본인만으로 축소 가능  
  \-- create policy ... on badges for select using (lower(wallet\_address)=...)

  \-- 6\) daily\_metrics: 공개 조회만, 쓰기는 서비스만  
  create policy "daily\_metrics\_read"  
  on public.daily\_metrics  
  for select  
  to anon, authenticated  
  using (true);

  \-- 7\) authenticated의 직접 쓰기 차단(방어 심화)  
  revoke insert, update, delete on public.questions from anon, authenticated;  
  revoke update, delete on public.responses from anon, authenticated;  
  revoke insert, update, delete on public.daily\_streaks from anon, authenticated;  
  revoke insert, update, delete on public.daily\_metrics from anon, authenticated;  
  revoke insert, update, delete on public.agent\_stats from anon, authenticated;  
  revoke insert, update, delete on public.agent\_actions from anon, authenticated;  
  revoke insert, update, delete on public.agent\_narratives from anon, authenticated;

  4\) events/responses 방어 전략 \+ API 수정 제안(의사코드)  
  현재 API route가 없으므로, 최소 무결성 레이어는 “서명 \+ nonce \+ rate limit \+ 봇 방어”를 API로 넣는 방식이 가장 안전합  
  니다.

  \+ apps/web/src/app/api/auth/nonce/route.ts  
  \+ apps/web/src/app/api/responses/route.ts  
  \+ apps/web/src/lib/security/rate-limit.ts  
  \+ apps/web/src/lib/security/verify-wallet.ts

  /api/auth/nonce:

  \- 입력: walletAddress  
  \- 처리:

  1\. IP 기준 10회/10분 제한  
  2\. wallet 기준 5회/10분 제한  
  3\. 1회용 nonce 발급(만료 5분), DB 저장(used\_at is null)

  /api/responses:

  \- 입력: questionId, selectedOption, walletAddress, nonce, signature, captchaToken  
  \- 처리:

  1\. IP 20회/분, wallet 6회/분, (wallet+question) 2회/10분  
  2\. Turnstile/hCaptcha 검증(위험 점수 높을 때 필수)  
  3\. EIP-4361/개인 메시지 서명 검증  
  4\. nonce 미사용/TTL 확인 후 즉시 used\_at=now()  
  5\. service role로 responses insert (is\_correct=null, points\_earned=0 고정)  
  6\. 중복/재전송은 409로 종료

  추가 권장:

  \- responses.wallet\_address는 소문자 정규화 저장.  
  \- UNIQUE(question\_id, wallet\_address) 유지 \+ API에서 먼저 idempotency key 체크.  
  \- 에이전트가 채점 시에도 DB 함수(RPC)로만 반영해 감사로그 남기기.

  원하시면 다음 턴에서 “실행 순서 기준(즉시/1주/1달)”로 우선순위 보안 로드맵만 따로 정리해드리겠습니다.

역할: 당신은 오라클/시장데이터 엔지니어입니다.

목표:  
\- Pyth(Hermes) 호출 구조를 점검하고,  
\- rate limit, 캐시, 백오프, 정산 타이밍의 데이터 무결성(종가/스냅샷)을 설계하세요.

작업:  
1\) 가격조회 코드 위치를 찾아 호출 빈도/캐시 유무/실패 처리 로직을 분석하세요.  
2\) "UI 표시용" vs "정산용"을 분리하는 구조를 제안하세요.  
3\) 가격 조작/급등락/TWAP 필요성 여부를 평가하세요.  
4\) 결과는:  
   \- 현재 구조 진단  
   \- 개선 설계(다이어그램/의사코드)  
   \- 코드 수정(diff)  
로 주세요.

요청대로 코드 수정 없이, 현재 구조의 문제 리포트와 개선 제안만 정리합니다.

  현재 구조 진단

  \- 가격 조회 엔트리: monffy/apps/agent/src/utils/pyth-client.ts:36, monffy/apps/agent/src/monitors/price-monitor.ts:77,  
    monffy/apps/agent/src/core/brain.ts:191  
  \- 호출 주기:

  1\. 모니터링 5초마다 (monffy/apps/agent/src/config.ts:53, monffy/apps/agent/src/monitors/price-monitor.ts:126)  
  2\. 브레인 루프 10초마다 (monffy/apps/agent/src/config.ts:54, monffy/apps/agent/src/index.ts:50)  
  3\. 정산 시점마다 별도 호출 (monffy/apps/agent/src/core/brain.ts:191)

  \- 캐시: 없음 (매 호출 Hermes 직접 hit)  
  \- 백오프/재시도/429 처리: 없음 (실패 시 즉시 error 로그만, monffy/apps/agent/src/monitors/price-monitor.ts:113)  
  \- 실패 처리:

  1\. 모니터링은 MON \-\> ETH \-\> BTC fallback (monffy/apps/agent/src/utils/pyth-client.ts:72)  
  2\. 정산도 동일 fallback 사용 (monffy/apps/agent/src/core/brain.ts:191)

  상세 문제 리포트 (심각도순)

  1\. Critical: 정산 자산 불일치 가능성

  \- 문제: 정산이 q.pyth\_price\_id를 쓰지 않고 fetchPriceWithFallback() 사용.  
  \- 결과: MON 질문 정산에 ETH/BTC 가격이 들어갈 수 있음.  
  \- 근거: monffy/apps/agent/src/core/brain.ts:191, monffy/apps/agent/src/utils/pyth-client.ts:72

  2\. High: 종가(만기 시점) 무결성 부재

  \- 문제: 만기 후 첫 루프 시점의 “현재가”로 정산. 만기 시점 스냅샷이 아님.  
  \- 결과: 브레인 틱 지연(최대 tick 간격 \+ 네트워크 지연)만큼 종가 왜곡.  
  \- 근거: monffy/apps/agent/src/executors/supabase-executor.ts:145, monffy/apps/agent/src/core/brain.ts:191

  3\. High: stale/confidence 검증 없음

  \- 문제: publishTime, confidence를 정산 승인 조건으로 사용하지 않음.  
  \- 결과: 오래된 가격이나 신뢰구간 큰 급변 데이터로 정산 가능.  
  \- 근거: monffy/apps/agent/src/utils/pyth-client.ts:57, monffy/apps/agent/src/core/brain.ts:191

  4\. High: rate limit/백오프/재시도 부재

  \- 문제: 폴링 기반 다중 호출 \+ 실패 즉시 재시도 없이 다음 tick 재호출.  
  \- 결과: 장애 시 불안정, 429/5xx에서 회복력 낮음.  
  \- 근거: monffy/apps/agent/src/monitors/price-monitor.ts:126, monffy/apps/agent/src/utils/pyth-client.ts:42

  5\. Medium: 동시성 중복 정산 위험

  \- 문제: setInterval(async)에 re-entrancy 가드 없음(브레인/모니터 공통).  
  \- 결과: 동일 만기 건을 중복 처리 시도 가능.  
  \- 근거: monffy/apps/agent/src/index.ts:50, monffy/apps/agent/src/monitors/price-monitor.ts:126

  6\. Medium: 정산 감사추적 부족

  \- 문제: DB에 최종 가격/스냅샷(가격, publish\_time, conf, source, hash) 저장 안 함.  
  \- 결과: 사후 검증/분쟁 대응 어려움.  
  \- 근거: monffy/apps/agent/src/executors/supabase-executor.ts:69, monffy/supabase/schema.sql:24

  ———

  개선 설계 제안  
  요지: UI 표시용과 정산용을 완전히 분리.

  \[Hermes\]  
     |  
     \+--\> DisplayPriceService (저지연, 캐시/허용 fallback)  
     |       \- TTL 1\~2s  
     |       \- stale 허용 \+ 라벨 표시  
     |       \- 429/5xx 백오프  
     |  
     \+--\> SettlementPriceService (엄격, 캐시 미사용, 단일 feed 고정)  
             \- market.feed\_id 강제  
             \- publish\_time/conf/staleness 검증  
             \- snapshot 영속화(불변)  
             \- 그 snapshot으로만 onchain/db resolve

  정산 정책 제안

  1\. feed 고정: market.pyth\_price\_id 외 대체 feed 금지  
  2\. 시간 고정: 만기 기준점 T\_expire를 명시  
  3\. 데이터 품질:

  \- publish\_time가 T\_expire ± grace 범위  
  \- now \- publish\_time \<= max\_staleness  
  \- confidence/price \<= conf\_ratio\_limit

  4\. 정산 방식:

  \- 기본: close-at-expiry (만기 인접 샘플 1개)  
  \- 권장: TWAP(30\~60초) 또는 median(마감 전후 N개) 중 선택 가능

  5\. 스냅샷 불변 저장 후 정산:

  \- settlement\_snapshots(market\_id unique, feed\_id, price, conf, publish\_time, fetched\_at, source, response\_hash)

  의사코드

  async function resolveMarket(marketId: string) {  
    const market \= await loadMarket(marketId); // includes pyth\_price\_id, expires\_at  
    const lock \= await claimMarketForResolution(marketId); // idempotent  
    if (\!lock) return;

    const snap \= await settlementPriceService.getSnapshot({  
      feedId: market.pyth\_price\_id,  
      expiry: market.expires\_at,  
      mode: "TWAP\_30S" // or CLOSE  
    }); // strict validation, no cross-feed fallback

    await saveSnapshotImmutable(marketId, snap);

    const outcome \= snap.finalPrice \> market.strike\_price;  
    await resolveOnchainWithSnapshot(market.onchain\_market\_id, snap.finalPriceScaled);  
    await resolveOffchainWithSnapshot(marketId, outcome, snap);  
  }

  ———

  가격 조작/급등락/TWAP 필요성 평가

  \- Pyth 자체가 다중 소스 집계라 단일 DEX spot보다 조작 저항성은 높습니다.  
  \- 하지만 현재 구현은 “만기 시점 고정”이 아니라 “정산 실행 시점 단일 샘플”이라, 급등락/지연에 취약합니다.  
  \- 결론:

  1\. 저위험/게임성 우선: close 유지 가능하나, publish\_time/conf/staleness 게이트는 필수  
  2\. 무결성 우선: TWAP 30\~60초 또는 median-of-N 도입 권장  
  3\. 분쟁 가능성 고려 시: snapshot 영속화는 필수

  필요하면 다음 단계로, \*\*실제 적용 전용 체크리스트(마이그레이션/런북/알람 규칙)\*\*만 별도로 작성해드리겠습니다.

역할: 당신은 Next.js \+ Web3 프론트엔드 테크리드입니다.

목표:  
\- 클라이언트 번들에 민감정보가 섞이지 않는지,  
\- XSS/CSRF/오픈리다이렉트/취약한 API 호출이 없는지,  
\- 해커톤 데모용으로 로딩/SEO/공유카드(OpenGraph)가 충분한지 점검하세요.

작업:  
1\) NEXT\_PUBLIC\_\* env 사용처를 전수 점검하고 위험을 찾으세요.  
2\) 공유(OG 이미지/카드)와 랜딩페이지 카피/CTA 흐름을 개선하세요.  
3\) 결과:  
   \- 발견 이슈(근거: 파일/라인)  
   \- 개선 PR 3개로 쪼갠 계획  
   \- 코드 패치(diff)

점검 결과는 monffy/apps/web 기준이며, 요청대로 코드 수정은 하지 않았고 아래는 리포트와 제안 diff입니다.

  발견 이슈 (근거 포함)

  1\. High \- Supabase RLS가 사실상 무제한 허용

  \- 근거: monffy/supabase/schema.sql:211, monffy/supabase/schema.sql:216, monffy/supabase/schema.sql:218  
  \- 문제: responses 정책이 USING (true), WITH CHECK (true)라서 anon 클라이언트가 임의 wallet\_address로 쓰기 가능한 구조  
    입니다.  
  \- 제안: 최소 authenticated 제약 \+ wallet claim 매핑 또는 쓰기 경로를 서버(Edge Function/API)로 강제.

  2\. Medium \- 클라이언트에서 Supabase 직접 접근 \+ 공개 키 중복 사용

  \- 근거: monffy/apps/web/src/app/agent/page.tsx:15, monffy/apps/web/src/app/agent/page.tsx:16, monffy/apps/web/src/app/  
    agent/page.tsx:17  
  \- 문제: 공개 anon key 사용 자체는 정상이나, 페이지마다 직접 client 생성/쿼리하면 추후 권한 경계가 흐려지고 오용 가능성  
    증가.  
  \- 제안: src/lib/supabase.ts 단일화 \+ 읽기 전용 데이터만 클라에서 직접 조회.

  3\. Medium \- 보안 헤더(CSP/Frame/Referrer 등) 부재

  \- 근거: monffy/apps/web/next.config.mjs:2-21 (headers 설정 없음)  
  \- 문제: XSS 완화/CSP, 클릭재킹 방지, MIME sniff 방지 등 기본 방어 미설정.  
  \- 제안: next.config.mjs에 headers() 추가.

  4\. Medium \- OG/Twitter 공유카드 정보 불충분

  \- 근거: monffy/apps/web/src/app/layout.tsx:30-42  
  \- 문제: openGraph.images, twitter.images, metadataBase, canonical 없음. 공유 시 카드 품질/일관성 저하.  
  \- 제안: 메타 보강 \+ opengraph-image.tsx/twitter-image.tsx 생성.

  5\. Low \- 랜딩 CTA 흐름이 “의미→증거→행동” 구조가 약함

  \- 근거: monffy/apps/web/src/app/page.tsx:53-75  
  \- 문제: 카피는 강하지만, 데모 관객이 바로 이해할 “How it works / proof / next action”이 부족.  
  \- 제안: 3-step 흐름(Connect → Watch Live → Verify Tx)과 보조 CTA(실거래 검증 링크) 추가.

  6\. Low \- 외부 링크 파라미터 인코딩 미적용

  \- 근거: monffy/apps/web/src/components/ActivityFeed.tsx:64  
  \- 문제: 고정 도메인이라 오픈리다이렉트는 아니지만, hash 무인코딩 삽입은 방어적으로 약함.  
  \- 제안: hash 형식 검증 \+ encodeURIComponent.

  미발견/판정

  \- XSS 직접 취약 패턴(dangerouslySetInnerHTML, eval)은 미발견.  
  \- CSRF: 현재 Next API POST 엔드포인트가 없어 전형적 CSRF 표면은 작음.  
  \- 오픈리다이렉트 직접 패턴은 미발견.

  개선 PR 3개 계획

  1\. PR-1 security-hardening

  \- RLS 정책 강화(responses), 클라이언트 링크 파라미터 검증/인코딩, 보안 헤더 추가.

  2\. PR-2 seo-og-foundation

  \- metadataBase/canonical/robots 및 OG/Twitter image 메타 완성.  
  \- opengraph-image.tsx, twitter-image.tsx, robots.ts, sitemap.ts 추가.

  3\. PR-3 landing-conversion-flow

  \- 랜딩 카피를 데모 중심 메시지로 정리.  
  \- CTA를 “Launch / Watch Proof” 2축으로 재배치.  
  \- 3-step 섹션 추가로 즉시 이해/전환 강화.

  제안 코드 패치(diff, 미적용)

  diff \--git a/monffy/supabase/schema.sql b/monffy/supabase/schema.sql  
  @@  
  \-CREATE POLICY "Users can view own responses"  
  \-ON responses FOR SELECT  
  \-USING (true);  
  \+CREATE POLICY "Users can view own responses"  
  \+ON responses FOR SELECT  
  \+USING (auth.role() \= 'authenticated');

  @@  
  \-CREATE POLICY "Users can insert own responses"  
  \-ON responses FOR INSERT  
  \-WITH CHECK (true);  
  \+CREATE POLICY "Users can insert own responses"  
  \+ON responses FOR INSERT  
  \+WITH CHECK (  
  \+  auth.role() \= 'authenticated'  
  \+  AND lower(wallet\_address) \= lower(coalesce(auth.jwt() \-\>\> 'wallet\_address', ''))  
  \+);

  diff \--git a/monffy/apps/web/next.config.mjs b/monffy/apps/web/next.config.mjs  
  @@  
   const nextConfig \= {  
     reactStrictMode: true,  
  \+  async headers() {  
  \+    return \[  
  \+      {  
  \+        source: "/(.\*)",  
  \+        headers: \[  
  \+          { key: "X-Frame-Options", value: "DENY" },  
  \+          { key: "X-Content-Type-Options", value: "nosniff" },  
  \+          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },  
  \+          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },  
  \+          {  
  \+            key: "Content-Security-Policy",  
  \+            value: "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src  
  'self'; connect-src 'self' https://\*.supabase.co https://rpc.monad.xyz https://\*.walletconnect.com;"  
  \+          }  
  \+        \]  
  \+      }  
  \+    \];  
  \+  },

  diff \--git a/monffy/apps/web/src/components/ActivityFeed.tsx b/monffy/apps/web/src/components/ActivityFeed.tsx  
  @@  
   export function ActivityItem({ type, data, hash, createdAt }: ActivityItemProps) {  
  \+    const safeHash \= hash && /^0x\[a-fA-F0-9\]{64}$/.test(hash) ? hash : null;  
  @@  
  \-                        {hash && (  
  \+                        {safeHash && (  
                               \<a  
  \-                                href={\`https://monadscan.com/tx/${hash}\`}  
  \+                                href={\`https://monadscan.com/tx/${encodeURIComponent(safeHash)}\`}

  diff \--git a/monffy/apps/web/src/app/layout.tsx b/monffy/apps/web/src/app/layout.tsx  
  @@  
   export const metadata: Metadata \= {  
  \+  metadataBase: new URL("https://monffy.vercel.app"),  
     title: "MONFFY \- Autonomous AI Agent on Monad",  
  @@  
  \+  alternates: { canonical: "/" },  
  \+  robots: { index: true, follow: true },  
     openGraph: {  
  @@  
       type: "website",  
       url: "https://monffy.vercel.app",  
  \+    images: \[{ url: "/opengraph-image", width: 1200, height: 630, alt: "MONFFY on Monad" }\],  
     },  
     twitter: {  
       card: "summary\_large\_image",  
  @@  
  \+    images: \["/twitter-image"\],  
     },  
   };

  diff \--git a/monffy/apps/web/src/app/opengraph-image.tsx b/monffy/apps/web/src/app/opengraph-image.tsx  
  new file mode 100644  
  \+import { ImageResponse } from "next/og";  
  \+export const size \= { width: 1200, height: 630 };  
  \+export const contentType \= "image/png";  
  \+export default function OGImage() {  
  \+  return new ImageResponse(  
  \+    \<div style={{ width: "100%", height: "100%", display: "flex", background: "\#0A0A14", color: "white", padding:  
  56 }}\>  
  \+      \<div style={{ fontSize: 72, fontWeight: 800 }}\>MONFFY\</div\>  
  \+      \<div style={{ fontSize: 34, opacity: 0.9 }}\>Autonomous AI Prediction Agent on Monad\</div\>  
  \+    \</div\>  
  \+  );  
  \+}

  diff \--git a/monffy/apps/web/src/app/page.tsx b/monffy/apps/web/src/app/page.tsx  
  @@  
  \-          The first autonomous AI agent on Monad. \<br className="hidden md:block" /\>  
  \-          Predicts markets, talks trash, writes history. 24/7.  
  \+          Autonomous market calls on Monad, with live action logs and verifiable tx proof.  
  @@  
  \-            Launch Terminal  
  \+            Watch Live Agent  
  @@  
  \-            Monad Ecosystem  
  \+            Verify on Monadscan

  원하시면 다음 턴에서 이 3개 PR 기준으로 실제 커밋 가능한 최소 변경 세트까지 분해해 드리겠습니다.

역할: 당신은 웹3 서비스 리스크/컴플라이언스 리뷰어입니다(법률 자문이 아니라 제품 리스크 관점).

목표:  
\- 예측/베팅 요소가 있는 서비스에서,  
\- "해커톤 데모"와 "실서비스"의 리스크를 분리해 정리하고,  
\- 최소 안전장치(지역 제한, 고지, 토큰/현금성 경계)를 제안하세요.

출력:  
\- 해커톤용(데모) 권장 범위  
\- 실서비스 전환 시 필요한 체크리스트  
\- 제품 문구(Disclaimer) 초안

• 아래는 법률 자문이 아닌 제품 리스크/컴플라이언스 관점의 상세 리포트입니다.

  \#\# 1\) 해커톤용(데모) 권장 범위

  \#\#\# 문제 리포트 A: 도박/투자 오인 리스크

  \- 예측/베팅 UX가 실제 수익 기대를 유도하면, 짧은 기간 데모라도 규제 이슈로 해석될 수 있음.  
  \- “승리 시 보상” 구조가 토큰 가치 상승 기대와 결합되면 투자성 오인 위험 증가.

  제안:

  \- 데모 단계는 완전 비금전(non-monetary) 포인트만 사용.  
  \- 포인트는 양도/거래/환급 불가, 외부 지갑 전송 불가.  
  \- “수익”, “배당”, “ROI” 표현 금지. “게임 점수/리더보드”로 한정.

  \#\#\# 문제 리포트 B: 지역 규제 충돌 리스크

  \- 일부 국가/지역은 예측시장·온라인 베팅·파생형 상품을 엄격히 제한.  
  \- 공개 URL이면 의도치 않은 지역 접근 발생.

  제안:

  \- 데모도 최소한의 지역 차단(Geo-block) 적용.  
  \- 제한 지역 접근 시 기능 비활성 \+ 안내 문구 노출.  
  \- 내부 심사/초대 링크 중심 운영(공개 배포 최소화).

  \#\#\# 문제 리포트 C: 연령/취약계층 보호 미흡

  \- 베팅형 인터랙션은 미성년자 접근/과몰입 이슈 발생 가능.

  제안:

  \- 데모 첫 화면에 18+/19+ 자기확인(현지 기준) 추가.  
  \- “오락/실험 목적, 금전 리워드 없음”을 명시.  
  \- 과도한 FOMO 문구(“지금 안 하면 손해”) 금지.

  \#\#\# 문제 리포트 D: 토큰-현금성 경계 불명확

  \- 토큰이 현금성(환전 가능성)으로 인식되면 AML/금융규제 쟁점이 커짐.

  제안:

  \- 데모 단계에서 토큰 미발행 또는 발행 시에도 테스트넷/폐쇄형으로 제한.  
  \- 온체인 자산은 “기술 데모용”으로만 사용, 경제적 권리 부여 금지.  
  \- 브리지/CEX 연계, 2차 유통 암시 기능 제외.

  ———

  \#\# 2\) 실서비스 전환 시 필요한 체크리스트

  \#\#\# A. 서비스 분류/법적 성격

  \- \[ \] 서비스가 게임, 예측시장, 베팅, 파생상품 중 어디에 해당하는지 관할별 매핑  
  \- \[ \] 운영 주체/서버 위치/대상 국가 기준 규제 적용범위 문서화  
  \- \[ \] 법무 검토(외부 자문 포함) 완료 및 제품 요구사항 반영

  \#\#\# B. 지역 제한/접근 통제

  \- \[ \] 국가/주 단위 허용·금지 매트릭스 운영  
  \- \[ \] Geo-IP \+ 결제수단 국가 \+ KYC 국가정보 교차 검증  
  \- \[ \] 제한 지역 우회(VPN) 탐지 및 차단 정책  
  \- \[ \] 약관/공지에 관할 제한 명시

  \#\#\# C. KYC/AML/제재 준수

  \- \[ \] 위험기반 고객확인(KYC) 레벨 설계  
  \- \[ \] 제재리스트/PEP 스크리닝  
  \- \[ \] 이상거래 탐지(급격한 자금 이동, 다계정, 세탁 패턴)  
  \- \[ \] 의심거래 보고/내부 에스컬레이션 절차

  \#\#\# D. 토큰/현금성 경계

  \- \[ \] 토큰의 기능 정의(유틸리티 vs 수익권/배당권) 문서화  
  \- \[ \] 환매·고정가 보장·수익 약속 금지  
  \- \[ \] 2차 유통/브리지/담보화 기능의 단계적 오픈 게이트  
  \- \[ \] 토큰 이코노미 변경 시 컴플라이언스 재검토 트리거

  \#\#\# E. 소비자 보호/제품 가드레일

  \- \[ \] 입금·손실·베팅 한도(일/주/월)  
  \- \[ \] 쿨다운, 자기차단(self-exclusion), 알림(과몰입 경고)  
  \- \[ \] 확률/수수료/정산 규칙의 사전 고지  
  \- \[ \] 분쟁 처리 및 고객지원 SLA

  \#\#\# F. 데이터/보안/감사

  \- \[ \] 약관/개인정보처리방침/쿠키정책 정합성  
  \- \[ \] 체인/오프체인 로그 감사추적 보관  
  \- \[ \] 스마트컨트랙트 보안감사 및 사고대응 계획  
  \- \[ \] 모델/오라클 조작 가능성 모니터링

  ———

  \#\# 3\) 제품 문구(Disclaimer) 초안

  \#\#\# 데모용(해커톤) 짧은 문구

  \> 본 서비스는 해커톤 시연용 프로토타입입니다. 실제 금전, 현금성 자산, 투자수익을 제공하지 않습니다. 모든 포인트/결과는  
  \> 테스트 목적이며 환전·양도·거래가 불가합니다. 일부 지역에서는 접근이 제한될 수 있습니다.

  \#\#\# 실서비스용 기본 문구(초안)

  \> 본 서비스는 허용된 관할지역의 사용자에게만 제공됩니다. 지역 법령에 따라 일부 기능은 제한될 수 있습니다.  
  \> 디지털 토큰/포인트는 예치금, 은행예금, 증권 또는 보장된 투자상품이 아니며, 가치 변동 및 손실 위험이 있습니다.  
  \> 과거 성과는 미래 수익을 보장하지 않으며, 본 서비스의 정보는 투자 자문이 아닙니다.  
  \> 이용자는 본인의 관할 법령 준수 책임이 있으며, 당사는 법령상 요구되는 본인확인(KYC) 및 자금세탁방지(AML) 절차를 적용  
  \> 할 수 있습니다.  
  \> 과몰입 방지를 위해 이용 한도 및 자기제한 기능이 제공될 수 있습니다.

  원하면 다음 턴에서, 위 문구를 기준으로 “앱 첫 진입/베팅 직전/결제 직전” 단계별 고지 카피까지 나눠서 더 구체화해드리겠  
  습니다.

  작업:  
  1\) README를 "3분 이해 / 10분 실행" 구조로 다시 쓰세요.  
  2\) 데모 시나리오(스크립트)를 작성하세요:  
  4\) 결과물:  
     \- README.md 초안  
     \- DEMO\_SCRIPT.md  
     \- CHECKLIST.md

역할: 당신은 Hackathon Submission Producer입니다.

목표:  
\- 심사자가 3분 안에 이해하고, 10분 안에 실행해볼 수 있는 제출 패키지를 만드세요.

작업:  
1\) README를 "3분 이해 / 10분 실행" 구조로 다시 쓰세요.  
2\) 데모 시나리오(스크립트)를 작성하세요:  
   \- 30초 버전(핵심 1개)  
   \- 2분 버전(풀 플로우)  
3\) 로컬 실행/테스트/배포(예: Vercel) 절차를 정확히 검증하고 문서화하세요.  
4\) 결과물:  
   \- README.md 초안  
   \- DEMO\_SCRIPT.md  
   \- CHECKLIST.md

• 요청하신 해커톤 제출 패키지 작업을 진행하겠습니다. 먼저 현재 프로젝트 구조와 기존 README/실행 스크립트/배포 설정을 확  
  인한 뒤, 검증 가능한 실행 절차를 기준으로 README.md, DEMO\_SCRIPT.md, CHECKLIST.md 초안을 바로 작성하겠습니다.

◦ Running Get-ChildItem \-Force | Select-Object Name,Mode

• Running Get-ChildItem \-Recurse \-File \-Filter README\* | ForEach-Object { $\_.FullName }

✔ You approved codex to always run commands that start with Get-ChildItem \-Recurse \-File \-Filter README\* | ForEach-  
  Object { $\_.FullName }

• Ran Get-ChildItem \-Recurse \-File | Where-Object { $\_.Name \-match 'package.json|pnpm-lock.yaml|yarn.lock|  
  │ package-lock.json|requirements.txt|pyproject.toml|Dockerfile|vercel.json' } | ForEach-Object { $\_.FullName }  
  └ C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\package.json  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\pnpm-lock.yaml  
    … \+541 lines  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\node\_modules\\.pnpm\\bn.js@5.2.2\\node\_modules\\bn.js\\package.json  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\node\_modules\\.pnpm\\borsh@0.7.0\\node\_modules\\borsh\\package.json  
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• 프로젝트 루트는 monffy이고 기존 README.md가 있습니다. 지금 README와 각 package.json 스크립트, 환경변수 예시 파일을 읽  
• Running Get-Content \-Path monffy\\apps\\agent\\package.json

✔ You approved codex to always run commands that start with Get-ChildItem \-Path monffy \-Force | Select-Object Name,Mode

• Ran Get-ChildItem \-Path monffy \-Force | Select-Object Name,Mode  
  └  
    Name                Mode  
    … \+16 lines

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• 현재 스크립트 기준으로 web/agent 실행 경로는 확인했습니다. 이제 .env.example 존재 여부, 실제 필수 변수, Vercel 설정

• Running Get-ChildItem \-Recurse \-File monffy\\docs | ForEach-Object { $\_.FullName }

• Running Get-ChildItem \-Recurse \-File monffy\\packages\\contracts | ForEach-Object { $\_.FullName }

✔ You approved codex to always run commands that start with Get-ChildItem \-Recurse \-File monffy\\apps\\agent | ForEach-  
  Object { $\_.FullName }

✔ You approved codex to always run commands that start with Get-ChildItem \-Recurse \-File monffy | Where-Object { $\_.Name  
  \-match 'vercel.j...

✔ You approved codex to always run commands that start with Get-ChildItem \-Recurse \-File monffy\\packages\\contracts |  
  ForEach-Object { $\_....

• Ran Get-ChildItem \-Recurse \-File monffy | Where-Object { $\_.Name \-match 'vercel.json|\\.env\\.example|\\.env\\.local|  
  │ \\.env$|dockerfile|README\\.md$' } | ForEach-Object { $\_.FullName }  
  └ C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\.env.local  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\README.md  
    … \+149 lines  
    \\monffy\\node\_modules\\.pnpm\\@solana-program+token@0.9.0\_@solana+kit@5.5.1\\node\_modules\\@solana-program\\token\\README.m  
    d

✔ You approved codex to always run commands that start with Get-ChildItem \-Recurse \-File monffy\\docs | ForEach-Object  
  { $\_.FullName }

• Ran Get-ChildItem \-Recurse \-File monffy\\docs | ForEach-Object { $\_.FullName }  
  └ C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\docs\\ANTIGRAVITY\_PROMPT.md  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\docs\\DEMO\_SCRIPT.md  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\docs\\DEV\_NOTES.md  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\docs\\FULL\_CODEBASE\_SNAPSHOT.md  
  Object { $\_.FullName }

• Ran Get-ChildItem \-Recurse \-File monffy\\apps\\web | ForEach-Object { $\_.FullName }  
  └ C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\apps\\web\\.env.example  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\apps\\web\\.env.local  
    … \+531 lines  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\apps\\web\\src\\lib\\supabase.ts  
    C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\apps\\web\\src\\lib\\wagmi.ts

• Ran Get-ChildItem \-Recurse \-File monffy | Where-Object { $\_.Name \-match 'vercel.json|\\.env\\.example|\\.env\\.local|  
  │ \\.env$|dockerfile|README\\.md$' } | ForEach-Object { $\_.FullName }  
  └ C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\.env.local  
• 필수 환경변수를 정확히 적기 위해 agent/web 코드에서 실제 참조하는 변수명을 확인하겠습니다. 이어서 기존 docs/  
  DEMO\_SCRIPT.md도 반영 가능한 부분만 가져와서 제출용 스크립트로 재구성하겠습니다.

• Running Get-Content \-Path monffy\\apps\\web\\src\\lib\\supabase.ts

• Running Get-Content \-Path monffy\\packages\\contracts\\package.json

• Running Get-Content \-Path monffy\\apps\\web\\src\\lib\\wagmi.ts

• Ran Get-Content \-Path monffy\\docs\\DEMO\_SCRIPT.md  
  └ \# MONFFY Demo Video Script (3 min)

    … \+156 lines

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• 문서 신뢰도를 위해 실제 커맨드 검증을 시작하겠습니다. 먼저 툴체인 버전/가용성(node, pnpm, forge, vercel)을 확인하고,  
  이어서 lint/build/test를 순서대로 실행해 통과 여부를 체크리스트에 반영하겠습니다.

• Running node \-v

• Running forge \--version

  └  
    \> monffy@0.1.0 build C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy  
    … \+34 lines

✔ You approved codex to always run commands that start with pnpm \--filter @monffy/agent build

• Ran pnpm \--filter @monffy/agent build  
  └  
    \> @monffy/agent@0.1.0 build C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy\\apps\\agent  
• Ran pnpm contracts:test  
  └  
    \> monffy@0.1.0 contracts:test C:\\Users\\sdyes\\OneDrive\\바탕 화면\\모나드\\monffy  
    … \+11 lines  
    'forge' is not recognized as an internal or external command,  
    Downloaded project settings to \~\\OneDrive\\바탕 화면\\모나드\\monffy\\.vercel\\project.json \[0ms\]

• Ran vercel build  
  └ Detected \`pnpm-lock.yaml\` version 6 generated by pnpm@8.x  
• Ran vercel build  
  └ Detected \`pnpm-lock.yaml\` version 6 generated by pnpm@8.x  
    Installing dependencies...  
    … \+54 lines  
    warn \- If this is content and not a class, replace it with \`duration-\&lsqb;1.4s\&rsqb;\` to silence this warning.  
    Build Completed in .vercel\\output \[26s\]

─ Worked for 1m 18s ────────────────────────────────────────────────────────────────────────────────────────────────────

• 배포 검증은 apps/web 기준으로는 vercel build 성공까지 확인했습니다. 마지막으로 변경 여부와 검증 결과를 정리해, 코드 수  
  정 없이 문서 초안을 리포트 형태로 전달하겠습니다.

• Ran git status \--short  
  └  M .gitignore  
     M CLAUDE.md  
    ?? nul

• Ran git diff \-- .gitignore  
  └ diff \--git a/.gitignore b/.gitignore  
    index c86e3f0..098b1f5 100644  
    … \+8 lines  
    \+.env\*.local  
    warning: in the working copy of '.gitignore', LF will be replaced by CRLF the next time Git touches it

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• 요청 준수: 코드 파일은 수정하지 않았습니다.  
  vercel pull \--yes 실행 중 .gitignore에 자동으로 2줄(.vercel, .env\*.local)이 추가되었습니다. 코드 변경은 아니지만 저장  
  소 변경이므로 아래 리포트에 포함했습니다.

  검증 리포트 (2026-02-12)

  1\. 로컬 툴체인

  \- node \-v: v20.14.0  
  \- pnpm \-v: 8.15.0  
  \- vercel \--version: 50.4.9  
  \- forge \--version: 실패 (forge 미설치)

  2\. 실행/테스트

  \- pnpm build (root): 성공  
  \- pnpm \--filter @monffy/agent build: 성공  
  \- pnpm lint: 실패 (next lint가 ESLint 초기설정 인터랙티브 프롬프트 요구)  
  \- pnpm contracts:test: 실패 (forge 없음)

  3\. 배포(Vercel)

  \- vercel build (root): 실패 (Root Directory가 Next.js 앱 경로와 불일치)  
  \- vercel build (apps/web): 성공  
  \- 결론: 배포 문서는 apps/web 기준으로 작성해야 정확함

  4\. 수정 필요사항 리포트 (코드 미수정)

  \- apps/web에 ESLint 설정 파일 부재로 CI/비대화형 lint 불가 (pnpm lint 실패 원인)  
  \- 컨트랙트 테스트는 Foundry 설치 전제 필요  
  \- Vercel 프로젝트 Root Directory를 apps/web로 고정해야 루트 실행 혼선 방지

  ———

  \#\# README.md 초안

  \# MONFFY Claw Agent

  Monad 메인넷에서 24/7 동작하는 자율형 AI Game Master.  
  실시간 가격 변동을 감지해 마이크로 예측시장을 만들고, 스스로 예측하고, 5분 후 자동 정산/내러티브를 생성합니다.

  \#\# 3분 이해

  \#\#\# 1\) 문제  
  일반 예측시장은 운영자 개입이 많고, 참여 동기가 약하며, 결과 해설이 건조합니다.

  \#\#\# 2\) 해결  
  MONFFY는 운영자를 대체합니다.  
  \- Pyth 가격 감시  
  \- 시장 자동 생성  
  \- 에이전트 자체 예측  
  \- 온체인 정산  
  \- 결과 내러티브 자동 생성

  \#\#\# 3\) 왜 새롭나  
  \- 트레이딩 봇이 아니라 “게임 마스터” AI  
  \- 일부러 이길 수 있게 설계된 정확도(\~60%)  
  \- 모든 핵심 액션 온체인 검증 가능

  \#\#\# 4\) 핵심 링크  
  \- Web: https://monffy.vercel.app  
  \- Agent Feed: https://monffy.vercel.app/agent  
  \- MonffyBadge: 0x959D55a6b0Ee16C3A2994552C705f61452BeB20e  
  \- MicroMarket: 0xDb3a5B6ec64dFe62EA050d597AFa075A26D7Eee0  
  \- ClawLog: 0x73559F1E246D04BA7835ACEC9003348506F5FC8e  
  \- Agent Wallet: 0x07eAC2Ccd0Fa94A259CadCEaCf1C86c1Dea245f8

  \---

  \#\# 10분 실행

  \#\#\# 0\) 사전 요구사항  
  \- Node.js 20+  
  \- pnpm 8+  
  \- (선택) Foundry/forge: 컨트랙트 테스트용

  \#\#\# 1\) 설치  
  \`\`\`bash  
  cd monffy  
  pnpm install

  \#\#\# 2\) 환경변수

  copy apps/agent/.env.example apps/agent/.env  
  copy apps/web/.env.example apps/web/.env.local

  apps/agent/.env 필수:

  \- AGENT\_PRIVATE\_KEY  
  \- SUPABASE\_URL  
  \- SUPABASE\_SERVICE\_KEY  
  \- MARKET\_CONTRACT\_ADDRESS  
  \- CLAW\_LOG\_CONTRACT\_ADDRESS

  apps/web/.env.local 필수:

  \- NEXT\_PUBLIC\_SUPABASE\_URL  
  \- NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY  
  \- NEXT\_PUBLIC\_RPC\_URL (기본 Monad RPC 사용 가능)  
  \- NEXT\_PUBLIC\_CHAIN\_ID=143

  \#\#\# 3\) 웹 실행

  pnpm dev

  \- 접속: http://localhost:3000  
  \- /agent 페이지 확인

  \#\#\# 4\) 에이전트 실행

  pnpm dev:agent

  로그에서 아래 흐름 확인:

  \- infra check  
  \- brain loop start  
  \- signal detect  
  \- market create/predict/resolve/narrate

  \#\#\# 5\) 빌드 검증

  pnpm build  
  pnpm \--filter @monffy/agent build

  \#\#\# 6\) 테스트 검증

  pnpm lint  
  pnpm contracts:test

  주의:

  \- 현재 pnpm lint는 ESLint 초기설정 프롬프트로 중단될 수 있음  
  \- pnpm contracts:test는 forge 설치 필요

  ———

  \#\# 배포 (Vercel)

  현재 저장소는 모노레포이며, 웹 앱 경로는 apps/web입니다.

  \#\#\# 1\) 앱 디렉토리 기준으로 링크/빌드

  cd apps/web  
  vercel pull \--yes  
  vercel build

  \#\#\# 2\) 프리빌드 산출물 배포

  vercel deploy \--prebuilt

  \#\#\# 3\) 프로덕션 배포

  vercel \--prod \--prebuilt

  권장 설정:

  \- Vercel Project Root Directory: apps/web  
  \- Environment Variables: apps/web/.env.example 기준 입력

  \---

  \#\# DEMO\_SCRIPT.md 초안

  \`\`\`markdown  
  \# MONFFY Demo Script

  \#\# 30초 버전 (핵심 1개)

  \#\#\# 목표  
  “사람 개입 없이 시장을 만들고 정산하는 에이전트”를 30초 안에 증명

  \#\#\# 진행  
  \- 0:00-0:05  
    \`/agent\` 페이지 오픈, Live 피드 노출  
  \- 0:05-0:15  
    터미널에서 \`pnpm dev:agent\` 실행 로그 보여주기  
  \- 0:15-0:25  
    \`MARKET\_CREATED\` \-\> \`PREDICTION\_MADE\` 이벤트 확인  
  \- 0:25-0:30  
    “자율 생성 \+ 자율 예측 \+ 온체인 검증 가능” 한 줄로 마무리

  \#\#\# 멘트  
  “MONFFY는 Monad에서 24/7 동작하는 Game Master AI입니다. 가격 신호를 감지하면 시장을 스스로 만들고, 예측하고, 결과까지  
  정산합니다.”

  \---

  \#\# 2분 버전 (풀 플로우)

  \#\#\# 0:00-0:20 문제와 솔루션  
  \- 예측시장 운영 자동화 필요성  
  \- MONFFY가 운영자 역할을 대체한다는 점 강조

  \#\#\# 0:20-0:45 실시간 에이전트 시작  
  \- \`pnpm dev:agent\`  
  \- Brain loop/price monitor 로그 확인

  \#\#\# 0:45-1:15 시장 생성과 예측  
  \- \`/agent\`에서 신규 시장 카드 확인  
  \- 에이전트의 UP/DOWN 예측 표시 확인

  \#\#\# 1:15-1:40 온체인 검증  
  \- Monadscan에서 Agent wallet/ClawLog/MicroMarket 트랜잭션 확인

  \#\#\# 1:40-2:00 정산과 내러티브  
  \- 만료된 시장 resolve 로그  
  \- 결과 내러티브와 승률 업데이트 확인  
  \- “검증 가능한 자율 에이전트”로 마무리

  ———

  \#\# CHECKLIST.md 초안

  \# Submission Checklist

  \#\# A. 3분 이해 자료  
  \- \[ \] README 상단에 제품 한 줄 정의  
  \- \[ \] 문제 \-\> 해결 \-\> 차별점 3단 구조  
  \- \[ \] Live 링크/컨트랙트 주소 포함  
  \- \[ \] 아키텍처 요약 포함

  \#\# B. 10분 실행 경로  
  \- \[ \] 설치 커맨드 3개 이내  
  \- \[ \] \`.env\` 설정 위치와 필수 키 명시  
  \- \[ \] 로컬 실행 URL 명시  
  \- \[ \] 실패 가능 포인트와 우회 방법 명시

  \#\# C. 데모 스크립트  
  \- \[ \] 30초 버전 (핵심 1개)  
  \- \[ \] 2분 버전 (풀 플로우)  
  \- \[ \] 타임라인과 멘트 포함  
  \- \[ \] 온체인 검증 장면 포함

  \#\# D. 검증 결과 기록  
  \- \[x\] \`pnpm build\` 성공  
  \- \[x\] \`pnpm \--filter @monffy/agent build\` 성공  
  \- \[ \] \`pnpm lint\` 성공 (현재 실패: ESLint 초기설정 프롬프트)  
  \- \[ \] \`pnpm contracts:test\` 성공 (현재 실패: forge 미설치)  
  \- \[x\] \`vercel build\` 성공 (\`apps/web\`에서 실행 시)

  \#\# E. 배포 체크  
  \- \[ \] Vercel Root Directory \= \`apps/web\`  
  \- \[ \] \`vercel pull \--yes\` 완료  
  \- \[ \] \`vercel build\` 완료  
  \- \[ \] \`vercel \--prod \--prebuilt\` 완료

  \#\# F. 최종 제출 패키지  
  \- \[ \] \`README.md\`  
  \- \[ \] \`DEMO\_SCRIPT.md\`  
  \- \[ \] \`CHECKLIST.md\`  
  \- \[ \] 데모 영상 링크  
  \- \[ \] 라이브 URL \+ 모나드스캔 링크

  원하면 다음 턴에서, 코드 수정 없이 지금 초안을 실제 제출 톤(심사위원용 한국어/영어 버전)으로 더 압축해 드리겠습니다.  
