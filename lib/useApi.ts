// lib/useApi.ts
'use client';

import { useEffect, useRef, useState } from 'react';

export function useApi<T = unknown>(url?: string, opts?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url);
  const urlRef = useRef(url);

  useEffect(() => {
    if (!url) return;
    urlRef.current = url;

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(url, { signal: ac.signal, ...opts });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as T;
        // Avoid setting stale results if url changed during fetch
        if (urlRef.current === url) setData(json);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e?.message ?? 'Unknown error');
      } finally {
        if (urlRef.current === url) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [url]);

  return { data, error, loading };
}
