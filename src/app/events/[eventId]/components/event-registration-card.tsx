'use client';

import Link from 'next/link';
import moment from 'moment';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateLong } from '@/lib/format-date';
import { IconArrowRight, IconBroadcast, IconTicket, IconUsers } from '@tabler/icons-react';
import { Event } from '@/domain/types/event';
import { routeEvents } from '@/domain/constants/routes';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { ActionButtonCopyEventUrl } from './action-button-copy-event-url';
import { EventFeedbackButton } from './event-feedback-button';
import { cn } from '@/lib/utils';

type RegistrationPhase = 'upcoming' | 'open' | 'closed';

function formatFee(amount: number, event: Event): string {
  return `${convertCurrencyIntegerToDecimal(amount, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}`;
}

/** Fee shown to attendees; includes payment costs when the organizer passes Stripe fees on (same rule as before). */
export function getParticipantFeeLabel(event: Event, freeLabel: string): string {
  if (event.paymentMethodStripe?.enabled && event.paymentMethodStripe?.coverProviderFee) return formatFee(event.participationFeeIncPaymentCosts, event);
  return event.participationFee > 0 ? formatFee(event.participationFee, event) : freeLabel;
}

function getVisitorFeeLabel(event: Event, freeLabel: string): string {
  if (event.paymentMethodStripe?.enabled && event.paymentMethodStripe?.coverProviderFee && event.visitorFee > 0) return formatFee(event.visitorFeeIncPaymentCosts, event);
  return event.visitorFee > 0 ? formatFee(event.visitorFee, event) : freeLabel;
}

interface IEventRegistrationCard {
  event: Event;
  participantCount?: number;
  className?: string;
}

/**
 * Sticky side card on event details: registration status + period, fees, participant count and the primary
 * "Registration" action (same target and visibility rule as the bottom bar button).
 */
export const EventRegistrationCard = ({ event, participantCount, className }: IEventRegistrationCard) => {
  const t = useTranslations('/events/eventid');
  const locale = useLocale();

  const now = moment();
  const opens = moment(event.registrationOpen);
  const closes = moment(event.registrationDeadline);
  const eventOver = moment(event.dateTo).unix() <= now.unix();
  const phase: RegistrationPhase = now.isBefore(opens) ? 'upcoming' : now.isAfter(closes) ? 'closed' : 'open';
  const daysLeft = Math.max(0, closes.clone().startOf('day').diff(now.clone().startOf('day'), 'days'));
  const fmt = (m: moment.Moment) => formatDateLong(m.toDate(), locale, false);

  const statusStyles: Record<RegistrationPhase, string> = {
    open: 'bg-brand-soft text-brand-strong',
    upcoming: 'bg-amber-50 text-amber-700',
    closed: 'bg-muted text-muted-foreground',
  };
  const statusLabel = phase === 'open' ? t('regStatusOpen') : phase === 'upcoming' ? t('regStatusUpcoming') : t('regStatusClosed');
  const statusDetail = phase === 'open' ? t('regClosesOn', { date: fmt(closes) }) : phase === 'upcoming' ? t('regOpensOn', { date: fmt(opens) }) : t('regClosedOn', { date: fmt(closes) });

  return (
    <section className={cn('flex flex-col gap-5 rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t('cardRegistrationTitle')}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{statusDetail}</p>
        </div>
        <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', statusStyles[phase])}>
          {phase === 'open' && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          {statusLabel}
        </span>
      </div>

      {phase === 'open' && !eventOver && (
        <div className="-mt-2 text-sm font-semibold text-brand-strong">{t('regDaysLeft', { count: daysLeft })}</div>
      )}

      <dl className="grid grid-cols-1 gap-3 rounded-2xl bg-muted/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconTicket className="h-4 w-4" stroke={1.75} aria-hidden />
            {t('tabOverviewParticipationFee')}
          </dt>
          <dd className="text-base font-bold tabular-nums text-foreground">{getParticipantFeeLabel(event, t('tabOverviewFeeFree'))}</dd>
        </div>
        {event.enableVisitorRegistration && (
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconTicket className="h-4 w-4" stroke={1.75} aria-hidden />
              {t('lblVisitorFee')}
            </dt>
            <dd className="text-base font-bold tabular-nums text-foreground">{getVisitorFeeLabel(event, t('tabOverviewFeeFree'))}</dd>
          </div>
        )}
        {participantCount !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconUsers className="h-4 w-4" stroke={1.75} aria-hidden />
              {t('tabRegistrationsTitle')}
            </dt>
            <dd className="text-sm font-semibold text-foreground">{t('lblParticipantsRegistered', { count: participantCount })}</dd>
          </div>
        )}
      </dl>

      {eventOver ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground">{t('lblEventOver')}</p>
      ) : (
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-12 w-full max-lg:hidden')}>
          <Link href={`${routeEvents}/${event.id}/registration`}>
            {t('btnRegistration')}
            <IconArrowRight className="h-4 w-4" stroke={2} />
          </Link>
        </Button>
      )}

      {/* below lg the sticky bottom bar already carries register / share / feedback */}
      <div className={cn('flex flex-wrap items-center gap-2', !event.livestreamUrl && 'max-lg:hidden')}>
        <div className="max-lg:hidden">
          <ActionButtonCopyEventUrl alias={event.alias} />
        </div>
        {event.livestreamUrl && (
          <Button asChild variant="outline" className="rounded-xl">
            <a href={event.livestreamUrl} target="_blank" rel="noopener noreferrer">
              <IconBroadcast className="h-4 w-4" stroke={1.75} />
              {t('tabOverviewLivestream')}
            </a>
          </Button>
        )}
        <div className="ml-auto max-lg:hidden">
          <EventFeedbackButton event={event} />
        </div>
      </div>
    </section>
  );
};
