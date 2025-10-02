'use client';

import { useEffect, useMemo, useState } from 'react';
// Optional (recommended if the API is not fully trusted):
// import DOMPurify from 'dompurify';

type Props = {
  locale: 'en' | 'de';
  name: string; // e.g. 'home'
  base?: string; // default: '/api/home'
};

type JsonData = Record<string, any>;

function getByPath(obj: any, path: string) {
  return path
    .split('.')
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function interpolate(template: string, data: JsonData) {
  // {{ element_1.title_small }}
  return template.replace(/{{\s*([^}]+?)\s*}}/g, (_m, rawPath) => {
    const path = String(rawPath).trim();
    const v = getByPath(data, path);
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(''); // arrays like ["<p>..</p>", "..."]
    if (typeof v === 'object') return ''; // objects not supported here
    return String(v);
  });
}

export default function HtmlFromTemplate({ locale, name, base = '' }: Props) {
  const [tpl, setTpl] = useState<string>('');
  const [json, setJson] = useState<JsonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const htmlUrl = `${base}/${locale}/${name}.html`;
  const jsonUrl = `${base}/${locale}/${name}.json`;

  useEffect(() => {
    let aborted = false;
    const ac = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setErr(null);
        const [hRes, jRes] = await Promise.all([
          fetch(htmlUrl, { cache: 'no-store', signal: ac.signal }),
          fetch(jsonUrl, { cache: 'no-store', signal: ac.signal }),
        ]);

        if (!hRes.ok) throw new Error(`HTML ${hRes.status}`);
        if (!jRes.ok) throw new Error(`JSON ${jRes.status}`);

        const [htmlText, jsonData] = await Promise.all([
          hRes.text(),
          jRes.json(),
        ]);
        if (!aborted) {
          setTpl(htmlText);
          setJson(jsonData);
        }
      } catch (e: any) {
        if (!aborted) setErr(e?.message ?? 'Fetch failed');
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    run();
    return () => {
      aborted = true;
      ac.abort();
    };
  }, [htmlUrl, jsonUrl]);

  const rendered = useMemo(() => {
    if (!tpl || !json) return '';
    const out = interpolate(tpl, json);
    // If the HTML content is NOT fully trusted, uncomment to sanitize:
    // return DOMPurify.sanitize(out, { USE_PROFILES: { html: true } });
    return out;
  }, [tpl, json]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
        <span>Loading…</span>
      </div>
    );
  }

  if (err || !rendered) {
    return null; // or show a small error box
  }

  return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
}
