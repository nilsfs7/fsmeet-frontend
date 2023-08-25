import TextButton from '@/components/common/TextButton';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import TextInput from '@/components/common/TextInput';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import Dropdown, { MenuItem } from '@/components/common/Dropdown';
import { routeAccount, routeHome } from '@/types/consts/routes';
import { imgUserNoImg } from '@/types/consts/images';
import Dialog from '@/components/Dialog';

const countries: MenuItem[] = [
  { text: 'not specified', value: '--' },
  { text: 'Austria', value: 'AT' },
  { text: 'Switzerland', value: 'CH' },
  { text: 'Germany', value: 'DE' },
];

const Account = ({ session }: any) => {
  const [userFetched, setUserFetched] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [country, setCountry] = useState();
  const [instagramHandle, setInstagramHandle] = useState();

  const handleSaveUserInfoClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'PATCH',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        country: country,
        instagramHandle: instagramHandle,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.log('updating user info successful');
    } else {
      console.log('updating user info failed');
    }
  };

  const handleDeleteAccountClicked = async () => {
    router.replace(`${routeAccount}?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteAccountClicked = async () => {
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
      router.push(routeHome);
    } else {
      console.error('failed to delete account');
    }
  };

  async function handleCanacelDeleteAccountClicked() {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${session?.user?.username}`);
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
    }
    fetchUser();
  }, []);

  if (!userFetched) {
    return <>loading...</>;
  }

  return (
    <>
      <Dialog title="Delete Account" queryParam="delete" onClose={handleCanacelDeleteAccountClicked} onOk={handleConfirmDeleteAccountClicked}>
        <p>Do you really want to leave us?</p>
      </Dialog>

      <div className="absolute inset-0 flex flex-col overflow-y-auto">
        <h1 className="mt-2 text-center text-xl">Account Settings</h1>

        <div className="mt-2 flex justify-center py-2">
          <Link href="/account/image">
            <img src={imageUrl ? imageUrl : imgUserNoImg} className="mx-2 flex h-32 w-32 rounded-full object-cover" />
          </Link>
        </div>

        <div className="my-4" />

        <div className={'flex flex-col items-center'}>
          <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
            <TextInput
              id={'firstName'}
              label={'First Name'}
              placeholder="Kevin"
              value={firstName}
              onChange={e => {
                setFirstName(e.currentTarget.value);
              }}
            />
            <TextInput
              id={'lastName'}
              label={'Last Name'}
              placeholder="Kück"
              value={lastName}
              onChange={e => {
                setLastName(e.currentTarget.value);
              }}
            />
            <div className="m-2 grid grid-cols-2">
              <div className="p-2">Country</div>
              <Dropdown
                menus={countries}
                value={country ? country : countries[0].value}
                onChange={(value: any) => {
                  setCountry(value);
                }}
              />
            </div>
            <TextInput
              id={'instagramHandle'}
              label={'Instagram Handle'}
              placeholder="@freestyler.kevin"
              value={instagramHandle}
              onChange={e => {
                setInstagramHandle(e.currentTarget.value);
              }}
            />
          </div>

          <div className="my-2 flex">
            <div className="px-1">
              <ActionButton action={Action.SAVE} onClick={handleSaveUserInfoClicked} />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-10">
          <TextButton text="Delete account" onClick={handleDeleteAccountClicked} />
        </div>

        <div className="flex justify-center pt-10">
          <Link href="/">
            <TextButton text="Back to home" />
          </Link>
        </div>

        <div className="flex justify-center py-2">
          <TextButton text="Logout" onClick={handleLogoutClicked} />
        </div>
      </div>
    </>
  );
};
export default Account;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
