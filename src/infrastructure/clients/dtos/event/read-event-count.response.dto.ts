export class ReadEventCountResponseDto {
  date: string;
  total: number;
  compsCount: number;
  onlineCompsCount: number;
  meetingsCount: number;

  constructor(date: string, total: number, compsCount: number, onlineCompsCount: number, meetingsCount: number) {
    this.date = date;
    this.total = total;
    this.compsCount = compsCount;
    this.onlineCompsCount = onlineCompsCount;
    this.meetingsCount = meetingsCount;
  }
}
