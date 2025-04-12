export class CreateOfferingBodyDto {
  eventId: string;
  description: string;
  cost: number;
  mandatoryForParticipant: boolean;

  constructor(eventId: string, description: string, cost: number, mandatoryForParticipant: boolean) {
    this.eventId = eventId;
    this.description = description;
    this.cost = cost;
    this.mandatoryForParticipant = mandatoryForParticipant;
  }
}
