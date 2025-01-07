import { PollOption } from './poll-option';
import { TargetGroup } from './target-group';
import { User } from './user';

export type Poll = {
  id?: string;
  questioner: User;
  question: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  totalRatingScore: number;
  deadline: string | null;
  targetGroup: TargetGroup;
  creationTime: string;
};
