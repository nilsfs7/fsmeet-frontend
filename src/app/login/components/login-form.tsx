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
  const [isLoading, setIsLoading] = useState(false);
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
    if (!usernameOrEmail || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
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
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <TextInput
                id={'usernameOrEmail'}
                label={t('inputUsername')}
                placeholder="Enter your username or email"
                value={usernameOrEmail}
                onChange={e => {
                  handleInputChangeUsernameOrEmail(e);
                }}
              />
              <TextInput
                id={'password'}
                type={'password'}
                label={t('inputPassword')}
                placeholder="Enter your password"
                onChange={e => {
                  handleInputChangePassword(e);
                }}
                onKeyDown={handleInputKeypressPassword}
              />
            </div>

            <div className="pt-2">
              <TextButton text={isLoading ? 'Signing in...' : t('btnLogin')} onClick={handleLoginClicked} disabled={isLoading} className="w-full py-3" />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link href={routePasswordForgot} className="text-sm text-primary hover:text-primary-dark transition-colors">
                {t('lnkResetPassword')}
              </Link>

              <Link href={routeRegistration} className="text-sm text-primary hover:text-primary-dark transition-colors">
                {t('lnkNewAccount')}
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </>
  );
};
