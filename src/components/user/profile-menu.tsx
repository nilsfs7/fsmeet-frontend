'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { routeAccount, routeEventSubs, routeFeedback, routeHome, routeLogin, routeUsers } from '@/domain/constants/routes';
import { imgProfileEvents, imgProfileFeedback, imgProfileLogout, imgProfileSettings, imgUserNoImg } from '@/domain/constants/images';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const ProfileMenu = () => {
  const t = useTranslations('global/components/profile-menu');
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [opened, setOpened] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuItems = [t('menuItemMyEvents'), t('menuItemPublicProfile'), t('menuItemSettings'), t('menuItemFeedback'), t('menuItemLogout')];
  const menuItemIcons = [imgProfileEvents, imgUserNoImg, imgProfileSettings, imgProfileFeedback, imgProfileLogout];

  useEffect(() => {
    const name = localStorage.getItem('username');
    setUsername(name ? name : null);

    const url = localStorage.getItem('imageUrl');
    setImageUrl(url ? url : null);
  }, [username, imageUrl, session]);

  useEffect(() => {
    if (!opened) return;
    const onPointerDown = (event: PointerEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(event.target as Node)) {
        setOpened(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [opened]);

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

      /* 
      Navigate to home page with full reload.
      Use "router.push(routeHome);" when google maps issue is resolved.
      More details in login-form.tsx
      */
      window.location.href = routeHome;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItemActions = [onEventsClicked, onPublicProfileClicked, onAccountClicked, onFeedbackClicked, onLogoutClicked];

  const isAuthenticated = () => {
    // workaround because session does not update and will be undefined unless page is refreshed manually
    if (username) {
      return true;
    }

    return false;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* picture and name  */}
      <div
        className={cn(
          'static flex h-14 min-w-[100px] max-w-[180px] cursor-pointer items-center justify-center rounded-xl border border-border/60 p-1',
          'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
          'supports-[backdrop-filter]:bg-secondary-light/70',
          'transition-all duration-200',
          'hover:border-primary/50 hover:shadow-md',
          'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
          opened && isAuthenticated() && 'border-primary/50 shadow-md',
        )}
      >
        <button type="button" className="flex items-center gap-2" onClick={onClickProfile}>
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
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-14 z-50 mt-2 min-w-max overflow-hidden rounded-xl border border-border/60',
            'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
            'supports-[backdrop-filter]:bg-secondary-light/70',
            'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
          )}
        >
          {menuItems.map((menuItem, index) => {
            return (
              <div
                key={index}
                className={cn(
                  'flex h-12 cursor-pointer items-center px-2 text-foreground transition-colors',
                  'hover:bg-muted/50 dark:hover:bg-muted/30',
                  activeIndex === index && 'bg-muted/50 dark:bg-muted/30',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                onClick={menuItemActions[index]}
                role="menuitem"
              >
                <img src={menuItemIcons[index]} className="mx-1 w-6 object-contain" alt="" />
                <div className="type-body-sm mx-1 sm:text-base">{menuItem}</div>
              </div>
            );
          })}
        </div>
      </Transition>
    </div>
  );
};

export default ProfileMenu;
