'use client';

import { useState } from 'react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import TextInput from '@/components/common/text-input';
import { useRouter } from 'next/navigation';
import { validateFirstName } from '@/functions/validation/validation-user';
import { routeRegistrationPending } from '@/domain/constants/routes';
import { UserType } from '@/domain/enums/user-type';
import ComboBox from '@/components/common/combo-box';
import { menuUserType } from '@/domain/constants/menus/menu-user-type';
import { getLabelForFirstName } from '@/functions/get-label-for-first-name';
import { getPlaceholderByUserType } from '@/functions/get-placeholder-by-user-type';
import { Toaster, toast } from 'sonner';
import { createUser } from '@/infrastructure/clients/user.client';
import { useTranslations } from 'next-intl';
import { Gender } from '@/domain/enums/gender';
import { menuGender } from '@/domain/constants/menus/menu-gender';
import { menuCountries } from '@/domain/constants/menus/menu-countries';
import { toTitleCase } from '@/functions/string-manipulation';
import { isNaturalPerson } from '@/functions/is-natural-person';
import { cn } from '@/lib/utils';

const comboBlockClass = 'flex flex-col gap-1.5';
const comboLabelClass = 'text-sm font-medium leading-none';

export const RegistrationForm = () => {
  const t = useTranslations('/registration');
  const tf = useTranslations('global/functions/getLabelForFirstName');

  const router = useRouter();

  const [userType, setUserType] = useState<UserType>(UserType.FREESTYLER);
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
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

    if (isNaturalPerson(userType)) {
      firstName = toTitleCase(firstName);
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
      await createUser(username, userType, email, password, firstName, gender || null, countryCode || null);
      router.replace(`${routeRegistrationPending}?username=${username}&email=${email}`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
        <div className={comboBlockClass}>
          <div className={comboLabelClass}>{t('cbUserType')}</div>
          <div className="w-full min-w-0">
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

        {isNaturalPerson(userType) && (
          <>
            <div className={comboBlockClass}>
              <div className={comboLabelClass}>{t('cbCountry')}</div>
              <div className="w-full min-w-0">
                <ComboBox
                  className="w-full"
                  menus={menuCountries}
                  value={countryCode || ''}
                  searchEnabled={true}
                  onChange={(value: any) => {
                    setCountryCode(value);
                  }}
                />
              </div>
            </div>

            <div className={comboBlockClass}>
              <div className={comboLabelClass}>{t('cbGender')}</div>
              <div className="w-full min-w-0">
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
          value={password}
          onChange={e => {
            handleInputChangePassword(e.currentTarget.value);
          }}
          onKeyDown={handleInputKeypressPassword}
        />

        <div className="w-full min-w-0 pt-1">
          <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'w-full min-w-0')} onClick={handleCreateClicked}>
            {t('btnSignUp')}
          </Button>
        </div>
      </div>
    </>
  );
};
