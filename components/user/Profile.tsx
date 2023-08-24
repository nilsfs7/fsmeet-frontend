import { signOut, useSession } from 'next-auth/react';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { routeAccount, routeEventSubs, routeFeedback, routeHome, routeLogin } from '@/types/consts/routes';
import { imgProfileEvents, imgProfileFeedback, imgProfileLogout, imgProfileSettings, imgUserNoImg } from '@/types/consts/images';

const Profile = () => {
  const { data: session, status } = useSession();

  const [username, setUsername] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [opened, setOpened] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const menuItems = ['My Events', 'Settings', 'Feedback', 'Logout'];
  const menuItemIcons = [imgProfileEvents, imgProfileSettings, imgProfileFeedback, imgProfileLogout];

  useEffect(() => {
    const name = localStorage.getItem('username');
    setUsername(name ? name : null);

    const url = localStorage.getItem('imageUrl');
    setImageUrl(url ? url : null);
  }, [username, imageUrl]);

  const onClickProfile = (e: any) => {
    !isAuthenticated() ? router.push(routeLogin) : !opened ? setOpened(true) : setOpened(false);
  };

  const onEventsClicked = () => {
    router.push(routeEventSubs);
  };

  const onAccountClicked = () => {
    router.push(routeAccount);
  };

  const onFeedbackClicked = () => {
    router.push(routeFeedback);
  };

  const onLogoutClicked = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
    router.push(routeHome);
  };

  const menuItemActions = [onEventsClicked, onAccountClicked, onFeedbackClicked, onLogoutClicked];

  const isAuthenticated = () => {
    return status === 'authenticated';
  };

  return (
    <div className="relative">
      {/* picture and name  */}
      <div className="static grid h-14 min-w-[100px] max-w-[180px] cursor-pointer rounded-lg border border-black bg-zinc-300 p-1 hover:bg-zinc-400">
        <button className="h-full w-full" onClick={onClickProfile}>
          <div className="grid grid-flow-col items-center">
            <img src={isAuthenticated() && imageUrl ? imageUrl : imgUserNoImg} className="mx-2 h-10 w-10 rounded-full object-cover" />
            <div className="mx-1 truncate hover:text-clip">{isAuthenticated() ? username : 'Login'}</div>
          </div>
        </button>
      </div>

      {/* actions menu */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={isAuthenticated() && opened}
      >
        <div className={`absolute right-0 top-14 mt-2 min-w-max rounded-lg border border-black bg-zinc-300`}>
          {menuItems.map((menuItem, index) => {
            return (
              <div
                key={index}
                className={`flex h-[48px] cursor-pointer items-center pl-2 pr-2 
                ${activeIndex === index ? 'bg-zinc-400' : ''} 
                ${index === 0 ? 'rounded-t-[8px]' : ''} 
                ${index === menuItems.length - 1 ? 'rounded-b-[8px]' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                onClick={menuItemActions[index]}
              >
                <img src={`${menuItemIcons[index]}`} className="mx-1 w-[24px] object-fill" alt="icon" />
                <div className={'item mx-1 text-base'}>{menuItem}</div>
              </div>
            );
          })}
        </div>
      </Transition>
    </div>
  );
};

export default Profile;
