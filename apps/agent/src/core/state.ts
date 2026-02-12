import type { AgentState, AgentQuestion } from "../utils/types.js";
import { brainLog } from "../utils/logger.js";

export interface AgentStateData {
  readonly state: AgentState;
  readonly activeMarkets: ReadonlyMap<string, AgentQuestion>;
  readonly lastQuestionTime: number;
  readonly lastResolveTime: number;
  readonly startedAt: number;
  readonly tickCount: number;
}

const INITIAL_STATE: AgentStateData = {
  state: "MONITORING",
  activeMarkets: new Map(),
  lastQuestionTime: 0,
  lastResolveTime: 0,
  startedAt: Date.now(),
  tickCount: 0,
};

let currentState: AgentStateData = INITIAL_STATE;

export function getState(): AgentStateData {
  return currentState;
}

export function setState(update: Partial<AgentStateData>): AgentStateData {
  const previous = currentState;
  currentState = { ...currentState, ...update };

  if (update.state && update.state !== previous.state) {
    brainLog.info(
      { from: previous.state, to: update.state },
      "State transition"
    );
  }

  return currentState;
}

export function transition(newState: AgentState): AgentStateData {
  return setState({ state: newState });
}

export function addActiveMarket(question: AgentQuestion): AgentStateData {
  const updated = new Map(currentState.activeMarkets);
  updated.set(question.id, question);
  return setState({
    activeMarkets: updated,
    lastQuestionTime: Date.now(),
  });
}

export function removeActiveMarket(questionId: string): AgentStateData {
  const updated = new Map(currentState.activeMarkets);
  updated.delete(questionId);
  return setState({ activeMarkets: updated });
}

export function incrementTick(): AgentStateData {
  return setState({ tickCount: currentState.tickCount + 1 });
}

export function getUptimeSeconds(): number {
  return Math.floor((Date.now() - currentState.startedAt) / 1000);
}

export function getTimeSinceLastQuestion(): number {
  if (currentState.lastQuestionTime === 0) return Infinity;
  return Date.now() - currentState.lastQuestionTime;
}
