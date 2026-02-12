# DEV_NOTES — 공식 값 검증 기록

> 코드에 적기 전 공식 문서에서 검증한 결과를 여기에 기록합니다.

---

## A) Monad Network Info (Mainnet)

**검증일**: 2026-02-11
**출처**: https://docs.monad.xyz/developer-essentials/network-information

| 항목 | 공식 값 | 코드 반영 |
|------|---------|----------|
| chainId | 143 | `config.ts` MONAD_CHAIN.id = 143 |
| Currency | MON (18 decimals) | `config.ts` nativeCurrency |
| Block Gas Limit | 200M gas | - |
| Tx Gas Limit | 30M gas | - |

### 공식 RPC 엔드포인트

| 제공자 | HTTP | Rate Limit |
|--------|------|------------|
| QuickNode | `https://rpc.monad.xyz` | 25 rps |
| Alchemy | `https://rpc1.monad.xyz` | 15 rps |
| Goldsky | `https://rpc2.monad.xyz` | 300/10s |
| Ankr | `https://rpc3.monad.xyz` | 300/10s |

**코드**: `config.ts` 기본값 `https://rpc.monad.xyz` (QuickNode, 25 rps)

### 블록 익스플로러

| 이름 | URL |
|------|-----|
| MonadVision | https://monadvision.com |
| Monadscan | https://monadscan.com |
| Socialscan | https://monad.socialscan.io |

**코드**: `config.ts` blockExplorers = `https://monadscan.com`

---

## B) Monad Gas Pricing

**검증일**: 2026-02-11
**출처**: https://docs.monad.xyz/developer-essentials/gas-pricing

### 핵심: Monad는 gas_limit 기준 과금!

```
gas_paid = gas_limit × price_per_gas
```

- Ethereum과 다름: gas_used가 아니라 gas_limit을 과금
- 이유: 비동기 실행 지원을 위한 설계
- **개발자 주의**: 모든 tx에 명시적 gasLimit 설정 필수

### EIP-1559 호환

```
price_per_gas = min(base_price + priority_price, max_price)
```

- 최소 base fee: 100 MON-gwei
- 타겟 블록 사용률: 160M gas (80%)

### 코드 반영

`tx-manager.ts` GAS_LIMITS:
- CREATE_MARKET: 200,000
- RESOLVE_MARKET: 100,000
- CLAW_LOG: 60,000

(12시간 안정성 테스트에서 관측된 실제 gasUsed 기반)

---

## C) Moltiverse 해커톤 제출 요건

**검증일**: 2026-02-11
**출처**: https://moltiverse.dev, https://forms.moltiverse.dev/submit

| 항목 | 값 |
|------|-----|
| 트랙 | Agent Track ($60K) |
| 마감 | 2026-02-15 23:59 ET |
| 팀 | 1-3명 |
| 제출 | forms.moltiverse.dev/submit |

### 제출 필수 항목
1. Team Name
2. Team Size
3. Track Selection (Agent)
4. Team Member Info (email, country)
5. Rules Agreement

### 요구사항
- Monad 블록체인과 통합
- 자율 에이전트 기능 시연
- 기존 코드 재사용 가능 (명시 필요)
- "Innovation must be substantial"

---

## D) Pyth Network

**검증일**: 2026-02-10
**출처**: https://docs.pyth.network/price-feeds/core/contract-addresses/evm

| 항목 | 값 |
|------|-----|
| Monad 컨트랙트 | `0x2880aB155794e7179c9eE2e38200202908C17B43` |
| MON/USD Feed ID | `0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1` |
| Hermes (stable) | `https://hermes.pyth.network` |

---

*이 문서는 코드 변경 전 공식 검증을 기록하는 용도입니다.*
