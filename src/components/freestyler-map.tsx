'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { User } from '@/domain/types/user';
import { routeUsers } from '@/domain/constants/routes';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserTypeIcon } from '@/components/user/user-type-icon';
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
import { IconAdjustmentsHorizontal, IconArrowRight, IconArrowUpRight, IconSearch } from '@tabler/icons-react';
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

const mapCountrySelectTriggerClass = 'h-9 w-full min-w-0 rounded-xl border-border bg-background text-left';

const DEFAULT_MAP_USER_TYPES: UserType[] = [UserType.FREESTYLER, UserType.ASSOCIATION, UserType.BRAND, UserType.DJ, UserType.EVENT_ORGANIZER, UserType.MC, UserType.MEDIA];

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
    () => Boolean(filterCountryCode.trim()) || !sameUserTypeSelection(filterUserType, DEFAULT_MAP_USER_TYPES) || !sameGenderSelection(filterGender, DEFAULT_MAP_GENDERS),
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
      const countryOk = !selectedCc || user.type === UserType.ASSOCIATION || user.type === UserType.BRAND || (user.countryCode || '').trim().toUpperCase() === selectedCc;

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
    setMapOptions({
      center: new google.maps.LatLng(lat, lng),
      streetViewControl: streetViewEnabled,
      zoom: zoom,
      // the floating search panel sits top-left, so move the map/satellite toggle out of its way
      ...(isIframe ? {} : { mapTypeControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM } }),
    });
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded || !iconFreestylerMale || !iconFreestylerFemale) return <LoadingSpinner />;

  const advancedFilterCount =
    (filterCountryCode.trim() ? 1 : 0) + (sameUserTypeSelection(filterUserType, DEFAULT_MAP_USER_TYPES) ? 0 : 1) + (sameGenderSelection(filterGender, DEFAULT_MAP_GENDERS) ? 0 : 1);

  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', !isIframe && 'overflow-hidden rounded-3xl border border-border bg-muted shadow-sm')}>
      {!isIframe && (
        // floating search + filter panel; leaves room for the fullscreen control on the right (mobile)
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 pr-12 sm:inset-x-auto sm:left-4 sm:top-4 sm:w-[23rem] sm:pr-0">
          <div className="pointer-events-auto max-h-[min(70vh,34rem)] overflow-y-auto rounded-2xl border border-border/70 bg-background/95 p-2 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
                <Input
                  placeholder={t('inputSearchPlaceholder')}
                  aria-label={t('inputSearchPlaceholder')}
                  value={filterName}
                  onChange={(event: any) => {
                    setFilterName(event.target.value);
                  }}
                  className="h-10 w-full min-w-0 rounded-xl pl-9"
                />
              </div>

              <button
                type="button"
                onClick={() => setAdvancedOpen(v => !v)}
                aria-expanded={advancedOpen}
                aria-label={t('searchAdvancedLabel')}
                className={cn(
                  'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors',
                  advancedOpen || hasAdvancedFiltersActive ? 'border-brand/40 bg-brand-soft text-brand-strong' : 'border-border bg-background text-foreground hover:bg-muted',
                )}
              >
                <IconAdjustmentsHorizontal className="h-4 w-4" stroke={1.75} aria-hidden />
                <span className="hidden sm:inline">{t('searchAdvancedLabel')}</span>
                {advancedFilterCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-2xs font-semibold text-brand-foreground">{advancedFilterCount}</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 px-1 pt-2 text-xs text-muted-foreground">
              <span aria-live="polite">{t('resultsCount', { count: filteredUsers.length })}</span>
              {hasAnyFiltersActive && (
                <button type="button" onClick={clearAllFilters} className="font-medium text-brand-strong hover:underline">
                  {t('filterClearAll')}
                </button>
              )}
            </div>

            {advancedOpen && (
              <div className="mt-2 space-y-3 border-t border-border/70 px-1 pb-1 pt-3">
                {userCountryOptions.length > 0 && (
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterUserCountry')}</div>
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

                <div className="grid grid-cols-2 gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-9 w-full min-w-0 justify-between rounded-xl px-3 text-sm font-normal">
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
                      <Button variant="outline" className="h-9 w-full min-w-0 justify-between rounded-xl px-3 text-sm font-normal">
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
                </div>

                <div className="flex w-full min-w-0 items-center justify-between gap-2 pt-1">
                  <Button type="button" variant="outline" className="h-9 min-w-0 rounded-xl px-3 text-sm" onClick={clearAllFilters} disabled={!hasAnyFiltersActive}>
                    {t('filterClearAll')}
                  </Button>
                  <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-9 min-w-0! px-4 text-sm')} onClick={() => setAdvancedOpen(false)}>
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
                    <div className="w-56 max-w-full p-0.5 font-sans text-zinc-900">
                      <div className="flex items-center gap-3">
                        <img src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-zinc-200" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{user.lastName ? `${user.firstName} ${user.lastName}` : `${user.firstName}`}</div>

                          {user.type === UserType.FREESTYLER && user.countryCode && (
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-600">
                              <ReactCountryFlag countryCode={user.countryCode} svg style={{ width: '1rem', height: '0.75rem', borderRadius: '2px' }} title={user.countryCode} />
                              <span className="truncate">{getCountryNameByCode(user.countryCode)}</span>
                            </div>
                          )}

                          {user.type !== UserType.FREESTYLER && (
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-600">
                              <UserTypeIcon userType={user.type} variant="tile" className="h-4 w-4 rounded" />
                              {user.type && <span className="truncate">{`${getUserTypeLabels(user.type, t)}`}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {!isIframe && (
                        <Link
                          href={`${routeUsers}/${user.username}`}
                          className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground! no-underline transition-colors hover:bg-brand-strong"
                        >
                          {t('infoWindowGoToProfileInternal')}
                          <IconArrowRight className="h-3.5 w-3.5" stroke={2} aria-hidden />
                        </Link>
                      )}

                      {isIframe && (
                        <a
                          href={`${window.location.origin}${routeUsers}/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground! no-underline transition-colors hover:bg-brand-strong"
                        >
                          {t('infoWindowGoToProfileExternal')}
                          <IconArrowUpRight className="h-3.5 w-3.5" stroke={2} aria-hidden />
                        </a>
                      )}
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
