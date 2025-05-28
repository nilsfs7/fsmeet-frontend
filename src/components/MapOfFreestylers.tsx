'use client';

import React, { useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { User } from '@/types/user';
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

interface IMapsProps {
  userList: User[];
  selectedUsernames?: string[];
  region?: string;
  language?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  streetViewEnabled?: boolean;
  filterName?: string;
  filterGender?: string[];
  isIframe?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const getSelectedUsers = (users: User[], selectedUsernames: string[]): User[] => {
  return users.filter(usr => {
    if (selectedUsernames.includes(usr.username)) {
      return usr;
    }
  });
};

export const MapOfFreestylers = ({
  userList = [],
  selectedUsernames = [],
  region = 'DE',
  language = 'EN',
  lat = 54.5259614, // Central Europe
  lng = 15.2551187, // Central Europe
  zoom = 6,
  streetViewEnabled = false,
  isIframe = false,
}: IMapsProps) => {
  let t = useTranslations('/map');

  const [users] = useState<User[]>(userList);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(getSelectedUsers(users, selectedUsernames));
  const [filterName, setFilterName] = useState('');
  const [filterGender, setFilterGender] = useState<Gender[]>([Gender.FEMALE, Gender.MALE]);
  const [map, setMap] = React.useState<google.maps.Map | null>();
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'maps-api-key',
    region,
    language,
  });

  const addToSelectedUsers = (user: User) => {
    let users = Array.from(selectedUsers);
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

  return isLoaded ? (
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
          {users.map(user => {
            if (user.locLatitude && user.locLongitude && user.exposeLocation && user.type !== UserType.TECHNICAL) {
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
                const img: {
                  path: string;
                  size: number;
                } = getUserTypeImages(user.type, user.gender);

                const icon = {
                  url: img.path,
                  size: new google.maps.Size(img.size, img.size),
                  scaledSize: new google.maps.Size(img.size, img.size),
                };

                return (
                  <Marker
                    key={`marker-${user.username}`}
                    clickable={true}
                    title={user.username}
                    icon={icon}
                    position={new google.maps.LatLng(user.locLatitude, user.locLongitude)}
                    onClick={() => addToSelectedUsers(user)}
                  >
                    {selectedUsers
                      .filter(u => {
                        if (u.username === user.username) return u;
                      })
                      .includes(user) && (
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
                                <img src={getUserTypeImages(user.type).path} className="h-6 w-6 object-cover" />

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
                              <a href={`${window.location.protocol}//${window.location.host}/${routeUsers}/${user.username}`} target="_blank" rel="noopener noreferrer">
                                <u>{t('infoWindowGoToProfileExternal')}</u>
                              </a>
                            )}
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              }
            }
          })}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
};
