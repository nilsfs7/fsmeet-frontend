export class PatchSponsorBodyDto {
  id: string;
  name: string;
  website: string;

  constructor(id: string, name: string, website: string) {
    this.id = id;
    this.name = name;
    this.website = website;
  }
}
