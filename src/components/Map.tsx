import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'maps-api-key',
  version: 'weekly',
  libraries: ['places'],
});

interface IMapProps {
  address: string;
}

const Map = ({ address }: IMapProps) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    loader.load().then(() => {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results) {
          const mapOptions = {
            center: results[0].geometry.location,
            zoom: 16,
          };

          // @ts-ignore
          const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);
          const marker = new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: newMap,
          });

          // @ts-ignore
          setMap(newMap);
        }
      });
    });
  }, [address]);
  return <div id="map" className="h-full w-full rounded-lg" ref={mapRef} />;
};

export default Map;
