export class ReadUserGrowthResponseDto {
  date: string;
  total: number;
  malesCount: number;
  femalesCount: number;
  maleFreestylersCount: number;
  femaleFreestylersCount: number;

  constructor(date: string, total: number, malesCount: number, femalesCount: number, maleFreestylersCount: number, femaleFreestylersCount: number) {
    this.date = date;
    this.total = total;
    this.malesCount = malesCount;
    this.femalesCount = femalesCount;
    this.maleFreestylersCount = maleFreestylersCount;
    this.femaleFreestylersCount = femaleFreestylersCount;
  }
}
