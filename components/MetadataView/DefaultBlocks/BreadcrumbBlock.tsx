'use client';

import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PUBLIC_CONFIG } from '@/config/public';
import Image from 'next/image';
import loaderGif from '@/public/images/arche_logo_flip_47px.gif';

type Item = { id: number; title: string };

export default function BreadcrumbBlock({
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
          `${PUBLIC_CONFIG.apiBase}/browser/api/breadcrumb/${identifier}/${lang}`
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
    <div className="max-w-lg flex flex-col ">
      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <Image
            src={loaderGif}
            alt="Loading...."
            width={16}
            height={16}
            className="w-16 h-16"
          />
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
        <div>
          {data.map((it, index) => (
            <span key={it.id} className="">
              <Link
                href={`/browser/metadata/${it.id}`}
                id={`breadcrumb-${it.id}`}
                className="hover:underline text-blue-600"
              >
                {it.title}
              </Link>
              {index < data.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
