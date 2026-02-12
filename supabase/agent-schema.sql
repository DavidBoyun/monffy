-- MONFFY Claw Agent - Additional Schema
-- Run this AFTER the base schema.sql

-- ==================== Extend questions table ====================

-- Agent prediction for this question (UP or DOWN)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS agent_prediction VARCHAR(10);
-- Whether agent's prediction was correct
ALTER TABLE questions ADD COLUMN IF NOT EXISTS agent_correct BOOLEAN;
-- Agent-generated narrative after resolution
ALTER TABLE questions ADD COLUMN IF NOT EXISTS agent_narrative TEXT;
-- What triggered this question (SPIKE, DUMP, QUIET)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS trigger_type VARCHAR(20);
-- On-chain market ID from MicroMarket contract
ALTER TABLE questions ADD COLUMN IF NOT EXISTS onchain_market_id INTEGER;

-- ==================== Agent Stats (singleton) ====================

CREATE TABLE IF NOT EXISTS agent_stats (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    total_questions INTEGER DEFAULT 0,
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    accuracy NUMERIC(5, 2) DEFAULT 0,
    uptime_seconds INTEGER DEFAULT 0,
    last_action_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize singleton
INSERT INTO agent_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ==================== Agent Actions Log ====================

CREATE TABLE IF NOT EXISTS agent_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type VARCHAR(30) NOT NULL,
    data TEXT NOT NULL,
    tx_hash VARCHAR(66),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_actions_type ON agent_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_agent_actions_created ON agent_actions(created_at DESC);

-- ==================== Agent Narratives ====================

CREATE TABLE IF NOT EXISTS agent_narratives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id),
    narrative_text TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    agent_won BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_narratives_created ON agent_narratives(created_at DESC);

-- ==================== RLS Policies ====================

ALTER TABLE agent_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_narratives ENABLE ROW LEVEL SECURITY;

-- Public read access for agent data (everyone can see the agent)
CREATE POLICY "Agent stats are viewable by everyone"
ON agent_stats FOR SELECT USING (true);

CREATE POLICY "Agent actions are viewable by everyone"
ON agent_actions FOR SELECT USING (true);

CREATE POLICY "Agent narratives are viewable by everyone"
ON agent_narratives FOR SELECT USING (true);

-- Service role can do everything (agent uses service key)
-- No INSERT/UPDATE policies needed for anon role - agent operates via service key
