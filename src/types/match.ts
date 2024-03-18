import { MatchSlot } from './match-slot';

export class Match {
  id?: string;
  matchIndex: number;
  name: string;
  isExtraMatch: boolean;
  slots: number;
  matchSlots: MatchSlot[];
  time?: string;

  constructor(matchIndex: number, name: string, isExtraMatch: boolean, slots: number = 1, matchSlots: MatchSlot[], time?: string, id?: string) {
    this.matchIndex = matchIndex;
    this.name = name;
    this.isExtraMatch = isExtraMatch;
    this.slots = slots;
    this.matchSlots = matchSlots;
    this.time = time;
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
