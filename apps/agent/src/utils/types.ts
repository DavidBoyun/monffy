// ==================== Agent State ====================

export type AgentState =
  | "MONITORING"
  | "CREATING"
  | "AWAITING"
  | "RESOLVING"
  | "NARRATING";

// ==================== Price Data ====================

export interface PriceData {
  readonly feedId: string;
  readonly symbol: string;
  readonly price: number;
  readonly confidence: number;
  readonly publishTime: number;
  readonly emaPrice: number;
}

export interface PriceSignal {
  readonly type: "SPIKE" | "DUMP" | "QUIET";
  readonly symbol: string;
  readonly currentPrice: number;
  readonly previousPrice: number;
  readonly changePct: number;
  readonly timestamp: number;
}

// ==================== Market / Question ====================

export interface AgentQuestion {
  readonly id: string;
  readonly questionText: string;
  readonly options: readonly string[];
  readonly lane: "prediction";
  readonly category: string;
  readonly pythPriceId: string;
  readonly strikePrice: number;
  readonly expiresAt: Date;
  readonly triggerType: PriceSignal["type"];
  readonly onchainMarketId?: number;
}

export interface AgentPrediction {
  readonly questionId: string;
  readonly prediction: "UP" | "DOWN";
  readonly confidence: number;
  readonly reasoning: string;
}

export interface MarketResolution {
  readonly questionId: string;
  readonly onchainMarketId: number;
  readonly outcome: boolean;
  readonly strikePrice: number;
  readonly finalPrice: number;
  readonly agentCorrect: boolean;
}

// ==================== Narrative ====================

export interface Narrative {
  readonly questionId: string;
  readonly text: string;
  readonly emoji: string;
  readonly agentRecord: { wins: number; losses: number; accuracy: number };
}

// ==================== Agent Action (onchain log) ====================

export type ActionType =
  | "MARKET_CREATED"
  | "PREDICTION_MADE"
  | "MARKET_RESOLVED"
  | "NARRATIVE_POSTED";

export interface AgentAction {
  readonly actionType: ActionType;
  readonly data: string;
  readonly txHash?: string;
  readonly timestamp: number;
}

// ==================== Reason Trace (Decision Transparency) ====================

export interface ReasonTrace {
  readonly timestamp: number;
  readonly signal: {
    readonly type: "SPIKE" | "DUMP" | "QUIET";
    readonly symbol: string;
    readonly priceChangePct: number;
    readonly currentPrice: number;
  };
  readonly components: {
    readonly momentumScore: number;
    readonly meanReversionScore: number;
    readonly emaDeviation: number;
    readonly noise: number;
  };
  readonly decision: {
    readonly rawScore: number;
    readonly clampedScore: number;
    readonly prediction: "UP" | "DOWN";
    readonly confidence: number;
  };
}

// ==================== Brain Decision ====================

export type BrainDecision =
  | { readonly action: "CREATE_MARKET"; readonly signal: PriceSignal }
  | { readonly action: "RESOLVE_MARKET"; readonly questionId: string }
  | { readonly action: "WRITE_NARRATIVE"; readonly questionId: string }
  | { readonly action: "IDLE" };

// ==================== Agent Stats ====================

export interface AgentStats {
  readonly totalQuestions: number;
  readonly totalPredictions: number;
  readonly correctPredictions: number;
  readonly accuracy: number;
  readonly uptimeSeconds: number;
  readonly lastActionAt: string | null;
}

// ==================== Supabase Row Types ====================

export interface QuestionRow {
  readonly id: string;
  readonly lane: string;
  readonly category: string;
  readonly question_text: string;
  readonly options: string[];
  readonly correct_answer: number | null;
  readonly pyth_price_id: string | null;
  readonly strike_price: number | null;
  readonly created_at: string;
  readonly expires_at: string | null;
  readonly resolved_at: string | null;
  readonly resolution_outcome: boolean | null;
  readonly is_active: boolean;
  readonly agent_prediction: string | null;
  readonly agent_correct: boolean | null;
  readonly agent_narrative: string | null;
  readonly trigger_type: string | null;
  readonly onchain_market_id: number | null;
}

export interface AgentStatsRow {
  readonly id: number;
  readonly total_questions: number;
  readonly total_predictions: number;
  readonly correct_predictions: number;
  readonly accuracy: number;
  readonly uptime_seconds: number;
  readonly last_action_at: string | null;
  readonly started_at: string;
}

export interface AgentActionRow {
  readonly id: string;
  readonly action_type: string;
  readonly data: string;
  readonly tx_hash: string | null;
  readonly created_at: string;
}
