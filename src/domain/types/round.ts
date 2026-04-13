import { createMatch, matchContainsParticipant, type Match } from '@/domain/types/match';

export type Round = {
  roundIndex: number;
  name: string;
  date: string | null;
  timeLimit: boolean;
  advancingTotal: number;
  matches: Match[];
};

export function createRound(roundIndex: number, name: string, date: string | null, timeLimit: boolean, advancingTotal: number, matches: Match[] = []): Round {
  return { roundIndex, name, date, timeLimit, advancingTotal, matches };
}

export function roundMatchesAscending(round: { matches: Match[] }): Match[] {
  return [...round.matches].sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1));
}

export function roundContainsParticipant(round: { matches: Match[] }, username: string): boolean {
  for (const match of round.matches) {
    if (matchContainsParticipant(match, username)) {
      return true;
    }
  }
  return false;
}

export function roundAddMatch(round: { matches: Match[] }, name: string, matchTime: string | null, isExtraMatch: boolean, amountSlots: number): void {
  round.matches.push(createMatch(round.matches.length, name, matchTime, isExtraMatch, amountSlots, []));
}
