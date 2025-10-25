'use client';

import { useState } from 'react';
import TextButton from '@/components/common/text-button';
import TextInput from '@/components/common/text-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { routeLogin } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import { updateUserPassword } from '@/infrastructure/clients/user.client';
import { useTranslations } from 'next-intl';

export default function ResetPassword() {
  const t = useTranslations('/password/reset');
  const router = useRouter();

  const searchParams = useSearchParams();
  const requestToken = searchParams?.get('requestToken');

  const [password, setPassword] = useState('');

  const handleInputChangePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleSaveClicked();
    }
  };

  const handleSaveClicked = async () => {
    try {
      // @ts-ignore
      await updateUserPassword(requestToken, password);
      router.replace(routeLogin);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <div className="p-2 h-full grid overflow-y-auto">
          <div className="h-full flex flex-col items-center justify-center">
            <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
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
              <TextButton text={t('btnSave')} onClick={handleSaveClicked} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
