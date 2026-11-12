import Link from 'next/link';
import { IconMailCheck } from '@tabler/icons-react';
import { routeEvents } from '@/domain/constants/routes';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { StatusCard } from '@/components/common/status-card';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function ThankYou(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/registration/visa/success');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <StatusCard icon={<IconMailCheck stroke={1.75} aria-hidden />} title={t('textSuccess1')} description={t('textSuccess2')}>
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={`${routeEvents}/${params.eventId}/registration`}>{t('btnBack')}</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 w-full min-w-0 rounded-xl">
          <Link href={`${routeEvents}/${params.eventId}`}>{t('btnEvent')}</Link>
        </Button>
      </StatusCard>
    </div>
  );
}
