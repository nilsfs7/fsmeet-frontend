export class PatchAccommodationBodyDto {
  id: string;
  description: string;
  cost: number;
  website: string;

  constructor(id: string, description: string, cost: number, website: string) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.website = website;
  }
}
