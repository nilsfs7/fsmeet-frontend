import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { routeDataProtection, routeImprint, routeTermsOfService } from '@/domain/constants/routes';
import { cn } from '@/lib/utils';

/** Imprint · Terms · Privacy (+ copyright), shared by the compact and the Home footer. */
export function LegalLinks({ className }: { className?: string }) {
  const t = useTranslations('global/components/site-footer');
  const linkClass = 'rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <nav aria-label={t('legalNav')} className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground', className)}>
      <Link href={routeImprint} className={linkClass}>
        {t('linkImprint')}
      </Link>
      <Link href={routeTermsOfService} className={linkClass}>
        {t('linkTerms')}
      </Link>
      <Link href={routeDataProtection} className={linkClass}>
        {t('linkPrivacy')}
      </Link>
      <span className="text-muted-foreground/70">© {new Date().getFullYear()} FSMeet</span>
    </nav>
  );
}
