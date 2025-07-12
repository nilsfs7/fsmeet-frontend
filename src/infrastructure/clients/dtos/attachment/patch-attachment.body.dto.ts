export class PatchAttachmentBodyDto {
  id: string;
  name: string;
  isExternal: boolean;
  url: string | null;
  documentBase64: string | null;
  expires: boolean;
  expiryDate: string;
  enabled: boolean;

  constructor(id: string, name: string, isExternal: boolean, url: string | null, documentBase64: string | null, expires: boolean, expiryDate: string, enabled: boolean) {
    this.id = id;
    this.name = name;
    this.isExternal = isExternal;
    this.url = url;
    this.documentBase64 = documentBase64;
    this.expires = expires;
    this.expiryDate = expiryDate;
    this.enabled = enabled;
  }
}
