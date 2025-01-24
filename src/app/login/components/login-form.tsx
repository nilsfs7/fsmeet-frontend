'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUserWithCredentials } from '@/app/actions/authentication';
import Link from 'next/link';
import { routeHome, routePasswordForgot, routeRegistration } from '@/domain/constants/routes';
import TextButton from '../../../components/common/TextButton';
import TextInput from '../../../components/common/TextInput';
import { Toaster, toast } from 'sonner';
import { getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export const LoginForm = () => {
  const t = useTranslations('/login');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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

          router.replace(callbackUrl ? callbackUrl : routeHome);
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

      <div className="p-2 h-full grid overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
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
          </div>

          <div className="flex justify-center py-2">
            <TextButton text={t('btnLogin')} onClick={handleLoginClicked} />
          </div>

          <div className="flex justify-center py-2">
            <Link href={`${routePasswordForgot}`}>
              <label className="cursor-pointer pr-4 underline">{t('lnkResetPassword')}</label>
            </Link>
          </div>

          <div className="flex justify-center py-2">
            <Link href={`${routeRegistration}`}>
              <label className="cursor-pointer pr-4 underline">{t('lnkNewAccount')}</label>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
