import { useSession } from 'next-auth/react';
import router from 'next/router';
import { useEffect, useState } from 'react';

const defaultImg = '/profile/default-pfp.png';
const routeLogin = '/login';
const routeAccount = '/account';

const Profile = () => {
  const { data: session, status } = useSession();

  const [username, setUsername] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('username');
    setUsername(name ? name : null);

    const url = localStorage.getItem('imageUrl');
    setImageUrl(url ? url : null);
  }, [username, imageUrl]);

  const onClickProfile = (e: any) => {
    isAuthenticated() ? router.push(routeAccount) : router.push(routeLogin);
  };

  const isAuthenticated = () => {
    return status === 'authenticated';
  };

  return (
    <div className="grid min-w-[100px] cursor-pointer rounded-lg border-2 border-black bg-zinc-300 p-1 hover:bg-zinc-400">
      <button className="h-full w-full" onClick={onClickProfile}>
        <div className="grid grid-flow-col items-center">
          <img alt={'user'} src={isAuthenticated() && imageUrl ? imageUrl : defaultImg} className="mx-2 h-10 w-10 rounded-full object-cover" />
          <div className="mx-4 text-xl">{isAuthenticated() ? username : 'Login'}</div>
        </div>
      </button>
    </div>
  );
};

export default Profile;
