import Navigation from '@/components/navigation';
import { RegistrationForm } from './components/registration-form';
import { routeDataProtection, routeLogin, routeTermsOfService } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { withCallbackUrl } from '@/functions/with-callback-url';

const legalLinkClass = 'text-foreground/90 no-underline underline-offset-2 transition-colors hover:underline focus-visible:underline focus-visible:outline-hidden';

export default async function Registration(props: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const t = await getTranslations('/registration');
  const { callbackUrl } = await props.searchParams;
  // Keep a pending redirect (e.g. an OAuth authorize request) when switching between sign-up and sign-in.
  const loginHref = withCallbackUrl(routeLogin, callbackUrl);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
        <div className="flex min-h-full flex-col items-center justify-center py-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl lg:max-w-4xl border border-border bg-background shadow-lg">
            <div className="h-1.5 w-full bg-linear-to-r from-brand via-emerald-400 to-sky-400" aria-hidden />
            <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:pb-6 lg:pt-6">
              <div className="mb-6 text-center lg:mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('headlineCreateAccount')}</h1>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t('sublineSignUp')}</p>
              </div>
              <RegistrationForm callbackUrl={callbackUrl} />
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {t('textHaveAccount')}{' '}
                <Link href={loginHref} className="font-semibold text-brand-strong no-underline hover:underline">
                  {t('lnkSignIn')}
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-5 w-full max-w-lg px-1 lg:max-w-4xl text-center text-xs text-muted-foreground">
            {t.rich('legalSignUp', {
              terms: chunks => (
                <Link href={routeTermsOfService} className={legalLinkClass}>
                  {chunks}
                </Link>
              ),
              privacy: chunks => (
                <Link href={routeDataProtection} className={legalLinkClass}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
      <Navigation>
        <div className="flex justify-start gap-1">
          <ActionButton href={loginHref} action={Action.BACK} />
        </div>
      </Navigation>
    </div>
  );
}
