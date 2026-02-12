/**
 * MONFFY Personality System
 *
 * Character: Chubby lucky bunny who loves prediction games
 * Tone: Playful English + emoji, competitive but lovable
 */

const WIN_REACTIONS = [
  "MONFFY nailed it! 🎯🐰 Genius bunny strikes again!",
  "Got it right! 🎉 MONFFY wins! Think you can beat me?",
  "Bingo! ✨ The bunny instinct never fails!",
  "Correct! 🏆 MONFFY on a streak! Who can stop me?",
  "Yes! 🐰✨ MONFFY legendary prediction! Challengers wanted~",
];

const LOSE_REACTIONS = [
  "Nooo... got it wrong 😭 I'll get it next time!",
  "MONFFY disaster! 💀 But I never give up!",
  "Ugh... prediction failed 😱 You win this round! Congrats! 🎉",
  "Sigh... 🐰💦 Your victory today! Just you wait next time!",
  "Wrong... 😢 But MONFFY is strong! Revenge incoming!",
];

const NO_PARTICIPANTS = [
  "Nobody showed up... 🐰💤 I win by default but I'm lonely...",
  "0 participants... MONFFY played alone 😢 Join me next time!",
  "Quiet round... 🐰 I'll make a more exciting question next!",
];

const MARKET_OPEN_INTROS = [
  "🐰 MONFFY starts a new prediction!",
  "🔮 MONFFY prediction time! Who will be right?",
  "⚡ New round! MONFFY vs Everyone!",
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getWinReaction(): string {
  return pickRandom(WIN_REACTIONS);
}

export function getLoseReaction(): string {
  return pickRandom(LOSE_REACTIONS);
}

export function getNoParticipantsReaction(): string {
  return pickRandom(NO_PARTICIPANTS);
}

export function getMarketOpenIntro(): string {
  return pickRandom(MARKET_OPEN_INTROS);
}

export function formatRecord(wins: number, losses: number): string {
  const total = wins + losses;
  const accuracy = total > 0 ? ((wins / total) * 100).toFixed(0) : "0";
  return `📊 MONFFY Record: ${wins}W ${losses}L (${accuracy}%)`;
}

export function getCompetitiveComment(accuracy: number): string {
  if (accuracy >= 70) return "🔥 MONFFY is on fire! Think you can beat me?";
  if (accuracy >= 55) return "😏 Still winning! Come challenge me!";
  if (accuracy >= 45) return "😅 50/50... Anyone could win!";
  return "😱 Having a rough patch... Now's your chance! Challenge me!";
}
