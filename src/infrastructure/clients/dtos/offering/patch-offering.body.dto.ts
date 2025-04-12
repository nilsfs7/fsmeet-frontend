export class PatchOfferingBodyDto {
  id: string;
  description: string;
  cost: number;
  mandatoryForParticipant: boolean;

  constructor(id: string, description: string, cost: number, mandatoryForParticipant: boolean) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.mandatoryForParticipant = mandatoryForParticipant;
  }
}
