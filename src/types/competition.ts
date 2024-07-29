import { CompetitionGender } from './enums/competition-gender';
import { CompetitionType } from './enums/competition-type';
import { MaxAge } from './enums/max-age';

export type Competition = {
  id: string | undefined;
  eventId: string | undefined;
  name: string;
  type: CompetitionType;
  gender: CompetitionGender;
  maxAge: MaxAge;
  description: string;
  rules: string;
};
