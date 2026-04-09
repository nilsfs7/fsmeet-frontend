export class PatchOfferingBodyDto {
  description: string;
  cost: number;
  mandatoryForParticipant: boolean;
  includesShirt: boolean;
  enabled: boolean;

  constructor(description: string, cost: number, mandatoryForParticipant: boolean, includesShirt: boolean, enabled: boolean) {
    this.description = description;
    this.cost = cost;
    this.mandatoryForParticipant = mandatoryForParticipant;
    this.includesShirt = includesShirt;
    this.enabled = enabled;
    // TODO: imageUrlPreview
  }
}
