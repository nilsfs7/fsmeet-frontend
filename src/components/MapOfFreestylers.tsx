import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { User } from '@/types/user';
import { imgAssociation, imgBrand, imgDJ, imgFreestyler, imgMC, imgMedia } from '@/types/consts/images';
import { routeUsers } from '@/types/consts/routes';
import { Gender } from '@/types/enums/gender';
import { UserType } from '@/types/enums/user-type';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'maps-api-key',
  version: 'weekly',
  libraries: ['places'],
});

interface IMapsProps {
  users: User[];
  selectedUsers?: string[];
  lat?: number;
  lng?: number;
  zoom?: number;
  filterName?: string;
  filterGender?: Gender;
}

// Europe = lat: 54.5259614, lng: 15.2551187
const MapOfFreestylers = ({ users = [], selectedUsers = [], lat = 54.5259614, lng = 15.2551187, zoom = 6, filterName, filterGender }: IMapsProps) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markersWithInfo, setMarkersWithInfo] = useState<{ marker: google.maps.Marker; info: google.maps.InfoWindow }[]>([]);

  useEffect(() => {
    markersWithInfo.forEach((markerWithInfo) => {
      const markerTitle = markerWithInfo.marker.getTitle();
      if (markerTitle) {
        const user = users.filter((user) => {
          return user.username === markerTitle;
        })[0];

        // @ts-ignore
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

        let nameOk: boolean = true;
        if (filterName && !fullName.includes(filterName.toLowerCase())) {
          nameOk = false;
        }

        let genderOk: boolean = true;
        if (filterGender && filterGender?.toString() !== '--' && user.gender !== filterGender) {
          genderOk = false;
        }

        if (nameOk && genderOk) {
          markerWithInfo.marker.setVisible(true);
        } else {
          markerWithInfo.marker.setVisible(false);
          markerWithInfo.info.close();
        }
      }
    });
  }, [filterName, filterGender]);

  useEffect(() => {
    loader.load().then(async () => {
      const mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoom,
      };

      // @ts-ignore
      const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      const markersWithInfo: { marker: google.maps.Marker; info: google.maps.InfoWindow }[] = [];
      users.forEach((user) => {
        if (user.locLatitude && user.locLongitude) {
          let userImg = '';
          let iconSize = 30;
          let tagType: string = '</>';

          switch (user.type) {
            case UserType.ASSOCIATION:
              userImg = imgAssociation;
              tagType = '<p>Association</p>';
              iconSize = 40;
              break;
            case UserType.BRAND:
              userImg = imgBrand;
              tagType = '<p>Brand</p>';
              break;
            case UserType.DJ:
              userImg = imgDJ;
              tagType = '<p>DJ</p>';
              break;
            case UserType.FREESTYLER:
              userImg = imgFreestyler;
              iconSize = 40;
              break;
            case UserType.MC:
              userImg = imgMC;
              tagType = '<p>MC</p>';
              break;
            case UserType.MEDIA:
              userImg = imgMedia;
              tagType = '<p>Media</p>';
              break;
          }

          const icon = {
            url: userImg,
            size: new google.maps.Size(iconSize, iconSize),
            scaledSize: new google.maps.Size(iconSize, iconSize),
          };

          const marker = new google.maps.Marker({
            clickable: true,
            title: user.username,
            position: new google.maps.LatLng(user.locLatitude, user.locLongitude),
            map: newMap,
            icon,
          });

          const content = `
              <div style="line-height:1.35;overflow:hidden;white-space:nowrap;";>
                <div>${user.firstName ? `${user.firstName} ${user.lastName} (${user.username})` : `${user.username}`}</div>
                ${tagType}
                <div>  
                  <a href=${routeUsers}/${user.username}>
                    <u>Click for profile</u>
                  </a>
                </div>
              </div>`;

          var infoWindow = new google.maps.InfoWindow({
            content: content,
          });

          markersWithInfo.push({ marker: marker, info: infoWindow });

          marker.addListener('mouseover', () => {
            // infowindow.open(map, marker);
          });

          marker.addListener('mouseout', () => {
            // infowindow.close();
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          if (selectedUsers.includes(user.username)) {
            infoWindow.open(map, marker);
          }
        }
      });

      setMarkersWithInfo(markersWithInfo);

      // @ts-ignore
      setMap(newMap);
    });
  }, []);
  return <div id="map" className="h-full w-full" ref={mapRef} />;
};

export default MapOfFreestylers;
