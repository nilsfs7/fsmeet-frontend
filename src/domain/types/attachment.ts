export type Attachment = {
  id: string | undefined;
  eventId: string | undefined;
  name: string;
  isExternal: boolean;
  url: string | null;
  expires: boolean;
  expiryDate: string;
  enabled: boolean;
};
