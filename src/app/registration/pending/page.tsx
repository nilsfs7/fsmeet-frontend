import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import Link from 'next/link';
import { IconMailForward } from '@tabler/icons-react';
import { routeHome, routeLogin } from '@/domain/constants/routes';
import { getTranslations } from 'next-intl/server';
import { AuthCard } from '@/components/auth/auth-card';
import { cn } from '@/lib/utils';
import { withCallbackUrl } from '@/functions/with-callback-url';

export default async function RegistrationPending(props: { searchParams: Promise<{ email: string; callbackUrl?: string }> }) {
  const t = await getTranslations('/registration/pending');
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard
        icon={<IconMailForward stroke={1.75} aria-hidden />}
        title={t('titleCheckInbox')}
        description={
          <>
            {t('registrationPendingText1')} <span className="block font-semibold text-foreground [overflow-wrap:anywhere]">{searchParams.email}</span>
          </>
        }
        footer={
          <Link href={routeHome} className="font-medium text-foreground/90 underline-offset-2 hover:underline">
            {t('btnBackHome')}
          </Link>
        }
      >
        <ol className="flex flex-col gap-2 rounded-2xl bg-muted/50 p-4 text-sm text-foreground">
          {[t('step1'), t('step2'), t('step3')].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-center text-sm text-muted-foreground">{t('registrationPendingText2')}</p>

        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={withCallbackUrl(routeLogin, searchParams.callbackUrl)}>{t('btnGoToLogin')}</Link>
        </Button>
      </AuthCard>
    </div>
  );
}
