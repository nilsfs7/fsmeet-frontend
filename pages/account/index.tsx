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

const Account = ({ session }: any) => {
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

  // private user info
  const [tShirtSize, setTShirtSize] = useState();
  const [city, setCity] = useState('');
  const [exposeLocation, setExposeLocation] = useState(false);

  const handleSaveUserInfoClicked = async () => {
    setError('');

    const body = JSON.stringify({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country: country,
      instagramHandle: instagramHandle,
      tikTokHandle: tikTokHandle,
      youTubeHandle: youTubeHandle,
      private: {
        tShirtSize: tShirtSize,
        city: city,
        exposeLocation: exposeLocation,
      },
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'PATCH',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.info('updating user info successful');
      router.push(`${routeHome}`);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteAccountClicked = async () => {
    router.replace(`${routeAccount}?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteAccountClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (response.status === 200) {
      await signOut({ redirect: false });
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');
      router.push(routeAccountDeleted);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  async function handleCancelDeleteAccountClicked() {
    router.replace(`${routeAccount}`, undefined, { shallow: true });
  }

  const handleLogoutClicked = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
    router.push(routeHome);
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${session?.user?.username}/private`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      const user = await res.json();
      setUserFetched(true);

      setImageUrl(user.imageUrl);
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
      if (user.private?.tShirtSize) {
        setTShirtSize(user.private.tShirtSize);
      }
      if (user.private?.city) {
        setCity(user.private.city);
      }
      if (user.private?.exposeLocation) {
        setExposeLocation(user.private.exposeLocation);
      }
    }
    fetchUser();
  }, []);

  if (!userFetched) {
    return <>loading...</>;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <Dialog title="Delete Account" queryParam="delete" onCancel={handleCancelDeleteAccountClicked} onConfirm={handleConfirmDeleteAccountClicked}>
        <p>Do you really want to leave us?</p>
      </Dialog>

      <div className="mx-2 flex flex-col overflow-y-auto">
        <h1 className="mt-2 text-center text-xl">Account Settings</h1>

        <div className="mt-2 flex justify-center py-2">
          <Link href={routeAccountImage}>
            <img src={imageUrl ? imageUrl : imgUserNoImg} className="mx-2 flex h-32 w-32 rounded-full object-cover" />
          </Link>
        </div>

        <div className="my-4" />

        <div className={'flex flex-col items-center'}>
          <div className="mb-2 flex flex-col rounded-lg border border-primary bg-secondary-light p-1">
            <div className="text-center">Public Info</div>
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
                setInstagramHandle(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'tikTokHandle'}
              label={'TikTok Handle'}
              placeholder="@dffb_org"
              value={tikTokHandle}
              onChange={e => {
                setTikTokHandle(e.currentTarget.value);
              }}
            />

            <TextInput
              id={'youTubeHandle'}
              label={'YouTube Handle'}
              placeholder="@dffb_org"
              value={youTubeHandle}
              onChange={e => {
                setYouTubeHandle(e.currentTarget.value);
              }}
            />
          </div>

          <div className="flex flex-col rounded-lg  border border-primary bg-secondary-light p-1">
            <div className="text-center">Private Info</div>
            <div className="m-2 grid grid-cols-2">
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
            </div>

            <TextInput
              id={'city'}
              label={'City'}
              placeholder="Munich"
              value={city}
              onChange={e => {
                setCity(e.currentTarget.value);
              }}
            />

            <CheckBox
              id={'exposeLocation'}
              label="Publish city on Freestyler's Map"
              value={exposeLocation}
              onChange={() => {
                setExposeLocation(!exposeLocation);
              }}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <TextButton text="Logout" onClick={handleLogoutClicked} />
        </div>

        <div className="flex justify-center pt-4">
          <TextButton text="Delete account" style={ButtonStyle.CRITICAL} onClick={handleDeleteAccountClicked} />
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

export async function getServerSideProps(context: any) {
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
}
