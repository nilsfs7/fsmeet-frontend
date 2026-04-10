export class PatchAccommodationBodyDto {
  description: string;
  cost: number;
  website: string;
  previewBase64: string | null;
  enabled: boolean;

  constructor(description: string, cost: number, website: string, previewBase64: string | null, enabled: boolean) {
    this.description = description;
    this.cost = cost;
    this.website = website;
    this.previewBase64 = previewBase64;
    this.enabled = enabled;
  }
}
