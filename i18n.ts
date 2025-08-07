// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/page.json';
import de from './locales/de/page.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
