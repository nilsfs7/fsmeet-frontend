export class PutCompetitionOrderBodyDto {
  eventId: string;
  competitionIds: string[];

  constructor(eventId: string, competitionIds: string[]) {
    this.eventId = eventId;
    this.competitionIds = competitionIds;
  }
}
