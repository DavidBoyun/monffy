-- MONFFY Stats Fix: Recalculate agent_stats from actual questions data
-- Run this in Supabase SQL Editor to fix corrupted 649.9% accuracy
-- Safe to run multiple times (idempotent)

-- Step 1: Check current (corrupted) stats
SELECT 'BEFORE FIX:' AS label,
       total_questions,
       total_predictions,
       correct_predictions,
       accuracy
FROM agent_stats WHERE id = 1;

-- Step 2: Count actual data from questions table
SELECT
  COUNT(*) FILTER (WHERE lane = 'prediction') AS actual_total_questions,
  COUNT(*) FILTER (WHERE lane = 'prediction' AND agent_prediction IS NOT NULL) AS actual_total_predictions,
  COUNT(*) FILTER (WHERE lane = 'prediction' AND agent_correct = true) AS actual_correct_predictions,
  CASE
    WHEN COUNT(*) FILTER (WHERE lane = 'prediction' AND agent_prediction IS NOT NULL) > 0
    THEN ROUND(
      COUNT(*) FILTER (WHERE lane = 'prediction' AND agent_correct = true)::numeric /
      COUNT(*) FILTER (WHERE lane = 'prediction' AND agent_prediction IS NOT NULL)::numeric * 100,
      1
    )
    ELSE 0
  END AS actual_accuracy
FROM questions;

-- Step 3: Fix agent_stats with actual data
UPDATE agent_stats
SET
  total_questions = (
    SELECT COUNT(*) FROM questions WHERE lane = 'prediction'
  ),
  total_predictions = (
    SELECT COUNT(*) FROM questions WHERE lane = 'prediction' AND agent_prediction IS NOT NULL
  ),
  correct_predictions = (
    SELECT COUNT(*) FROM questions WHERE lane = 'prediction' AND agent_correct = true
  ),
  accuracy = (
    SELECT CASE
      WHEN COUNT(*) FILTER (WHERE agent_prediction IS NOT NULL) > 0
      THEN ROUND(
        COUNT(*) FILTER (WHERE agent_correct = true)::numeric /
        COUNT(*) FILTER (WHERE agent_prediction IS NOT NULL)::numeric * 100,
        1
      )
      ELSE 0
    END
    FROM questions WHERE lane = 'prediction'
  ),
  last_action_at = NOW()
WHERE id = 1;

-- Step 4: Verify fix
SELECT 'AFTER FIX:' AS label,
       total_questions,
       total_predictions,
       correct_predictions,
       accuracy
FROM agent_stats WHERE id = 1;
