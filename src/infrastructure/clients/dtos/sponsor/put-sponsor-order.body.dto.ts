export class PutSponsorOrderBodyDto {
  eventId: string;
  sponsorIds: string[];

  constructor(eventId: string, sponsorIds: string[]) {
    this.eventId = eventId;
    this.sponsorIds = sponsorIds;
  }
}
