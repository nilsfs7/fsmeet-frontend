import { Match } from './match';

// TODO: cleanup
export class Round {
  roundIndex: number;
  name: string;
  // numberPlayers: number;
  advancingTotal: number;
  // passingPerMatch: number = 1;
  matches: Match[] = [];
  // passingExtra: number = 0;

  constructor(roundIndex: number, name: string, advancingTotal: number) {
    //  passingPerMatch = 1
    // numberPlayers: number
    this.roundIndex = roundIndex;
    this.name = name;
    // this.numberPlayers = numberPlayers;
    this.advancingTotal = advancingTotal;
    // this.passingPerMatch = passingPerMatch;
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

  addMatch(name: string, amountSlots: number) {
    this.matches.push(new Match(this.matches.length, name, amountSlots, []));
  }

  get amountSlots(): number {
    return this.matches.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.slots;
    }, 0);
  }
}
