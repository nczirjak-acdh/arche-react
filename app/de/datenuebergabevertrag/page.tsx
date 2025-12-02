'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HtmlFromTemplate from '@/components/StaticPages/HtmlFromTemplate';
import Cookies from 'js-cookie';

export default function metadata() {
  const lang = Cookies.get('i18nextLng') || 'de';
  const router = useRouter();

  useEffect(() => {
    if (lang === 'en') router.replace('/deposition-agreement');
  }, [lang, router]);

  if (lang === 'en') return null; // or a spinner while redirecting

  return (
    <div className="">
      <HtmlFromTemplate
        locale={lang}
        name="deposition-agreement"
        base="https://raw.githubusercontent.com/nczirjak-acdh/arche-react-static-test/refs/heads/main/arche-react"
      />
    </div>
  );
}
