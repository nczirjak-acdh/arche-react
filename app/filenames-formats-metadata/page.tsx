'use client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HtmlFromTemplate from '@/components/StaticPages/HtmlFromTemplate';
import Cookies from 'js-cookie';

export default function metadata() {
  const router = useRouter();
  const lang = Cookies.get('i18nextLng') || 'en';
  const apiBase = process.env.NEXT_PUBLIC_BASE_BROWSER_API;
  const templateName = 'filenames-formats-metadata';

  const tableUrlForLang = useCallback(
    (lng: string) =>
      apiBase ? `${apiBase}/${templateName}?lang=${lng}` : null,
    [apiBase]
  );
  console.log('API BASE');
  console.log(apiBase);

  const internalTables = apiBase
    ? [
        { id: 'metadata-table', url: `${apiBase}/ontologyjs/${lang}` },
        {
          id: 'filenames-formats-dynamic-table',
          url: `${apiBase}/accepted-formats-table/${lang}`,
        },
      ]
    : [];

  useEffect(() => {
    if (lang === 'de') router.replace('/de/dateinamen-formate-metadaten');
  }, [lang, router]);

  if (lang === 'de') return null; // or a spinner while redirecting

  return (
    <div className="">
      <HtmlFromTemplate
        locale={lang}
        name={templateName}
        base="https://raw.githubusercontent.com/nczirjak-acdh/arche-react-static-test/refs/heads/main/arche-react"
        dynamicTableUrlForLang={tableUrlForLang}
        internalTableApi={internalTables}
      />
    </div>
  );
}
