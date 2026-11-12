import Link from 'next/link';
import { IconHeartHandshake } from '@tabler/icons-react';
import { routeHome } from '@/domain/constants/routes';
import { AuthCard } from '@/components/auth/auth-card';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function ThankYou() {
  const t = await getTranslations('/feedback/thankyou');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard icon={<IconHeartHandshake stroke={1.75} aria-hidden />} title={t('thankYouText1')} description={t('thankYouText2')}>
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={routeHome}>{t('btnBackHome')}</Link>
        </Button>
      </AuthCard>
    </div>
  );
}
