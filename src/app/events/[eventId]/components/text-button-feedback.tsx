'use client';

import TextButton from '@/components/common/text-button';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { routeEvents } from '@/domain/constants/routes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEventRegistrations } from '../../../../infrastructure/clients/event.client';
import { EventRegistration } from '../../../../domain/types/event-registration';
import { isInEventRegistrations } from '../../../../functions/is-in-event-registrations';

interface ITextButtonFeedback {
  event: Event;
}

export const TextButtonFeedback = ({ event }: ITextButtonFeedback) => {
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
      <Link href={`${routeEvents}/${event.id}/feedback`}>
        <TextButton text={t('btnFeedback')} />
      </Link>
    )
  );
};
