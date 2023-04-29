import Button from '@/components/common/Button';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';

const Account = ({ session }: any) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleInputImageChanged = (event: any) => {
    setImageUrl(event.target.value);
  };

  const handleLogoutClicked = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
    router.push('/');
  };

  const handleSaveClicked = async () => {
    // add more validation here
    if (imageUrl) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
        method: 'PUT',
        body: JSON.stringify({ username: `${session?.user?.accessToken}`, imageUrl: imageUrl }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });

      if (response.status === 200) {
        localStorage.setItem('imageUrl', imageUrl);
        router.push(`/`);
      }
    }
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
          <label className="pr-4">Image URL:</label>
          <input type="text" required minLength={2} value={imageUrl ? imageUrl : ''} className="" onChange={handleInputImageChanged} />
        </div>
        <div className="flex justify-center py-2">
          <Button text="Save" onClick={handleSaveClicked} />
        </div>
        <div className="flex justify-center py-2">
          <Button text="Logout" onClick={handleLogoutClicked} />
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
