// components/Carousel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type ApiItem = {
  identifier?: string; // may be an external URL
  title?: string;
  description?: string;
  modifyDate?: string;
  avDate?: string;
};

type ApiResponse = Record<string, ApiItem>;

type Slide = {
  id: string | number;
  title: string;
  href: string;
  image: string;
  description?: string;
};

export default function HomeCarousel({ endpoint }: { endpoint: string }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const r = await fetch(endpoint, { cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);

        const data: ApiResponse = await r.json();

        // Convert object -> array with sorting by modifyDate/avDate (desc)
        const entries = Object.entries(data);

        const ts = (s?: string) => (s ? Date.parse(s) || 0 : 0);
        entries.sort(([, a], [, b]) => {
          const ta = ts(a.modifyDate) || ts(a.avDate);
          const tb = ts(b.modifyDate) || ts(b.avDate);
          return tb - ta; // newest first
        });

        const mapped: Slide[] = entries.map(([id, item]) => {
          const title = item.title || 'Untitled';
          const description = item.description
            ? item.description.replace(/\s+/g, ' ').trim()
            : '';

          // Link: prefer full URL in `identifier`, else fall back to /browser/metadata/{id}
          const defaultHref =
            item.identifier && /^https?:\/\//i.test(item.identifier)
              ? item.identifier
              : `/browser/metadata/${id}`;

          const href = `browser/metadata/${id}`;

          // Image: let caller supply a resolver; otherwise placeholder
          const thumbBase = process.env.NEXT_PUBLIC_THUMBNAILS_URL!;
          const baseApi = process.env.NEXT_PUBLIC_BASE_API!;
          const image = `${thumbBase}${baseApi}/${id}&width=350`;
          console.log(image);
          // https://arche-thumbnails.acdh.oeaw.ac.at?id=https://arche-dev.acdh-dev.oeaw.ac.at/api/258020&width=350
          return { id, title, href, image, description };
        });
        if (!abort) setSlides(mapped);
      } catch (e: any) {
        if (!abort) setErr(e?.message ?? 'Failed to load');
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [endpoint]);

  const by = () => scrollerRef.current?.clientWidth ?? 0;
  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * by() * 0.9, behavior: 'smooth' });
  };

  if (loading)
    return (
      <div className="py-8 text-center text-sm text-neutral-500">Loading…</div>
    );
  if (err)
    return (
      <div className="py-8 text-center text-sm text-red-600">Error: {err}</div>
    );
  if (!slides.length) return null;

  return (
    <div className="relative">
      <button
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/10 hover:bg-white"
      >
        ‹
      </button>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {slides.map((s) => (
          <a
            key={s.id}
            href={s.href}
            className="snap-start shrink-0 w-72 rounded-xl border bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-t-xl">
              <img
                src={s.image}
                alt={s.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold">{s.title}</h3>
              {s.description && (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {s.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      <button
        aria-label="Next"
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/10 hover:bg-white"
      >
        ›
      </button>
    </div>
  );
}
