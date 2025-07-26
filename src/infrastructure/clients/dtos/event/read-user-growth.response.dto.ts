import { Moment } from 'moment';

export class ReadUserGrowthResponseDto {
  date: Moment;
  userCount: number;

  constructor(date: Moment, userCount: number) {
    this.date = date;
    this.userCount = userCount;
  }
}
