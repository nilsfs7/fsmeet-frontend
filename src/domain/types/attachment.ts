export type Attachment = {
  id: string | undefined;
  eventId: string | undefined;
  index: number | undefined;
  name: string;
  isExternal: boolean;
  url: string | null;
  expires: boolean;
  expiryDate: string | null;
  enabled: boolean;
};
