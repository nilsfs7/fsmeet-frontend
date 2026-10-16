export type Sponsor = {
  id: string | undefined;
  eventId: string | undefined;
  index: number | undefined;
  name: string;
  website: string;
  imageUrlLogo?: string;
  isPublic: boolean;
};
