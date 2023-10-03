import { Match } from './match';

export class Round {
  public name: string;
  public numberPlayers: number;
  public maxMatchSize: number = 2;
  public matches: Match[] = [];
  public passingPerMatch: number = 1;
  public passingExtra: number = 0;

  constructor(roundIndex: number, name: string, numberPlayers: number) {
    this.name = name;
    this.numberPlayers = numberPlayers;

    this.matches = this.createMatches(roundIndex);
  }

  public get advancingTotal(): number {
    const advancing = this.matches.length * this.passingPerMatch + this.passingExtra;

    if (advancing > this.numberPlayers) {
      return this.numberPlayers;
    }

    return advancing;
  }

  public get maxPossibleAdvancingExtra(): number {
    const maxAdvancingExtra = this.numberPlayers - this.matches.length * this.passingPerMatch;

    if (maxAdvancingExtra < 0) {
      return 0;
    }

    return maxAdvancingExtra;
  }

  public createMatches = (roundIndex: number): Match[] => {
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
        matches.push({ name: `Match ${i + 1}`, roundIndex: roundIndex, slots: this.maxMatchSize });
      }
    } else {
      let initialSlots = getInitialMatchSize(this.numberPlayers, numMatches, this.maxMatchSize);
      let distributedSlots = 0;

      // distribute save (initial) slots
      for (let i = 0; i < numMatches; i++) {
        matches.push({ name: `Match ${i + 1}`, roundIndex: roundIndex, slots: initialSlots });
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
}
