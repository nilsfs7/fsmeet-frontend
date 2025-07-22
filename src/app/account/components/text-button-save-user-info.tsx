'use client';

import TextButton from '@/components/common/TextButton';
import { updateUser } from '@/infrastructure/clients/user.client';
import { User } from '@/domain/types/user';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';

export const TextButtonSaveUserInfo = () => {
  const t = useTranslations('/account');

  const { data: session } = useSession();

  const handleSaveUserInfoClicked = async () => {
    const userInfoObject = sessionStorage.getItem('userInfo');

    if (userInfoObject) {
      const user: User = JSON.parse(userInfoObject);

      try {
        await updateUser(user, session);
        toast.success('Profile updated.');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    } else {
      const msg = 'Failed loading user info from session storage.';
      toast.error(msg);
      console.error(msg);
    }
  };

  return (
    <>
      <Toaster richColors />

      <TextButton text={t('btnSave')} onClick={handleSaveUserInfoClicked} />
    </>
  );
};
