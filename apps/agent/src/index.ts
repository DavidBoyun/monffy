import { config } from "./config.js";
import { agentLog } from "./utils/logger.js";
import { logAgentInfo } from "./utils/monad-client.js";
import { testSupabaseConnection } from "./utils/supabase-client.js";
import { createPriceMonitor } from "./monitors/price-monitor.js";
import { createBrain } from "./core/brain.js";
import { getState, getUptimeSeconds } from "./core/state.js";
import { updateUptime, getOrCreateAgentStats } from "./executors/supabase-executor.js";

async function main(): Promise<void> {
  agentLog.info("===========================================");
  agentLog.info("🐰 MONFFY Claw Agent - Game Master AI");
  agentLog.info("===========================================");

  // Step 1: Verify infrastructure
  agentLog.info("Verifying infrastructure...");

  const [supabaseOk] = await Promise.all([
    testSupabaseConnection(),
    logAgentInfo(),
  ]);

  if (!supabaseOk) {
    agentLog.error("Supabase connection failed. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.");
    process.exit(1);
  }

  // Initialize stats
  await getOrCreateAgentStats();

  agentLog.info(
    {
      priceInterval: `${config.PRICE_CHECK_INTERVAL_MS}ms`,
      brainInterval: `${config.BRAIN_TICK_INTERVAL_MS}ms`,
      priceThreshold: `${config.PRICE_THRESHOLD_PCT}%`,
      marketDuration: `${config.MARKET_DURATION_SECS}s`,
    },
    "Configuration loaded"
  );

  // Step 2: Start price monitor
  const priceMonitor = createPriceMonitor();
  priceMonitor.start();

  // Step 3: Start brain
  const brain = createBrain(priceMonitor);

  agentLog.info("🧠 Brain starting autonomous loop...");

  const brainInterval = setInterval(async () => {
    try {
      await brain.tick();
    } catch (err) {
      agentLog.error({ err }, "Brain tick fatal error");
    }
  }, config.BRAIN_TICK_INTERVAL_MS);

  // Step 4: Uptime tracker (every 60s)
  const uptimeInterval = setInterval(async () => {
    const uptime = getUptimeSeconds();
    await updateUptime(uptime);

    const state = getState();
    agentLog.debug(
      {
        state: state.state,
        uptime: `${Math.floor(uptime / 60)}m`,
        activeMarkets: state.activeMarkets.size,
        ticks: state.tickCount,
      },
      "Heartbeat"
    );
  }, 60_000);

  // Step 5: Status report (every 5 min)
  const statusInterval = setInterval(async () => {
    const stats = await getOrCreateAgentStats();
    const state = getState();
    const latestPrice = priceMonitor.getLatestPrice();

    agentLog.info(
      {
        state: state.state,
        uptime: `${Math.floor(getUptimeSeconds() / 60)}m`,
        questions: stats.totalQuestions,
        predictions: stats.totalPredictions,
        accuracy: `${stats.accuracy.toFixed(1)}%`,
        activeMarkets: state.activeMarkets.size,
        latestPrice: latestPrice
          ? `${latestPrice.symbol} $${latestPrice.price.toFixed(4)}`
          : "N/A",
      },
      "📊 MONFFY Status Report"
    );
  }, 5 * 60 * 1000);

  // Graceful shutdown
  const shutdown = () => {
    agentLog.info("Shutting down MONFFY Claw Agent...");
    priceMonitor.stop();
    clearInterval(brainInterval);
    clearInterval(uptimeInterval);
    clearInterval(statusInterval);
    agentLog.info("👋 MONFFY out! See you next time!");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  agentLog.info("🐰 MONFFY Claw Agent is LIVE! Monitoring markets...");
}

main().catch((err) => {
  agentLog.fatal({ err }, "MONFFY Claw Agent crashed");
  process.exit(1);
});
