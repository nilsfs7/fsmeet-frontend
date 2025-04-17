export class ReadOfferingResponseDto {
  id: string;
  description: string;
  cost: number;
  costIncPaymentCosts: number;
  mandatoryForParticipant: boolean;
  includesShirt: boolean;
  imageUrlPreview: string;
  eventId: string;

  constructor(id: string, description: string, cost: number, costIncPaymentCosts: number, mandatoryForParticipant: boolean, includesShirt: boolean, imageUrlPreview: string, eventId: string) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.costIncPaymentCosts = costIncPaymentCosts;
    this.mandatoryForParticipant = mandatoryForParticipant;
    this.includesShirt = includesShirt;
    this.imageUrlPreview = imageUrlPreview;
    this.eventId = eventId;
  }
}
