export type Accommodation = {
  id: string | undefined;
  eventId: string | undefined;
  index: number | undefined;
  description: string;
  cost: number;
  costIncPaymentCosts: number;
  website: string | null;
  imageUrlPreview?: string;
  enabled: boolean;
};
