import { MatchSlot } from './match-slot';

export class Match {
  id?: string;
  matchIndex: number;
  name: string;
  slots: number;
  matchSlots: MatchSlot[];
  time?: string;
  // TODO: isExtraMatch: boolean,

  constructor(matchIndex: number, name: string, slots: number = 1, matchSlots: MatchSlot[], time?: string, id?: string) {
    this.matchIndex = matchIndex;
    this.name = name;
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
