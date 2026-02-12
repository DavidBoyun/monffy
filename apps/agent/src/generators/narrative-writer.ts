import {
  getWinReaction,
  getLoseReaction,
  getNoParticipantsReaction,
  formatRecord,
  getCompetitiveComment,
} from "../core/personality.js";

interface NarrativeInput {
  readonly questionText: string;
  readonly outcome: boolean;
  readonly agentPrediction: "UP" | "DOWN";
  readonly agentCorrect: boolean;
  readonly participants: number;
  readonly agentRecord: {
    readonly wins: number;
    readonly losses: number;
    readonly accuracy: number;
  };
}

export function generateNarrative(input: NarrativeInput): string {
  const {
    questionText,
    outcome,
    agentPrediction,
    agentCorrect,
    participants,
    agentRecord,
  } = input;

  const outcomeEmoji = outcome ? "📈" : "📉";
  const outcomeText = outcome ? "UP ⬆️" : "DOWN ⬇️";

  const parts: string[] = [];

  // Header
  parts.push(`${outcomeEmoji} Result: ${outcomeText}`);
  parts.push("");

  // Question recap
  parts.push(`❓ "${questionText}"`);
  parts.push("");

  // Agent reaction
  if (participants === 0) {
    parts.push(getNoParticipantsReaction());
  } else if (agentCorrect) {
    parts.push(getWinReaction());
    if (participants > 0) {
      parts.push(`👥 ${participants} participants`);
    }
  } else {
    parts.push(getLoseReaction());
    if (participants > 0) {
      parts.push(`👥 Congrats to ${participants} who beat MONFFY! 🎉`);
    }
  }

  parts.push("");

  // MONFFY's prediction recap
  const predEmoji = agentPrediction === "UP" ? "⬆️" : "⬇️";
  const correctMark = agentCorrect ? "✅" : "❌";
  parts.push(
    `🐰 MONFFY predicted: ${predEmoji} ${agentPrediction} ${correctMark}`
  );

  // Record
  parts.push(formatRecord(agentRecord.wins, agentRecord.losses));
  parts.push(getCompetitiveComment(agentRecord.accuracy));

  return parts.join("\n");
}
