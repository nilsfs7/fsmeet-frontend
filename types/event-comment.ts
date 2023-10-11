import { EventSubComment } from './event-sub-comment';
import { User } from './user';

export type EventComment = {
  id: string;
  message: string;
  user: User;
  timestamp: number;
  subComments: EventSubComment[];
};
