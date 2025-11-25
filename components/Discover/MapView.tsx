// components/Discover/MapView.tsx
'use client';

import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Rectangle,
  useMapEvents,
} from 'react-leaflet';
import L, { LatLng, LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/browser/images/leaflet/marker-icon-2x.png',
  iconUrl: '/browser/images/leaflet/marker-icon.png',
  shadowUrl: '/browser/images/leaflet/marker-shadow.png',
});

type MapViewProps = {
  geoJson: any;
  currentPolygon?: string | null;
  onPolygonChange?: (polygonWkt: string | null) => void;
};

const VIENNA_CENTER: LatLngExpression = [48.2082, 16.3738]; // Bécs
const VIENNA_ZOOM = 10;

function getDefaultCenter(geoJson: any): [number, number] {
  const coords: [number, number][] = geoJson?.coordinates ?? [];
  if (!coords.length) return [48.2, 16.3];
  const [lon, lat] = coords[0];
  return [lat, lon];
}

export default function MapView({
  geoJson,
  currentPolygon,
  onPolygonChange,
}: MapViewProps) {
  if (!geoJson) return null;

  const coords: [number, number][] = geoJson.coordinates ?? [];

  const defaultCenter = getDefaultCenter(geoJson);

  const [rectBounds, setRectBounds] = useState<LatLngBoundsExpression | null>(
    null
  );
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);

  function DragDrawHandler() {
    const map = useMapEvents({
      mousedown(e) {
        // csak bal egér + csak ha drawing módban vagyunk
        if (!drawing || e.originalEvent.button !== 0) return;

        // ne pan-eljen a map
        map.dragging.disable();
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        setStartPoint(e.latlng);
        setRectBounds([
          [e.latlng.lat, e.latlng.lng],
          [e.latlng.lat, e.latlng.lng],
        ]);
      },
      mousemove(e) {
        if (!drawing || !startPoint) return;

        const end = e.latlng;

        const minLat = Math.min(startPoint.lat, end.lat);
        const maxLat = Math.max(startPoint.lat, end.lat);
        const minLng = Math.min(startPoint.lng, end.lng);
        const maxLng = Math.max(startPoint.lng, end.lng);

        const bounds: LatLngBoundsExpression = [
          [minLat, minLng],
          [maxLat, maxLng],
        ];
        setRectBounds(bounds);
      },
      mouseup(e) {
        if (!drawing || !startPoint) {
          map.dragging.enable();
          return;
        }

        const end = e.latlng;

        const minLat = Math.min(startPoint.lat, end.lat);
        const maxLat = Math.max(startPoint.lat, end.lat);
        const minLng = Math.min(startPoint.lng, end.lng);
        const maxLng = Math.max(startPoint.lng, end.lng);

        const bounds: LatLngBoundsExpression = [
          [minLat, minLng],
          [maxLat, maxLng],
        ];
        setRectBounds(bounds);
        setStartPoint(null);
        setDrawing(false);

        // nagyon fontos: újra engedélyezzük a dragginget
        map.dragging.enable();

        // POLYGON WKT (lon lat sorrend!)
        const polygon = `POLYGON((${minLng} ${minLat},${minLng} ${maxLat},${maxLng} ${maxLat},${maxLng} ${minLat},${minLng} ${minLat}))`;
        onPolygonChange?.(polygon);
      },
      // biztos ami biztos: ha az egér elhagyja a mapet lenyomott gombbal,
      // engedélyezzük vissza a dragginget
      mouseout() {
        if (!drawing) return;
        map.dragging.enable();
      },
    });

    return null;
  }

  const handleClear = () => {
    setRectBounds(null);
    setStartPoint(null);
    setDrawing(false);
    onPolygonChange?.(null);
  };

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <div className="absolute z-[1000] left-20 top-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setDrawing(true);
            setStartPoint(null);
          }}
          className="rounded-md bg-white/90 px-3 py-1 text-sm shadow border"
        >
          {drawing ? 'Drawing… (Move the mouse)' : 'Draw a rectangle'}
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="rounded-md bg-white/90 px-3 py-1 text-sm shadow border"
        >
          Remove rectangle
        </button>
      </div>

      <MapContainer
        center={[48.2082, 16.3738]}
        zoom={10}
        style={{ width: '100%', height: '100%' }}
        // optional: double click disabled during drawing
        doubleClickZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <DragDrawHandler />

        {coords.map((pt: [number, number], i: number) => (
          <Marker key={i} position={[pt[1], pt[0]]} />
        ))}

        {rectBounds && <Rectangle bounds={rectBounds} />}
      </MapContainer>
    </div>
  );
}
