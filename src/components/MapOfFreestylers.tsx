import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { User } from '@/types/user';
import { imgFreestyler } from '@/types/consts/images';
import { routeUsers } from '@/types/consts/routes';

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
}

// Europe = lat: 54.5259614, lng: 15.2551187
const MapOfFreestylers = ({ users = [], selectedUsers = [], lat = 54.5259614, lng = 15.2551187, zoom = 6 }: IMapsProps) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    loader.load().then(async () => {
      const mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoom,
      };

      // @ts-ignore
      const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      users.forEach((user) => {
        if (user.locLatitude && user.locLongitude) {
          // const userImg = 'https://bucket-fsmeet-dev.s3.eu-central-1.amazonaws.com/nils/Safeimagekit-resized-img.png';

          const iconSize = 40;

          const icon = {
            url: imgFreestyler,
            size: new google.maps.Size(iconSize, iconSize),
            // origin: new google.maps.Point(0, 0),
            // anchor: new google.maps.Point(0, 32),
            scaledSize: new google.maps.Size(iconSize, iconSize),
          };

          const marker = new window.google.maps.Marker({
            clickable: true,
            title: user.username,
            position: new google.maps.LatLng(user.locLatitude, user.locLongitude),
            map: newMap,
            icon,
          });

          const content = `
              <div style="line-height:1.35;overflow:hidden;white-space:nowrap;";>
                <div>${user.firstName ? `${user.firstName} ${user.lastName} (${user.username})` : `${user.username}`}</div>
                <div>  
                  <a href=${routeUsers}/${user.username}>
                    <u>Click for profile</u>
                  </a>
                </div>
              </div>`;

          var infowindow = new google.maps.InfoWindow({
            content: content,
          });

          marker.addListener('mouseover', () => {
            // infowindow.open(map, marker);
          });

          marker.addListener('mouseout', () => {
            // infowindow.close();
          });

          marker.addListener('click', () => {
            infowindow.open(map, marker);
          });

          if (selectedUsers.includes(user.username)) {
            infowindow.open(map, marker);
          }
        }
      });

      // @ts-ignore
      setMap(newMap);
    });
  }, []);
  return <div id="map" className="h-full w-full" ref={mapRef} />;
};

export default MapOfFreestylers;
