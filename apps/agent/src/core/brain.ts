import { config, PYTH_FEEDS, EFFECTIVE_MARKET_DURATION } from "../config.js";
import {
  getState,
  transition,
  addActiveMarket,
  removeActiveMarket,
  incrementTick,
  getTimeSinceLastQuestion,
} from "./state.js";
import type { PriceMonitor } from "../monitors/price-monitor.js";
import {
  generateQuestion,
  generateQuietSignal,
} from "../generators/question-generator.js";
import { makePrediction } from "../generators/prediction-engine.js";
import { generateNarrative } from "../generators/narrative-writer.js";
import {
  createOnchainMarket,
  resolveOnchainMarket,
  logAgentAction,
  ONCHAIN_ACTION,
} from "../executors/market-executor.js";
import {
  insertQuestion,
  savePrediction,
  resolveQuestion,
  saveNarrative,
  getExpiredUnresolvedQuestions,
  getResolvedWithoutNarrative,
  incrementStats,
  recalculateStats,
  logAction,
  getParticipantCount,
  getOrCreateAgentStats,
} from "../executors/supabase-executor.js";
import { fetchPriceWithFallback } from "../utils/pyth-client.js";
import { brainLog } from "../utils/logger.js";
import type { PriceSignal, AgentQuestion } from "../utils/types.js";

const QUIET_THRESHOLD_MS = config.DEMO_MODE ? 20 * 1000 : 5 * 60 * 1000;
const MIN_QUESTION_GAP_MS = config.DEMO_MODE ? 8 * 1000 : 1 * 60 * 1000;

export function createBrain(priceMonitor: PriceMonitor) {
  const pendingSignals: PriceSignal[] = [];
  const resolvingIds = new Set<string>(); // Guard against duplicate resolution

  // Register signal handler from price monitor
  priceMonitor.onSignal((signal) => {
    brainLog.info(
      { type: signal.type, change: signal.changePct.toFixed(2) + "%" },
      "Signal received from price monitor"
    );
    pendingSignals.push(signal);
  });

  async function tick(): Promise<void> {
    incrementTick();
    const state = getState();

    try {
      // Phase 1: Check for expired markets to resolve
      await handleResolutions();

      // Phase 2: Check for resolved markets needing narratives
      await handleNarratives();

      // Phase 3: Process pending signals (create new markets)
      if (pendingSignals.length > 0 && canCreateQuestion()) {
        const signal = pendingSignals.shift()!;
        await handleCreateMarket(signal);
      }

      // Phase 4: Check for quiet market
      if (
        pendingSignals.length === 0 &&
        canCreateQuestion() &&
        getTimeSinceLastQuestion() > QUIET_THRESHOLD_MS
      ) {
        const latestPrice = priceMonitor.getLatestPrice();
        if (latestPrice) {
          const quietSignal = generateQuietSignal(
            latestPrice.symbol,
            latestPrice.price
          );
          await handleCreateMarket(quietSignal);
        }
      }

      // Return to monitoring
      if (state.state !== "MONITORING") {
        transition("MONITORING");
      }
    } catch (err) {
      brainLog.error({ err }, "Brain tick error");
      transition("MONITORING");
    }
  }

  async function handleCreateMarket(signal: PriceSignal): Promise<void> {
    transition("CREATING");

    // Generate question
    const question = generateQuestion(signal);
    brainLog.info({ text: question.questionText }, "Creating market...");

    // Create on-chain market (if contracts deployed)
    let onchainMarketId: number | undefined;
    let txHash: string | undefined;

    if (config.MARKET_CONTRACT_ADDRESS) {
      const strikePriceScaled = BigInt(
        Math.round(signal.currentPrice * 1e8)
      );
      const result = await createOnchainMarket(
        question.pythPriceId as `0x${string}`,
        strikePriceScaled,
        EFFECTIVE_MARKET_DURATION
      );
      if (result) {
        onchainMarketId = result.marketId;
        txHash = result.txHash;
      } else {
        brainLog.warn("On-chain market creation skipped (balance/error), continuing off-chain");
      }
    }

    // Insert into Supabase
    const questionWithMarketId: AgentQuestion = {
      ...question,
      onchainMarketId,
    };

    const questionId = await insertQuestion(questionWithMarketId);
    await incrementStats("total_questions");

    // Log on-chain action
    await logAgentAction(
      ONCHAIN_ACTION.MARKET_CREATED,
      JSON.stringify({ questionId, signal: signal.type })
    );

    await logAction({
      actionType: "MARKET_CREATED",
      data: `Question: ${question.questionText}`,
      txHash,
      timestamp: Date.now(),
    });

    // MONFFY makes its own prediction
    transition("AWAITING");

    const { prediction, reasonTrace } = makePrediction(signal, priceMonitor.getHistory());
    const predictionWithId = { ...prediction, questionId };
    await savePrediction(predictionWithId);
    await incrementStats("total_predictions");

    // Log Reason Trace — decision transparency for judges
    brainLog.info(
      {
        signal: `${reasonTrace.signal.type} (${reasonTrace.signal.priceChangePct > 0 ? "+" : ""}${reasonTrace.signal.priceChangePct.toFixed(2)}%)`,
        momentum: reasonTrace.components.momentumScore.toFixed(3),
        meanReversion: reasonTrace.components.meanReversionScore.toFixed(3),
        emaDeviation: reasonTrace.components.emaDeviation.toFixed(3),
        noise: reasonTrace.components.noise.toFixed(3),
        rawScore: reasonTrace.decision.rawScore.toFixed(3),
        clampedScore: reasonTrace.decision.clampedScore.toFixed(3),
        prediction: reasonTrace.decision.prediction,
        confidence: (reasonTrace.decision.confidence * 100).toFixed(0) + "%",
      },
      "📊 Reason Trace — why MONFFY decided"
    );

    await logAgentAction(
      ONCHAIN_ACTION.PREDICTION_MADE,
      JSON.stringify({
        questionId,
        prediction: prediction.prediction,
        reasonTrace: reasonTrace.components,
      })
    );

    await logAction({
      actionType: "PREDICTION_MADE",
      data: `${prediction.prediction} - ${prediction.reasoning}`,
      timestamp: Date.now(),
    });

    // Track active market
    addActiveMarket({ ...questionWithMarketId, id: questionId });

    brainLog.info(
      {
        questionId,
        prediction: prediction.prediction,
        onchainMarketId,
      },
      "Market created + prediction published"
    );
  }

  async function handleResolutions(): Promise<void> {
    const expired = await getExpiredUnresolvedQuestions();

    for (const q of expired) {
      // Skip if already being resolved (double-resolution guard)
      if (resolvingIds.has(q.id)) {
        brainLog.debug({ questionId: q.id }, "Skipping — already resolving");
        continue;
      }
      resolvingIds.add(q.id);

      transition("RESOLVING");

      brainLog.info(
        { questionId: q.id, text: q.question_text },
        "Resolving expired market..."
      );

      // Get current price for resolution
      const currentPrice = await fetchPriceWithFallback();
      const finalPriceScaled = BigInt(
        Math.round(currentPrice.price * 1e8)
      );
      const strikePriceScaled = q.strike_price ?? 0;
      const outcome = currentPrice.price * 1e8 > strikePriceScaled;

      // Resolve on-chain
      let txHash: string | undefined;
      if (
        config.MARKET_CONTRACT_ADDRESS &&
        q.onchain_market_id != null
      ) {
        const result = await resolveOnchainMarket(
          q.onchain_market_id,
          finalPriceScaled
        );
        if (result) {
          txHash = result.txHash;
        } else {
          brainLog.warn("On-chain resolution skipped (balance/error)");
        }
      }

      // Determine if agent was correct
      const agentPrediction = q.agent_prediction;
      const agentCorrect =
        agentPrediction != null
          ? (agentPrediction === "UP") === outcome
          : null;

      // Resolve in Supabase
      await resolveQuestion({
        questionId: q.id,
        onchainMarketId: q.onchain_market_id ?? 0,
        outcome,
        strikePrice: strikePriceScaled / 1e8,
        finalPrice: currentPrice.price,
        agentCorrect: agentCorrect ?? false,
      });

      await logAgentAction(
        ONCHAIN_ACTION.MARKET_RESOLVED,
        JSON.stringify({
          questionId: q.id,
          outcome: outcome ? "UP" : "DOWN",
          agentCorrect,
        })
      );

      await logAction({
        actionType: "MARKET_RESOLVED",
        data: `Outcome: ${outcome ? "UP" : "DOWN"}, Agent ${agentCorrect ? "correct ✅" : "wrong ❌"}`,
        txHash,
        timestamp: Date.now(),
      });

      removeActiveMarket(q.id);
      resolvingIds.delete(q.id);

      brainLog.info(
        {
          questionId: q.id,
          outcome: outcome ? "UP" : "DOWN",
          agentCorrect,
          finalPrice: currentPrice.price,
        },
        "Market resolved"
      );
    }

    // Recalculate stats once after all resolutions (DB-derived, immune to duplication)
    if (expired.length > 0) {
      await recalculateStats();
    }
  }

  async function handleNarratives(): Promise<void> {
    const unnarrated = await getResolvedWithoutNarrative();

    for (const q of unnarrated) {
      transition("NARRATING");

      const stats = await getOrCreateAgentStats();
      const participants = await getParticipantCount(q.id);

      const narrative = generateNarrative({
        questionText: q.question_text,
        outcome: q.resolution_outcome ?? false,
        agentPrediction: (q.agent_prediction as "UP" | "DOWN") ?? "UP",
        agentCorrect: q.agent_correct ?? false,
        participants,
        agentRecord: {
          wins: stats.correctPredictions,
          losses: stats.totalPredictions - stats.correctPredictions,
          accuracy: stats.accuracy,
        },
      });

      await saveNarrative(q.id, narrative);

      await logAgentAction(
        ONCHAIN_ACTION.NARRATIVE_POSTED,
        JSON.stringify({ questionId: q.id })
      );

      await logAction({
        actionType: "NARRATIVE_POSTED",
        data: narrative,
        timestamp: Date.now(),
      });

      brainLog.info({ questionId: q.id }, "Narrative generated");
    }
  }

  function canCreateQuestion(): boolean {
    const timeSinceLast = getTimeSinceLastQuestion();
    const activeCount = getState().activeMarkets.size;

    // Max 3 concurrent markets
    if (activeCount >= 3) return false;

    // Min gap between questions
    if (timeSinceLast < MIN_QUESTION_GAP_MS) return false;

    return true;
  }

  return { tick };
}

export type Brain = ReturnType<typeof createBrain>;
