export class ReadAttachmentResponseDto {
  id: string;
  name: string;
  isExternal: boolean;
  url: string;
  expires: boolean;
  expiryDate: string;
  enabled: boolean;
  eventId: string;

  constructor(id: string, name: string, isExternal: boolean, url: string, expires: boolean, expiryDate: string, enabled: boolean, eventId: string) {
    this.id = id;
    this.name = name;
    this.isExternal = isExternal;
    this.url = url;
    this.expiryDate = expiryDate;
    this.expires = expires;
    this.enabled = enabled;
    this.eventId = eventId;
  }
}
