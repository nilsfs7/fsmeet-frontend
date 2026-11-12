'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconArrowUpRight, IconCalendarEvent, IconHome, IconInfoCircle, IconMap2, IconMenu2, IconSpeakerphone, IconStopwatch, IconUsers, IconX } from '@tabler/icons-react';
import LanguagePicker from './language-picker';
import { appShellContentClass } from '@/components/layout/app-shell-content';
import { LogoFSMeet } from './logo';
import ProfileMenu from './user/profile-menu';
import { CreateEventButton } from '@/components/events/create-event-button';
import { routeAbout, routeEvents, routeEventsCreate, routeHome, routeMap, routeUsers } from '@/domain/constants/routes';
import { UserType } from '@/domain/enums/user-type';
import { getVoiceBaseUrl } from '@/lib/voice-url';
import { getTrainingBaseUrl } from '@/lib/training-url';
import { cn } from '@/lib/utils';

type NavIcon = typeof IconHome;

interface NavEntry {
  href: string;
  label: string;
  Icon: NavIcon;
  external?: boolean;
  /** Route prefixes that mark this entry as active. */
  match?: (pathname: string) => boolean;
}

/** Routes rendered full-screen (e.g. the arena display on a venue screen) get no app bar. */
const isChromeless = (pathname: string) => pathname.includes('/arena-screen');

const isEventsRoute = (pathname: string) => pathname === routeEvents || (pathname.startsWith(`${routeEvents}/`) && !pathname.startsWith(routeEventsCreate));

/**
 * Global app bar, rendered once in `app/layout` for every route.
 * - Desktop: logo · primary destinations · create-event CTA · language · account.
 * - Mobile: logo · language · account · menu button that opens a full-height sheet with all destinations.
 */
export const AppHeader = () => {
  const pathname = usePathname() ?? routeHome;
  const t = useTranslations('global/components/app-header');
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isChromeless(pathname)) return null;

  const voiceUrl = getVoiceBaseUrl();
  const trainingUrl = getTrainingBaseUrl();
  const canCreateEvents = session?.user?.type !== UserType.FAN;

  const primary: NavEntry[] = [
    { href: routeEvents, label: t('navEvents'), Icon: IconCalendarEvent, match: isEventsRoute },
    { href: routeMap, label: t('navMap'), Icon: IconMap2 },
    { href: routeUsers, label: t('navCommunity'), Icon: IconUsers },
    ...(voiceUrl ? [{ href: voiceUrl, label: t('navVoice'), Icon: IconSpeakerphone, external: true }] : []),
    ...(trainingUrl ? [{ href: trainingUrl, label: t('navTraining'), Icon: IconStopwatch, external: true }] : []),
  ];
  const secondary: NavEntry[] = [{ href: routeAbout, label: t('navAbout'), Icon: IconInfoCircle }];

  const isActive = (entry: NavEntry) => {
    if (entry.external) return false;
    if (entry.match) return entry.match(pathname);
    return pathname === entry.href || pathname.startsWith(`${entry.href}/`);
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full shrink-0 border-b border-border/70 bg-background/80 pt-[max(0px,env(safe-area-inset-top))] backdrop-blur-xl supports-backdrop-filter:bg-background/70"
    >
      <div className={cn(appShellContentClass, 'flex h-16 items-center gap-3 sm:gap-6')}>
        <div className="flex shrink-0 items-center">
          <LogoFSMeet />
        </div>

        {/* desktop destinations */}
        <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center gap-0.5 md:flex xl:gap-1">
          {[...primary, ...secondary].map(entry => (
            <Link
              key={entry.href}
              href={entry.href}
              target={entry.external ? '_blank' : undefined}
              rel={entry.external ? 'noopener noreferrer' : undefined}
              aria-current={isActive(entry) ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors xl:px-3',
                'hover:bg-muted hover:text-foreground',
                isActive(entry) && 'bg-brand-soft text-brand-strong hover:bg-brand-soft hover:text-brand-strong',
              )}
            >
              {/* icons only where there is room (xl+) so all destinations fit at md/lg */}
              <entry.Icon className="hidden h-4 w-4 xl:block" stroke={1.75} />
              {entry.label}
              {entry.external && <IconArrowUpRight className="h-3.5 w-3.5 opacity-60" stroke={1.75} />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {canCreateEvents && (
            <div className="hidden lg:block">
              <CreateEventButton label={t('btnCreateEvent')} compact />
            </div>
          )}
          <LanguagePicker />
          <ProfileMenu />

          {/* mobile menu */}
          <DialogPrimitive.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label={t('menuOpen')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-xs transition-colors hover:bg-muted md:hidden"
              >
                <IconMenu2 className="h-5 w-5" stroke={1.75} />
              </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-foreground/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
              <DialogPrimitive.Content
                className={cn(
                  'fixed inset-y-0 right-0 z-[200] flex w-[min(20rem,88vw)] flex-col gap-6 border-l border-border bg-background p-5 shadow-lg',
                  'pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]',
                  'data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
                )}
              >
                <div className="flex items-center justify-between">
                  <DialogPrimitive.Title asChild>
                    <div onClick={() => setSheetOpen(false)}>
                      <LogoFSMeet />
                    </div>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">{t('sectionDiscover')}</DialogPrimitive.Description>
                  <DialogPrimitive.Close
                    aria-label={t('menuClose')}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <IconX className="h-5 w-5" stroke={1.75} />
                  </DialogPrimitive.Close>
                </div>

                {canCreateEvents && (
                  <div onClick={() => setSheetOpen(false)} className="[&_button]:w-full">
                    <CreateEventButton label={t('btnCreateEvent')} />
                  </div>
                )}

                <SheetSection title={t('sectionDiscover')}>
                  {[{ href: routeHome, label: t('navHome'), Icon: IconHome, match: (p: string) => p === routeHome }, ...primary].map(entry => (
                    <SheetLink key={entry.href} entry={entry} active={isActive(entry)} onNavigate={() => setSheetOpen(false)} />
                  ))}
                </SheetSection>

                <SheetSection title={t('sectionMore')}>
                  {secondary.map(entry => (
                    <SheetLink key={entry.href} entry={entry} active={isActive(entry)} onNavigate={() => setSheetOpen(false)} />
                  ))}
                </SheetSection>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>
    </header>
  );
};

const SheetSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
    {children}
  </div>
);

const SheetLink = ({ entry, active, onNavigate }: { entry: NavEntry; active: boolean; onNavigate: () => void }) => (
  <Link
    href={entry.href}
    target={entry.external ? '_blank' : undefined}
    rel={entry.external ? 'noopener noreferrer' : undefined}
    onClick={onNavigate}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'flex h-12 items-center gap-3 rounded-xl px-3 text-base font-medium text-foreground transition-colors hover:bg-muted',
      active && 'bg-brand-soft text-brand-strong hover:bg-brand-soft',
    )}
  >
    <entry.Icon className="h-5 w-5" stroke={1.75} />
    <span className="flex-1">{entry.label}</span>
    {entry.external && <IconArrowUpRight className="h-4 w-4 opacity-60" stroke={1.75} />}
  </Link>
);
