import Button from '@/components/common/Button';
import jwt_decode from 'jwt-decode';
import router from 'next/router';
import { useState } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';
import useSWR from 'swr';

const fetcher = (url: RequestInfo | URL) => fetch(url).then(res => res.json());

const Account = () => {
  const [imageUrl, setImageUrl] = useState();

  const handleInputImageChanged = (event: any) => {
    setImageUrl(event.target.value);
  };

  const handleLogoutClicked = async () => {
    deleteCookie('jwt');
    router.replace('/');
    router.push('/');
  };

  const handleSaveClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`, {
      method: 'PUT',
      body: JSON.stringify({ username: `${decoded.username}`, imageUrl: imageUrl }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('jwt')}`,
      },
    });

    if (response.status === 200) {
      router.push(`/`);
    }
  };

  const jwt = getCookie('jwt');
  let decoded: any = null;
  if (typeof jwt === 'string') {
    decoded = jwt_decode(jwt);
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
