import { PollOption } from './poll-option';
import { TargetGroup } from './target-group';
import { User } from './user';

export type Poll = {
  id?: string;
  question: string;
  questioner: User;
  options: PollOption[];
  totalVotes: number;
  totalRatingScore: number;
  deadline: string | null;
  targetGroup: TargetGroup;
  creationTime: string;
};
