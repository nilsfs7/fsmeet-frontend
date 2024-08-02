import { Moment } from 'moment';
import { Match } from './match';
import moment from 'moment';

export class Round {
  roundIndex: number;
  name: string;
  advancingTotal: number;
  matches: Match[] = [];
  date: Moment | null;

  constructor(roundIndex: number, name: string, date: Moment | null, advancingTotal: number) {
    this.roundIndex = roundIndex;
    this.name = name;
    if (date) {
      this.date = moment(date).startOf('day');
    } else {
      this.date = date;
    }
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

  addMatch(name: string, isExtraMatch: boolean, amountSlots: number) {
    this.matches.push(new Match(this.matches.length, name, isExtraMatch, amountSlots, []));
  }

  get amountSlots(): number {
    return this.matches.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.slots;
    }, 0);
  }
}
