import { Session } from 'next-auth';
import { EventRegistration } from '../domain/types/event-registration';
import { validateSession } from './validate-session';

export const isInEventRegistrations = (eventRegistrations: EventRegistration[], session: Session | null) => {
  if (validateSession(session)) {
    if (eventRegistrations.some(registration => registration.user.username === session?.user?.username)) {
      return true;
    }
  }

  return false;
};
