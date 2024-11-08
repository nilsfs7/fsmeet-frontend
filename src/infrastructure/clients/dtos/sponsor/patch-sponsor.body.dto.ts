export class PatchSponsorBodyDto {
  id: string;
  name: string;
  website: string;
  isPublic: boolean;

  constructor(id: string, name: string, website: string, isPublic: boolean) {
    this.id = id;
    this.name = name;
    this.website = website;
    this.isPublic = isPublic;
  }
}
