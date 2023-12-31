import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import router from 'next/router';
import { User } from '@/types/user';

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
              // const svgMarker = {
              //   path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
              //   fillColor: 'blue',
              //   fillOpacity: 0.6,
              //   strokeWeight: 0,
              //   rotation: 0,
              //   scale: 2,
              //   anchor: new google.maps.Point(0, 20),
              // };

              // const shape = {
              //   coords: [1, 1, 1, 20, 18, 20, 18, 1],
              //   type: 'poly',
              // };

              // const userImg = 'https://bucket-fsmeet-dev.s3.eu-central-1.amazonaws.com/nils/Safeimagekit-resized-img.png';
              // const flag = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
              // const image = {
              //   url: userImg,
              //   // This marker is 20 pixels wide by 32 pixels high.
              //   size: new google.maps.Size(32, 32),
              //   // The origin for this image is (0, 0).
              //   origin: new google.maps.Point(0, 0),
              //   // The anchor for this image is the base of the flagpole at (0, 32).
              //   anchor: new google.maps.Point(0, 32),
              // };

              const marker = new window.google.maps.Marker({
                clickable: true,
                title: user.username,
                label: user.username,
                position: new google.maps.LatLng(user.locLatitude, user.locLongitude),
                map: newMap,
                // shape: shape,
                // icon: image,
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
  return <div id="map" className="h-full w-full rounded-lg" ref={mapRef} />;
};

export default MapOfFreestylers;
