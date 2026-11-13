import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { routeEventNotFound, routeEvents } from '@/domain/constants/routes';
import { notFound } from 'next/navigation';
import Navigation from '@/components/navigation';
import { TabsMenu } from './components/tabs-menu';
import { auth } from '@/auth';
import { getComments, getEvent } from '@/infrastructure/clients/event.client';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { compareByIndex } from '@/functions/compare-by-index';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import { getTranslations } from 'next-intl/server';
import { ActionButtonCopyEventUrl } from './components/action-button-copy-event-url';
import { EventFeedbackButton } from './components/event-feedback-button';
import { isEventAdminOrMaintainer } from '@/functions/is-event-admin-or-maintrainer';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import moment from 'moment';
import { getAttachments } from '@/infrastructure/clients/attachment.client';
import AdminPanel from './components/admin-panel';
import { EventHero } from './components/event-hero';
import { EventRegistrationCard } from './components/event-registration-card';
import { getUser } from '@/infrastructure/clients/user.client';
import { getEventRegistrations } from '@/infrastructure/clients/event.client';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { toAbsoluteUrl, truncateMetaDescription } from '@/lib/site-url';
import { JsonLd } from '@/components/seo/json-ld';
import { buildEventJsonLd } from '@/lib/json-ld';

const constrainedContentClass = 'mx-auto w-full max-w-6xl min-w-0 px-4 sm:px-6 md:px-8';

export async function generateMetadata(props: { params: Promise<{ eventId: string }> }): Promise<Metadata> {
  const { eventId } = await props.params;

  try {
    const event = await getEvent(eventId);
    const dateLabel = moment(event.dateFrom).isValid() ? moment(event.dateFrom).format('D MMM YYYY') : '';
    const placeParts = [event.venueCity, event.venueCountryCode].filter(Boolean);
    const placeLabel = placeParts.join(', ');
    const fallbackDescription = [dateLabel, placeLabel].filter(Boolean).join(' · ');
    const t = await getTranslations('/events/eventid');
    const description = truncateMetaDescription(event.description?.trim() || fallbackDescription || t('metaFallbackDescription'));
    const image = toAbsoluteUrl(event.imageUrlPoster);
    const canonicalPath = `${routeEvents}/${event.id}`;

    return {
      title: event.name,
      description,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: 'website',
        title: event.name,
        description,
        url: canonicalPath,
        ...(image ? { images: [{ url: image }] } : {}),
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title: event.name,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    const t = await getTranslations('/events/eventid');
    return { title: t('metaFallbackTitle') };
  }
}

export default async function EventDetails(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  // Unknown short links (/e/[alias]) redirect here; show the event not-found page instead of a generic error.
  if (`${routeEvents}/${params.eventId}` === routeEventNotFound) notFound();
  const [t, session] = await Promise.all([getTranslations('/events/eventid'), auth()]);

  const [event, fetchedCompetitions, sponsors, attachments, comments] = await Promise.all([
    getEvent(params.eventId, session),
    getCompetitions(params.eventId, null),
    getSponsors(params.eventId),
    getAttachments(params.eventId),
    getComments(params.eventId),
  ]);
  const competitions = [...fetchedCompetitions].sort(compareByIndex);

  // Header data (organizer + participant count) is best-effort: the page must still render if these fail.
  const [eventAdmin, registrations] = await Promise.all([
    event.admin ? getUser(event.admin).catch(() => undefined) : Promise.resolve(undefined),
    getEventRegistrations(params.eventId, EventRegistrationType.PARTICIPANT, session).catch(() => undefined),
  ]);
  const participantCount = Array.isArray(registrations) ? registrations.filter(r => r.status === EventRegistrationStatus.APPROVED).length : undefined;
  const eventOver = moment(event?.dateTo).unix() <= moment().unix();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <JsonLd data={buildEventJsonLd(event)} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn('flex flex-col gap-4 pb-8 pt-4 sm:gap-6 sm:pt-6', constrainedContentClass)}>
          {isEventAdminOrMaintainer(event, session) && <AdminPanel event={event} competitions={competitions} />}

          <EventHero event={event} eventAdmin={eventAdmin} />

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            {/* registration summary: right column on desktop, directly below the header on mobile */}
            <aside className="lg:sticky lg:top-4 lg:col-start-2 lg:row-start-1">
              <EventRegistrationCard event={event} participantCount={participantCount} />
            </aside>

            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <TabsMenu event={event} competitions={competitions} sponsors={sponsors} attachments={attachments} comments={comments} />
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        <div className="flex justify-start gap-1">
          <ActionButton href={routeEvents} action={Action.BACK} />
        </div>

        {/* mobile / tablet keep a sticky primary action; desktop has it in the side card */}
        <div className="flex min-w-0 flex-wrap justify-end gap-1 lg:hidden">
          <ActionButtonCopyEventUrl alias={event.alias} />

          {!eventOver && (
            <Button asChild variant="action" className={ctaActionButtonClassName}>
              <Link href={`${routeEvents}/${event.id}/registration`}>{t('btnRegistration')}</Link>
            </Button>
          )}

          <EventFeedbackButton event={event} />
        </div>
      </Navigation>
    </div>
  );
}
