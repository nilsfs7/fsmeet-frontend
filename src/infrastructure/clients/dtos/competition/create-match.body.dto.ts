export class CreateMatchBodyDto {
  matchIndex: number;
  name: string;
  time: string | null;
  isExtraMatch: boolean;
  slots: number;

  constructor(matchIndex: number, name: string, time: string | null, isExtraMatch: boolean, slots: number) {
    this.matchIndex = matchIndex;
    this.name = name;
    this.time = time;
    this.isExtraMatch = isExtraMatch;
    this.slots = slots;
  }
}
