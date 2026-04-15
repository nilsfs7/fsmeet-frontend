export class PatchAttachmentBodyDto {
  name: string;
  isExternal: boolean;
  url: string | null;
  expires: boolean;
  expiryDate: string | null;
  enabled: boolean;

  constructor(name: string, isExternal: boolean, url: string | null, expires: boolean, expiryDate: string | null, enabled: boolean) {
    this.name = name;
    this.isExternal = isExternal;
    this.url = url;
    this.expires = expires;
    this.expiryDate = expiryDate;
    this.enabled = enabled;
  }
}
