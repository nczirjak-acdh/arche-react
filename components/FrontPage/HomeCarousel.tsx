// components/HomeCarousel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type ApiItem = {
  identifier?: string;
  title?: string;
  description?: string;
  modifyDate?: string;
  avDate?: string;
};
type ApiResponse = Record<string, ApiItem>;

type Slide = {
  id: string;
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
  const hoverRef = useRef(false);

  const autoPlay = true;
  const intervalMs = 5000;
  const pauseOnHover = true;
  const loop = true;
  const perView = 4; // ← always 4 visible

  // fetch
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const r = await fetch(endpoint, { cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: ApiResponse = await r.json();

        const entries = Object.entries(data);
        const ts = (s?: string) => (s ? Date.parse(s) || 0 : 0);
        entries.sort(([, a], [, b]) => {
          const ta = ts(a.modifyDate) || ts(a.avDate);
          const tb = ts(b.modifyDate) || ts(b.avDate);
          return tb - ta;
        });

        const thumbBase = process.env.NEXT_PUBLIC_THUMBNAILS_URL!;
        const baseApi = process.env.NEXT_PUBLIC_BASE_API!;

        const mapped: Slide[] = entries.map(([id, item]) => ({
          id,
          title: item.title || 'Untitled',
          href: `/browser/metadata/${id}`,
          image: `${thumbBase}${baseApi}/${id}&width=600`, // image URL (your service)
          description: item.description?.replace(/\s+/g, ' ').trim(),
        }));

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

  // helpers
  const currentStartIndex = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return 0;

    // find nearest child to current scrollLeft, then snap to page start (multiple of perView)
    const left = el.scrollLeft;
    let idx = 0;
    let minDelta = Infinity;
    for (let i = 0; i < children.length; i++) {
      const d = Math.abs(children[i].offsetLeft - left);
      if (d < minDelta) {
        minDelta = d;
        idx = i;
      }
    }
    return Math.floor(idx / perView) * perView;
  };

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;
    const target = children[Math.max(0, Math.min(index, children.length - 1))];
    el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  };

  const nextPage = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const total = slides.length;
    if (total === 0) return;

    const start = currentStartIndex();
    const nextStart = start + perView;
    if (nextStart >= total) {
      if (loop) scrollToIndex(0);
      else scrollToIndex(start); // stay
    } else {
      scrollToIndex(nextStart);
    }
  };

  const prevPage = () => {
    const start = currentStartIndex();
    const prevStart = start - perView;
    if (prevStart < 0) {
      if (loop) {
        // go to last full page (or the last chunk)
        const remainder = slides.length % perView;
        const lastStart =
          remainder === 0 ? slides.length - perView : slides.length - remainder;
        scrollToIndex(Math.max(0, lastStart));
      } else {
        scrollToIndex(start);
      }
    } else {
      scrollToIndex(prevStart);
    }
  };

  // autoplay by page
  useEffect(() => {
    if (!autoPlay || slides.length <= perView) return;
    const id = window.setInterval(
      () => {
        if (!pauseOnHover || !hoverRef.current) nextPage();
      },
      Math.max(1500, intervalMs)
    );
    return () => window.clearInterval(id);
  }, [autoPlay, intervalMs, pauseOnHover, slides.length]);

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
    <div
      className="relative"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <button
        aria-label="Previous"
        onClick={prevPage}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/10 hover:bg-white"
      >
        ‹
      </button>

      {/*
        Important:
        - gap-x-4 = 1rem gaps → width per slide = (100% - 3 * 1rem) / 4
        - basis-[calc((100%-3rem)/4)] ensures exactly 4 slides fit, no partials
      */}
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-x-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
      >
        {slides.map((s) => (
          <a
            key={s.id}
            href={s.href}
            className="flex-none snap-start basis-[calc((100%-3rem)/4)] rounded-xl border bg-white shadow-sm transition hover:shadow-md"
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
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                  {s.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      <button
        aria-label="Next"
        onClick={nextPage}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/10 hover:bg-white"
      >
        ›
      </button>
    </div>
  );
}
