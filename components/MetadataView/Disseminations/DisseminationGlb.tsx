// components/ModelViewerWithControls.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  src: string; // GLB/GLTF URL
  poster?: string; // optional poster image
  alt?: string;
  ar?: boolean; // enable AR button
  autoRotate?: boolean;
  cameraControls?: boolean;
  environmentImage?: string; // HDRI / envmap url
  exposure?: number;
  className?: string;
};

const ensureModelViewerScript = () => {
  // Add the module script once (CDN). If you installed the npm package,
  // you can replace this with: import('@google/model-viewer');
  const id = 'model-viewer-module';
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.type = 'module';
  s.id = id;
  s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
  document.head.appendChild(s);
};

export default function DisseminationGlb({
  src,
  poster,
  alt = '3D model',
  ar = false,
  autoRotate = false,
  cameraControls = true,
  environmentImage,
  exposure = 1,
  className = '',
}: Props) {
  const mvRef = useRef<any>(null);
  const [initialOrbit, setInitialOrbit] = useState<string | null>(null);
  const [initialFov, setInitialFov] = useState<string | null>(null);

  useEffect(() => {
    ensureModelViewerScript();
  }, []);

  // After the model loads, snapshot starting camera so we can reset later
  useEffect(() => {
    const el = mvRef.current as HTMLElement | null;
    if (!el) return;

    const onLoad = () => {
      const mv = mvRef.current as any;
      // Prefer properties if available; fall back to attributes
      const orbit =
        (mv?.cameraOrbit as string) ||
        el.getAttribute('camera-orbit') ||
        'auto auto auto';
      const fov =
        (mv?.fieldOfView as string) ||
        el.getAttribute('field-of-view') ||
        '45deg';
      setInitialOrbit(orbit);
      setInitialFov(fov);
    };

    el.addEventListener('load', onLoad);
    return () => el.removeEventListener('load', onLoad);
  }, [src]);

  // Helpers
  const clamp = (n: number, min: number, max: number) =>
    Math.min(Math.max(n, min), max);
  const getFovDeg = () => {
    const mv = mvRef.current as any;
    const v: string =
      (mv?.fieldOfView as string) ||
      mv?.getAttribute('field-of-view') ||
      '45deg';
    return parseFloat(String(v).replace('deg', '')) || 45;
  };

  const setFovDeg = (deg: number) => {
    const mv = mvRef.current as any;
    const val = `${deg}deg`;
    if (mv) {
      mv.fieldOfView = val; // property works in modern versions
      mv.setAttribute?.('field-of-view', val); // attribute as fallback
      mv.jumpCameraToGoal?.(); // apply instantly (optional)
    }
  };

  const zoomIn = () => {
    // Smaller FOV = zoom in
    const current = getFovDeg();
    setFovDeg(clamp(current * 0.85, 15, 100)); // tweak bounds to taste
  };

  const zoomOut = () => {
    const current = getFovDeg();
    setFovDeg(clamp(current / 0.85, 15, 100));
  };

  const resetView = () => {
    const mv = mvRef.current as any;
    if (!mv) return;
    if (initialOrbit) {
      mv.cameraOrbit = initialOrbit;
      mv.setAttribute('camera-orbit', initialOrbit);
    }
    if (initialFov) {
      mv.fieldOfView = initialFov;
      mv.setAttribute('field-of-view', initialFov);
    }
    mv.jumpCameraToGoal?.();
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* @ts-ignore - model-viewer is a custom element */}
      <model-viewer
        ref={mvRef}
        src={src}
        poster={poster}
        alt={alt}
        ar={ar || undefined}
        autoplay={autoRotate || undefined}
        auto-rotate={autoRotate || undefined}
        camera-controls={cameraControls || undefined}
        touch-action="pan-y"
        environment-image={environmentImage}
        exposure={exposure}
        style={{ width: '100%', height: '500px', background: '#f8fafc' }} // adjust height
        // You can also constrain camera if desired:
        // min-field-of-view="15deg"
        // max-field-of-view="100deg"
      />

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          onClick={zoomOut}
          className="rounded-md border bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="rounded-md border bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
          aria-label="Reset view"
          title="Reset view"
        >
          Reset
        </button>
        <button
          onClick={zoomIn}
          className="rounded-md border bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
