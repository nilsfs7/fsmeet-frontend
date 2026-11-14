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
import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react';
import { MapFilters } from './freestyler-map-filters';
import { Gender } from '@/domain/enums/gender';
import LoadingSpinner from './animation/loading-spinner';
import { isNaturalPerson } from '../functions/is-natural-person';
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

const DEFAULT_MAP_USER_TYPES: UserType[] = [UserType.FREESTYLER, UserType.ASSOCIATION, UserType.BRAND, UserType.DJ, UserType.EVENT_ORGANIZER, UserType.MC, UserType.MEDIA];


const DEFAULT_MAP_GENDERS: Gender[] = [Gender.FEMALE, Gender.MALE];


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
    const seen = new globalThis.Map<string, number>();
    for (const u of userList) {
      const c = (u.countryCode || '').trim().toUpperCase();
      if (c) seen.set(c, (seen.get(c) ?? 0) + 1);
    }
    return [...seen.entries()]
      .map(([code, count]) => {
        const name = getCountryNameByCode(code) || code;
        return { code, name, count };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [userList]);

  // a country can only be picked from the options, so it is always one of them; no reset effect needed

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<UserType, number>> = {};
    for (const u of userList) counts[u.type] = (counts[u.type] ?? 0) + 1;
    return counts;
  }, [userList]);

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

  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', !isIframe && 'overflow-hidden rounded-3xl border border-border bg-muted shadow-sm')}>
      {!isIframe && (
        <MapFilters
          filters={{ name: filterName, countryCode: filterCountryCode, genders: filterGender, userTypes: filterUserType }}
          onChange={next => {
            setFilterName(next.name);
            setFilterCountryCode(next.countryCode);
            setFilterGender(next.genders);
            setFilterUserType(next.userTypes);
          }}
          onReset={clearAllFilters}
          defaultUserTypes={DEFAULT_MAP_USER_TYPES}
          defaultGenders={DEFAULT_MAP_GENDERS}
          countryOptions={userCountryOptions}
          typeCounts={typeCounts}
          resultCount={filteredUsers.length}
          totalCount={userList.length}
        />
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
