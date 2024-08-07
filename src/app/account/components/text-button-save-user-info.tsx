'use client';

import TextButton from '@/components/common/TextButton';
import { updateUser } from '@/services/fsmeet-backend/user.client';
import { User } from '@/types/user';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';

export const ButtonSaveUserInfo = () => {
  const { data: session, status } = useSession();

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

      <TextButton text="Save" onClick={handleSaveUserInfoClicked} />
    </>
  );
};
