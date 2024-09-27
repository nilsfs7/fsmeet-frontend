import { Match as MatchClass } from '@/domain/classes/match';
import { RemoveFunctions } from './helper/remove-functions-from-class';

export type Match = RemoveFunctions<MatchClass>;
