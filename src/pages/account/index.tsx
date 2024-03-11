import TextButton from '@/components/common/TextButton';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import TextInput from '@/components/common/TextInput';
import { routeAccount, routeAccountDeleted, routeAccountImage, routeHome, routeLogin } from '@/types/consts/routes';
import { imgUserNoImg } from '@/types/consts/images';
import Dialog from '@/components/Dialog';
import Navigation from '@/components/Navigation';
import { menuCountries } from '@/types/consts/menus/menu-countries';
import { menuTShirtSizes } from '@/types/consts/menus/menu-t-shirt-sizes';
import { ButtonStyle } from '@/types/enums/button-style';
import ErrorMessage from '@/components/ErrorMessage';
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

const Account = ({ session }: any) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const needsAuthorization = searchParams.get('auth');

  const [userFetched, setUserFetched] = useState(false);
  const [error, setError] = useState('');

  // public user info
  const [imageUrl, setImageUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [tikTokHandle, setTikTokHandle] = useState('');
  const [youTubeHandle, setYouTubeHandle] = useState('');
  const [website, setWebsite] = useState('');

  // private user info
  const [tShirtSize, setTShirtSize] = useState<string>();
  const [city, setCity] = useState<string>();
  const [exposeLocation, setExposeLocation] = useState<boolean>(false);

  const handleSaveUserInfoClicked = async () => {
    setError('');

    let firstNameAdjusted = firstName.trim();
    let lastNameAdjusted = lastName.trim();
    let websiteAdjusted = website.trim();
    if (websiteAdjusted.endsWith('/')) {
      websiteAdjusted = websiteAdjusted.substring(0, websiteAdjusted.length - 1);
    }

    const user: User = {
      username: session?.user?.username,
      firstName: firstNameAdjusted,
      lastName: lastNameAdjusted,
      country: country,
      website: websiteAdjusted,
      instagramHandle: instagramHandle,
      tikTokHandle: tikTokHandle,
      youTubeHandle: youTubeHandle,
      tShirtSize: tShirtSize,
      city: city,
      exposeLocation: exposeLocation,
    };

    try {
      await updateUser(user, session);
      router.push(`${routeHome}`);
    } catch (error: any) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteAccountClicked = async () => {
    router.replace(`${routeAccount}?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteAccountClicked = async () => {
    setError('');

    try {
      await deleteUser(session);
      await signOut({ redirect: false });
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');
      router.push(routeAccountDeleted);
    } catch (error: any) {
      setError(error.message);
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
    setError('');

    try {
      await signOut({ redirect: false });
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');
      router.push(routeHome);
    } catch (error: any) {
      setError(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser(session?.user?.username, session);
      setUserFetched(true);

      if (user.imageUrl) {
        setImageUrl(user.imageUrl);
      }
      if (user.firstName) {
        setFirstName(user.firstName);
      }
      if (user.lastName) {
        setLastName(user.lastName);
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
      if (user.tShirtSize) {
        setTShirtSize(user.tShirtSize);
      }
      if (user.city) {
        setCity(user.city);
      }
      if (user.exposeLocation) {
        setExposeLocation(user.exposeLocation);
      }
    }
    fetchUser();
  }, []);

  if (!userFetched) {
    return <LoadingSpinner />;
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      <Dialog title="Delete Account" queryParam="delete" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmDeleteAccountClicked}>
        <p>Do you really want to leave us?</p>
      </Dialog>

      <Dialog title="Logout" queryParam="logout" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmLogoutClicked}>
        <p>Logout now?</p>
      </Dialog>

      <div className="mx-2 flex flex-col overflow-auto">
        <h1 className="mt-2 text-center text-xl">Account Settings</h1>

        <div className="mt-2 flex justify-center py-2">
          <Link href={routeAccountImage}>
            <img src={imageUrl ? imageUrl : imgUserNoImg} className="mx-2 flex h-32 w-32 rounded-full object-cover" />
          </Link>
        </div>

        <div className="my-4" />
        <div className="mx-2 flex flex-col overflow-hidden">
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
                    label={'First Name'}
                    placeholder=""
                    value={firstName}
                    onChange={e => {
                      setFirstName(e.currentTarget.value);
                    }}
                  />

                  <TextInput
                    id={'lastName'}
                    label={'Last Name'}
                    placeholder=""
                    value={lastName}
                    onChange={e => {
                      setLastName(e.currentTarget.value);
                    }}
                  />

                  <div className="m-2 grid grid-cols-2">
                    <div className="p-2">Country</div>
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

                  <TextInput
                    id={'instagramHandle'}
                    label={'Instagram Handle'}
                    placeholder="@dffb_org"
                    value={instagramHandle}
                    onChange={e => {
                      setInstagramHandle(prefixRequired(e.currentTarget.value, '@'));
                    }}
                  />

                  <TextInput
                    id={'tikTokHandle'}
                    label={'TikTok Handle'}
                    placeholder="@dffb_org"
                    value={tikTokHandle}
                    onChange={e => {
                      setTikTokHandle(prefixRequired(e.currentTarget.value, '@'));
                    }}
                  />

                  <TextInput
                    id={'youTubeHandle'}
                    label={'YouTube Handle'}
                    placeholder="@dffb_org"
                    value={youTubeHandle}
                    onChange={e => {
                      setYouTubeHandle(prefixRequired(e.currentTarget.value, '@'));
                    }}
                  />

                  <TextInput
                    id={'website'}
                    label={'Website'}
                    placeholder="https://dffb.org"
                    value={website}
                    onChange={e => {
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
                    onChange={e => {
                      setExposeLocation(true);
                      setCity(e.currentTarget.value);
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
                <div className="mt-2">
                  <div className="flex justify-center pt-4">
                    <TextButton text="Logout" onClick={handleLogoutClicked} />
                  </div>

                  <div className="flex justify-center pt-4">
                    <TextButton text="Delete account" style={ButtonStyle.CRITICAL} onClick={handleDeleteAccountClicked} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitions" className="overflow-hidden overflow-y-auto"></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>

        <TextButton text="Save" onClick={handleSaveUserInfoClicked} />
      </Navigation>
    </div>
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
