export class PatchAccommodationBodyDto {
  id: string;
  description: string;
  cost: number;
  website: string;

  constructor(id: string, description: string, website: string, cost: number) {
    this.id = id;
    this.description = description;

    this.cost = cost;
    this.website = website;
  }
}
