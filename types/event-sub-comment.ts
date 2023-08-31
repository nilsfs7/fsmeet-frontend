import { User } from './user';

export type EventSubComment = {
  id: string;
  rootCommentId: string;
  message: string;
  user: User;
  timestamp: number;
};
