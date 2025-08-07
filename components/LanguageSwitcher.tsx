'use client';

import i18n from 'i18next';

export default function LanguageSwitcher() {
  console.log('LANGUAGE SWITHCER:');
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    console.log('LANGUAGE SWITHCER LANG:');
    console.log(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('de')}>DE</button>
    </div>
  );

  /*const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
    // Optionally update query param or localStorage
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {i18n.language === 'en' ? 'DE' : 'EN'}
    </button>
  );*/
}
