import { CompetitionType } from './enums/competition-type';

export type EventCompetition = {
  id: string | undefined;
  eventId: string | undefined;
  name: string;
  type: CompetitionType;
  description: string;
  rules: string;
};
