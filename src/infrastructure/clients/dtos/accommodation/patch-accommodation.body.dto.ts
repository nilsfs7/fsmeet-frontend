export class PatchAccommodationBodyDto {
  id: string;
  description: string;
  cost: number;
  website: string;
  previewBase64: string | null;
  enabled: boolean;

  constructor(id: string, description: string, cost: number, website: string, previewBase64: string | null, enabled: boolean) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.website = website;
    this.previewBase64 = previewBase64;
    this.enabled = enabled;
  }
}
