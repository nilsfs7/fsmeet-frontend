import Link from 'next/link';
import { IconMailForward } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { routeHome, routeLogin, routePasswordForgot } from '@/domain/constants/routes';
import { AuthCard } from '@/components/auth/auth-card';
import { cn } from '@/lib/utils';

export default async function PasswordResetRequestPending() {
  const t = await getTranslations('/password/forgot/pending');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard
        icon={<IconMailForward stroke={1.75} aria-hidden />}
        title={t('thankYouText1')}
        description={t('thankYouText2')}
        footer={
          <Link href={routeHome} className="font-medium text-foreground/90 underline-offset-2 hover:underline">
            {t('btnBackHome')}
          </Link>
        }
      >
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={routeLogin}>{t('btnBackToLogin')}</Link>
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t('hintSpam')}{' '}
          <Link href={routePasswordForgot} className="font-medium text-brand-strong underline-offset-2 hover:underline">
            {t('btnRequestNewLink')}
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
