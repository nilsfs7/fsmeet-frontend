export type Sponsor = {
  id: string | undefined;
  eventId: string | undefined;
  name: string;
  website: string;
  imageUrlLogo?: string;
  isPublic: boolean;
};
