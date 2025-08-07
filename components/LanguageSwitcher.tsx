'use client';

import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
    // Optionally update query param or localStorage
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {i18n.language === 'en' ? 'DE' : 'EN'}
    </button>
  );
}
