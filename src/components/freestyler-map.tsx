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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { menuGender } from '@/domain/constants/menus/menu-gender';
import { ChevronDown } from 'lucide-react';
import { Gender } from '@/domain/enums/gender';
import LoadingSpinner from './animation/loading-spinner';

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
  const [filterGender, setFilterGender] = useState<Gender[]>([Gender.FEMALE, Gender.MALE]);
  const [map, setMap] = React.useState<google.maps.Map | null>();
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
    region,
    language,
  });

  // prepare icons
  const iconAssociation = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.ASSOCIATION);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconBrand = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.BRAND);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconDJ = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.DJ);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconEventOrganizer = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.EVENT_ORGANIZER);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconFreestylerMale = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.FREESTYLER, Gender.MALE);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconFreestylerFemale = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.FREESTYLER, Gender.FEMALE);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconMC = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.MC);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const iconMedia = useMemo(() => {
    if (!isLoaded) return null;

    const img = getUserTypeImages(UserType.MEDIA);
    return {
      url: img.path,
      size: new window.google.maps.Size(img.size, img.size),
      scaledSize: new window.google.maps.Size(img.size, img.size),
    };
  }, [isLoaded]);

  const addToSelectedUsers = (user: User) => {
    const users = Array.from(selectedUsers);
    users.push(user);
    setSelectedUsers(users);
  };

  const removeFromSelectedUsers = (user: User) => {
    let users = Array.from(selectedUsers);
    users = users.filter(usr => {
      if (usr.username !== user.username) {
        return usr;
      }
    });

    setSelectedUsers(users);
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
    <div className="flex flex-col h-full gap-2">
      {!isIframe && (
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
        <GoogleMap mapContainerStyle={containerStyle} options={mapOptions} onLoad={onLoad} onUnmount={onUnmount}>
          {userList.map(user => {
            // filter by name name
            let nameOk: boolean = true;
            const fullName = `${user.firstName?.toLowerCase()} ${user.lastName?.toLowerCase()}`;
            if (filterName && !fullName.includes(filterName.toLowerCase())) {
              nameOk = false;
            }

            // filter by gender
            let genderOk: boolean = true;
            if (user.gender && filterGender && !filterGender.includes(user.gender as Gender)) {
              genderOk = false;
            }

            if (nameOk && genderOk) {
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

                          {user.type === UserType.FREESTYLER && user.country && (
                            <div className="grid grid-flow-col justify-start items-center gap-1">
                              <div className="h-6 w-6">
                                <ReactCountryFlag
                                  countryCode={user.country}
                                  svg
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                  }}
                                  title={user.country}
                                />
                              </div>

                              <div>{getCountryNameByCode(user.country)}</div>
                            </div>
                          )}

                          {user.type !== UserType.FREESTYLER && (
                            <div className="grid grid-flow-col justify-start items-center gap-1">
                              <img src={iconFreestylerMale.url} className="h-6 w-6 object-cover" />

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
            }
          })}
        </GoogleMap>
      </div>
    </div>
  );
};

export { MapWrapper as FreestylerMap };
