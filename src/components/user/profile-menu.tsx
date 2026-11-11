'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { routeAccount, routeAdminOverview, routeAds, routeEventSubs, routeFeedback, routeHome, routeJobs, routeLogin, routeUsers, routeWffaOverview } from '@/domain/constants/routes';
import { imgUserNoImg } from '@/domain/constants/images';
import { IconAd2, IconBriefcase, IconCalendarUser, IconChevronDown, IconLogout, IconMessageCircle, IconSettings, IconShieldCheck, IconUserCircle, IconWorld, type Icon } from '@tabler/icons-react';
import { AdministrativeUser } from '@/domain/enums/administrative-user';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { UserType } from '@/domain/enums/user-type';
import { getUser } from '@/infrastructure/clients/user.client';

const ProfileMenu = () => {
  const t = useTranslations('global/components/profile-menu');
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userTypeFromApi, setUserTypeFromApi] = useState<UserType | undefined>(undefined);
  const [countryCodeFromApi, setCountryCodeFromApi] = useState<string | undefined>(undefined);
  const [isWffaMember, setIsWffaMember] = useState<boolean>(false);

  const [opened, setOpened] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const uname = username ?? session?.user?.username;
    if (!uname || !session?.user?.accessToken) {
      setUserTypeFromApi(undefined);
      setCountryCodeFromApi(undefined);
      setIsWffaMember(false);
      return;
    }
    let cancelled = false;
    void getUser(uname, session).then(user => {
      if (cancelled) return;
      if (session?.user?.type === undefined) {
        setUserTypeFromApi(user.type);
      } else {
        setUserTypeFromApi(undefined);
      }
      setCountryCodeFromApi(user.countryCode);
      setIsWffaMember(!!user.isWffaMember);
    });
    return () => {
      cancelled = true;
    };
  }, [session, username]);

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

  const onAdsClicked = () => {
    router.push(routeAds);
  };

  const onJobsClicked = () => {
    router.push(routeJobs);
  };

  const onFeedbackClicked = () => {
    router.push(routeFeedback);
  };

  const onAdminClicked = () => {
    router.push(routeAdminOverview);
  };

  const onWffaClicked = () => {
    router.push(routeWffaOverview);
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

  const effectiveUserType = session?.user?.type ?? userTypeFromApi;
  const showAdsMenu = effectiveUserType === UserType.BRAND;
  // Temporarily limited to German freestylers (same gate as account Jobs tab)
  const showJobsMenu = effectiveUserType === UserType.FREESTYLER && countryCodeFromApi === 'DE';

  const isAdmin = (username ?? session?.user?.username) === AdministrativeUser.ADMIN;
  const tHeader = useTranslations('global/components/app-header');

  type MenuEntry = { label: string; Icon: Icon; action: () => void; critical?: boolean; divider?: boolean };
  const menuEntries: MenuEntry[] = [
    { label: t('menuItemMyEvents'), Icon: IconCalendarUser, action: onEventsClicked },
    { label: t('menuItemPublicProfile'), Icon: IconUserCircle, action: onPublicProfileClicked },
    { label: t('menuItemSettings'), Icon: IconSettings, action: onAccountClicked },
    ...(showAdsMenu ? [{ label: t('menuItemAds'), Icon: IconAd2, action: onAdsClicked }] : []),
    ...(showJobsMenu ? [{ label: t('menuItemJobs'), Icon: IconBriefcase, action: onJobsClicked }] : []),
    ...(isWffaMember || isAdmin ? [{ label: tHeader('menuItemWffa'), Icon: IconWorld, action: onWffaClicked, divider: true }] : []),
    ...(isAdmin ? [{ label: tHeader('menuItemAdmin'), Icon: IconShieldCheck, action: onAdminClicked, divider: !(isWffaMember || isAdmin) }] : []),
    { label: t('menuItemFeedback'), Icon: IconMessageCircle, action: onFeedbackClicked, divider: true },
    { label: t('menuItemLogout'), Icon: IconLogout, action: onLogoutClicked, critical: true },
  ];

  const isAuthenticated = () => {
    // workaround because session does not update and will be undefined unless page is refreshed manually
    if (username) {
      return true;
    }

    return false;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* avatar + name (name hidden on small screens) */}
      <button
        type="button"
        data-shot="account-menu"
        aria-haspopup="menu"
        aria-expanded={isAuthenticated() && opened}
        onClick={onClickProfile}
        className={cn(
          'flex h-10 max-w-[200px] items-center gap-2 rounded-full border border-border bg-background shadow-xs transition-all duration-150',
          'hover:border-foreground/20 hover:shadow-sm',
          isAuthenticated() ? 'pl-1 pr-1 sm:pr-3' : 'px-4 text-sm font-semibold',
          opened && isAuthenticated() && 'border-foreground/20 shadow-sm',
        )}
      >
        {isAuthenticated() ? (
          <>
            <img src={imageUrl ? imageUrl : imgUserNoImg} className="h-8 w-8 shrink-0 rounded-full object-cover" alt="" />
            <span className="hidden truncate text-sm font-medium sm:inline">{username}</span>
            <IconChevronDown className={cn('hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform sm:block', opened && 'rotate-180')} stroke={1.75} />
          </>
        ) : (
          <span>{t('login')}</span>
        )}
      </button>

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
        <div role="menu" className="absolute right-0 top-12 z-50 w-60 origin-top-right overflow-hidden rounded-2xl border border-border bg-background p-1.5 shadow-lg">
          <div className="flex items-center gap-3 px-2.5 pb-2.5 pt-1.5">
            <img src={imageUrl ? imageUrl : imgUserNoImg} className="h-9 w-9 rounded-full object-cover" alt="" />
            <div className="min-w-0 truncate text-sm font-semibold">{username}</div>
          </div>
          {menuEntries.map((entry, index) => {
            return (
              <div key={`${entry.label}-${index.toString()}`}>
                {(entry.divider || index === 0) && <div className="mx-1 my-1 h-px bg-border" aria-hidden />}
                <div
                  className={cn(
                    'flex h-10 cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors',
                    entry.critical ? 'text-critical-dark' : 'text-foreground',
                    'hover:bg-muted',
                    activeIndex === index && 'bg-muted',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  onClick={() => {
                    setOpened(false);
                    void entry.action();
                  }}
                  role="menuitem"
                >
                  <entry.Icon className={cn('h-[18px] w-[18px]', entry.critical ? 'text-critical-dark' : 'text-muted-foreground')} stroke={1.75} />
                  <span>{entry.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Transition>
    </div>
  );
};

export default ProfileMenu;
