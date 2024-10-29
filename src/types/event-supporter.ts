import { EventRole } from '@/domain/enums/event-role';
import { User } from './user';

export type EventSupporter = {
  user: User;
  role: EventRole;
};
