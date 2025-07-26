import { Moment } from 'moment';

export class ReadEventCountResponseDto {
  date: Moment;
  total: number;
  compsCount: number;
  onlineCompsCount: number;
  meetingsCount: number;

  constructor(date: Moment, total: number, compsCount: number, onlineCompsCount: number, meetingsCount: number) {
    this.date = date;
    this.total = total;
    this.compsCount = compsCount;
    this.onlineCompsCount = onlineCompsCount;
    this.meetingsCount = meetingsCount;
  }
}
