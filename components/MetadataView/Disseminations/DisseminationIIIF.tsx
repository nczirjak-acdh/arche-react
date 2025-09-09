// components/OSDFromImagesCdn.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    OpenSeadragon?: any;
  }
}

type ImagesResponse = { images: string[]; index?: number };

export default function DisseminationIIIF({
  endpoint,
  height = 750, // matches your PHP 750px
  className = '',
}: {
  endpoint: string;
  height?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  // Load OSD from CDN once
  useEffect(() => {
    if (window.OpenSeadragon) {
      setReady(true);
      return;
    }
    const s = document.createElement('script');
    s.src =
      'https://unpkg.com/openseadragon@4.1/build/openseadragon/openseadragon.min.js';
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setErr('Failed to load OpenSeadragon (CDN).');
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  // Fetch your { index, images[] }
  useEffect(() => {
    let alive = true;
    setErr(null);
    (async () => {
      try {
        const r = await fetch(endpoint, { cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = (await r.json()) as ImagesResponse;
        const list = (Array.isArray(j.images) ? j.images : []).filter(Boolean);
        if (!alive) return;
        if (list.length === 0) throw new Error('No images in response.');
        setImages(list);
        setIndex(Math.min(Math.max(0, j.index ?? 0), list.length - 1));
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || 'Failed to load images endpoint.');
        setImages([]);
        setIndex(0);
      }
    })();
    return () => {
      alive = false;
    };
  }, [endpoint]);

  // Create OSD and open current page
  useEffect(() => {
    if (!ready || !containerRef.current || images.length === 0) return;

    if (!viewerRef.current) {
      viewerRef.current = window.OpenSeadragon({
        element: containerRef.current,
        tileSources: images[index], // MUST be a IIIF info.json
        prefixUrl:
          'https://unpkg.com/openseadragon@4.1/build/openseadragon/images/',
        sequenceMode: false, // we handle Prev/Next manually
        showNavigator: true,
        navigatorPosition: 'BOTTOM_LEFT',
        showRotationControl: true,
        showSequenceControl: false,
        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: true,
          dblClickToZoom: true,
        },
      });
      viewerRef.current.addHandler('open', () =>
        viewerRef.current.viewport?.goHome(true)
      );
    } else {
      viewerRef.current.open(images[index]);
    }
  }, [ready, images, index]);

  // Cleanup
  useEffect(() => {
    return () => {
      try {
        viewerRef.current?.destroy?.();
      } catch {}
      viewerRef.current = null;
    };
  }, []);

  // Controls
  const canPrev = index > 0;
  const canNext = index < images.length - 1;
  const prev = () => canPrev && setIndex((i) => i - 1);
  const next = () => canNext && setIndex((i) => i + 1);
  const zoomIn = () =>
    viewerRef.current?.viewport?.zoomBy(1.25) &&
    viewerRef.current?.viewport?.applyConstraints();
  const zoomOut = () =>
    viewerRef.current?.viewport?.zoomBy(0.8) &&
    viewerRef.current?.viewport?.applyConstraints();
  const home = () => viewerRef.current?.viewport?.goHome(true);
  const full = () => viewerRef.current?.setFullScreen?.(true);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        id="iiif_viewer"
        ref={containerRef}
        className="w-full overflow-hidden rounded-md bg-slate-100"
        style={{ height }}
      />
      {/* Controls bar */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          disabled={!canPrev}
          className="rounded-md border bg-[#0a6ebd] px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span id="currentPage-iiif" className="text-sm text-gray-700">
          {images.length ? `${index + 1} / ${images.length}` : '—'}
        </span>
        <button
          onClick={next}
          disabled={!canNext}
          className="rounded-md border bg-[#0a6ebd] px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>

        <div className="ml-4 inline-flex gap-2">
          <button
            onClick={zoomOut}
            className="rounded-md border bg-white px-3 py-1 text-sm shadow"
          >
            −
          </button>
          <button
            onClick={home}
            className="rounded-md border bg-white px-3 py-1 text-sm shadow"
          >
            Reset
          </button>
          <button
            onClick={zoomIn}
            className="rounded-md border bg-white px-3 py-1 text-sm shadow"
          >
            +
          </button>
          <button
            onClick={full}
            className="rounded-md border bg-white px-3 py-1 text-sm shadow"
          >
            ⛶ Full
          </button>
        </div>
      </div>

      {err && (
        <div className="mt-2 mx-auto w-fit rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 shadow">
          {err}
        </div>
      )}
    </div>
  );
}
