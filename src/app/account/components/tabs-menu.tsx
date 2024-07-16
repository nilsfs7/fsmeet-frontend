'use client';

import Separator from '@/components/Seperator';
import TextButton from '@/components/common/TextButton';
import { UserType } from '@/types/enums/user-type';
import { UserVerificationState } from '@/types/enums/user-verification-state';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { switchTab } from '@/types/funcs/switch-tab';
import { useSession } from 'next-auth/react';
import { User } from '@/types/user';
import { Toaster, toast } from 'sonner';
import { routeAccount, routeAccountDeleted, routeHome, routeLogin, routeMap } from '@/types/consts/routes';
import { deleteUser } from '@/services/fsmeet-backend/delete-user';
import { copyToClipboard } from '@/types/funcs/copy-to-clipboard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { logoutUser } from '../../actions';
import { validateSession } from '@/types/funcs/validate-session';
import TextInput from '@/components/common/TextInput';
import { getLabelForFirstName } from '@/types/funcs/get-label-for-first-name';
import { getPlaceholderByUserType } from '@/types/funcs/get-placeholder-by-user-type';
import ComboBox from '@/components/common/ComboBox';
import { menuGenderWithUnspecified } from '@/types/consts/menus/menu-gender';
import { menuCountriesWithUnspecified } from '@/types/consts/menus/menu-countries';
import { prefixRequired } from '@/types/funcs/prefix-required';
import CheckBox from '@/components/common/CheckBox';
import Link from 'next/link';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { ButtonStyle } from '@/types/enums/button-style';
import { updateUserVerificationState } from '@/services/fsmeet-backend/update-user-verification-state';
import Dialog from '@/components/Dialog';
import SocialLink from '@/components/user/SocialLink';
import { Platform } from '@/types/enums/platform';

export const TabsMenu = ({ user }: { user: User }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const [userInfo, setUserInfo] = useState<User>(user);

  const handleFirstNameChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo.firstName = value;
    setUserInfo(newUserInfo);
    cacheUserInfo(newUserInfo);
  };

  const handleLastNameChanged = (value: string) => {
    const newUserInfo = Object.assign({}, userInfo);
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
      instagramHandle: userInfo.instagramHandle,
      tikTokHandle: userInfo.tikTokHandle,
      youTubeHandle: userInfo.youTubeHandle,
      website: websiteAdjusted,
      verificationState: userInfo.verificationState,
      tShirtSize: userInfo.tShirtSize,
      houseNumber: userInfo.houseNumber,
      street: userInfo.street,
      postCode: userInfo.postCode,
      city: userInfo.city,
      exposeLocation: userInfo.exposeLocation,
      locLatitude: userInfo.locLatitude,
      locLongitude: userInfo.locLongitude,
    };

    try {
      sessionStorage.setItem('userInfo', JSON.stringify(user));
    } catch (error: any) {
      toast.error('error.message');
      console.error('error.message');
    }
  };

  const handleDeleteAccountClicked = async () => {
    router.replace(`${routeAccount}?delete=1`);
  };

  const handleConfirmDeleteAccountClicked = async () => {
    try {
      await deleteUser(session);

      await logoutUser();
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
    await logoutUser();
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
    router.push(routeHome);
  };

  const handleVerificationRequestClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    router.replace(`${routeAccount}?tab=account&verification=1`);
  };

  const handleConfirmSendVerificationRequestClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    try {
      await updateUserVerificationState(session, 'nils', UserVerificationState.VERIFICATION_PENDING);
      toast.success('Requesting verification successful.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleCopyClicked = async (input: string) => {
    copyToClipboard(input);
    toast.info('Message copied to clipboard.');
  };

  useEffect(() => {
    cacheUserInfo(user);
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Account Verification" queryParam="verification" onCancel={handleCancelDialogClicked}>
        <div className="flex flex-col justify-center text-center">
          <p className="text-lg font-bold">{`Step 1`}</p>
          <p>{`Provide your first name, gender and country in general info. Any other fields are optional.`}</p>
          <p>
            {`Please note: Once verification is completed, updating any of the previously mentioned
        fields will automatically reset your verified status and the process needs to be repeated.`}
          </p>
        </div>

        <div className="mt-4 mb-2">
          <Separator />
        </div>

        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-lg font-bold">{`Step 2`}</p>
          <p className="flex">{`Have an Instagram profile with decent history (account age and feed with freestyle related content showing you).`}</p>
          <p className="flex">{`Send us a DM on Instagram including your FSMeet username. You can simply copy the message below.`}</p>
          <div className="flex justify-center items-center gap-2">
            <div className="italic select-text bg-secondary rounded-lg py-1 px-2">{`"Hey there, please verify ${session?.user?.username} on fsmeet."`}</div>

            <ActionButton
              action={Action.COPY}
              onClick={() => {
                handleCopyClicked(`Hey there, please verify ${session?.user?.username} on fsmeet.`);
              }}
            />
          </div>

          <div className="mt-2">
            <SocialLink platform={Platform.INSTAGRAM} path="@fsmeet_com" />
          </div>
        </div>

        <div className="mt-4 mb-2">
          <Separator />
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg font-bold">{`Step 3`}</p>
          <p>{`If done with step 1 and 2, please request verification by hitting the button below.`}</p>
          <div className="mt-2">
            <TextButton text="Request Now" onClick={handleConfirmSendVerificationRequestClicked} />
          </div>
        </div>

        <div className="mt-4 mb-2">
          <Separator />
        </div>

        <div className="flex flex-col justify-center text-center">
          <p className="text-lg font-bold">{`Step 4`}</p>
          <p>{`Wait for verification. This should usually be done within a few hours. We will let you know via email.`}</p>
          <p>{`Once verified a checkmark appears next to your name in your public profile.`}</p>
        </div>
      </Dialog>

      <Dialog title="Delete Account" queryParam="delete" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmDeleteAccountClicked}>
        <p>{`Do you really want to leave us?`}</p>
      </Dialog>

      <Dialog title="Logout" queryParam="logout" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmLogoutClicked}>
        <p>{`Logout now?`}</p>
      </Dialog>

      <Tabs defaultValue={tab || `general`} className="flex flex-col h-full">
        <TabsList className="mb-2">
          <TabsTrigger
            value="general"
            onClick={() => {
              switchTab(router, 'general');
            }}
          >
            {`General Info`}
          </TabsTrigger>

          <TabsTrigger
            value="map"
            onClick={() => {
              switchTab(router, 'map');
            }}
          >
            {`Freestyler Map`}
          </TabsTrigger>

          <TabsTrigger
            value="account"
            onClick={() => {
              switchTab(router, 'account');
            }}
          >
            {`Account`}
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="overflow-hidden overflow-y-auto">
          <div className="mb-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
            <TextInput
              id={'firstName'}
              label={getLabelForFirstName(userInfo.type)}
              placeholder={getPlaceholderByUserType(userInfo.type).firstName}
              value={userInfo.firstName}
              onChange={(e) => {
                handleFirstNameChanged(e.currentTarget.value);
              }}
            />

            {userInfo.type !== UserType.ASSOCIATION && userInfo.type !== UserType.BRAND && (
              <>
                <TextInput
                  id={'lastName'}
                  label={'Last Name'}
                  placeholder=""
                  value={userInfo.lastName}
                  onChange={(e) => {
                    handleLastNameChanged(e.currentTarget.value);
                  }}
                />

                <TextInput
                  id={'nickName'}
                  label={'Nickname / Artist Name'}
                  placeholder=""
                  value={userInfo.nickName}
                  onChange={(e) => {
                    handleNickNameChanged(e.currentTarget.value);
                  }}
                />

                <div className="m-2 grid grid-cols-2">
                  <div className="p-2">{`Gender`}</div>
                  <div className="flex w-full">
                    <ComboBox
                      menus={menuGenderWithUnspecified}
                      value={userInfo.gender ? userInfo.gender : menuGenderWithUnspecified[0].value}
                      onChange={(value: any) => {
                        handleGenderChanged(value);
                      }}
                    />
                  </div>
                </div>

                <div className="m-2 grid grid-cols-2">
                  <div className="p-2">{`Country`}</div>
                  <div className="flex w-full">
                    <ComboBox
                      menus={menuCountriesWithUnspecified}
                      value={userInfo.country ? userInfo.country : menuCountriesWithUnspecified[0].value}
                      searchEnabled={true}
                      onChange={(value: any) => {
                        handleCountryChanged(value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <TextInput
              id={'instagramHandle'}
              label={'Instagram Handle'}
              placeholder="@dffb_org"
              value={userInfo.instagramHandle}
              onChange={(e) => {
                handleInstagramHandleChanged(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'tikTokHandle'}
              label={'TikTok Handle'}
              placeholder="@dffb_org"
              value={userInfo.tikTokHandle}
              onChange={(e) => {
                handleTikTokHandleChanged(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'youTubeHandle'}
              label={'YouTube Handle'}
              placeholder="@dffb_org"
              value={userInfo.youTubeHandle}
              onChange={(e) => {
                handleYouTubeHandleChanged(prefixRequired(e.currentTarget.value, '@'));
              }}
            />

            <TextInput
              id={'website'}
              label={'Website'}
              placeholder="https://dffb.org"
              value={userInfo.website}
              onChange={(e) => {
                handleWebsiteChanged(e.currentTarget.value);
              }}
            />

            {/* <div className="m-2 grid grid-cols-2">
              <div className="p-2">T-Shirt Size</div>
              <div className="flex w-full">
                <ComboBox
                  menus={menuTShirtSizesWithUnspecified}
                  value={userInfo.tShirtSize ? userInfo.tShirtSize : menuTShirtSizesWithUnspecified[0].value}
                  onChange={(value: any) => {
                    handleTShirtSizeChanged(value);
                  }}
                />
              </div>
            </div> */}
          </div>
        </TabsContent>

        {/* Freestyler Map */}
        <TabsContent value="map" className="overflow-hidden overflow-y-auto">
          <div className="flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
            <TextInput
              id={'city'}
              label={'City'}
              placeholder="Munich"
              value={userInfo.city}
              onChange={(e) => {
                handleCityChanged(e.currentTarget.value);
              }}
            />

            <CheckBox
              id={'exposeLocation'}
              label="Publish city on Freestyler Map"
              value={userInfo.exposeLocation}
              onChange={(e) => {
                handleExposeLocationChanged(!userInfo.exposeLocation);
              }}
            />

            {userInfo.exposeLocation && userInfo.locLatitude && userInfo.locLongitude && (
              <div className="m-2 flex place-items-start items-center">
                <Link href={`${routeMap}?user=${session?.user?.username}&lat=${userInfo.locLatitude}&lng=${userInfo.locLongitude}`}>
                  <div className="p-2 hover:underline">{'Show my pin'}</div>
                </Link>

                <Link href={`${routeMap}?user=${session?.user?.username}&lat=${userInfo.locLatitude}&lng=${userInfo.locLongitude}`}>
                  <ActionButton action={Action.GOTOMAP} />
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="overflow-hidden overflow-y-auto">
          <div className="flex flex-col rounded-lg border border-primary bg-secondary-light p-4">
            <div className="flex justify-center text-lg">{`Account Verification`}</div>

            <div className="mt-4 flex flex-col justify-center items-center gap-2 text-center">
              <div className="flex gap-2 items-center">
                <div>{`Verification Status:`}</div>
                <div className="font-extrabold p-2 rounded-lg bg-secondary">
                  {(userInfo?.verificationState ? userInfo.verificationState.charAt(0).toUpperCase() + userInfo.verificationState.slice(1) : 'n/a').replaceAll('_', ' ')}
                </div>
              </div>

              {userInfo.verificationState !== UserVerificationState.VERIFIED && userInfo.verificationState !== UserVerificationState.VERIFICATION_PENDING && (
                <TextButton text="Verify Now" onClick={handleVerificationRequestClicked} />
              )}
            </div>

            <div className="my-4">
              <Separator />
            </div>

            <div className="flex justify-center text-lg">{`Account Management`}</div>

            <div className="mt-4 flex justify-center">
              <TextButton text="Logout" onClick={handleLogoutClicked} />
            </div>

            <div className="mt-4 flex justify-center">
              <TextButton text="Delete Account" style={ButtonStyle.CRITICAL} onClick={handleDeleteAccountClicked} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
