export class PutAttachmentOrderBodyDto {
  eventId: string;
  attachmentIds: string[];

  constructor(eventId: string, attachmentIds: string[]) {
    this.eventId = eventId;
    this.attachmentIds = attachmentIds;
  }
}
