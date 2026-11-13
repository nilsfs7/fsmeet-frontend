import Link from 'next/link';
import { IconTrophyOff } from '@tabler/icons-react';
import { routeEvents, routeHome } from '@/domain/constants/routes';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { StatusCard } from '@/components/common/status-card';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function CompetitionNotFound() {
  const t = await getTranslations('/events/eventid/comps/compid/not-found');
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <StatusCard
        icon={<IconTrophyOff stroke={1.75} aria-hidden />}
        title={t('textNotFound')}
        description={t('textNotFoundHint')}
        footer={
          <Link href={routeHome} className="font-medium text-foreground/90 underline-offset-2 hover:underline">
            {t('btnBackHome')}
          </Link>
        }
      >
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={routeEvents}>{t('btnBackToEvents')}</Link>
        </Button>
      </StatusCard>
    </div>
  );
}
