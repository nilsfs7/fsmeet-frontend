export class PatchSponsorBodyDto {
  name: string;
  website: string;
  isPublic: boolean;

  constructor(name: string, website: string, isPublic: boolean) {
    this.name = name;
    this.website = website;
    this.isPublic = isPublic;
  }
}
