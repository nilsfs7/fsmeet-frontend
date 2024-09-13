export class ReadSponsorResponseDto {
  id: string;
  name: string;
  eventId: string;

  constructor(id: string, name: string, eventId: string) {
    this.id = id;
    this.name = name;
    this.eventId = eventId;
  }
}
