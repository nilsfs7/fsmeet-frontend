import { ReadPartialUser2ResponseDto } from '../user/read-partial-user-2.response.dto';
import { ReadArenaScreenStyleResponseDto } from './read-arena-screen-style.response.dto';
import { ReadMatchResponseDto } from '../competition/read-match.response.dto';

export class ReadArenaScreenResponseDto {
  activeMatch: ReadMatchResponseDto | null;
  competitionName: string | null;
  matchName: string | null;
  participants: ReadPartialUser2ResponseDto[];
  style: ReadArenaScreenStyleResponseDto;

  constructor(activeMatch: ReadMatchResponseDto | null, competitionName: string | null, matchName: string | null, participants: ReadPartialUser2ResponseDto[], style: ReadArenaScreenStyleResponseDto) {
    this.activeMatch = activeMatch;
    this.competitionName = competitionName;
    this.matchName = matchName;
    this.participants = participants;
    this.style = style;
  }
}
