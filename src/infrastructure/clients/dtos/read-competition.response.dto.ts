import { CompetitionGender } from '@/domain/enums/competition-gender';
import { CompetitionType } from '@/domain/enums/competition-type';
import { MaxAge } from '@/domain/enums/max-age';

export class ReadCompetitionResponseDto {
  id: string;
  name: string;
  type: CompetitionType;
  gender: CompetitionGender;
  maxAge: MaxAge;
  description: string;
  rules: string;
  eventId: string;

  constructor(id: string, name: string, type: CompetitionType, gender: CompetitionGender, maxAge: MaxAge, description: string, rules: string, eventId: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.gender = gender;
    this.maxAge = maxAge;
    this.description = description;
    this.rules = rules;
    this.eventId = eventId;
  }
}
