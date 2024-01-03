import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import router from 'next/router';
import { User } from '@/types/user';
import { imgFreestyler } from '@/types/consts/images';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'maps-api-key',
  version: 'weekly',
  libraries: ['places'],
});

interface IMapsProps {
  address: string;
  zoom?: number;
  users: User[];
}

const MapOfFreestylers = ({ address = 'Europe', zoom = 6, users = [] }: IMapsProps) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    loader.load().then(async () => {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results) {
          const mapOptions = {
            center: results[0].geometry.location,
            zoom: zoom,
          };

          // @ts-ignore
          const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);

          users.forEach(user => {
            if (user.locLatitude && user.locLongitude) {
              // const userImg = 'https://bucket-fsmeet-dev.s3.eu-central-1.amazonaws.com/nils/Safeimagekit-resized-img.png';

              const iconSize = 40;

              const icon = {
                // url: user.imageUrl ? user.imageUrl : imgUserNoImg,
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

              var infowindow = new google.maps.InfoWindow({
                content: `<div style="line-height:1.35;overflow:hidden;white-space:nowrap";>${user.username}</div>`,
              });

              marker.addListener('mouseover', () => {
                infowindow.open(map, marker);
              });

              marker.addListener('mouseout', () => {
                infowindow.close();
              });

              marker.addListener('click', () => {
                router.push(`user/${user.username}`);
              });
            }
          });

          // @ts-ignore
          setMap(newMap);
        }
      });
    });
  }, [address]);
  return <div id="map" className="h-full w-full" ref={mapRef} />;
};

export default MapOfFreestylers;
