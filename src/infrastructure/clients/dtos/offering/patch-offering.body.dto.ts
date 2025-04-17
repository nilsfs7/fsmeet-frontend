export class PatchOfferingBodyDto {
  id: string;
  description: string;
  cost: number;
  mandatoryForParticipant: boolean;
  includesShirt: boolean;

  constructor(id: string, description: string, cost: number, mandatoryForParticipant: boolean, includesShirt: boolean) {
    this.id = id;
    this.description = description;
    this.cost = cost;
    this.mandatoryForParticipant = mandatoryForParticipant;
    this.includesShirt = includesShirt;
  }
}
