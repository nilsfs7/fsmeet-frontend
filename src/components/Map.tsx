import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';

interface IMapProps {
  address: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const Map = ({ address }: IMapProps) => {
  const t = useTranslations('/map');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'maps-api-key',
  });

  const [map, setMap] = React.useState<google.maps.Map | null>();
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results) {
        const mapOptions: google.maps.MapOptions = {
          center: results[0].geometry.location,
          zoom: 16,
        };

        setMapOptions(mapOptions);
        setMap(map);
      }
    });
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} options={mapOptions} onLoad={onLoad} onUnmount={onUnmount}>
      {mapOptions?.center && <Marker key={`marker-location`} position={mapOptions.center} />}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
