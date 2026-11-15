import { useTranslations } from 'next-intl';
import { IconDeviceMobile } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { AppQrCode } from './app-qr-code';
import { LegalLinks } from './legal-links';
import { StoreBadges } from './store-badges';

interface IHomeFooterProps {
  /** Absolute URL of the `/app` store redirect (QR code target). */
  qrUrl: string;
  className?: string;
}

/** Full footer for Home (no action bar there): app promo with phone mockup, store badges, QR code (desktop) and legal links. */
export function HomeFooter({ qrUrl, className }: IHomeFooterProps) {
  const t = useTranslations('global/components/site-footer');

  return (
    <footer id="app" className={cn('flex scroll-mt-4 flex-col gap-6', className)}>
      <section
        aria-labelledby="home-app-title"
        className={cn(
          'relative isolate overflow-hidden rounded-3xl border border-border bg-secondary-light shadow-xs',
          'bg-[radial-gradient(26rem_20rem_at_100%_100%,rgb(var(--brand)/0.16),transparent_70%)]',
          'dark:border-border/60',
        )}
      >
        <div className="grid grid-cols-1 items-center gap-8 px-6 pt-8 sm:px-10 sm:pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:py-10">
          <div className="flex max-w-xl flex-col items-start gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-strong">
              <IconDeviceMobile className="h-3.5 w-3.5" stroke={2} />
              {t('appEyebrow')}
            </span>
            <h2 id="home-app-title" className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {t('appHeadline')}
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg">{t('appText')}</p>

            <StoreBadges size="md" className="mt-1" />

            {/* QR only where scanning makes sense (desktop); phones use the badges */}
            <div className="mt-2 hidden items-center gap-4 rounded-2xl border border-border bg-background p-3 pr-5 lg:flex">
              <div className="rounded-lg bg-white p-2">
                <AppQrCode value={qrUrl} title={t('qrTitle')} />
              </div>
              <p className="max-w-[14rem] text-sm text-muted-foreground">{t('qrHint')}</p>
            </div>
          </div>

          {/* phone mockup with real app screenshots (light / dark) */}
          <div className="relative mx-auto h-[18rem] w-[15rem] overflow-hidden sm:h-[22rem] md:h-[27rem] md:w-[15.5rem] md:overflow-visible" aria-hidden>
            <div className="absolute inset-x-0 top-0 rounded-[2.4rem] border-[0.55rem] border-neutral-900 bg-neutral-900 shadow-2xl ring-1 ring-black/10 dark:border-neutral-700 dark:ring-white/10">
              <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-neutral-700" />
              <img src="/mobile-app/screen-light.webp" alt="" width={598} height={1300} loading="lazy" className="block aspect-[598/1300] w-full rounded-[1.85rem] dark:hidden" />
              <img src="/mobile-app/screen-dark.webp" alt="" width={598} height={1300} loading="lazy" className="hidden aspect-[598/1300] w-full rounded-[1.85rem] dark:block" />
            </div>
          </div>
        </div>
      </section>

      <LegalLinks className="justify-center pb-[env(safe-area-inset-bottom)] sm:justify-start" />
    </footer>
  );
}
