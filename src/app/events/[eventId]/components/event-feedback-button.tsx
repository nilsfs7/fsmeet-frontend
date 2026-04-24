'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { routeEvents } from '@/domain/constants/routes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEventRegistrations } from '@/infrastructure/clients/event.client';
import { EventRegistration } from '@/domain/types/event-registration';
import { isInEventRegistrations } from '@/functions/is-in-event-registrations';

export interface EventFeedbackButtonProps {
  event: Event;
}

export const EventFeedbackButton = ({ event }: EventFeedbackButtonProps) => {
  const t = useTranslations('/events/eventid');
  const { data: session } = useSession();

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);

  useEffect(() => {
    if (event.id)
      getEventRegistrations(event.id, null, session).then(registrations => {
        setEventRegistrations(registrations);
      });
  }, []);

  return (
    isInEventRegistrations(eventRegistrations, session) &&
    moment(event.dateTo).unix() < moment().unix() && (
      <Button asChild variant="action" className={ctaActionButtonClassName}>
        <Link href={`${routeEvents}/${event.id}/feedback`}>{t('btnFeedback')}</Link>
      </Button>
    )
  );
};
