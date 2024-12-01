'use client';

import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';
import { validateFirstName } from '@/functions/validation/validation-user';
import { routeRegistrationPending } from '@/domain/constants/routes';
import { UserType } from '@/domain/enums/user-type';
import ComboBox from '@/components/common/ComboBox';
import { menuUserType } from '@/domain/constants/menus/menu-user-type';
import { getLabelForFirstName } from '@/functions/get-label-for-first-name';
import { getPlaceholderByUserType } from '@/functions/get-placeholder-by-user-type';
import { Toaster, toast } from 'sonner';
import { createUser } from '@/infrastructure/clients/user.client';
import { useTranslations } from 'next-intl';
import { Gender } from '@/domain/enums/gender';
import { menuGender } from '@/domain/constants/menus/menu-gender';

export const RegistrationForm = () => {
  const t = useTranslations('/registration');
  const tf = useTranslations('global/functions/getLabelForFirstName');

  const router = useRouter();

  const [userType, setUserType] = useState<UserType>(UserType.FREESTYLER);
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState(Gender.MALE);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChangeFirstName = (event: any) => {
    let firstName: string = event.currentTarget.value;
    firstName = firstName.trimStart();
    firstName = firstName.replaceAll('  ', ' ');

    if (firstName.length > 0 && userType !== UserType.ASSOCIATION && userType !== UserType.BRAND) {
      const firstChar = firstName.charAt(0).toUpperCase();
      if (firstName.length === 1) {
        firstName = firstChar;
      } else {
        firstName = firstChar + firstName.slice(1).toLowerCase();
      }
    }

    if (validateFirstName(firstName)) {
      setFirstName(firstName);
    }
  };

  const handleInputChangeUsername = (event: any) => {
    const uname: string = event.currentTarget.value;
    setUsername(uname.toLowerCase().trim());
  };

  const handleInputChangeEmail = (event: any) => {
    const email: string = event.currentTarget.value;
    setEmail(email.toLowerCase().trim());
  };

  const handleInputChangePassword = (event: any) => {
    const hashedPassword = bcrypt.hashSync(event.currentTarget.value, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    setPassword(hashedPassword);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleCreateClicked();
    }
  };

  const handleCreateClicked = async () => {
    try {
      await createUser(username, userType, email, password, firstName, gender);
      router.replace(`${routeRegistrationPending}?username=${username}&email=${email}`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="p-2 h-full grid overflow-y-auto">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
            <div className="flex h-[100%] flex-col p-2">
              <div>{t('cbUserType')}</div>
              <div className="flex w-full">
                <ComboBox
                  className="w-full"
                  menus={menuUserType}
                  value={userType ? userType : menuUserType[0].value}
                  onChange={(value: any) => {
                    setUserType(value);
                  }}
                />
              </div>
            </div>

            <TextInput
              id={'firstName'}
              label={getLabelForFirstName(userType, tf)}
              placeholder={getPlaceholderByUserType(userType).firstName}
              value={firstName}
              onChange={e => {
                handleInputChangeFirstName(e);
              }}
            />

            <div className="m-2 grid grid-cols-2 items-center">
              <div>{t('cbGender')}</div>
              <div className="flex w-full">
                <ComboBox
                  menus={menuGender}
                  value={gender ? gender : menuGender[0].value}
                  onChange={(value: any) => {
                    setGender(value);
                  }}
                />
              </div>
            </div>

            <TextInput
              id={'username'}
              label={t('inputUsername')}
              placeholder={getPlaceholderByUserType(userType).username}
              value={username}
              onChange={e => {
                handleInputChangeUsername(e);
              }}
            />

            <TextInput
              id={'email'}
              label={t('inputEmail')}
              placeholder={getPlaceholderByUserType(userType).email}
              value={email}
              onChange={e => {
                handleInputChangeEmail(e);
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
            <TextButton text={t('btnSignUp')} onClick={handleCreateClicked} />
          </div>
        </div>
      </div>
    </>
  );
};
