import { PollOption } from './poll-option';
import { User } from './user';

export type Poll = {
  id?: string;
  question: string;
  questioner: User;
  options: PollOption[];
  totalVotes: number;
  deadline: string | null;
  creationTime: string;
};
