'use client';

import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
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
import { capitalizeFirstChar } from '@/functions/capitalize-first-char';
import { menuCountries } from '@/domain/constants/menus/menu-countries';

export const RegistrationForm = () => {
  const t = useTranslations('/registration');
  const tf = useTranslations('global/functions/getLabelForFirstName');

  const router = useRouter();

  const [userType, setUserType] = useState<UserType>(UserType.FREESTYLER);
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [gender, setGender] = useState<Gender | undefined>(Gender.MALE);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUserTypeChanged = (value: UserType) => {
    setUserType(value);
  };

  const handleInputChangeUsername = (value: string) => {
    setUsername(value.toLowerCase().trim());
  };

  const handleInputChangeFirstName = (value: string) => {
    let firstName: string = value;
    firstName = firstName.trimStart();
    firstName = firstName.replaceAll('  ', ' ');

    if (userType !== UserType.ASSOCIATION && userType !== UserType.BRAND) {
      firstName = capitalizeFirstChar(firstName);
    }

    if (validateFirstName(firstName)) {
      setFirstName(firstName);
    }
  };

  const handleInputChangeEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
  };

  const handleInputChangePassword = (value: string) => {
    setPassword(value);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleCreateClicked();
    }
  };

  const handleCreateClicked = async () => {
    try {
      await createUser(username, userType, email, password, firstName, gender, country);
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
                    handleUserTypeChanged(value);
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
                handleInputChangeUsername(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'firstName'}
              label={getLabelForFirstName(userType, tf)}
              placeholder={getPlaceholderByUserType(userType).firstName}
              value={firstName}
              onChange={e => {
                handleInputChangeFirstName(e.currentTarget.value);
              }}
            />

            {userType !== UserType.ASSOCIATION && userType !== UserType.BRAND && (
              <>
                <div className="flex h-[100%] flex-col p-2">
                  <div>{t('cbCountry')}</div>
                  <div className="flex w-full">
                    <ComboBox
                      className="w-full"
                      menus={menuCountries}
                      value={country || ''}
                      searchEnabled={true}
                      onChange={(value: any) => {
                        setCountry(value);
                      }}
                    />
                  </div>
                </div>

                <div className="flex h-[100%] flex-col p-2">
                  <div>{t('cbGender')}</div>
                  <div className="flex w-full">
                    <ComboBox
                      className="w-full"
                      menus={menuGender}
                      value={gender ? gender : menuGender[0].value}
                      onChange={(value: any) => {
                        setGender(value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <TextInput
              id={'email'}
              label={t('inputEmail')}
              placeholder={getPlaceholderByUserType(userType).email}
              value={email}
              onChange={e => {
                handleInputChangeEmail(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'password'}
              type={'password'}
              label={t('inputPassword')}
              placeholder="Ball&Chill2021"
              onChange={e => {
                handleInputChangePassword(e.currentTarget.value);
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
