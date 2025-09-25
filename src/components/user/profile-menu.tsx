'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { routeAccount, routeEventSubs, routeFeedback, routeHome, routeLogin, routeUsers } from '@/domain/constants/routes';
import { imgProfileEvents, imgProfileFeedback, imgProfileLogout, imgProfileSettings, imgUserNoImg } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';

const ProfileMenu = () => {
  const t = useTranslations('global/components/profile-menu');
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [opened, setOpened] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const menuItems = [t('menuItemMyEvents'), t('menuItemPublicProfile'), t('menuItemSettings'), t('menuItemFeedback'), t('menuItemLogout')];
  const menuItemIcons = [imgProfileEvents, imgUserNoImg, imgProfileSettings, imgProfileFeedback, imgProfileLogout];

  useEffect(() => {
    const name = localStorage.getItem('username');
    setUsername(name ? name : null);

    const url = localStorage.getItem('imageUrl');
    setImageUrl(url ? url : null);
  }, [username, imageUrl, session]);

  const onClickProfile = () => {
    !isAuthenticated() ? router.push(routeLogin) : setOpened(!opened);
  };

  const onEventsClicked = () => {
    router.push(routeEventSubs);
  };

  const onPublicProfileClicked = () => {
    router.push(`${routeUsers}/${username}`);
  };

  const onAccountClicked = () => {
    router.push(routeAccount);
  };

  const onFeedbackClicked = () => {
    router.push(routeFeedback);
  };

  const onLogoutClicked = async () => {
    console.info('Logging out...');

    try {
      // Sign out from NextAuth first
      await signOut({
        redirect: false,
        callbackUrl: routeHome,
      });

      // Clear data after successful logout
      localStorage.removeItem('username');
      localStorage.removeItem('imageUrl');

      // Update local state
      setUsername(null);
      setImageUrl(null);

      // Navigate to home page
      router.push(routeHome);
      router.refresh(); // Force refresh to update session state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItemActions = [onEventsClicked, onPublicProfileClicked, onAccountClicked, onFeedbackClicked, onLogoutClicked];

  const isAuthenticated = () => {
    // workaround because session does not update and will be undefined unsless page is refreshed manually
    if (username) {
      return true;
    }

    return false;
  };

  return (
    <div className="relative">
      {/* picture and name  */}
      <div className="static flex h-14 min-w-[100px] max-w-[180px] p-1 items-center justify-center cursor-pointer rounded-lg border border-secondary-dark bg-secondary-light hover:border-primary">
        <button className="flex gap-2 items-center" onClick={onClickProfile}>
          <div className="h-11 w-11">
            <img src={imageUrl ? imageUrl : imgUserNoImg} className="h-full w-full rounded-full object-cover" />
          </div>
          <div className="truncate hover:text-clip">{username || t('login')}</div>
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
        <div className={`absolute right-0 top-14 mt-2 min-w-max rounded-lg border border-secondary-dark bg-secondary-light hover:border-primary`}>
          {menuItems.map((menuItem, index) => {
            return (
              <div
                key={index}
                className={`flex h-[48px] cursor-pointer items-center pl-2 pr-2 
                ${activeIndex === index ? 'bg-secondary' : ''} 
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

export default ProfileMenu;
