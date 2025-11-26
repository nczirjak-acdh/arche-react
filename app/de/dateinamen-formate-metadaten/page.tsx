'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HtmlFromTemplate from '@/components/StaticPages/HtmlFromTemplate';
import Cookies from 'js-cookie';

export default function metadata() {
  const lang = Cookies.get('i18nextLng') || 'de';
  const router = useRouter();

  useEffect(() => {
    if (lang === 'en') router.replace('/filenames-formats-metadata');
  }, [lang, router]);

  if (lang === 'en') return null; // or a spinner while redirecting

  return (
    <div className="mb-[100px]">
      <HtmlFromTemplate
        locale={lang}
        name="filenames-formats-metadata"
        base="https://raw.githubusercontent.com/nczirjak-acdh/arche-react-static-test/refs/heads/main/arche-react"
      />
    </div>
  );
}
