'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { User } from '@/domain/types/user';
import { routeUsers } from '@/domain/constants/routes';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserType } from '@/domain/enums/user-type';
import { imgUserDefaultImg } from '@/domain/constants/images';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { menuGender } from '@/domain/constants/menus/menu-gender';
import { ChevronDown } from 'lucide-react';
import { Gender } from '@/domain/enums/gender';
import LoadingSpinner from './animation/loading-spinner';
import { isNaturalPerson } from '../functions/is-natural-person';
import { menuUserType } from '../domain/constants/menus/menu-user-type';
import { cn } from '@/lib/utils';

interface IMapWrapperProps {
  userList: User[];
  selectedUsernames?: string[];
  region?: string;
  language?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  streetViewEnabled?: boolean;
  isIframe?: boolean;
}

const MapWrapper = ({
  userList = [],
  selectedUsernames = [],
  region = 'DE',
  language = 'EN',
  lat = 54.5259614, // Central Europe
  lng = 15.2551187, // Central Europe
  zoom = 6,
  streetViewEnabled = false,
  isIframe = false,
}: IMapWrapperProps) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      const res = await fetch('/api/maps-api-key');
      const data = await res.json();
      setApiKey(data.apiKey);
    };

    fetchApiKey();
  }, []);

  if (!apiKey) return <LoadingSpinner />;

  return (
    <Map
      googleMapsApiKey={apiKey}
      userList={userList}
      selectedUsernames={selectedUsernames}
      region={region}
      language={language}
      lat={lat}
      lng={lng}
      zoom={zoom}
      streetViewEnabled={streetViewEnabled}
      isIframe={isIframe}
    />
  );
};

interface IMapProps {
  googleMapsApiKey: string;
  userList: User[];
  selectedUsernames?: string[];
  region?: string;
  language?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  streetViewEnabled?: boolean;
  isIframe?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MAP_FILTER_ALL = '__all__' as const;

const mapCountrySelectTriggerClass = 'h-9 w-full min-w-0 border-border/60 bg-background/80 text-left dark:border-zinc-700';

const DEFAULT_MAP_USER_TYPES: UserType[] = [
  UserType.FREESTYLER,
  UserType.ASSOCIATION,
  UserType.BRAND,
  UserType.DJ,
  UserType.EVENT_ORGANIZER,
  UserType.MC,
  UserType.MEDIA,
];

function sameUserTypeSelection(a: UserType[], b: UserType[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

const DEFAULT_MAP_GENDERS: Gender[] = [Gender.FEMALE, Gender.MALE];

function sameGenderSelection(a: Gender[], b: Gender[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

const getSelectedUsers = (users: User[], selectedUsernames: string[]): User[] => {
  return users.filter(usr => selectedUsernames.includes(usr.username));
};

const Map = ({
  googleMapsApiKey,
  userList = [],
  selectedUsernames = [],
  region = 'DE',
  language = 'EN',
  lat = 54.5259614, // Central Europe
  lng = 15.2551187, // Central Europe
  zoom = 6,
  streetViewEnabled = false,
  isIframe = false,
}: IMapProps) => {
  let t = useTranslations('/map');

  const [selectedUsers, setSelectedUsers] = useState<User[]>(getSelectedUsers(userList, selectedUsernames));
  const [filterName, setFilterName] = useState('');
  const [filterGender, setFilterGender] = useState<Gender[]>(() => [...DEFAULT_MAP_GENDERS]);
  const [filterUserType, setFilterUserType] = useState<UserType[]>(() => [...DEFAULT_MAP_USER_TYPES]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filterCountryCode, setFilterCountryCode] = useState('');
  const [map, setMap] = React.useState<google.maps.Map | null>();
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script-fs-map',
    googleMapsApiKey,
    region,
    language,
  });

  // prepare icons
  const iconAssociation = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.ASSOCIATION, undefined, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconBrand = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.BRAND, undefined, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconDJ = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.DJ, undefined, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconEventOrganizer = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.EVENT_ORGANIZER, undefined, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconFreestylerMale = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.FREESTYLER, Gender.MALE, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconFreestylerFemale = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.FREESTYLER, Gender.FEMALE, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconMC = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.MC, undefined, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconMedia = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.MEDIA, undefined, true);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const userCountryOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const u of userList) {
      const c = (u.countryCode || '').trim().toUpperCase();
      if (c) seen.add(c);
    }
    return [...seen]
      .map(code => {
        const name = getCountryNameByCode(code) || code;
        return { code, name };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [userList]);

  useEffect(() => {
    if (!filterCountryCode) return;
    const v = filterCountryCode.trim().toUpperCase();
    const stillValid = userCountryOptions.some(o => o.code === v);
    if (!stillValid) setFilterCountryCode('');
  }, [filterCountryCode, userCountryOptions]);

  const hasAdvancedFiltersActive = useMemo(
    () =>
      Boolean(filterCountryCode.trim()) ||
      !sameUserTypeSelection(filterUserType, DEFAULT_MAP_USER_TYPES) ||
      !sameGenderSelection(filterGender, DEFAULT_MAP_GENDERS),
    [filterCountryCode, filterUserType, filterGender],
  );

  const hasAnyFiltersActive = useMemo(() => Boolean(filterName.trim()) || hasAdvancedFiltersActive, [filterName, hasAdvancedFiltersActive]);

  // Memoize filtered users to avoid filtering on every render
  const filteredUsers = useMemo(() => {
    const selectedCc = filterCountryCode.trim().toUpperCase();

    return userList.filter(user => {
      // filter by name
      let fullName = user.firstName?.toLowerCase() || '';
      if (user.lastName) fullName += ` ${user.lastName.toLowerCase()}`; // append last name if exists
      const nameOk = fullName.includes(filterName.toLowerCase());

      // filter by gender
      const genderOk = !isNaturalPerson(user.type) || filterGender.includes(user.gender as Gender);

      // filter by type
      const typeOk = filterUserType.includes(user.type);

      // filter by country (associations & brands always pass — they typically have no country code)
      const countryOk =
        !selectedCc ||
        user.type === UserType.ASSOCIATION ||
        user.type === UserType.BRAND ||
        (user.countryCode || '').trim().toUpperCase() === selectedCc;

      return nameOk && genderOk && typeOk && countryOk;
    });
  }, [userList, filterName, filterGender, filterUserType, filterCountryCode]);

  const addToSelectedUsers = (user: User) => {
    const users = Array.from(selectedUsers);
    users.push(user);
    setSelectedUsers(users);
  };

  const removeFromSelectedUsers = (user: User) => {
    let users = Array.from(selectedUsers);
    users = users.filter(usr => usr.username !== user.username);

    setSelectedUsers(users);
  };

  const clearAllFilters = () => {
    setFilterName('');
    setFilterCountryCode('');
    setFilterGender([...DEFAULT_MAP_GENDERS]);
    setFilterUserType([...DEFAULT_MAP_USER_TYPES]);
  };

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMapOptions({ center: new google.maps.LatLng(lat, lng), streetViewControl: streetViewEnabled, zoom: zoom });
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded || !iconFreestylerMale || !iconFreestylerFemale) return <LoadingSpinner />;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      {!isIframe && (
        <div className="flex shrink-0 flex-col gap-1.5 px-3 sm:px-4">
          <div className="mx-auto w-full min-w-0 max-w-lg">
            <Input
              placeholder={t('inputSearchPlaceholder')}
              value={filterName}
              onChange={(event: any) => {
                setFilterName(event.target.value);
              }}
              className="w-full min-w-0"
            />
          </div>

          <div className="w-full min-w-0 max-w-lg sm:mx-auto">
            <button
              type="button"
              onClick={() => setAdvancedOpen(v => !v)}
              className="flex w-full min-w-0 items-center justify-center gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-expanded={advancedOpen}
            >
              {hasAdvancedFiltersActive ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden /> : null}
              <span className="font-medium text-foreground/90">{t('searchAdvancedLabel')}</span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', advancedOpen && 'rotate-180')} aria-hidden />
            </button>

            {advancedOpen && (
              <div className="space-y-3 pt-0.5 pb-1">
                {userCountryOptions.length > 0 && (
                  <div>
                    <div className="mb-1 text-2xs text-muted-foreground sm:text-xs">{t('filterUserCountry')}</div>
                    <Select value={filterCountryCode || MAP_FILTER_ALL} onValueChange={v => setFilterCountryCode(v === MAP_FILTER_ALL ? '' : v)}>
                      <SelectTrigger className={mapCountrySelectTriggerClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MAP_FILTER_ALL}>{t('filterAll')}</SelectItem>
                        {userCountryOptions.map(({ code, name }) => (
                          <SelectItem key={code} value={code}>
                            {name} ({code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full min-w-0 justify-between">
                      {t('drpDwnGender')}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
                    {menuGender.map(menuItem => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={menuItem.value}
                          checked={filterGender.includes(menuItem.value as Gender)}
                          onCheckedChange={(value: any) => {
                            const genders = Array.from(filterGender);

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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full min-w-0 justify-between">
                      {t('drpDwnUserTypes')}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
                    {menuUserType
                      .filter(type => type.value !== UserType.FAN)
                      .map(menuItem => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={menuItem.value}
                            checked={filterUserType.includes(menuItem.value as UserType)}
                            onCheckedChange={(value: any) => {
                              const types = Array.from(filterUserType);

                              // add or remove user type from array
                              if (value === true) {
                                types.push(menuItem.value as UserType);
                              } else {
                                const index = types.indexOf(menuItem.value as UserType);
                                if (index > -1) {
                                  types.splice(index, 1);
                                }
                              }

                              setFilterUserType(types);
                            }}
                          >
                            {menuItem.text}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex w-full min-w-0 flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="action"
                    className={cn(ctaActionButtonClassName, '!min-w-0 px-3 text-sm')}
                    onClick={clearAllFilters}
                    disabled={!hasAnyFiltersActive}
                  >
                    {t('filterClearAll')}
                  </Button>
                  <Button type="button" variant="action" className={cn(ctaActionButtonClassName, '!min-w-0 px-3 text-sm sm:self-end')} onClick={() => setAdvancedOpen(false)}>
                    {t('filterApply')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">
        <GoogleMap mapContainerStyle={containerStyle} options={mapOptions} onLoad={onLoad} onUnmount={onUnmount}>
          {filteredUsers.map(user => {
            let icon = user.gender === Gender.MALE ? iconFreestylerMale : iconFreestylerFemale;

            switch (user.type) {
              case UserType.ASSOCIATION:
                if (iconAssociation) icon = iconAssociation;
                break;
              case UserType.BRAND:
                if (iconBrand) icon = iconBrand;
                break;
              case UserType.DJ:
                if (iconDJ) icon = iconDJ;
                break;
              case UserType.EVENT_ORGANIZER:
                if (iconEventOrganizer) icon = iconEventOrganizer;
                break;
              case UserType.MC:
                if (iconMC) icon = iconMC;
                break;
              case UserType.MEDIA:
                if (iconMedia) icon = iconMedia;
                break;
            }

            return (
              <MarkerF
                key={`marker-${user.username}`}
                clickable={true}
                title={user.username}
                icon={icon}
                position={new google.maps.LatLng(user.locLatitude || 0, user.locLongitude)}
                onClick={() => addToSelectedUsers(user)}
              >
                {selectedUsers.filter(u => u.username === user.username).includes(user) && (
                  <InfoWindow
                    key={`info-${user.username}`}
                    onCloseClick={() => {
                      removeFromSelectedUsers(user);
                    }}
                  >
                    <div className="bg-white shadow-lg rounded-lg">
                      <div className="flex flex-col gap-1">
                        <div className="grid grid-flow-col justify-start items-center gap-1">
                          <img src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} className="h-6 w-6 rounded-full object-cover" />

                          <div className="text-md font-semibold">{user.lastName ? `${user.firstName} ${user.lastName}` : `${user.firstName}`}</div>
                        </div>

                        {user.type === UserType.FREESTYLER && user.countryCode && (
                          <div className="grid grid-flow-col justify-start items-center gap-1">
                            <div className="h-6 w-6">
                              <ReactCountryFlag
                                countryCode={user.countryCode}
                                svg
                                style={{
                                  width: '100%',
                                  height: '100%',
                                }}
                                title={user.countryCode}
                              />
                            </div>

                            <div>{getCountryNameByCode(user.countryCode)}</div>
                          </div>
                        )}

                        {user.type !== UserType.FREESTYLER && (
                          <div className="grid grid-flow-col justify-start items-center gap-1">
                            <img src={getUserTypeImages(user.type, undefined).path} className="h-6 w-6 object-cover" />

                            {user.type && <div>{`${getUserTypeLabels(user.type, t)}`}</div>}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-2">
                        {!isIframe && (
                          <Link href={`${routeUsers}/${user.username}`}>
                            <u>{t('infoWindowGoToProfileInternal')}</u>
                          </Link>
                        )}

                        {isIframe && (
                          <a href={`${window.location.origin}/${routeUsers}/${user.username}`} target="_blank" rel="noopener noreferrer">
                            <u>{t('infoWindowGoToProfileExternal')}</u>
                          </a>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </MarkerF>
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
};

export { MapWrapper as FreestylerMap };
