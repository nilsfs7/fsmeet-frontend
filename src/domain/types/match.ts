import type { MatchSlot } from '@/domain/types/match-slot';

export type Match = {
  id?: string;
  matchIndex: number;
  name: string;
  time: string | null;
  isExtraMatch: boolean;
  slots: number;
  matchSlots: MatchSlot[];
};

export function createMatch(matchIndex: number, name: string, time: string | null, isExtraMatch: boolean, slots: number, matchSlots: MatchSlot[], id?: string): Match {
  return { matchIndex, name, time, isExtraMatch, slots, matchSlots, id };
}

export function matchContainsParticipant(match: { matchSlots: MatchSlot[] }, username: string): boolean {
  for (const slot of match.matchSlots) {
    if (slot.name === username) {
      return true;
    }
  }
  return false;
}
