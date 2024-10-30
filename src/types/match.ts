import { Match as MatchClass } from '@/domain/classes/match';
import { RemoveFunctions } from '@/lib/utils';

export type Match = RemoveFunctions<MatchClass>;
