import { useTranslations } from 'next-intl';
import { appStoreUrl, googlePlayUrl } from '@/domain/constants/app-links';
import { cn } from '@/lib/utils';

const sizeClass = {
  sm: 'h-9',
  md: 'h-11 sm:h-12',
} as const;

interface IStoreBadgesProps {
  size?: keyof typeof sizeClass;
  className?: string;
}

/** Official App Store / Google Play badge artwork (public/mobile-app), opening the store in a new tab. */
export function StoreBadges({ size = 'sm', className }: IStoreBadgesProps) {
  const t = useTranslations('global/components/site-footer');
  const linkClass = 'inline-flex shrink-0 rounded-[0.5rem] outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <img src="/mobile-app/badge-app-store.svg" alt={t('badgeAppStore')} width={120} height={40} className={cn('w-auto', sizeClass[size])} />
      </a>
      <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <img src="/mobile-app/badge-google-play.png" alt={t('badgeGooglePlay')} width={134} height={40} className={cn('w-auto', sizeClass[size])} />
      </a>
    </div>
  );
}
