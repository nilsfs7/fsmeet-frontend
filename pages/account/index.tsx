import TextButton from '@/components/common/TextButton';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import TextInput from '@/components/common/TextInput';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';

const defaultImg = '/profile/default-pfp.png';

const Account = ({ session }: any) => {
  const [imageUrl, setImageUrl] = useState('');

  const [instagramHandle, setInstagramHandle] = useState();

  const handleSaveUserInfoClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'PUT',
      body: JSON.stringify({
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

  const handleBackToHomeClicked = () => {
    router.replace('/');
  };

  const handleDeleteAccountClicked = async () => {
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
      router.push('/');
    } else {
      console.error('failed to delete account');
    }
  };

  const handleLogoutClicked = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
    router.push('/');
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${session?.user?.username}`);
      const user = await res.json();
      console.log(user);
      setImageUrl(user.imageUrl);
      if (user.instagramHandle) {
        setInstagramHandle(user.instagramHandle);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <div className="flex h-screen columns-2 flex-col justify-center">
        <div className="flex justify-center py-2">
          <Link href="/account/image">
            <img src={imageUrl ? imageUrl : defaultImg} className="mx-2 flex h-32 w-32 rounded-full object-cover" />
          </Link>
        </div>

        <div className="my-4" />

        <div className={'flex columns-1 flex-col items-center'}>
          <div className="m-2 flex flex-col rounded-lg bg-zinc-300 p-1">
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
          <TextButton text="Back to home" onClick={handleBackToHomeClicked} />
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
