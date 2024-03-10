import { Match } from './match';

export class Round {
  roundIndex: number;
  name: string;
  numberPlayers: number;
  maxMatchSize: number = 2;
  matches: Match[] = [];
  passingPerMatch: number = 1;
  passingExtra: number = 0;
  matchStartingIndex: number = 0;

  constructor(roundIndex: number, name: string, numberPlayers: number, matchStartingIndex: number = 0) {
    this.roundIndex = roundIndex;
    this.name = name;
    this.numberPlayers = numberPlayers;
    this.matchStartingIndex = matchStartingIndex;

    this.matches = this.createMatches();
  }

  get advancingTotal(): number {
    const advancing = this.matches.length * this.passingPerMatch + this.passingExtra;

    if (advancing > this.numberPlayers) {
      return this.numberPlayers;
    }

    return advancing;
  }

  get maxPossibleAdvancingExtra(): number {
    const maxAdvancingExtra = this.numberPlayers - this.matches.length * this.passingPerMatch;

    if (maxAdvancingExtra < 0) {
      return 0;
    }

    return maxAdvancingExtra;
  }

  get matchesAscending(): Match[] {
    return this.matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1));
  }

  get cumulatedMatchStartingIndex(): number {
    return this.matchStartingIndex + this.matches.length;
  }

  createMatches = (): Match[] => {
    const getInitialMatchSize = (numPlayers: number, numMatches: number, maxMatchSize: number): number => {
      while (numMatches * maxMatchSize > numPlayers) {
        maxMatchSize -= 1;
      }

      return maxMatchSize;
    };

    let matches: Match[] = [];

    const numMatches: number = Math.ceil(this.numberPlayers / this.maxMatchSize);

    const modulo = this.numberPlayers % this.maxMatchSize;
    if (modulo === 0) {
      for (let i = 0; i < numMatches; i++) {
        matches.push(new Match(i, `Match ${i + this.matchStartingIndex + 1}`, this.maxMatchSize, []));
      }
    } else {
      let initialSlots = getInitialMatchSize(this.numberPlayers, numMatches, this.maxMatchSize);
      let distributedSlots = 0;

      // distribute save (initial) slots
      for (let i = 0; i < numMatches; i++) {
        matches.push(new Match(i, `Match ${i + this.matchStartingIndex + 1}`, initialSlots, []));
        distributedSlots += initialSlots;
      }

      // distribute leftover slots
      const slotsLeft = this.numberPlayers - distributedSlots;
      for (let i = 0; i < slotsLeft; i++) {
        matches[i].slots += 1;
      }
    }

    return matches;
  };

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
}
