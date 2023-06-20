import TextButton from '@/components/common/TextButton';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const defaultImg = '/profile/default-pfp.png';

const Account = ({ session }: any) => {
  const [imageUrl, setImageUrl] = useState('');

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
      setImageUrl(user.imageUrl);
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
