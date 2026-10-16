export type Offering = {
  id: string | undefined;
  eventId: string | undefined;
  index: number | undefined;
  description: string;
  cost: number;
  costIncPaymentCosts: number;
  mandatoryForParticipant: boolean;
  includesShirt: boolean;
  imageUrlPreview?: string;
  enabled: boolean;
};
