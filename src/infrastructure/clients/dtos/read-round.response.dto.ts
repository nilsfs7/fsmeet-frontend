import { Moment } from 'moment';
import { ReadMatchResponseDto } from './read-match.response.dto';

export class ReadRoundResponseDto {
  id: string;
  roundIndex: number;
  name: string;
  date: Moment;
  timeLimit: boolean;
  matches: ReadMatchResponseDto[];
  advancingTotal: number;

  constructor(id: string, roundIndex: number, name: string, date: Moment, timeLimit: boolean, matches: ReadMatchResponseDto[], advancingTotal: number) {
    this.id = id;
    this.roundIndex = roundIndex;
    this.name = name;
    this.date = date;
    this.timeLimit = timeLimit;
    this.matches = matches;
    this.advancingTotal = advancingTotal;
  }
}
