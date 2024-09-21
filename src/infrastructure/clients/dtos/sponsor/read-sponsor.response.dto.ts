export class ReadSponsorResponseDto {
  id: string;
  name: string;
  website: string;
  eventId: string;
  imageUrlLogo?: string;

  constructor(id: string, name: string, website: string, eventId: string, imageUrlLogo?: string) {
    this.id = id;
    this.name = name;
    this.website = website;
    this.eventId = eventId;
    this.imageUrlLogo = imageUrlLogo;
  }
}
