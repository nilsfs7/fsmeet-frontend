import { Match } from './match';

export class Round {
  roundIndex: number;
  name: string;
  date: string | null;
  advancingTotal: number;
  matches: Match[] = [];

  constructor(roundIndex: number, name: string, date: string | null, advancingTotal: number) {
    this.roundIndex = roundIndex;
    this.name = name;
    this.date = date;
    this.advancingTotal = advancingTotal;
  }

  get matchesAscending(): Match[] {
    return this.matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1));
  }

  containsParticipant(username: string): boolean {
    let userFound = false;
    for (const match of this.matches) {
      if (match.containsParticipant(username)) {
        userFound = true;
        break;
      }
    }

    return userFound;
  }

  addMatch(name: string, matchTime: string | null, isExtraMatch: boolean, amountSlots: number) {
    this.matches.push(new Match(this.matches.length, name, matchTime, isExtraMatch, amountSlots, []));
  }

  get amountSlots(): number {
    return this.matches.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.slots;
    }, 0);
  }
}
