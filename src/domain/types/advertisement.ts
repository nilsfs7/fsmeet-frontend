export type Advertisement = {
  id: string | undefined;
  title: string;
  description: string;
  targetUrl: string;
  imageUrl?: string;
  displayOrder: number;
  enabled: boolean;
  username: string;
};
