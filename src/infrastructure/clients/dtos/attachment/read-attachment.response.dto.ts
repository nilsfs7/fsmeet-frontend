export class ReadAttachmentResponseDto {
  id: string;
  index: number;
  name: string;
  isExternal: boolean;
  url: string;
  expires: boolean;
  expiryDate: string | null;
  enabled: boolean;
  eventId: string;

  constructor(id: string, index: number, name: string, isExternal: boolean, url: string, expires: boolean, expiryDate: string | null, enabled: boolean, eventId: string) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.isExternal = isExternal;
    this.url = url;
    this.expiryDate = expiryDate;
    this.expires = expires;
    this.enabled = enabled;
    this.eventId = eventId;
  }
}
