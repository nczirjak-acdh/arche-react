'use client';

import i18n from 'i18next';
import { usePathname, useRouter } from 'next/navigation';
import { setLanguage } from '@/app/actions/set-language';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  console.log('LANGUAGE SWITHCER:');

  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (lang: string) => {
    startTransition(async () => {
      console.log('SET LANGUAGE: ');
      console.log(lang);
      localStorage.setItem('i18nextLng', lang);
      document.cookie = `i18nextLng=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      await setLanguage(lang, pathname);
      router.refresh(); // SSR reruns with the new cookie
    });
    //i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2">
      <button disabled={isPending} onClick={() => changeLanguage('en')}>
        EN
      </button>
      <button disabled={isPending} onClick={() => changeLanguage('de')}>
        DE
      </button>
    </div>
  );
}
