export class PatchAccommodationBodyDto {
  id: string;
  description: string;
  cost: number;
  website: string;
  enabled: boolean;

  constructor(id: string, description: string, cost: number, website: string, enabled: boolean) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.website = website;
    this.enabled = enabled;
  }
}
