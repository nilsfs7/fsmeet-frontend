export class ReadSponsorResponseDto {
  id: string;
  name: string;
  website: string;
  imageUrlLogo: string;
  isPublic: boolean;
  eventId: string;

  constructor(id: string, name: string, website: string, imageUrlLogo: string, isPublic: boolean, eventId: string) {
    this.id = id;
    this.name = name;
    this.website = website;
    this.imageUrlLogo = imageUrlLogo;
    this.isPublic = isPublic;
    this.eventId = eventId;
  }
}
