import { User } from './user';

export type EventComment = {
  message: string;
  user: User;
  timestamp: number;
};
