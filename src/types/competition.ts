import { CompetitionGender } from '../domain/enums/competition-gender';
import { CompetitionType } from '../domain/enums/competition-type';
import { MaxAge } from '../domain/enums/max-age';

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
