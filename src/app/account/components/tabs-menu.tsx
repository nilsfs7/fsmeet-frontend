'use client';

import TextButton from '@/components/common/text-button';
import { UserType } from '@/domain/enums/user-type';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/domain/types/user';
import { Toaster, toast } from 'sonner';
import { routeAccount, routeAccountDeleted, routeAccountPayments, routeHome, routeMap } from '@/domain/constants/routes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TextInput from '@/components/common/text-input';
import { getLabelForFirstName } from '@/functions/get-label-for-first-name';
import { getPlaceholderByUserType } from '@/functions/get-placeholder-by-user-type';
import ComboBox from '@/components/common/combo-box';
import { menuGender, menuGenderWithUnspecified } from '@/domain/constants/menus/menu-gender';
import { menuCountries } from '@/domain/constants/menus/menu-countries';
import { prefixRequired } from '@/functions/prefix-required';
import CheckBox from '@/components/common/check-box';
import Link from 'next/link';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { ButtonStyle } from '@/domain/enums/button-style';
import Dialog from '@/components/dialog';
import SocialLink from '@/components/user/social-link';
import { Platform } from '@/domain/enums/platform';
import { menuFreestyleSinceWithUnspecified } from '@/domain/constants/menus/menu-freestyle-since';
import { DatePicker } from '@/components/common/date-picker';
import moment, { Moment } from 'moment';
import { menuTShirtSizesWithUnspecified } from '@/domain/constants/menus/menu-t-shirt-sizes';
import { menuShowExperience } from '@/domain/constants/menus/menu-show-experience';
import { menuPhoneCountryCodesWithUnspecified } from '@/domain/constants/menus/menu-phone-county-codes';
import SectionHeader from '@/components/common/section-header';
import { createStripeAccount, createStripeAccountOnboardingLink, createStripeLoginLink, deleteUser, updateUserVerificationState } from '@/infrastructure/clients/user.client';
import { switchTab } from '@/functions/switch-tab';
import { useTranslations } from 'next-intl';
import Label from '@/components/label';
import { toTitleCase } from '@/functions/string-manipulation';
import { isNaturalPerson } from '@/functions/is-natural-person';
import Separator from '@/components/seperator';
import { ActionButtonCopyToClipboard } from '@/components/common/action-button-copy-to-clipboard';

interface ITabsMenu {
  user: User;
}

export const TabsMenu = ({ user }: ITabsMenu) => {
  const t = useTranslations('/account');
  const tf = useTranslations('global/functions/getLabelForFirstName');

  const { data: session, status } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const [userInfo, setUserInfo] = useState<User>(user);

  const handleFirstNameChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);

    if (isNaturalPerson(user.type)) {
      value = toTitleCase(value);
    }

    newUserInfo.firstName = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleLastNameChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);

    if (isNaturalPerson(user.type)) {
      value = toTitleCase(value);
    }

    newUserInfo.lastName = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleNickNameChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.nickName = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleGenderChanged = (value: any) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.gender = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleCountryChanged = (value: any) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.country = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleFreestyleSinceChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.freestyleSince = +value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleInstagramHandleChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.instagramHandle = prefixRequired(value.toLowerCase(), '@');
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleTikTokHandleChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.tikTokHandle = prefixRequired(value.toLowerCase(), '@');
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleYouTubeHandleChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.youTubeHandle = prefixRequired(value.toLowerCase(), '@');
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleWebsiteChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.website = value.toLowerCase();
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleBirthdayChanged = (value: Moment) => {
    if (value) {
      const newUserInfo = Object.assign({}, userInfo);
      newUserInfo.birthday = value.startOf('day').utc().format();
      setUserInfo(newUserInfo);
      cacheUserInfo(newUserInfo);
    }
  };

  const handleTShirtSizeChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.tShirtSize = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleCityChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.city = value;
    newUserInfo.exposeLocation = true; // when changing city name a user's location should be exposed by default
    newUserInfo.locLatitude = undefined;
    newUserInfo.locLongitude = undefined;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleExposeLocationChanged = (value: boolean) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.exposeLocation = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleAcceptTermsChanged = (value: boolean) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.jobAcceptTerms = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleOfferShowsChanged = (value: boolean) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.jobOfferShows = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleOfferWalkActsChanged = (value: boolean) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.jobOfferWalkActs = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleOfferWorkshopsChanged = (value: boolean) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.jobOfferWorkshops = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleShowExperienceChanged = (value: any) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.jobShowExperience = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handlePhoneCountryCodeChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.phoneCountryCode = +value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handlePhoneNumberChanged = (value: string) => {
    const regex = new RegExp('^[0-9]+$');
    const newUserInfo = Object.assign({}, userInfo);

    if (value === '') {
      newUserInfo.phoneNumber = null;
    } else if (regex.test(value)) {
      newUserInfo.phoneNumber = value;
    }

    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const cacheUserInfo = async (userInfo: User) => {
    let firstNameAdjusted = userInfo.firstName;
    let lastNameAdjusted = userInfo.lastName;
    let nickNameAdjusted = userInfo.nickName;
    let websiteAdjusted = userInfo.website;

    if (userInfo.firstName) firstNameAdjusted = userInfo.firstName.trim();
    if (userInfo.lastName) lastNameAdjusted = userInfo.lastName.trim();
    if (userInfo.nickName) nickNameAdjusted = userInfo.nickName.trim();
    if (userInfo.website) {
      websiteAdjusted = userInfo.website.trim();
      if (websiteAdjusted.endsWith('/')) {
        websiteAdjusted = websiteAdjusted.substring(0, websiteAdjusted.length - 1);
      }
    }

    const user: User = {
      username: userInfo.username,
      type: userInfo.type,
      firstName: firstNameAdjusted,
      lastName: lastNameAdjusted,
      nickName: nickNameAdjusted,
      gender: userInfo.gender,
      country: userInfo.country,
      freestyleSince: userInfo.freestyleSince,
      instagramHandle: userInfo.instagramHandle,
      tikTokHandle: userInfo.tikTokHandle,
      youTubeHandle: userInfo.youTubeHandle,
      website: websiteAdjusted,
      verificationState: userInfo.verificationState,
      birthday: userInfo.birthday,
      tShirtSize: userInfo.tShirtSize,
      houseNumber: userInfo.houseNumber,
      street: userInfo.street,
      postCode: userInfo.postCode,
      city: userInfo.city,
      exposeLocation: userInfo.exposeLocation,
      locLatitude: userInfo.locLatitude,
      locLongitude: userInfo.locLongitude,
      jobAcceptTerms: userInfo.jobAcceptTerms,
      jobOfferShows: userInfo.jobOfferShows,
      jobOfferWalkActs: userInfo.jobOfferWalkActs,
      jobOfferWorkshops: userInfo.jobOfferWorkshops,
      jobShowExperience: userInfo.jobShowExperience,
      phoneCountryCode: userInfo.phoneCountryCode,
      phoneNumber: userInfo.phoneNumber,
    };

    try {
      sessionStorage.setItem('userInfo', JSON.stringify(user));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleTermsAndConditionsClicked = async () => {
    router.replace(`${routeAccount}?tab=jobs&terms=1`);
  };

  const handleCreateStripeAccountClicked = async () => {
    try {
      const id = await createStripeAccount(session);

      const user = structuredClone(userInfo);
      user.stripeAccountId = id;
      setUserInfo(user);

      toast.success('Stripe account generated.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleCreateStripeAccountOnboardingLinkClicked = async () => {
    try {
      const url = await createStripeAccountOnboardingLink(
        `${window.location.origin}${pathname}?tab=account&stripeRefresh=1`,
        `${window.location.origin}${pathname}?tab=account&stripeReturn=1`,
        session
      );
      router.push(url);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleCreateStripeLoginLinkClicked = async () => {
    try {
      const url = await createStripeLoginLink(session);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteAccountClicked = async () => {
    router.replace(`${routeAccount}?delete=1`);
  };

  const handleConfirmDeleteAccountClicked = async () => {
    try {
      await deleteUser(session?.user?.username || '', session);

      // Sign out from NextAuth
      await signOut({ redirect: false });

      // Clear localStorage after successful logout
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');

      router.push(routeAccountDeleted);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleLogoutClicked = async () => {
    router.replace(`${routeAccount}?logout=1`);
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeAccount}`);
  };

  const handleConfirmLogoutClicked = async () => {
    try {
      // Sign out from NextAuth first
      await signOut({ redirect: false });

      // Clear localStorage after successful logout
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');

      router.push(routeHome);
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error
    }
  };

  const handleVerificationRequestClicked = async () => {
    router.replace(`${routeAccount}?tab=account&verification=1`);
  };

  const handleConfirmSendVerificationRequestClicked = async () => {
    if (userInfo.instagramHandle) {
      try {
        await updateUserVerificationState(session, session?.user?.username || '', UserVerificationState.VERIFICATION_PENDING);
        toast.success('Requesting verification successful.');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    cacheUserInfo(user);
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgJobsTermsTitle')} queryParam="terms" onCancel={handleCancelDialogClicked}>
        <p className="mb-4">{t('dlgJobsTermsDate')}</p>

        <div className="flex flex-col justify-center text-start">
          <p className="text-lg font-bold">{t('dlgJobsTermsDescriptionTitle')}</p>
          <p>{t('dlgJobsTermsDescriptionText1')}</p>
          <p className="mt-2">{t('dlgJobsTermsDescriptionText2')}</p>
          <p className="mt-2">{t('dlgJobsTermsDescriptionText3')}</p>
        </div>

        <div className="my-2">
          <Separator />
        </div>

        <div className="flex flex-col justify-center text-start">
          <p className="text-lg font-bold">{t('dlgJobsTermsDataSharingTitle')}</p>
          <p>{t('dlgJobsTermsDataSharingText1')}</p>
          <p className="mt-2">{t('dlgJobsTermsDataSharingText2')}</p>
          <p className="mt-2">{t('dlgJobsTermsDataSharingText3')}</p>
        </div>

        <div className="my-2">
          <Separator />
        </div>

        <div className="flex flex-col justify-center text-start">
          <p className="text-lg font-bold">{t('dlgJobsTermsDataSharingDetailsTitle')}</p>
          <p>{`${t('dlgJobsTermsDataSharingDetailsPublic')}:`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsName')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsGender')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsCountry')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsAge')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsCity')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsSocials')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsWebsite')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsFreestyleSince')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsOfferings')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsShowExperience')}`}</p>

          <p className="mt-2">{`${t('dlgJobsTermsDataSharingDetailsOnRequest')}:`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsPhone')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsEmail')}`}</p>
          <p>{`- ${t('dlgJobsTermsDataSharingDetailsShirtSize')}`}</p>
        </div>
      </Dialog>

      <Dialog title={t('dlgAccountVerificationTitle')} queryParam="verification" onCancel={handleCancelDialogClicked}>
        <div className="flex flex-col justify-center text-center">
          <p className="text-lg font-bold">{t('dlgAccountVerificationStep1')}</p>
          <p>{t('dlgAccountVerificationStep1Text1')}</p>
          <p>{t('dlgAccountVerificationStep1Text2')}</p>
        </div>

        <div className="mt-4 mb-2">
          <Separator />
        </div>

        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-lg font-bold">{t('dlgAccountVerificationStep2')}</p>
          <p className="flex">{t('dlgAccountVerificationStep2Text1')}</p>
          <p className="flex">{t('dlgAccountVerificationStep2Text2')}</p>
          <div className="flex justify-center items-center gap-2">
            <div className="italic select-text bg-secondary rounded-lg py-1 px-2">{`"Hey there, please verify ${session?.user?.username} on fsmeet."`}</div>

            <ActionButtonCopyToClipboard value={`Hey there, please verify ${session?.user?.username} on fsmeet.`} toastMessage={t('tabAccountBtnCopyMessage')} />
          </div>

          <div className="mt-2">
            <SocialLink platform={Platform.INSTAGRAM} path="@fsmeet_com" />
          </div>
        </div>

        <div className="mt-4 mb-2">
          <Separator />
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg font-bold">{t('dlgAccountVerificationStep3')}</p>
          <p>{t('dlgAccountVerificationStep3Text1')}</p>
          <div className="mt-2">
            <TextButton text={t('dlgAccountVerificationStep3BtnRequestNow')} disabled={!userInfo.instagramHandle} onClick={handleConfirmSendVerificationRequestClicked} />
          </div>
        </div>

        <div className="mt-4 mb-2">
          <Separator />
        </div>

        <div className="flex flex-col justify-center text-center">
          <p className="text-lg font-bold">{t('dlgAccountVerificationStep4')}</p>
          <p>{t('dlgAccountVerificationStep4Text1')}</p>
          <p>{t('dlgAccountVerificationStep4Text2')}</p>
        </div>
      </Dialog>

      <Dialog title={t('dlgAccountLogoutTitle')} queryParam="logout" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmLogoutClicked}>
        <p>{t('dlgAccountLogoutText')}</p>
      </Dialog>

      <Dialog title={t('dlgAccountDeleteAccountTitle')} queryParam="delete" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmDeleteAccountClicked}>
        <p>{t('dlgAccountDeleteAccountText')}</p>
      </Dialog>

      <Tabs defaultValue={tab || `general`} className="flex flex-col h-full">
        <TabsList>
          <TabsTrigger
            value="general"
            onClick={() => {
              switchTab(router, 'general');
            }}
          >
            {t('tabGeneralTitle')}
          </TabsTrigger>

          {user.type !== UserType.FAN && (
            <TabsTrigger
              value="map"
              onClick={() => {
                switchTab(router, 'map');
              }}
            >
              {t('tabMaplTitle')}
            </TabsTrigger>
          )}

          {/* TODO: disable for now, decide what to do with it */}
          {/* {userInfo.type === UserType.FREESTYLER && (
            <TabsTrigger
              value="jobs"
              onClick={() => {
                switchTab(router, 'jobs');
              }}
            >
              {t('tabJobsTitle')}
            </TabsTrigger>
          )} */}

          <TabsTrigger
            value="account"
            onClick={() => {
              switchTab(router, 'account');
            }}
          >
            {t('tabAccountTitle')}
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="overflow-hidden overflow-y-auto">
          <div className="mb-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
            <SectionHeader label={t('tabGeneralSectionGeneral')} />

            <TextInput
              id={'firstName'}
              label={getLabelForFirstName(userInfo.type, tf)}
              placeholder={getPlaceholderByUserType(userInfo.type).firstName}
              value={userInfo.firstName}
              onChange={e => {
                handleFirstNameChanged(e.currentTarget.value);
              }}
            />

            {isNaturalPerson(userInfo.type) && (
              <>
                <TextInput
                  id={'lastName'}
                  label={t('tabGeneralLastName')}
                  value={userInfo.lastName}
                  onChange={e => {
                    handleLastNameChanged(e.currentTarget.value);
                  }}
                />

                {user.type !== UserType.FAN && (
                  <TextInput
                    id={'nickName'}
                    label={t('tabGeneralArtistName')}
                    value={userInfo.nickName}
                    onChange={e => {
                      handleNickNameChanged(e.currentTarget.value);
                    }}
                  />
                )}

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('tabGeneralGender')}</div>
                  <div className="flex w-full">
                    <ComboBox
                      menus={menuGender}
                      // TODO: remove menuGenderWithUnspecified. Only here until every user has a gender set
                      value={userInfo.gender ? userInfo.gender : menuGenderWithUnspecified[0].value}
                      onChange={(value: any) => {
                        handleGenderChanged(value);
                      }}
                    />
                  </div>
                </div>

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('tabGeneralCountry')}</div>
                  <div className="flex w-full">
                    <ComboBox
                      menus={menuCountries}
                      value={userInfo.country ? userInfo.country : ''}
                      searchEnabled={true}
                      onChange={(value: any) => {
                        handleCountryChanged(value);
                      }}
                    />
                  </div>
                </div>

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('tabGeneralBirthday')}</div>
                  <DatePicker
                    date={moment(userInfo.birthday)}
                    fromDate={moment(1970)}
                    toDate={moment().subtract(6, 'y')}
                    onChange={value => {
                      handleBirthdayChanged(value);
                    }}
                  />
                </div>

                {user.type !== UserType.FAN && (
                  <div className="m-2 grid grid-cols-2 items-center gap-2">
                    <div>{t('tabGeneralFreestyleSince')}</div>
                    <div className="flex w-full">
                      <ComboBox
                        menus={menuFreestyleSinceWithUnspecified}
                        value={userInfo.freestyleSince ? userInfo.freestyleSince.toString() : menuFreestyleSinceWithUnspecified[0].value}
                        onChange={(value: any) => {
                          handleFreestyleSinceChanged(value);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('tabGeneralShirtSize')}</div>
                  <div className="flex w-full">
                    <ComboBox
                      menus={menuTShirtSizesWithUnspecified}
                      value={userInfo.tShirtSize ? userInfo.tShirtSize : menuTShirtSizesWithUnspecified[0].value}
                      onChange={(value: any) => {
                        handleTShirtSizeChanged(value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {user.type !== UserType.FAN && (
              <>
                <div className="m-2">
                  <Separator />
                </div>

                <SectionHeader label={t('tabGeneralSectionSocials')} />

                <TextInput
                  id={'instagramHandle'}
                  label={t('tabGeneralInstagramHandle')}
                  placeholder="@dffb_org"
                  value={userInfo.instagramHandle}
                  onChange={e => {
                    handleInstagramHandleChanged(e.currentTarget.value);
                  }}
                />

                <TextInput
                  id={'tikTokHandle'}
                  label={t('tabGeneralTikTokHandle')}
                  placeholder="@dffb_org"
                  value={userInfo.tikTokHandle}
                  onChange={e => {
                    handleTikTokHandleChanged(e.currentTarget.value);
                  }}
                />

                <TextInput
                  id={'youTubeHandle'}
                  label={t('tabGeneralYouTubeHandle')}
                  placeholder="@dffb_org"
                  value={userInfo.youTubeHandle}
                  onChange={e => {
                    handleYouTubeHandleChanged(prefixRequired(e.currentTarget.value, '@'));
                  }}
                />

                <TextInput
                  id={'website'}
                  label={t('tabGeneralWebsite')}
                  placeholder="https://dffb.org"
                  value={userInfo.website}
                  onChange={e => {
                    handleWebsiteChanged(e.currentTarget.value);
                  }}
                />
              </>
            )}
          </div>
        </TabsContent>

        {/* Freestyler Map */}
        {user.type !== UserType.FAN && (
          <TabsContent value="map" className="overflow-hidden overflow-y-auto">
            <div className="flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
              <SectionHeader label={t('tabMaplSectionLocation')} />

              <TextInput
                id={'city'}
                label={t('tabMaplCity')}
                placeholder="Munich"
                value={userInfo.city}
                onChange={e => {
                  handleCityChanged(e.currentTarget.value);
                }}
              />

              <CheckBox
                id={'exposeLocation'}
                label={t('tabMapPublish')}
                value={userInfo.exposeLocation}
                onChange={e => {
                  handleExposeLocationChanged(!userInfo.exposeLocation);
                }}
              />

              {userInfo.exposeLocation && userInfo.locLatitude && userInfo.locLongitude && (
                <div className="m-2 flex place-items-start gap-2 items-center">
                  <Link href={`${routeMap}?user=${session?.user?.username}&lat=${userInfo.locLatitude}&lng=${userInfo.locLongitude}&zoom=7`}>
                    <div className="hover:underline">{t('tabMapShowOnMap')}</div>
                  </Link>

                  <Link href={`${routeMap}?user=${session?.user?.username}&lat=${userInfo.locLatitude}&lng=${userInfo.locLongitude}&zoom=7`}>
                    <ActionButton action={Action.GOTOMAP} />
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Jobs */}
        {user.type !== UserType.FAN && (
          <TabsContent value="jobs" className="overflow-hidden overflow-y-auto">
            <div className="mb-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
              <div className="mx-2 text-lg underline">{t('tabJobsSectionTerms')}</div>

              <div className="m-2 grid grid-cols-2 items-center gap-2">
                <div>{t('tabJobsTerms')}</div>
                <TextButton text={t('tabJobBtnReadTerms')} onClick={handleTermsAndConditionsClicked} />
              </div>

              <CheckBox
                id={'terms'}
                label={t('tabJobAcceptTerms')}
                value={userInfo.jobAcceptTerms}
                onChange={e => {
                  handleAcceptTermsChanged(!userInfo.jobAcceptTerms);
                }}
              />

              {userInfo.jobAcceptTerms && (
                <>
                  <div className="m-2">
                    <Separator />
                  </div>
                  <div className="mx-2 text-lg underline">{t('tabJobSectionOffer')}</div>

                  <CheckBox
                    id={'offeringShow'}
                    label={t('tabJobOfferingShow')}
                    value={userInfo.jobOfferShows}
                    onChange={e => {
                      handleOfferShowsChanged(!userInfo.jobOfferShows);
                    }}
                  />

                  <CheckBox
                    id={'offeringWalkAct'}
                    label={t('tabJobOfferingWalkact')}
                    value={userInfo.jobOfferWalkActs}
                    onChange={e => {
                      handleOfferWalkActsChanged(!userInfo.jobOfferWalkActs);
                    }}
                  />

                  <CheckBox
                    id={'offeringWorkshop'}
                    label={t('tabJobOfferingWorkshop')}
                    value={userInfo.jobOfferWorkshops}
                    onChange={e => {
                      handleOfferWorkshopsChanged(!userInfo.jobOfferWorkshops);
                    }}
                  />

                  <div className="m-2">
                    <Separator />
                  </div>
                  <div className="mx-2 text-lg underline">{t('tabJobSectionContact')}</div>

                  <div className="m-2 grid grid-cols-2 items-center gap-2">
                    <div>{t('tabJobPhoneCountryCode')}</div>
                    <div className="flex w-full">
                      <ComboBox
                        menus={menuPhoneCountryCodesWithUnspecified}
                        value={userInfo.phoneCountryCode ? userInfo.phoneCountryCode.toString() : menuPhoneCountryCodesWithUnspecified[0].value}
                        searchEnabled={true}
                        onChange={(value: any) => {
                          handlePhoneCountryCodeChanged(value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="h-fit" /* fixes safari layouting issue */>
                    <TextInput
                      id={'phoneNumber'}
                      label={t('tabJobPhoneNumber')}
                      labelOnTop={false}
                      type="tel"
                      placeholder="1516 123456"
                      value={userInfo.phoneNumber ? userInfo.phoneNumber : ''}
                      onChange={e => {
                        handlePhoneNumberChanged(e.currentTarget.value);
                      }}
                    />
                  </div>

                  <div className="m-2">
                    <Separator />
                  </div>
                  <div className="mx-2 text-lg underline">{t('tabJobSectionOther')}</div>

                  <div className="m-2 grid grid-cols-2 items-center gap-2">
                    <div>{t('tabJobExperience')}</div>
                    <div className="flex w-full">
                      <ComboBox
                        menus={menuShowExperience}
                        value={userInfo.jobShowExperience ? userInfo.jobShowExperience : menuShowExperience[0].value}
                        searchEnabled={false}
                        onChange={(value: any) => {
                          handleShowExperienceChanged(value);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        )}

        {/* Account */}
        <TabsContent value="account" className="overflow-hidden overflow-y-auto">
          <div className="flex flex-col rounded-lg border border-primary bg-secondary-light p-4">
            {user.type !== UserType.FAN && (
              <>
                <div className="flex justify-center text-lg">{t('tabAccountSectionVerification')}</div>

                <div className="mt-4 flex flex-col justify-center items-center gap-2 text-center">
                  <div className="flex gap-2 items-center">
                    <div>{`${t('tabAccountVerificationStatus')}:`}</div>
                    <Label text={userInfo?.verificationState || 'n/a'} />
                  </div>

                  {userInfo.verificationState !== UserVerificationState.VERIFIED && userInfo.verificationState !== UserVerificationState.VERIFICATION_PENDING && (
                    <TextButton text={t('tabAccountBtnVerify')} onClick={handleVerificationRequestClicked} />
                  )}
                </div>

                <div className="m-2">
                  <Separator />
                </div>

                <div className="flex justify-center text-lg">{t('tabAccountSectionPayments')}</div>

                {!userInfo.stripeAccountId && (
                  <div className="mt-4 flex justify-center">
                    <TextButton text={t('tabAccounBtnRequestPaymentsAccount')} onClick={handleCreateStripeAccountClicked} />
                  </div>
                )}

                {userInfo.stripeAccountId && (
                  <>
                    <div className="mt-4 flex flex-col items-center gap-4">
                      <div>{`${t('tabAccountLblStripeAccount')}: ${userInfo.stripeAccountId}`}</div>
                      <TextButton text={t('tabAccounBtnEditPaymentsAccount')} onClick={handleCreateStripeAccountOnboardingLinkClicked} />

                      <TextButton text={t('tabAccounBtnViewPaymentsInStripe')} onClick={handleCreateStripeLoginLinkClicked} />

                      <Link href={routeAccountPayments}>
                        <TextButton text={t('tabAccounBtnManagePayments')} />
                      </Link>
                    </div>
                  </>
                )}

                <div className="m-2">
                  <Separator />
                </div>
              </>
            )}

            <div className="flex justify-center text-lg">{t('tabAccountSectionAccountManagement')}</div>

            <div className="mt-4 flex justify-center">
              <TextButton text={t('tabAccounBtnLogout')} onClick={handleLogoutClicked} />
            </div>

            <div className="mt-4 flex justify-center">
              <TextButton text={t('tabAccounBtnDeleteAccount')} style={ButtonStyle.CRITICAL} onClick={handleDeleteAccountClicked} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
