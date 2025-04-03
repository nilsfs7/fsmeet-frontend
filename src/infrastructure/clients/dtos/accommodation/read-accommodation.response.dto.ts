export class ReadAccommodationResponseDto {
  id: string;
  description: string;
  cost: number;
  website: string;
  imageUrlPreview: string;
  eventId: string;

  constructor(id: string, description: string, cost: number, website: string, imageUrlPreview: string, eventId: string) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.website = website;
    this.imageUrlPreview = imageUrlPreview;
    this.eventId = eventId;
  }
}
