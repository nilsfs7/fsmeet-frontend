export class CreateSponsorBodyDto {
  eventId: string;
  name: string;

  constructor(eventId: string, name: string) {
    this.eventId = eventId;
    this.name = name;
  }
}
