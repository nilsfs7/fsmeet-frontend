export class CreateAttachmentBodyDto {
  eventId: string;
  name: string;
  isExternal: boolean;
  url: string | null;
  expires: boolean;
  expiryDate: string | null;
  enabled: boolean;

  constructor(eventId: string, name: string, isExternal: boolean, url: string | null, expires: boolean, expiryDate: string | null, enabled: boolean) {
    this.eventId = eventId;
    this.name = name;
    this.isExternal = isExternal;
    this.url = url;
    this.expires = expires;
    this.expiryDate = expiryDate;
    this.enabled = enabled;
  }
}
