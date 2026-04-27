'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginUserWithCredentials } from '@/app/actions/authentication';
import Link from 'next/link';
import { routeHome, routePasswordForgot, routeRegistration } from '@/domain/constants/routes';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TextInput from '../../../components/common/text-input';
import { Toaster, toast } from 'sonner';
import { getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export const LoginForm = () => {
  const t = useTranslations('/login');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChangeUsernameOrEmail = (event: any) => {
    const usernameOrEmail: string = event.target.value;
    setUsernameOrEmail(usernameOrEmail.toLowerCase());
  };

  const handleInputChangePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleLoginClicked();
    }
  };

  const handleLoginClicked = async () => {
    const response = await loginUserWithCredentials(usernameOrEmail, password);

    const session = await getSession();

    switch (response?.status) {
      case 200:
        if (session) {
          localStorage.setItem('username', session.user.username);
          if (session.user.imageUrl) {
            localStorage.setItem('imageUrl', session.user.imageUrl);
          }

          /*
          Use window.location.href for full page reload.
          Helps to reset all states and contexts after login, 
          specifically important for google maps as it uses global state for its loader.
          When google maps issue is resolved this should be used:
          router.replace(callbackUrl ? callbackUrl : routeHome);
          */
          const redirectUrl = callbackUrl ? decodeURIComponent(callbackUrl) : routeHome;
          window.location.href = redirectUrl;
        }
        break;

      case 401:
        const err = 'Wrong username or password.';
        toast.error(err);
        console.error(err);
        break;

      default:
        toast.error(response.message);
        console.error(response.message);
        break;
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
        <TextInput
          id={'usernameOrEmail'}
          label={t('inputUsername')}
          placeholder="max"
          value={usernameOrEmail}
          onChange={e => {
            handleInputChangeUsernameOrEmail(e);
          }}
        />
        <TextInput
          id={'password'}
          type={'password'}
          label={t('inputPassword')}
          placeholder="Ball&Chill2021"
          onChange={e => {
            handleInputChangePassword(e);
          }}
          onKeyDown={handleInputKeypressPassword}
        />

        <div className="w-full min-w-0 pt-1">
          <Button
            type="button"
            variant="action"
            className={cn(ctaActionButtonClassName, 'w-full min-w-0')}
            onClick={handleLoginClicked}
          >
            {t('btnLogin')}
          </Button>
        </div>

        <div className="flex w-full min-w-0 items-center justify-between gap-3 pt-1 sm:pt-2">
          <Link href={`${routePasswordForgot}`} className="type-body-sm min-w-0 shrink text-foreground/90 no-underline hover:underline">
            {t('lnkResetPassword')}
          </Link>
          <Link href={`${routeRegistration}`} className="type-body-sm min-w-0 shrink text-right text-foreground/90 no-underline hover:underline">
            {t('lnkNewAccount')}
          </Link>
        </div>
      </div>
    </>
  );
};
