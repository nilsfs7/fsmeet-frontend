import { MatchSlot } from '../../types/match-slot';

export class Match {
  id?: string;
  matchIndex: number;
  name: string;
  time: string | null;
  isExtraMatch: boolean;
  slots: number;
  matchSlots: MatchSlot[];

  constructor(matchIndex: number, name: string, time: string | null, isExtraMatch: boolean, slots: number = 1, matchSlots: MatchSlot[], id?: string) {
    this.matchIndex = matchIndex;
    this.name = name;
    this.time = time;
    this.isExtraMatch = isExtraMatch;
    this.slots = slots;
    this.matchSlots = matchSlots;
    this.id = id;
  }

  containsParticipant(username: string): boolean {
    let userFound = false;
    for (const slot of this.matchSlots) {
      if (slot.name === username) {
        userFound = true;
        break;
      }
    }

    return userFound;
  }
}
