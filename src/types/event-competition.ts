import { CompetitionGender } from './enums/competition-gender';
import { CompetitionType } from './enums/competition-type';

export type EventCompetition = {
  id: string | undefined;
  eventId: string | undefined;
  name: string;
  type: CompetitionType;
  gender: CompetitionGender;
  description: string;
  rules: string;
};
