import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import LoadingSpinner from './animation/loading-spinner';

interface IMapWrapperProps {
  address: string;
}

interface IMapProps {
  googleMapsApiKey: string;
  address: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const MapWrapper = ({ address }: IMapWrapperProps) => {
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

  return <Map googleMapsApiKey={apiKey} address={address} />;
};

const Map = ({ googleMapsApiKey, address }: IMapProps) => {
  const t = useTranslations('/map');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script-location-map',
    googleMapsApiKey,
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

export { MapWrapper as LocationMap };
