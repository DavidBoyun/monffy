/**
 * One-time script to fix corrupted agent_stats.
 * Recalculates stats from actual questions table data.
 * Run: cd monffy && pnpm tsx apps/agent/src/utils/run-fix-stats.ts
 */
import { config } from "../config.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("=== MONFFY Stats Fix ===\n");

  // Step 1: Show current (corrupted) stats
  const { data: before } = await supabase
    .from("agent_stats")
    .select("total_questions, total_predictions, correct_predictions, accuracy")
    .eq("id", 1)
    .single();

  console.log("BEFORE FIX:", before);

  // Step 2: Count actual data from questions table
  const { count: totalQuestions } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("lane", "prediction");

  const { count: totalPredictions } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("lane", "prediction")
    .not("agent_prediction", "is", null);

  const { count: correctPredictions } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("lane", "prediction")
    .eq("agent_correct", true);

  const total = totalPredictions ?? 0;
  const correct = correctPredictions ?? 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;

  console.log("\nACTUAL DATA:", {
    totalQuestions,
    totalPredictions: total,
    correctPredictions: correct,
    accuracy: `${accuracy}%`,
  });

  // Step 3: Update agent_stats
  const { error } = await supabase
    .from("agent_stats")
    .update({
      total_questions: totalQuestions ?? 0,
      total_predictions: total,
      correct_predictions: correct,
      accuracy,
      last_action_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("\nUPDATE FAILED:", error);
    process.exit(1);
  }

  // Step 4: Verify
  const { data: after } = await supabase
    .from("agent_stats")
    .select("total_questions, total_predictions, correct_predictions, accuracy")
    .eq("id", 1)
    .single();

  console.log("\nAFTER FIX:", after);
  console.log("\n=== Stats fixed successfully! ===");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
