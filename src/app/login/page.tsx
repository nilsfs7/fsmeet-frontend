import Navigation from '@/components/navigation';
import { LoginForm } from './components/login-form';
import { routeDataProtection, routeHome, routeTermsOfService } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const loginSurfaceClass = cn('w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-lg');

const legalLinkClass = 'text-foreground/90 no-underline underline-offset-2 transition-colors hover:underline focus-visible:underline focus-visible:outline-hidden';

export default async function Login() {
  const t = await getTranslations('/login');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
        <div className="flex min-h-full flex-col items-center justify-center py-4">
          <div className={loginSurfaceClass}>
            <div className="h-1.5 w-full bg-linear-to-r from-brand via-emerald-400 to-sky-400" aria-hidden />
            <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('headlineWelcome')}</h1>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t('sublineSignIn')}</p>
              </div>
              <LoginForm />
            </div>
          </div>
          <p className="mt-5 w-full max-w-md px-1 text-center text-xs text-muted-foreground">
            {t.rich('legalSignIn', {
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
          <ActionButton href={routeHome} action={Action.BACK} />
        </div>
      </Navigation>
    </div>
  );
}
