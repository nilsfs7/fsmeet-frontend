export class CreateAccommodationBodyDto {
  eventId: string;
  description: string;
  cost: number;
  website: string | null;
  enabled: boolean;

  constructor(eventId: string, description: string, cost: number, website: string | null, enabled: boolean) {
    this.eventId = eventId;
    this.description = description;
    this.cost = cost;
    this.website = website;
    this.enabled = enabled;
  }
}
