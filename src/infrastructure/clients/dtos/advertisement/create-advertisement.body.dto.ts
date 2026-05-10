export class CreateAdvertisementBodyDto {
  title: string;
  description: string;
  targetUrl: string;
  displayOrder: number;
  enabled: boolean;
  username: string;

  constructor(title: string, description: string, targetUrl: string, displayOrder: number, enabled: boolean, username: string) {
    this.title = title;
    this.description = description;
    this.targetUrl = targetUrl;
    this.displayOrder = displayOrder;
    this.enabled = enabled;
    this.username = username;
  }
}
