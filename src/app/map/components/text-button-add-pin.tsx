'use client';

import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';
import TextButton from '../../../components/common/text-button';
import Dialog from '../../../components/dialog';
import { routeLogin, routeMap } from '../../../domain/constants/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TextInput from '../../../components/common/text-input';
import { useEffect, useState } from 'react';
import { getUser, updateUser } from '../../../infrastructure/clients/user.client';
import { User } from '../../../domain/types/user';

export const TextButtonAddPin = () => {
  const t = useTranslations('/map');
  const { data: session } = useSession();

  const router = useRouter();

  const [city, setCity] = useState<string>();
  const [actingUser, setActingUser] = useState<User>();

  const handleAddPinClicked = async () => {
    if (session) {
      router.replace(`${routeMap}?add=1`);
    } else {
      router.push(`${routeLogin}?callbackUrl=${window.location.origin}%2Fmap`);
    }
  };

  const handleConfirmAddPinClicked = async () => {
    const newUserInfo = Object.assign({}, actingUser);
    newUserInfo.city = city;
    newUserInfo.exposeLocation = true;
    newUserInfo.locLatitude = undefined;
    newUserInfo.locLongitude = undefined;

    updateUser(newUserInfo, session).then(() => {
      router.replace(`${routeMap}`);
    });
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeMap}`);
  };

  const handleCityChanged = (value: string) => {
    setCity(value);
  };

  useEffect(() => {
    if (session?.user.username) {
      getUser(session.user.username, session).then(user => {
        setActingUser(user);
        setCity(user.city);
      });
    }
  }, [session]);

  return (
    <>
      <Dialog title={t('dlgAddPinTitle')} queryParam="add" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmAddPinClicked} confirmText={t('dlgAddPinCornfirmText')}>
        <div className="flex flex-col justify-center text-center">
          <TextInput
            id={'city'}
            label={t('dlgAddPinInputCity')}
            placeholder="Munich"
            value={city}
            onChange={e => {
              handleCityChanged(e.currentTarget.value);
            }}
          />
        </div>
      </Dialog>

      <Toaster richColors />
      <TextButton text={t('btnAddPin')} onClick={handleAddPinClicked} />
    </>
  );
};
