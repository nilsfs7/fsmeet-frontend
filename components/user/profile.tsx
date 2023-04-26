import { useSession } from 'next-auth/react';
import router from 'next/router';

interface IProfile {
  imgUrl?: string;
  username?: string;
  onClick?: () => void;
}

const defaultImg = '/profile/default-pfp.png';
const routeLogin = '/login';
const routeAccount = '/account';

const Profile = ({ imgUrl, onClick }: IProfile) => {
  const { data: session, status } = useSession();

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
          <img alt={'user'} src={isAuthenticated() ? imgUrl : defaultImg} className="mx-2 h-11 w-11 rounded-full object-cover" />
          <div className="mx-2 text-xl">{isAuthenticated() && session?.user?.name ? session.user.name : 'Login'}</div>
        </div>
      </button>
    </div>
  );
};

export default Profile;
