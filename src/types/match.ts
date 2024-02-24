import { MatchSlot } from './match-slot';

export type Match = {
  id?: string;
  matchIndex: number;
  name: string;
  slots: number;
  matchSlots: MatchSlot[];
  time?: string;
};
