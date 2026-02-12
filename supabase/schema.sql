-- MONFFY Database Schema
-- Supabase PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== TABLES ====================

-- Sponsors (must be created BEFORE questions due to FK reference)
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'premium', 'exclusive')),
    monthly_fee_krw INTEGER NOT NULL, -- Korean Won
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Questions table (all 3 lanes: luck, prediction, sponsor)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lane VARCHAR(20) NOT NULL CHECK (lane IN ('luck', 'prediction', 'sponsor')),
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- ["option1", "option2", ...]
    correct_answer INTEGER, -- NULL for predictions (resolved later)
    sponsor_id UUID REFERENCES sponsors(id),
    pyth_price_id VARCHAR(66), -- For prediction markets
    strike_price BIGINT, -- For prediction markets (scaled by 10^8)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_outcome BOOLEAN, -- For predictions: true=UP, false=DOWN
    is_active BOOLEAN DEFAULT true,

    CONSTRAINT valid_prediction CHECK (
        (lane = 'prediction' AND pyth_price_id IS NOT NULL AND strike_price IS NOT NULL)
        OR (lane != 'prediction')
    )
);

-- User responses
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL,
    selected_option INTEGER NOT NULL,
    is_correct BOOLEAN, -- NULL until question resolved
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (question_id, wallet_address) -- One response per user per question
);

-- Daily streaks (wallet-based)
CREATE TABLE IF NOT EXISTS daily_streaks (
    wallet_address VARCHAR(42) PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    total_points INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_predictions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge minting records (mirrors on-chain data)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    token_id INTEGER NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    minted_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (wallet_address, badge_type)
);

-- Daily metrics (analytics)
CREATE TABLE IF NOT EXISTS daily_metrics (
    date DATE PRIMARY KEY,
    total_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    predictions_made INTEGER DEFAULT 0,
    sponsor_impressions INTEGER DEFAULT 0,
    total_volume_mon NUMERIC(20, 8) DEFAULT 0,
    protocol_fees_mon NUMERIC(20, 8) DEFAULT 0
);

-- Leaderboard cache (refreshed periodically)
CREATE TABLE IF NOT EXISTS leaderboard (
    wallet_address VARCHAR(42) PRIMARY KEY,
    rank INTEGER,
    total_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    prediction_accuracy NUMERIC(5, 2), -- percentage
    badges_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================

CREATE INDEX IF NOT EXISTS idx_questions_lane ON questions(lane);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_questions_sponsor ON questions(sponsor_id) WHERE sponsor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_responses_wallet ON responses(wallet_address);
CREATE INDEX IF NOT EXISTS idx_responses_question ON responses(question_id);
CREATE INDEX IF NOT EXISTS idx_responses_created ON responses(created_at);

CREATE INDEX IF NOT EXISTS idx_badges_wallet ON badges(wallet_address);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard(total_points DESC);

-- ==================== FUNCTIONS ====================

-- Update streak on response
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    current_date_val DATE := CURRENT_DATE;
BEGIN
    -- Get or create streak record
    INSERT INTO daily_streaks (wallet_address, current_streak, last_activity_date)
    VALUES (NEW.wallet_address, 0, NULL)
    ON CONFLICT (wallet_address) DO NOTHING;

    SELECT last_activity_date INTO last_date
    FROM daily_streaks
    WHERE wallet_address = NEW.wallet_address;

    -- Update streak
    IF last_date IS NULL OR last_date < current_date_val - INTERVAL '1 day' THEN
        -- Streak broken or first activity
        UPDATE daily_streaks
        SET current_streak = 1,
            last_activity_date = current_date_val,
            total_questions_answered = total_questions_answered + 1,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    ELSIF last_date = current_date_val - INTERVAL '1 day' THEN
        -- Consecutive day
        UPDATE daily_streaks
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = current_date_val,
            total_questions_answered = total_questions_answered + 1,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    ELSIF last_date = current_date_val THEN
        -- Same day, just increment questions
        UPDATE daily_streaks
        SET total_questions_answered = total_questions_answered + 1,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update points on correct answer
CREATE OR REPLACE FUNCTION update_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_correct = true AND NEW.points_earned > 0 THEN
        UPDATE daily_streaks
        SET total_points = total_points + NEW.points_earned,
            updated_at = NOW()
        WHERE wallet_address = NEW.wallet_address;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

CREATE TRIGGER trigger_update_streak
AFTER INSERT ON responses
FOR EACH ROW
EXECUTE FUNCTION update_streak();

CREATE TRIGGER trigger_update_points
AFTER UPDATE OF is_correct ON responses
FOR EACH ROW
EXECUTE FUNCTION update_points();

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Public read access for questions (active AND resolved, for narrative feed)
CREATE POLICY "Questions are viewable by everyone"
ON questions FOR SELECT
USING (true);

-- Users can view their own responses
CREATE POLICY "Users can view own responses"
ON responses FOR SELECT
USING (true);

-- Users can insert their own responses
CREATE POLICY "Users can insert own responses"
ON responses FOR INSERT
WITH CHECK (true);

-- Public read for sponsors
CREATE POLICY "Sponsors are viewable by everyone"
ON sponsors FOR SELECT
USING (is_active = true);

-- Users can view their own streaks
CREATE POLICY "Users can view all streaks"
ON daily_streaks FOR SELECT
USING (true);

-- Badges are public
CREATE POLICY "Badges are viewable by everyone"
ON badges FOR SELECT
USING (true);

-- Leaderboard is public
CREATE POLICY "Leaderboard is viewable by everyone"
ON leaderboard FOR SELECT
USING (true);

-- ==================== SEED DATA (SAMPLE) ====================

-- Sample culture questions
INSERT INTO questions (lane, category, question_text, options, correct_answer) VALUES
('luck', '한국 문화', '한국의 전통 명절 중 음력 1월 1일을 무엇이라 부르나요?', '["추석", "설날", "한식", "단오"]', 1),
('luck', 'K-POP', 'BTS의 공식 팬클럽 이름은?', '["ARMY", "BLINK", "ONCE", "STAY"]', 0),
('luck', '한국 역사', '조선의 4대 임금으로, 한글을 창제한 왕은?', '["태조", "태종", "세종", "성종"]', 2);

-- Note: Prediction questions are created dynamically by the agent
-- Note: Sponsor questions require sponsors to be added first
