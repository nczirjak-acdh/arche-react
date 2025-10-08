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
  const [reduced, setReduced] = useState(false);
  const [page, setPage] = useState(0);

  const autoPlay = true;
  const intervalMs = 5000;
  const pauseOnHover = true;
  const loop = true;
  const perView = 4; // always 4 visible

  // prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener?.('change', update);
    return () => m.removeEventListener?.('change', update);
  }, []);

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
          image: `${thumbBase}${baseApi}/${id}&width=600`,
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

  const totalPages = Math.max(1, Math.ceil(slides.length / perView));

  // helpers
  const currentStartIndex = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return 0;

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

  const goToPage = (p: number) => {
    const clamped = Math.max(0, Math.min(p, totalPages - 1));
    scrollToIndex(clamped * perView);
    setPage(clamped);
  };

  const nextPage = () => {
    if (slides.length === 0) return;
    const start = currentStartIndex();
    const nextStart = start + perView;
    if (nextStart >= slides.length) {
      loop ? goToPage(0) : goToPage(Math.floor(start / perView));
    } else {
      goToPage(Math.floor(nextStart / perView));
    }
  };

  const prevPage = () => {
    const start = currentStartIndex();
    const prevStart = start - perView;
    if (prevStart < 0) {
      if (loop) {
        const remainder = slides.length % perView;
        const lastStart =
          remainder === 0 ? slides.length - perView : slides.length - remainder;
        goToPage(Math.floor(Math.max(0, lastStart) / perView));
      } else {
        goToPage(Math.floor(start / perView));
      }
    } else {
      goToPage(Math.floor(prevStart / perView));
    }
  };

  // Update page indicator on manual scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const start = currentStartIndex();
        setPage(Math.floor(start / perView));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slides.length]);

  // autoplay by page (respects reduced motion and hidden tab)
  useEffect(() => {
    if (!autoPlay || reduced || slides.length <= perView) return;
    const id = window.setInterval(
      () => {
        if ((pauseOnHover && hoverRef.current) || document.hidden) return;
        nextPage();
      },
      Math.max(1500, intervalMs)
    );
    return () => window.clearInterval(id);
  }, [autoPlay, intervalMs, pauseOnHover, reduced, slides.length]);

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
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* Prev */}
      <button
        aria-label="Previous"
        onClick={prevPage}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/10 hover:bg-white z-10"
      >
        ‹
      </button>

      {/* Scroller: EXACT 4 per view, equal heights, no scrollbar */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextPage();
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPage();
          }
        }}
        className="flex items-stretch snap-x snap-mandatory gap-x-5 overflow-x-auto scroll-smooth p-4 no-scrollbar focus:outline-none focus:ring-2 focus:ring-black/10 rounded-xl"
        role="list"
      >
        {slides.map((s) => (
          <article
            role="listitem"
            key={s.id}
            className="flex-none snap-start basis-[calc((100%-3rem)/4)]
                       rounded-xl bg-white shadow-[0_20px_60px_-20px_rgba(2,6,23,0.2)] ring-1 ring-black/5
                       p-4 flex flex-col h-full min-h-[25rem]"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-md">
              <img
                src={s.image}
                alt={s.title}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="mt-4 flex-1">
              <h3 className="text-base font-semibold">{s.title}</h3>
              {s.description && (
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                  {s.description}
                </p>
              )}
            </div>

            <a
              href={s.href}
              className="mt-auto basic-arche-btn home-collections-btn"
            >
              More
            </a>
          </article>
        ))}
      </div>

      {/* Next */}
      <button
        aria-label="Next"
        onClick={nextPage}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow ring-1 ring-black/10 hover:bg-white z-10"
      >
        ›
      </button>

      {/* Page dots */}
      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide group ${i + 1}`}
              aria-current={i === page}
              onClick={() => goToPage(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === page
                  ? 'bg-neutral-800'
                  : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
