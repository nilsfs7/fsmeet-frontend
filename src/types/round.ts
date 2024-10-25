import { Round as RoundClass } from '@/domain/classes/round';
import { RemoveFunctions } from './helper/remove-functions-from-class';

export type Round = RemoveFunctions<RoundClass>;
