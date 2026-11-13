import { getEventsFeatured, getEventsOngoing, getEventsRecent, getEventsUpcoming } from '@/infrastructure/clients/event.client';
import Link from 'next/link';
import { imgFreestyler } from '@/domain/constants/images';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeAbout, routeEvents, routeHome, routeMap, routeUsers } from '@/domain/constants/routes';
import { auth } from '@/auth';
import { EventsCarousel } from './components/events-carousel';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/infrastructure/clients/user.client';
import { User } from '@/domain/types/user';
import { CreateEventButton } from '@/components/events/create-event-button';
import { UserType } from '@/domain/enums/user-type';
import { pageRootClipClassName } from '@/components/layout/app-shell-content';
import { PageInset } from '@/components/layout/page-inset';
import { JsonLd } from '@/components/seo/json-ld';
import { buildOrganizationJsonLd } from '@/lib/json-ld';
import { getVoiceBaseUrl } from '@/lib/voice-url';
import { getTrainingBaseUrl } from '@/lib/training-url';
import { IconArrowRight, IconArrowUpRight, IconInfoCircle, IconMap2, IconSpeakerphone, IconStopwatch, IconUsers } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default async function Home() {
  const [t, session, upcomingEvents, ongoingEvents, recentEvents, fetauredEvents] = await Promise.all([
    getTranslations(routeHome),
    auth(),
    getEventsUpcoming(1),
    getEventsOngoing(1),
    getEventsRecent(1),
    getEventsFeatured(),
  ]);

  let actingUser: User | undefined;
  if (session?.user.username) {
    actingUser = await getUser(session.user.username);
  }

  const voiceUrl = getVoiceBaseUrl();
  const trainingUrl = getTrainingBaseUrl();
  const explore = [
    { href: routeMap, label: t('navMap'), text: t('exploreMapText'), Icon: IconMap2, tone: 'bg-sky-50 text-sky-700' },
    { href: routeUsers, label: t('navCommunity'), text: t('exploreCommunityText'), Icon: IconUsers, tone: 'bg-violet-50 text-violet-700' },
    ...(voiceUrl ? [{ href: voiceUrl, label: t('navVoice'), text: t('exploreVoiceText'), Icon: IconSpeakerphone, tone: 'bg-amber-50 text-amber-700', external: true }] : []),
    ...(trainingUrl ? [{ href: trainingUrl, label: t('navTraining'), text: t('exploreTrainingText'), Icon: IconStopwatch, tone: 'bg-emerald-50 text-emerald-700', external: true }] : []),
    { href: routeAbout, label: t('navAbout'), text: t('exploreAboutText'), Icon: IconInfoCircle, tone: 'bg-neutral-100 text-neutral-700' },
  ];

  return (
    <div className={pageRootClipClassName}>
      <JsonLd data={buildOrganizationJsonLd()} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset className="flex flex-col gap-10 pt-4 sm:gap-14 sm:pt-8">
          {/* hero */}
          <section className="relative overflow-hidden rounded-3xl bg-[#0b1220] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex max-w-xl flex-col gap-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {t('heroEyebrow')}
                </span>
                <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">{t('pageTitle')}</h1>
                <p className="text-lg text-white/70">{t('slogan')}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-12')}>
                    <Link href={routeEvents}>
                      {t('btnShowAllEvents')}
                      <IconArrowRight className="h-4 w-4" stroke={2} />
                    </Link>
                  </Button>
                  {actingUser?.type !== UserType.FAN && (
                    <div className="[&_button]:h-12 [&_button]:border [&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white [&_button]:shadow-none [&_button:hover]:bg-white/20">
                      <CreateEventButton label={t('btnCreateEvent')} />
                    </div>
                  )}
                </div>
              </div>
              <img src={imgFreestyler} alt="" className="hidden h-40 w-40 shrink-0 invert md:block lg:h-48 lg:w-48" />
            </div>
          </section>

          {/* events */}
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-heading-2">{t('eventsTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('eventsSubtitle')}</p>
              </div>
              <Link href={routeEvents} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-strong hover:underline">
                {t('btnShowAllEvents')}
                <IconArrowRight className="h-4 w-4" stroke={2} />
              </Link>
            </div>
            <EventsCarousel upcomingEvents={upcomingEvents} ongoingEvents={ongoingEvents} recentEvents={recentEvents} featuredEvents={fetauredEvents} />
          </section>

          {/* explore side features */}
          <section className="flex flex-col gap-4">
            <h2 className="text-heading-2">{t('exploreTitle')}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {explore.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', item.tone)}>
                      <item.Icon className="h-5 w-5" stroke={1.75} />
                    </span>
                    {item.external ? (
                      <IconArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" stroke={1.75} />
                    ) : (
                      <IconArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" stroke={1.75} />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </PageInset>
      </div>
    </div>
  );
}
