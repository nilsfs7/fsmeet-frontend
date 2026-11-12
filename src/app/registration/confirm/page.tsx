import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import Link from 'next/link';
import { IconAlertTriangle, IconConfetti } from '@tabler/icons-react';
import { routeHome, routeLogin } from '@/domain/constants/routes';
import { createConfirmUser } from '@/infrastructure/clients/user.client';
import { getTranslations } from 'next-intl/server';
import { AuthCard } from '@/components/auth/auth-card';
import { cn } from '@/lib/utils';

export default async function RegistrationConfirmation(props: { searchParams: Promise<{ username: string; requestToken: string }> }) {
  const t = await getTranslations('/registration/confirm');
  const searchParams = await props.searchParams;

  const confirmationSuccessful = await createConfirmUser(searchParams.username, searchParams.requestToken);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      {confirmationSuccessful ? (
        <AuthCard icon={<IconConfetti stroke={1.75} aria-hidden />} title={t('registrationSuccess')} description={t('successText')}>
          <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
            <Link href={routeLogin}>{t('btnProceed')}</Link>
          </Button>
        </AuthCard>
      ) : (
        <AuthCard
          tone="danger"
          icon={<IconAlertTriangle stroke={1.75} aria-hidden />}
          title={t('registrationFailure')}
          description={t('failureText')}
          footer={
            <Link href={routeHome} className="font-medium text-foreground/90 underline-offset-2 hover:underline">
              {t('btnBackHome')}
            </Link>
          }
        >
          <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
            <Link href={routeLogin}>{t('btnProceed')}</Link>
          </Button>
        </AuthCard>
      )}
    </div>
  );
}
