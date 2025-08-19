'use client';

import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PUBLIC_CONFIG } from '@/config/public';

type Item = { id: number; title: string };

export default function NewVersionBlock({
  identifier,
}: {
  identifier: string;
}) {
  const [data, setData] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lang = Cookies.get('i18nextLng') || 'en';

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${PUBLIC_CONFIG.apiBase}/browser/api/versions-list/${identifier}/${lang}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Loader */}
      {loading && (
        <div className="flex items-center gap-3 text-gray-600">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent font-black" />
          Loading…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded border border-red-300 bg-red-50 text-red-700 p-3">
          Failed to load: {error}
        </div>
      )}

      {/* Data */}
      {!loading && !error && data && (
        <div className="flex flex-col lg:flex-row w-full">
          {data?.[0]?.id !== identifier && (
            <div
              id="metadata-versions-alert"
              role="alert"
              className="w-full flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-700"
            >
              <div className="w-full text-center">
                The resource has a newer version!
                <Link
                  href={`/browser/metadata/${data?.[0]?.id}`}
                  id="metadata-versions-alert-url"
                  className="font-medium underline hover:text-red-800"
                >
                  Click here for the newer version
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
