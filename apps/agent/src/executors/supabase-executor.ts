import { supabase } from "../utils/supabase-client.js";
import { dbLog } from "../utils/logger.js";
import type {
  AgentQuestion,
  AgentPrediction,
  MarketResolution,
  AgentStats,
  AgentAction,
  QuestionRow,
} from "../utils/types.js";

// ==================== Questions ====================

export async function insertQuestion(
  question: AgentQuestion
): Promise<string> {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      lane: "prediction",
      category: question.category,
      question_text: question.questionText,
      options: question.options,
      pyth_price_id: question.pythPriceId,
      strike_price: Math.round(question.strikePrice * 1e8),
      expires_at: question.expiresAt.toISOString(),
      is_active: true,
      trigger_type: question.triggerType,
      onchain_market_id: question.onchainMarketId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    dbLog.error({ error }, "Failed to insert question");
    throw new Error(`Insert question failed: ${error.message}`);
  }

  dbLog.info({ id: data.id, text: question.questionText }, "Question inserted");
  return data.id;
}

export async function savePrediction(
  prediction: AgentPrediction
): Promise<void> {
  const { error } = await supabase
    .from("questions")
    .update({
      agent_prediction: prediction.prediction,
    })
    .eq("id", prediction.questionId);

  if (error) {
    dbLog.error({ error }, "Failed to save prediction");
    throw new Error(`Save prediction failed: ${error.message}`);
  }

  dbLog.info(
    { questionId: prediction.questionId, prediction: prediction.prediction },
    "Agent prediction saved"
  );
}

export async function resolveQuestion(
  resolution: MarketResolution
): Promise<void> {
  const { error } = await supabase
    .from("questions")
    .update({
      resolved_at: new Date().toISOString(),
      resolution_outcome: resolution.outcome,
      is_active: false,
      correct_answer: resolution.outcome ? 0 : 1, // 0=UP, 1=DOWN
      agent_correct: resolution.agentCorrect,
    })
    .eq("id", resolution.questionId);

  if (error) {
    dbLog.error({ error }, "Failed to resolve question");
    throw new Error(`Resolve question failed: ${error.message}`);
  }

  // Also update user responses' is_correct based on outcome
  const correctOption = resolution.outcome ? 0 : 1;
  await supabase
    .from("responses")
    .update({ is_correct: true, points_earned: 10 })
    .eq("question_id", resolution.questionId)
    .eq("selected_option", correctOption);

  await supabase
    .from("responses")
    .update({ is_correct: false, points_earned: 0 })
    .eq("question_id", resolution.questionId)
    .neq("selected_option", correctOption);

  dbLog.info(
    {
      questionId: resolution.questionId,
      outcome: resolution.outcome ? "UP" : "DOWN",
      agentCorrect: resolution.agentCorrect,
    },
    "Question resolved"
  );
}

export async function saveNarrative(
  questionId: string,
  narrative: string
): Promise<void> {
  const { error } = await supabase
    .from("questions")
    .update({ agent_narrative: narrative })
    .eq("id", questionId);

  if (error) {
    dbLog.error({ error }, "Failed to save narrative");
  }
}

export async function getActiveQuestions(): Promise<readonly QuestionRow[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("is_active", true)
    .eq("lane", "prediction")
    .order("created_at", { ascending: false });

  if (error) {
    dbLog.error({ error }, "Failed to fetch active questions");
    return [];
  }

  return data ?? [];
}

export async function getExpiredUnresolvedQuestions(): Promise<
  readonly QuestionRow[]
> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("is_active", true)
    .eq("lane", "prediction")
    .lt("expires_at", new Date().toISOString())
    .is("resolved_at", null);

  if (error) {
    dbLog.error({ error }, "Failed to fetch expired questions");
    return [];
  }

  return data ?? [];
}

export async function getResolvedWithoutNarrative(): Promise<
  readonly QuestionRow[]
> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("lane", "prediction")
    .not("resolved_at", "is", null)
    .is("agent_narrative", null)
    .order("resolved_at", { ascending: false })
    .limit(5);

  if (error) {
    dbLog.error({ error }, "Failed to fetch unnarrated questions");
    return [];
  }

  return data ?? [];
}

// ==================== Agent Stats ====================

export async function getOrCreateAgentStats(): Promise<AgentStats> {
  const { data, error } = await supabase
    .from("agent_stats")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    // Create initial stats
    const { data: newData, error: insertError } = await supabase
      .from("agent_stats")
      .upsert({
        id: 1,
        total_questions: 0,
        total_predictions: 0,
        correct_predictions: 0,
        accuracy: 0,
        uptime_seconds: 0,
        last_action_at: null,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      dbLog.warn({ insertError }, "Could not create agent_stats row");
      return {
        totalQuestions: 0,
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 0,
        uptimeSeconds: 0,
        lastActionAt: null,
      };
    }

    return mapStatsRow(newData);
  }

  return mapStatsRow(data);
}

export async function incrementStats(
  field: "total_questions" | "total_predictions" | "correct_predictions"
): Promise<void> {
  const stats = await getOrCreateAgentStats();
  const currentValue =
    field === "total_questions"
      ? stats.totalQuestions
      : field === "total_predictions"
        ? stats.totalPredictions
        : stats.correctPredictions;

  const newValue = currentValue + 1;
  const updateData: Record<string, unknown> = {
    [field]: newValue,
    last_action_at: new Date().toISOString(),
  };

  // Recalculate accuracy if predictions changed
  if (field === "correct_predictions" || field === "total_predictions") {
    const totalPred =
      field === "total_predictions"
        ? newValue
        : stats.totalPredictions;
    const correctPred =
      field === "correct_predictions"
        ? newValue
        : stats.correctPredictions;
    updateData.accuracy =
      totalPred > 0 ? (correctPred / totalPred) * 100 : 0;
  }

  await supabase.from("agent_stats").update(updateData).eq("id", 1);
}

export async function updateUptime(seconds: number): Promise<void> {
  await supabase
    .from("agent_stats")
    .update({ uptime_seconds: seconds })
    .eq("id", 1);
}

// ==================== Agent Actions ====================

export async function logAction(action: AgentAction): Promise<void> {
  const { error } = await supabase.from("agent_actions").insert({
    action_type: action.actionType,
    data: action.data,
    tx_hash: action.txHash ?? null,
  });

  if (error) {
    dbLog.warn({ error, action: action.actionType }, "Failed to log action");
  }
}

// ==================== Helpers ====================

function mapStatsRow(row: Record<string, unknown>): AgentStats {
  return {
    totalQuestions: (row.total_questions as number) ?? 0,
    totalPredictions: (row.total_predictions as number) ?? 0,
    correctPredictions: (row.correct_predictions as number) ?? 0,
    accuracy: (row.accuracy as number) ?? 0,
    uptimeSeconds: (row.uptime_seconds as number) ?? 0,
    lastActionAt: (row.last_action_at as string) ?? null,
  };
}

export async function getParticipantCount(
  questionId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("question_id", questionId);

  if (error) return 0;
  return count ?? 0;
}
