// Minimal ABIs for agent interaction - only functions the agent calls

export const MICRO_MARKET_ABI = [
  {
    inputs: [
      { name: "priceId", type: "bytes32" },
      { name: "strikePrice", type: "int64" },
      { name: "duration", type: "uint64" },
    ],
    name: "createMarket",
    outputs: [{ name: "marketId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "finalPrice", type: "int64" },
    ],
    name: "resolveMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "markets",
    outputs: [
      { name: "priceId", type: "bytes32" },
      { name: "strikePrice", type: "int64" },
      { name: "createdAt", type: "uint64" },
      { name: "expiresAt", type: "uint64" },
      { name: "resolvedAt", type: "uint64" },
      { name: "resolved", type: "bool" },
      { name: "outcome", type: "bool" },
      { name: "upPool", type: "uint256" },
      { name: "downPool", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: false, name: "priceId", type: "bytes32" },
      { indexed: false, name: "strikePrice", type: "int64" },
      { indexed: false, name: "expiresAt", type: "uint64" },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: false, name: "outcome", type: "bool" },
      { indexed: false, name: "finalPrice", type: "int64" },
    ],
    name: "MarketResolved",
    type: "event",
  },
] as const;

export const CLAW_LOG_ABI = [
  {
    inputs: [
      { name: "actionType", type: "uint8" },
      { name: "dataHash", type: "bytes32" },
    ],
    name: "log",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "actionTypes", type: "uint8[]" },
      { name: "dataHashes", type: "bytes32[]" },
    ],
    name: "logBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "actionCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "actionId", type: "uint256" },
      { indexed: true, name: "actionType", type: "uint8" },
      { indexed: false, name: "dataHash", type: "bytes32" },
      { indexed: false, name: "timestamp", type: "uint64" },
    ],
    name: "AgentAction",
    type: "event",
  },
] as const;

export const MONFFY_BADGE_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "badgeId", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "minter", type: "address" }],
    name: "addMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
