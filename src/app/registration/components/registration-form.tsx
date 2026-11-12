'use client';

import { useState, type ReactNode } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { withCallbackUrl } from '@/functions/with-callback-url';
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

const comboBlockClass = 'flex min-w-0 flex-col gap-1.5';
const comboLabelClass = 'text-sm font-medium leading-none';

const FormSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="flex min-w-0 flex-col gap-3">
    <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</legend>
    {children}
  </fieldset>
);

interface IRegistrationForm {
  /** Pending redirect (e.g. OAuth authorize) that is carried along to the next steps. */
  callbackUrl?: string;
}

export const RegistrationForm = ({ callbackUrl }: IRegistrationForm) => {
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

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
    if (submitting) return;
    setSubmitting(true);
    try {
      await createUser(username, userType, email, password, firstName, gender || null, countryCode || null);
      router.replace(withCallbackUrl(`${routeRegistrationPending}?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`, callbackUrl));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />

      <form
        className="flex min-w-0 flex-1 flex-col gap-6"
        noValidate
        onSubmit={e => {
          // Submitting is handled by the button and Enter in the password field (unchanged behaviour).
          e.preventDefault();
        }}
      >
        <FormSection title={t('sectionProfile')}>
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
            id={'firstName'}
            label={getLabelForFirstName(userType, tf)}
            placeholder={getPlaceholderByUserType(userType).firstName}
            value={firstName}
            onChange={e => {
              handleInputChangeFirstName(e.currentTarget.value);
            }}
          />

          {isNaturalPerson(userType) && (
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
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
            </div>
          )}
        </FormSection>

        <FormSection title={t('sectionAccount')}>
          <div className="flex flex-col gap-1.5">
            <TextInput
              id={'username'}
              label={t('inputUsername')}
              placeholder={getPlaceholderByUserType(userType).username}
              value={username}
              onChange={e => {
                handleInputChangeUsername(e.currentTarget.value);
              }}
            />
            <p className="text-xs text-muted-foreground">{t('hintUsername')}</p>
          </div>

          <TextInput
            id={'email'}
            type={'email'}
            label={t('inputEmail')}
            placeholder={getPlaceholderByUserType(userType).email}
            value={email}
            onChange={e => {
              handleInputChangeEmail(e.currentTarget.value);
            }}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              {t('inputPassword')}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full pr-11"
                placeholder="Ball&Chill2021"
                value={password}
                onChange={e => {
                  handleInputChangePassword(e.currentTarget.value);
                }}
                onKeyDown={handleInputKeypressPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                aria-pressed={showPassword}
              >
                {showPassword ? <IconEyeOff className="h-4 w-4" stroke={1.75} /> : <IconEye className="h-4 w-4" stroke={1.75} />}
              </button>
            </div>
          </div>
        </FormSection>

        <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')} onClick={handleCreateClicked} disabled={submitting}>
          {t('btnSignUp')}
        </Button>
      </form>
    </>
  );
};
