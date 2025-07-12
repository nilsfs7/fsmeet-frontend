export class CreateAttachmentBodyDto {
  eventId: string;
  name: string;
  isExternal: boolean;
  url: string | null;
  documentBase64: string | null;
  expires: boolean;
  expiryDate: string;
  enabled: boolean;

  constructor(eventId: string, name: string, isExternal: boolean, url: string | null, documentBase64: string | null, expires: boolean, expiryDate: string, enabled: boolean) {
    this.eventId = eventId;
    this.name = name;
    this.isExternal = isExternal;
    this.url = url;
    this.documentBase64 = documentBase64;
    this.expires = expires;
    this.expiryDate = expiryDate;
    this.enabled = enabled;
  }
}
