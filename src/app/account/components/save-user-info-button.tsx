'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { getUser, updateUser } from '@/infrastructure/clients/user.client';
import { dispatchUserSaveBlocked, dispatchUserSaved } from './user-saved-event';
import { normalizeWebsite, validateUserInfo } from '@/functions/validate-user-info';
import { User } from '@/domain/types/user';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';

export const SaveUserInfoButton = () => {
  const t = useTranslations('/account');

  const { data: session } = useSession();

  const handleSaveUserInfoClicked = async () => {
    const userInfoObject = sessionStorage.getItem('userInfo');

    if (userInfoObject) {
      const user: User = JSON.parse(userInfoObject);

      const errors = validateUserInfo(user);
      if (Object.keys(errors).length > 0) {
        dispatchUserSaveBlocked(errors);
        toast.error(t('toastFixErrors'));
        return;
      }
      user.website = normalizeWebsite(user.website) ?? user.website;

      try {
        let saved = await updateUser(user, session);
        // the backend geocodes the city on save; if the response lacks the coordinates, read them back
        if (saved.city && (!saved.locLatitude || !saved.locLongitude) && user.username) {
          saved = await getUser(user.username, session).catch(() => saved);
        }
        dispatchUserSaved(saved);
        toast.success(t('toastProfileUpdated'));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    } else {
      const msg = t('toastProfileLoadFailed');
      toast.error(msg);
      console.error(msg);
    }
  };

  return (
    <>
      <Toaster richColors />

      <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSaveUserInfoClicked}>
        {t('btnSave')}
      </Button>
    </>
  );
};
