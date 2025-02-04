'use client';

import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import TextButton from '@/components/common/TextButton';
import { getUser, getUsers } from '@/infrastructure/clients/user.client';
import { routeAccount, routeHome, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { User } from '@/types/user';
import Link from 'next/link';
import { ActionButtonCopyUrl } from './components/action-button-copy-url';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { supportedLanguages } from '@/domain/constants/supported-languages';
import { getCookie, setCookie } from 'cookies-next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import MapOfFreestylers from '@/components/MapOfFreestylers';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { menuGender } from '@/domain/constants/menus/menu-gender';
import { Gender } from '@/domain/enums/gender';
import { ChevronDown } from 'lucide-react';

export default function Map(props: { searchParams: Promise<{ iframe: string; lang: string }> }) {
  const t = useTranslations('/map');
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  const router = useRouter();

  const username = searchParams?.get('user');
  const Lat = searchParams?.get('lat');
  const Lng = searchParams?.get('lng');
  const zoom = searchParams?.get('zoom');
  const iframeView = searchParams?.get('iframe') === '1';
  let language = searchParams?.get('lang');

  const [users, setUsers] = useState<User[]>([]);
  const [actingUser, setActingUser] = useState<User>();
  const [filterName, setFilterName] = useState('');
  const [filterGender, setFilterGender] = useState<Gender[]>([Gender.FEMALE, Gender.MALE]);

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users);
    });

    if (language) {
      language = language.toUpperCase();
      if (supportedLanguages.includes(language)) {
        if (getCookie('locale') !== language) {
          setCookie('locale', language);
          router.refresh();
        }
      }
    }
  }, []);

  useEffect(() => {
    if (session?.user?.username) {
      getUser(session.user.username).then(user => {
        setActingUser(user);
      });
    }
  }, [session]);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      {!iframeView && (
        <>
          <Header />

          <PageTitle title={t('pageTitle')} />
        </>
      )}
      <div className="flex flex-col h-full gap-2">
        {/* filters */}
        {!iframeView && (
          <div className="mx-2 flex gap-2">
            <Input
              placeholder={t('inputSearchPlaceholder')}
              value={filterName}
              onChange={(event: any) => {
                setFilterName(event.target.value);
              }}
              className="max-w-40"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {t('drpDwnGender')}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuGender.map(menuItem => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={menuItem.value}
                      checked={filterGender.includes(menuItem.value as Gender)}
                      onCheckedChange={(value: any) => {
                        const genders = Array.from(filterGender);

                        // add or remove gender from array
                        if (value === true) {
                          genders.push(menuItem.value as Gender);
                        } else {
                          const index = genders.indexOf(menuItem.value as Gender);
                          if (index > -1) {
                            genders.splice(index, 1);
                          }
                        }

                        setFilterGender(genders);
                      }}
                    >
                      {menuItem.text}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="h-full max-h-screen overflow-hidden">
          {Lat && Lng && (
            <MapOfFreestylers lat={+Lat} lng={+Lng} zoom={zoom ? +zoom : 7} users={users} selectedUsers={[username ? username : '']} filterName={filterName} filterGender={filterGender} />
          )}
          {(!Lat || !Lng) && <MapOfFreestylers zoom={zoom ? +zoom : 4} users={users} filterName={filterName} filterGender={filterGender} />}
        </div>
      </div>

      {iframeView && (
        <Navigation reverse>
          <div className="flex justify-end gap-1">
            <a href={routeMap} target="_blank" rel="noopener noreferrer">
              <TextButton text={t('btnViewOnFSMeet')} />
            </a>
          </div>
        </Navigation>
      )}
      {!iframeView && (
        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          <div className="flex justify-end gap-1">
            <ActionButtonCopyUrl />

            {(!actingUser || (actingUser && !actingUser.locLatitude)) && (
              <Link href={`${routeAccount}?tab=map`}>
                <TextButton text={t('btnAddPin')} />
              </Link>
            )}
          </div>
        </Navigation>
      )}
    </div>
  );
}
