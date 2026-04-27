import Navigation from '@/components/navigation';
import { LoginForm } from './components/login-form';
import { routeDataProtection, routeHome, routeTermsOfService } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const loginSurfaceClass = cn(
  'group w-full max-w-lg overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'transition-all duration-200',
  'hover:border-primary/50 hover:shadow-md',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
);

const legalLinkClass = 'text-foreground/90 no-underline underline-offset-2 transition-colors hover:underline focus-visible:underline focus-visible:outline-none';

export default async function Login() {
  const t = await getTranslations('/login');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
        <div className="flex min-h-full flex-col items-center justify-center py-4">
          <div className="mb-4 w-full max-w-lg text-center sm:mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('headlineWelcome')}</h1>
            <p className="mt-1.5 type-body-sm text-muted-foreground sm:mt-2 sm:text-body">{t('sublineSignIn')}</p>
          </div>
          <div className={loginSurfaceClass}>
            <div className="p-2.5 sm:p-3">
              <LoginForm />
            </div>
          </div>
          <p className="type-body-sm mt-4 w-full max-w-lg px-1 text-center text-muted-foreground">
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
