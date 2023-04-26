import Button from '@/components/common/Button';
import router from 'next/router';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { decode } from 'next-auth/jwt';

const Account = (props: any) => {
  const user = props.data;

  const { data: session, status } = useSession();
  const [imageUrl, setImageUrl] = useState();

  const handleInputImageChanged = (event: any) => {
    setImageUrl(event.target.value);
  };

  const handleLogoutClicked = async () => {
    router.push('/');
    await signOut({ redirect: false });
  };

  const handleSaveClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'PUT',
      body: JSON.stringify({ username: `${'nils'}`, imageUrl: imageUrl }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${'jwt'}`,
      },
    });

    if (response.status === 200) {
      router.push(`/`);
    }
  };

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  return (
    <>
      <div className="flex h-screen columns-2 flex-col justify-center">
        <div className="flex justify-center py-2">
          <label className="pr-4">Image URL:</label>
          <input type="text" required minLength={2} defaultValue={user.imageUrl} value={imageUrl} className="" onChange={handleInputImageChanged} />
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

export const getServerSideProps: GetServerSideProps = async context => {
  const sessionToken = context.req.cookies['next-auth.session-token'];
  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET as string,
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${decoded?.name}`);
  const data = await response.json();

  return {
    props: {
      data: data,
    },
  };
};
