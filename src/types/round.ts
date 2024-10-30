import { Round as RoundClass } from '@/domain/classes/round';
import { RemoveFunctions } from '@/lib/utils';

export type Round = RemoveFunctions<RoundClass>;
