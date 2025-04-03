export class CreateAccommodationBodyDto {
  eventId: string;
  description: string;
  cost: number;
  website: string;

  constructor(eventId: string, description: string, cost: number, website: string) {
    this.eventId = eventId;
    this.description = description;
    this.cost = cost;
    this.website = website;
  }
}
