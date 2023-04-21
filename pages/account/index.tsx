import Button from '@/components/common/Button';
import jwt_decode from 'jwt-decode';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';

const fetcher = (url: RequestInfo | URL) => fetch(url).then(res => res.json());

const Account = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [imageUrl, setImageUrl] = useState();

  const handleInputImageChanged = (event: any) => {
    setImageUrl(event.target.value);
  };

  const handleLogoutClicked = async () => {
    removeCookie('jwt');
    router.push('/');
  };

  const handleSaveClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'PUT',
      body: JSON.stringify({ username: `${decoded.username}`, imageUrl: imageUrl }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.jwt}`,
      },
    });

    if (response.status === 200) {
      router.push(`/`);
    }
  };

  let decoded: any = null;
  if (cookies.jwt) {
    decoded = jwt_decode(cookies.jwt);
  }

  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${decoded === null ? 'undefined' : decoded.username}`, fetcher);
  if (error) return 'An error has occurred.';
  if (isLoading) return 'Loading...';

  return (
    <>
      <div className="flex h-screen columns-2 flex-col justify-center">
        <div className="flex justify-center py-2">
          <label className="pr-4">Image URL:</label>
          <input type="text" required minLength={2} defaultValue={data.imageUrl} value={imageUrl} className="" onChange={handleInputImageChanged} />
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
