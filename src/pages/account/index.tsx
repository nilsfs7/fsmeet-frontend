import TextButton from '@/components/common/TextButton';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import TextInput from '@/components/common/TextInput';
import { routeAccount, routeAccountDeleted, routeAccountImage, routeHome, routeLogin } from '@/types/consts/routes';
import { imgUserAddImg } from '@/types/consts/images';
import Dialog from '@/components/Dialog';
import Navigation from '@/components/Navigation';
import { menuCountries } from '@/types/consts/menus/menu-countries';
import { menuTShirtSizes } from '@/types/consts/menus/menu-t-shirt-sizes';
import { ButtonStyle } from '@/types/enums/button-style';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import ComboBox from '@/components/common/ComboBox';
import { validateSession } from '@/types/funcs/validate-session';
import CheckBox from '@/components/common/CheckBox';
import { prefixRequired } from '@/types/funcs/prefix-required';
import { GetServerSidePropsContext } from 'next';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { updateUser } from '@/services/fsmeet-backend/update-user';
import { User } from '@/types/user';
import { deleteUser } from '@/services/fsmeet-backend/delete-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { switchTab } from '@/types/funcs/switch-tab';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { Gender } from '@/types/enums/gender';
import { menuGender } from '@/types/consts/menus/menu-gender';
import { UserType } from '@/types/enums/user-type';
import { UserVerificationState } from '@/types/enums/user-verification-state';
import Separator from '@/components/Seperator';
import SocialLink from '@/components/user/SocialLink';
import { Platform } from '@/types/enums/platform';
import { copyToClipboard } from '@/types/funcs/copy-to-clipboard';
import { updateUserVerificationState } from '@/services/fsmeet-backend/update-user-verification-state';
import PageTitle from '@/components/PageTitle';
import { getLabelForFirstName } from '@/types/funcs/get-label-for-first-name';
import { getPlaceholderByUserType } from '@/types/funcs/get-placeholder-by-user-type';

const Account = ({ session }: any) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const needsAuthorization = searchParams.get('auth');

  const [userFetched, setUserFetched] = useState(false);

  // public user info
  const [imageUrl, setImageUrl] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.FREESTYLER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState<Gender>();
  const [country, setCountry] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [tikTokHandle, setTikTokHandle] = useState('');
  const [youTubeHandle, setYouTubeHandle] = useState('');
  const [website, setWebsite] = useState('');
  const [verificationState, setVerificationState] = useState<UserVerificationState>(UserVerificationState.NOT_VERIFIED);

  // private user info
  const [tShirtSize, setTShirtSize] = useState<string>();
  const [houseNumber, setHouseNumber] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [postCode, setPostCode] = useState<string>();
  const [city, setCity] = useState<string>();
  const [exposeLocation, setExposeLocation] = useState<boolean>(false);
  const [locLatitude, setLocLatitude] = useState<number | undefined>(undefined);
  const [locLongitude, setLocLongitude] = useState<number | undefined>(undefined);

  const handleSaveUserInfoClicked = async () => {
    let firstNameAdjusted = firstName.trim();
    let lastNameAdjusted = lastName.trim();
    let nickNameAdjusted = nickName.trim();
    let websiteAdjusted = website.trim();
    if (websiteAdjusted.endsWith('/')) {
      websiteAdjusted = websiteAdjusted.substring(0, websiteAdjusted.length - 1);
    }

    const user: User = {
      username: session?.user?.username,
      type: userType,
      firstName: firstNameAdjusted,
      lastName: lastNameAdjusted,
      nickName: nickNameAdjusted,
      gender: gender,
      country: country,
      instagramHandle: instagramHandle,
      tikTokHandle: tikTokHandle,
      youTubeHandle: youTubeHandle,
      website: websiteAdjusted,
      verificationState: verificationState,
      tShirtSize: tShirtSize,
      houseNumber: houseNumber,
      street: street,
      postCode: postCode,
      city: city,
      exposeLocation: exposeLocation,
      locLatitude: locLatitude,
      locLongitude: locLongitude,
    };

    try {
      await updateUser(user, session);
      toast.success('Profile updated.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteAccountClicked = async () => {
    router.replace(`${routeAccount}?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteAccountClicked = async () => {
    try {
      await deleteUser(session);
      await signOut({ redirect: false });
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');
      router.push(routeAccountDeleted);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleLogoutClicked = async () => {
    router.replace(`${routeAccount}?logout=1`, undefined, { shallow: true });
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeAccount}`, undefined, { shallow: true });
  };

  const handleConfirmLogoutClicked = async () => {
    try {
      await signOut({ redirect: false });
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');
      router.push(routeHome);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleVerificationRequestClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    router.replace(`${routeAccount}?tab=account&verification=1`, undefined, { shallow: true });
  };

  const handleConfirmSendVerificationRequestClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    try {
      await updateUserVerificationState(session, session?.user?.username, UserVerificationState.VERIFICATION_PENDING);
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
    async function fetchUser() {
      const user = await getUser(session?.user?.username, session);
      setUserFetched(true);

      if (user.imageUrl) {
        setImageUrl(user.imageUrl);
      }
      if (user.type) {
        setUserType(user.type);
      }
      if (user.firstName) {
        setFirstName(user.firstName);
      }
      if (user.lastName) {
        setLastName(user.lastName);
      }
      if (user.nickName) {
        setNickName(user.nickName);
      }
      if (user.gender) {
        setGender(user.gender);
      }
      if (user.country) {
        setCountry(user.country);
      }
      if (user.instagramHandle) {
        setInstagramHandle(user.instagramHandle);
      }
      if (user.tikTokHandle) {
        setTikTokHandle(user.tikTokHandle);
      }
      if (user.youTubeHandle) {
        setYouTubeHandle(user.youTubeHandle);
      }
      if (user.website) {
        setWebsite(user.website);
      }
      if (user.verificationState) {
        setVerificationState(user.verificationState);
      }
      if (user.tShirtSize) {
        setTShirtSize(user.tShirtSize);
      }
      if (user.houseNumber) {
        setHouseNumber(user.houseNumber);
      }
      if (user.street) {
        setStreet(user.street);
      }
      if (user.postCode) {
        setPostCode(user.postCode);
      }
      if (user.city) {
        setCity(user.city);
      }
      if (user.exposeLocation) {
        setExposeLocation(user.exposeLocation);
      }
      if (user.locLatitude) {
        setLocLatitude(user.locLatitude);
      }
      if (user.locLongitude) {
        setLocLongitude(user.locLongitude);
      }
    }
    fetchUser();
  }, []);

  if (!userFetched) {
    return <LoadingSpinner />;
  }

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

      <div className="absolute inset-0 flex flex-col">
        <PageTitle title="Account Settings" />

        <div className="mx-2 flex flex-col overflow-auto">
          <div className="flex justify-center py-2">
            <Link href={routeAccountImage}>
              {!imageUrl && (
                <div className="mx-2 flex h-32 w-32 rounded-full border border-primary hover:bg-secondary justify-center">
                  <div className="w-24 flex flex-col justify-center items-center text-center gap-1">
                    <img className="w-16" src={imgUserAddImg} />
                    <div className="text-sm">{`Add picture`}</div>
                  </div>
                </div>
              )}

              {imageUrl && (
                <div className="flex justify-center py-2">
                  <img src={imageUrl} className="mx-2 flex h-32 w-32 rounded-full object-cover border border-secondary-dark hover:border-primary" />
                </div>
              )}
            </Link>
          </div>

          <div className="my-4" />
          <div className="flex flex-col overflow-hidden">
            <div className={'flex flex-col items-center overflow-auto'}>
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
                      label={getLabelForFirstName(userType)}
                      placeholder={getPlaceholderByUserType(userType).firstName}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.currentTarget.value);
                      }}
                    />

                    {userType !== UserType.ASSOCIATION && userType !== UserType.BRAND && (
                      <>
                        <TextInput
                          id={'lastName'}
                          label={'Last Name'}
                          placeholder=""
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.currentTarget.value);
                          }}
                        />

                        <TextInput
                          id={'nickName'}
                          label={'Nickname / Artist Name'}
                          placeholder=""
                          value={nickName}
                          onChange={(e) => {
                            setNickName(e.currentTarget.value);
                          }}
                        />

                        <div className="m-2 grid grid-cols-2">
                          <div className="p-2">{`Gender`}</div>
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

                        <div className="m-2 grid grid-cols-2">
                          <div className="p-2">{`Country`}</div>
                          <div className="flex w-full">
                            <ComboBox
                              menus={menuCountries}
                              value={country ? country : menuCountries[0].value}
                              searchEnabled={true}
                              onChange={(value: any) => {
                                setCountry(value);
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
                      value={instagramHandle}
                      onChange={(e) => {
                        setInstagramHandle(prefixRequired(e.currentTarget.value, '@'));
                      }}
                    />

                    <TextInput
                      id={'tikTokHandle'}
                      label={'TikTok Handle'}
                      placeholder="@dffb_org"
                      value={tikTokHandle}
                      onChange={(e) => {
                        setTikTokHandle(prefixRequired(e.currentTarget.value, '@'));
                      }}
                    />

                    <TextInput
                      id={'youTubeHandle'}
                      label={'YouTube Handle'}
                      placeholder="@dffb_org"
                      value={youTubeHandle}
                      onChange={(e) => {
                        setYouTubeHandle(prefixRequired(e.currentTarget.value, '@'));
                      }}
                    />

                    <TextInput
                      id={'website'}
                      label={'Website'}
                      placeholder="https://dffb.org"
                      value={website}
                      onChange={(e) => {
                        let url: string = e.currentTarget.value;
                        url = url.toLowerCase();

                        setWebsite(url);
                      }}
                    />

                    {/* <div className="m-2 grid grid-cols-2">
                    <div className="p-2">T-Shirt Size</div>
                    <div className="flex w-full">
                      <ComboBox
                        menus={menuTShirtSizes}
                        value={tShirtSize ? tShirtSize : menuTShirtSizes[0].value}
                        onChange={(value: any) => {
                          setTShirtSize(value);
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
                      value={city}
                      onChange={(e) => {
                        setExposeLocation(true);
                        setCity(e.currentTarget.value);
                        setLocLatitude(undefined);
                        setLocLongitude(undefined);
                      }}
                    />

                    <CheckBox
                      id={'exposeLocation'}
                      label="Publish city on Freestyler Map"
                      value={exposeLocation}
                      onChange={() => {
                        setExposeLocation(!exposeLocation);
                      }}
                    />
                  </div>
                </TabsContent>

                {/* Account */}
                <TabsContent value="account" className="overflow-hidden overflow-y-auto">
                  <div className="flex flex-col rounded-lg border border-primary bg-secondary-light p-4">
                    <div className="flex justify-center text-lg">{`Account Verification`}</div>

                    <div className="mt-4 flex flex-col justify-center items-center gap-2 text-center">
                      <p className="flex gap-2 items-center">
                        <div>{`Verification Status:`}</div>
                        <div className="font-extrabold p-2 rounded-lg bg-secondary">{(verificationState.charAt(0).toUpperCase() + verificationState.slice(1)).replaceAll('_', ' ')}</div>
                      </p>

                      {verificationState !== UserVerificationState.VERIFIED && verificationState !== UserVerificationState.VERIFICATION_PENDING && (
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

                <TabsContent value="competitions" className="overflow-hidden overflow-y-auto"></TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          <TextButton text="Save" onClick={handleSaveUserInfoClicked} />
        </Navigation>
      </div>
    </>
  );
};
export default Account;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: `${routeLogin}?redir=${routeAccount}`,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
