// components/HtmlFromTemplate.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import HomeCarousel from '../FrontPage/HomeCarousel';
import Loader from '../Loader';
import TwTokens from './TwTokens';

type JsonData = Record<string, any>;

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}
function interpolate(tpl: string, data: JsonData) {
  return tpl.replace(/{{\s*([^}]+?)\s*}}/g, (_m, p) => {
    const v = getByPath(data, String(p).trim());
    if (v == null) return '';
    if (Array.isArray(v)) return v.join('');
    if (typeof v === 'object') return '';
    return String(v);
  });
}

export default function HtmlFromTemplate({
  locale,
  name,
  base = '',
}: {
  locale: string;
  name: string; // e.g. 'home'
  base?: string; // e.g. 'http://localhost/api/home'
}) {
  const [tpl, setTpl] = useState('');
  const [json, setJson] = useState<JsonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Root[]>([]);
  const baseBrowser = process.env.NEXT_PUBLIC_BASE_BROWSER;

  const htmlUrl = `${base}/${locale}/${name}.html`;
  const jsonUrl = `${base}/${locale}/${name}.json`;

  useEffect(() => {
    let aborted = false;
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [h, j] = await Promise.all([
          fetch(htmlUrl, { cache: 'no-store', signal: ac.signal }),
          fetch(jsonUrl, { cache: 'no-store', signal: ac.signal }),
        ]);
        if (!h.ok) throw new Error(`HTML ${h.status}`);
        if (!j.ok) throw new Error(`JSON ${j.status}`);
        const [htmlText, jsonData] = await Promise.all([h.text(), j.json()]);
        if (!aborted) {
          setTpl(htmlText);
          setJson(jsonData);
        }
      } catch (e: any) {
        if (!aborted) setErr(e?.message ?? 'Fetch failed');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
      ac.abort();
    };
  }, [htmlUrl, jsonUrl]);

  const rendered = useMemo(
    () => (tpl && json ? interpolate(tpl, json) : ''),
    [tpl, json]
  );

  // Mount dynamic components into placeholders
  useEffect(() => {
    // cleanup previous mounts
    rootsRef.current.forEach((r) => r.unmount());
    rootsRef.current = [];

    const host = containerRef.current;
    if (!host) return;

    const nodes = host.querySelectorAll<HTMLElement>(
      '[data-component="carousel"]'
    );
    nodes.forEach((el) => {
      const endpoint = el.dataset.endpoint || '';
      console.log('ENDPOINT');
      console.log(`${baseBrowser}${endpoint}`);
      const root = createRoot(el);
      rootsRef.current.push(root);

      root.render(<HomeCarousel endpoint={`${baseBrowser}${endpoint}`} />);
    });

    return () => {
      rootsRef.current.forEach((r) => r.unmount());
      rootsRef.current = [];
    };
  }, [rendered]);

  if (loading) {
    return (
      <div className="pt-8 pb-8 mb-8">
        <Loader></Loader>
      </div>
    );
  }

  if (err || !rendered) return null;

  return (
    <div>
      <TwTokens />
      <div
        ref={containerRef}
        // If the API is trusted, this is fine. If not, sanitize before.
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    </div>
  );
}
