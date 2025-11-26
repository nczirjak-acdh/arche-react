'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HtmlFromTemplate from '@/components/StaticPages/HtmlFromTemplate';
import Cookies from 'js-cookie';

export default function metadata() {
  const router = useRouter();
  const lang = Cookies.get('i18nextLng') || 'en';

  useEffect(() => {
    if (lang === 'de') router.replace('/de/datenschutzbestimmungen');
  }, [lang, router]);

  if (lang === 'de') return null; // or a spinner while redirecting

  return (
    <div className="mb-[100px]">
      <HtmlFromTemplate
        locale={lang}
        name="privacy-policy"
        base="https://raw.githubusercontent.com/nczirjak-acdh/arche-react-static-test/refs/heads/main/arche-react"
      />
    </div>
  );
}
