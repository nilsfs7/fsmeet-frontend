'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconCircleCheck, IconEye, IconEyeOff, IconLinkOff, IconLock } from '@tabler/icons-react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { routeLogin, routePasswordForgot } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { Toaster, toast } from 'sonner';
import { updateUserPassword } from '@/infrastructure/clients/user.client';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { AuthCard } from '@/components/auth/auth-card';

export default function ResetPassword() {
  const t = useTranslations('/password/reset');

  const searchParams = useSearchParams();
  const requestToken = searchParams?.get('requestToken');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChangePassword = (event: any) => {
    setPassword(event.target.value);
    setErrorMessage(null);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleSaveClicked();
    }
  };

  const handleSaveClicked = async () => {
    if (!requestToken) {
      toast.error(t('errorMissingResetLink'));
      return;
    }
    if (submitting || !password) return;

    setSubmitting(true);
    try {
      await updateUserPassword(requestToken, password);
      setDone(true);
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const requestNewLink = (
    <Button asChild variant="outline" className="h-11 w-full min-w-0 rounded-xl text-base font-semibold">
      <Link href={routePasswordForgot}>{t('btnRequestNewLink')}</Link>
    </Button>
  );

  let content;
  if (!requestToken) {
    content = (
      <AuthCard tone="danger" icon={<IconLinkOff stroke={1.75} aria-hidden />} title={t('invalidLinkTitle')} description={t('errorMissingResetLink')}>
        {requestNewLink}
      </AuthCard>
    );
  } else if (done) {
    content = (
      <AuthCard icon={<IconCircleCheck stroke={1.75} aria-hidden />} title={t('successTitle')} description={t('successText')}>
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={routeLogin}>{t('btnGoToLogin')}</Link>
        </Button>
      </AuthCard>
    );
  } else {
    content = (
      <AuthCard icon={<IconLock stroke={1.75} aria-hidden />} title={t('pageTitle')} description={t('pageDescription')}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium leading-none">
            {t('inputPassword')}
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="w-full pr-11"
              placeholder="Ball&Chill2021"
              value={password}
              onChange={handleInputChangePassword}
              onKeyDown={handleInputKeypressPassword}
              aria-invalid={errorMessage ? true : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              aria-pressed={showPassword}
            >
              {showPassword ? <IconEyeOff className="h-4 w-4" stroke={1.75} /> : <IconEye className="h-4 w-4" stroke={1.75} />}
            </button>
          </div>
        </div>

        {errorMessage && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</p>}

        <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')} onClick={handleSaveClicked} disabled={submitting || !password}>
          {t('btnSave')}
        </Button>

        {errorMessage && requestNewLink}
      </AuthCard>
    );
  }

  return (
    <>
      <Toaster richColors />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">{content}</div>

        <Navigation>
          <div className="flex justify-start gap-1">
            <ActionButton href={routeLogin} action={Action.BACK} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
