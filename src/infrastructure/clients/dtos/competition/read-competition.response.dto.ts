import { CompetitionGender } from '@/domain/enums/competition-gender';
import { CompetitionType } from '@/domain/enums/competition-type';
import { MaxAge } from '@/domain/enums/max-age';
import { ReadPartialUser1ResponseDto } from '../user/read-partial-user-1.response.dto';

export class ReadCompetitionResponseDto {
  id: string;
  name: string;
  type: CompetitionType;
  gender: CompetitionGender;
  maxAge: MaxAge;
  isFollowUpCompetition: boolean;
  participationFee: number;
  participationFeeIncPaymentCosts: number;
  description: string;
  rules: string;
  judges: ReadPartialUser1ResponseDto[];
  eventId: string;

  constructor(
    id: string,
    name: string,
    type: CompetitionType,
    gender: CompetitionGender,
    maxAge: MaxAge,
    isFollowUpCompetition: boolean,
    participationFee: number,
    participationFeeIncPaymentCosts: number,
    description: string,
    rules: string,
    judges: ReadPartialUser1ResponseDto[],
    eventId: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.gender = gender;
    this.maxAge = maxAge;
    this.isFollowUpCompetition = isFollowUpCompetition;
    this.participationFee = participationFee;
    this.participationFeeIncPaymentCosts = participationFeeIncPaymentCosts;
    this.description = description;
    this.rules = rules;
    this.judges = judges;
    this.eventId = eventId;
  }
}
