export class ReadAccommodationResponseDto {
  id: string;
  index: number;
  description: string;
  cost: number;
  costIncPaymentCosts: number;
  website: string;
  imageUrlPreview: string;
  enabled: boolean;
  eventId: string;

  constructor(id: string, index: number, description: string, cost: number, costIncPaymentCosts: number, website: string, imageUrlPreview: string, enabled: boolean, eventId: string) {
    this.id = id;
    this.index = index;
    this.description = description;
    this.cost = cost;
    this.costIncPaymentCosts = costIncPaymentCosts;
    this.website = website;
    this.imageUrlPreview = imageUrlPreview;
    this.enabled = enabled;
    this.eventId = eventId;
  }
}
