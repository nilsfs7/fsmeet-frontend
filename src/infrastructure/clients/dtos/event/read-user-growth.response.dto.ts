import { Moment } from 'moment';

export class ReadUserGrowthResponseDto {
  date: Moment;
  total: number;
  malesCount: number;
  femalesCount: number;

  constructor(date: Moment, total: number, malesCount: number, femalesCount: number) {
    this.date = date;
    this.total = total;
    this.malesCount = malesCount;
    this.femalesCount = femalesCount;
  }
}
