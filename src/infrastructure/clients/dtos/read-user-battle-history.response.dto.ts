import { ReadRoundResponseDto } from './read-round.response.dto';

export class ReadUserBattleHistoryResponseDto {
  competitionId: string;
  rounds: ReadRoundResponseDto[];

  constructor(competitionId: string, rounds: ReadRoundResponseDto[]) {
    this.competitionId = competitionId;
    this.rounds = rounds;
  }
}
