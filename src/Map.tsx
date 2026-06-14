import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { Offer } from './mocks/offers';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  offers: Offer[];
  cityName?: string;
  containerClassName?: string;
  height?: number | string;
  activeOfferId?: string | null;
}

export default function Map({
  offers,
  cityName = 'Amsterdam',
  containerClassName = 'cities__map map',
  height,
  activeOfferId,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const offersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Record<string, L.Marker> | null>(null);
  const activeMarkerRef = useRef<L.Marker | null>(null);
  const defaultIconRef = useRef<L.Icon | null>(null);
  const activeIconRef = useRef<L.Icon | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [52.38333, 4.9],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    const map = leafletMap.current;
    if (!map) {
      return;
    }
    const existing = offersLayerRef.current;
    if (existing) {
      map.removeLayer(existing);
      offersLayerRef.current = null;
    }

    const markers = L.layerGroup();

    if (!defaultIconRef.current) {
      defaultIconRef.current = L.icon({
        iconUrl: '/img/pin.svg',
        iconSize: [27, 39],
        iconAnchor: [13, 39],
      });
    }
    if (!activeIconRef.current) {
      activeIconRef.current = L.icon({
        iconUrl: '/img/pin-active.svg',
        iconSize: [27, 39],
        iconAnchor: [13, 39],
      });
    }

    markersMapRef.current = {};

    offers
      .filter((o) => o.city && o.city.name === cityName)
      .forEach((o) => {
        if (!o.city) {
          return;
        }
        const marker = L.marker(
          [o.city.location.latitude, o.city.location.longitude],
          {
            icon: defaultIconRef.current!,
          },
        );
        marker.addTo(markers);
        markersMapRef.current![+o.id] = marker;
      });

    markers.addTo(map);
    offersLayerRef.current = markers;

    const latlngs: [number, number][] = [];
    offers.forEach((p) => {
      if (p.city && p.city.name === cityName) {
        latlngs.push([p.city.location.latitude, p.city.location.longitude]);
      }
    });

    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {};
  }, [offers, cityName]);

  useEffect(() => {
    if (!leafletMap.current) {
      return;
    }
    const markersMap = markersMapRef.current;
    if (!markersMap) {
      return;
    }

    const defaultIcon = defaultIconRef.current!;
    const activeIcon = activeIconRef.current!;

    if (activeMarkerRef.current) {
      activeMarkerRef.current.setIcon(defaultIcon);
      activeMarkerRef.current = null;
    }

    if (activeOfferId != null) {
      const m = markersMap[activeOfferId];
      if (m) {
        m.setIcon(activeIcon);
        activeMarkerRef.current = m;
      }
    }
  }, [activeOfferId]);

  const styleHeight =
    typeof height === 'number' ? `${height}px` : (height ?? '100%');

  return (
    <div
      ref={mapRef}
      className={containerClassName}
      style={{ height: styleHeight }}
    />
  );
}
