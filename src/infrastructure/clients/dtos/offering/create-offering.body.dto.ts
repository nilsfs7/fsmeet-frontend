export class CreateOfferingBodyDto {
  eventId: string;
  description: string;
  cost: number;
  mandatoryForParticipant: boolean;
  includesShirt: boolean;
  enabled: boolean;

  constructor(eventId: string, description: string, cost: number, mandatoryForParticipant: boolean, includesShirt: boolean, enabled: boolean) {
    this.eventId = eventId;
    this.description = description;
    this.cost = cost;
    this.mandatoryForParticipant = mandatoryForParticipant;
    this.includesShirt = includesShirt;
    this.enabled = enabled;
    // TODO: imageUrlPreview
  }
}
