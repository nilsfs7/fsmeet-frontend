export class PutOfferingOrderBodyDto {
  eventId: string;
  offeringIds: string[];

  constructor(eventId: string, offeringIds: string[]) {
    this.eventId = eventId;
    this.offeringIds = offeringIds;
  }
}
