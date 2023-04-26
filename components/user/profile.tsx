import { useSession } from 'next-auth/react';
import router from 'next/router';

const defaultImg = '/profile/default-pfp.png';
const routeLogin = '/login';
const routeAccount = '/account';

const Profile = () => {
  const { data: session, status } = useSession();

  // get from session
  const imgUrl =
    'https://scontent-muc2-1.xx.fbcdn.net/v/t31.18172-8/17492379_1395721013824677_2431623315541165382_o.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=HxVgLT_npx4AX-WRSrd&_nc_ht=scontent-muc2-1.xx&oh=00_AfDNqfcc7VuvR0-bjrGcEHQA4Om_dOKr7xiHiS2Hu6-7Fg&oe=645399B7';

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
          <img alt={'user'} src={isAuthenticated() ? imgUrl : defaultImg} className="mx-2 h-10 w-10 rounded-full object-cover" />
          <div className="my- mx-4 text-xl">{isAuthenticated() && session?.user?.name ? session.user.name : 'Login'}</div>
        </div>
      </button>
    </div>
  );
};

export default Profile;
