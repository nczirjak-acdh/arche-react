'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

type MapViewProps = {
  geoJson: any;
};

export default function MapView({ geoJson }: MapViewProps) {
  if (!geoJson) return null;

  const coords = geoJson.coordinates ?? [];

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <MapContainer
        center={[48.2082, 16.3738]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coords.map((pt: [number, number], i: number) => (
          <Marker key={i} position={[pt[1], pt[0]]}>
            <Popup>Point #{i + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
