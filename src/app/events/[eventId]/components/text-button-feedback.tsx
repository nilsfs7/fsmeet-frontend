'use client';

import TextButton from '@/components/common/TextButton';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { isRegistered } from './tabs-menu';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { routeEvents } from '@/domain/constants/routes';
import Link from 'next/link';

interface ITextButtonFeedback {
  event: Event;
}

export const TextButtonFeedback = ({ event }: ITextButtonFeedback) => {
  const t = useTranslations('/events/eventid');

  const { data: session } = useSession();

  return (
    isRegistered(event, session) &&
    moment(event.dateTo).unix() < moment().unix() && (
      <Link href={`${routeEvents}/${event.id}/feedback`}>
        <TextButton text={t('btnFeedback')} />
      </Link>
    )
  );
};
