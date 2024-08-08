import { Moment } from 'moment';
import { ReadMatchSlotResponseDto } from './read-match-slots.response.dto';

export class ReadMatchResponseDto {
  id: string;
  matchIndex: number;
  name: string;
  time: Moment;
  isExtraMatch: boolean;
  slots: number;
  matchSlots: ReadMatchSlotResponseDto[];

  constructor(id: string, matchIndex: number, name: string, time: Moment, isExtraMatch: boolean, slots: number, matchSlots: ReadMatchSlotResponseDto[]) {
    this.id = id;
    this.matchIndex = matchIndex;
    this.name = name;
    this.time = time;
    this.isExtraMatch = isExtraMatch;
    this.slots = slots;
    this.matchSlots = matchSlots;
  }
}
