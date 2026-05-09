export class ReadAdvertisementResponseDto {
  id: string;
  title: string;
  description: string;
  targetUrl: string;
  imageUrl: string;
  displayOrder: number;
  enabled: boolean;
  username: string;

  constructor(id: string, title: string, description: string, targetUrl: string, imageUrl: string, displayOrder: number, enabled: boolean, username: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.targetUrl = targetUrl;
    this.imageUrl = imageUrl;
    this.displayOrder = displayOrder;
    this.enabled = enabled;
    this.username = username;
  }
}
