import { Moment } from 'moment';
import { CreateMatchBodyDto } from './create-match.body.dto';

export class CreateRoundBodyDto {
  roundIndex: number;
  name: string;
  date: Moment;
  timeLimit: boolean;
  matches: CreateMatchBodyDto[];
  advancingTotal: number;

  constructor(roundIndex: number, name: string, date: Moment, timeLimit: boolean, matches: CreateMatchBodyDto[], advancingTotal: number) {
    this.roundIndex = roundIndex;
    this.name = name;
    this.date = date;
    this.timeLimit = timeLimit;
    this.matches = matches;
    this.advancingTotal = advancingTotal;
  }
}
