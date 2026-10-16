export class PutAccommodationOrderBodyDto {
  eventId: string;
  accommodationIds: string[];

  constructor(eventId: string, accommodationIds: string[]) {
    this.eventId = eventId;
    this.accommodationIds = accommodationIds;
  }
}
