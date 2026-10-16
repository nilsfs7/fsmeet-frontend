export class ReadSponsorResponseDto {
  id: string;
  index: number;
  name: string;
  website: string;
  imageUrlLogo: string;
  isPublic: boolean;
  eventId: string;

  constructor(id: string, index: number, name: string, website: string, imageUrlLogo: string, isPublic: boolean, eventId: string) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.website = website;
    this.imageUrlLogo = imageUrlLogo;
    this.isPublic = isPublic;
    this.eventId = eventId;
  }
}
