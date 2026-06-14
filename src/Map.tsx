import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { Offer } from './types/offer';
import 'leaflet/dist/leaflet.css';
import { City } from './types/city';

interface MapProps {
  city: City;
  offers: Offer[];
  activeOfferId?: string | null;
  containerClassName?: string;
}

const URL_TEMPLATE =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const defaultIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const activeIcon = L.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

export default function Map({
  offers,
  city,
  containerClassName = 'cities__map map',
  activeOfferId,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current !== null && leafletRef.current === null) {
      leafletRef.current = L.map(mapRef.current, {
        center: {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        zoom: city.location.zoom,
      });

      L.tileLayer(URL_TEMPLATE, { attribution: ATTRIBUTION }).addTo(
        leafletRef.current,
      );
    }

    return () => {
      leafletRef.current?.remove();
      leafletRef.current = null;
    };
  }, [city]);

  useEffect(() => {
    if (leafletRef.current !== null) {
      const markers: L.Marker[] = [];

      offers.forEach((offer) => {
        const icon = offer.id === activeOfferId ? activeIcon : defaultIcon;
        markers.push(
          L.marker(
            {
              lat: offer.city.location.latitude,
              lng: offer.city.location.longitude,
            },
            { icon },
          ).addTo(leafletRef.current!),
        );
      });

      return () => {
        markers.forEach((marker) => marker.remove());
      };
    }
  }, [offers, activeOfferId]);

  return <div ref={mapRef} className={containerClassName} />;
}
