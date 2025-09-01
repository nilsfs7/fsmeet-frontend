export class ReadOfferingResponseDto {
  id: string;
  description: string;
  cost: number;
  costIncPaymentCosts: number;
  mandatoryForParticipant: boolean;
  includesShirt: boolean;
  imageUrlPreview: string;
  enabled: boolean;
  eventId: string;

  constructor(
    id: string,
    description: string,
    cost: number,
    costIncPaymentCosts: number,
    mandatoryForParticipant: boolean,
    includesShirt: boolean,
    imageUrlPreview: string,
    enabled: boolean,
    eventId: string
  ) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.costIncPaymentCosts = costIncPaymentCosts;
    this.mandatoryForParticipant = mandatoryForParticipant;
    this.includesShirt = includesShirt;
    this.imageUrlPreview = imageUrlPreview;
    this.enabled = enabled;
    this.eventId = eventId;
  }
}
