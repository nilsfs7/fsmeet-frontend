import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { User } from '@/types/user';
import { routeUsers } from '@/domain/constants/routes';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserType } from '@/domain/enums/user-type';
import { imgFreestyler, imgUserDefaultImg } from '@/domain/constants/images';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';

interface IMapsProps {
  users: User[];
  selectedUsernames?: string[];
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

// Europe = lat: 54.5259614, lng: 15.2551187
const MapOfFreestylers = ({ users = [], selectedUsernames = [], lat = 54.5259614, lng = 15.2551187, zoom = 6, streetViewEnabled = false, filterName, filterGender, isIframe = false }: IMapsProps) => {
  const t = useTranslations('/map');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'maps-api-key',
  });

  const [map, setMap] = React.useState<google.maps.Map | null>();
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const initSelectedUsers = (users: User[], selectedUsernames: string[]) => {
    const usrs = users.filter(usr => {
      if (selectedUsernames.includes(usr.username)) {
        return usr;
      }
    });

    setSelectedUsers(usrs);
  };

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

  useEffect(() => {
    initSelectedUsers(users, selectedUsernames);
  }, [users]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} options={mapOptions} onLoad={onLoad} onUnmount={onUnmount}>
      {users.map(user => {
        if (user.locLatitude && user.locLongitude && user.exposeLocation && user.type !== UserType.TECHNICAL) {
          let imgPath = user.type ? getUserTypeImages(user.type).path : imgFreestyler;
          let imgSize = user.type ? getUserTypeImages(user.type).size : 40;

          const icon = {
            url: imgPath,
            size: new google.maps.Size(imgSize, imgSize),
            scaledSize: new google.maps.Size(imgSize, imgSize),
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
      })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapOfFreestylers;
