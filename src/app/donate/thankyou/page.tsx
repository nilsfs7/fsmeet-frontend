import Link from 'next/link';
import { IconHeartHandshake } from '@tabler/icons-react';
import { routeHome } from '@/domain/constants/routes';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { StatusCard } from '@/components/common/status-card';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function ThankYou() {
  const t = await getTranslations('/donate/thankyou');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <StatusCard icon={<IconHeartHandshake stroke={1.75} aria-hidden />} title={t('thankYouText1')} description={t('thankYouText2')}>
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={routeHome}>{t('btnBackHome')}</Link>
        </Button>
      </StatusCard>
    </div>
  );
}
