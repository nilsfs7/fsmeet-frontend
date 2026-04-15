export class CreateAccommodationBodyDto {
  eventId: string;
  description: string;
  cost: number;
  website: string;
  enabled: boolean;

  constructor(eventId: string, description: string, cost: number, website: string, enabled: boolean) {
    this.eventId = eventId;
    this.description = description;
    this.cost = cost;
    this.website = website;
    this.enabled = enabled;
  }
}
