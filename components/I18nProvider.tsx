'use client';

import { useEffect, useState } from 'react';
import i18n from '../i18n';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      i18n.on('initialized', () => setReady(true));
    }
  }, []);

  if (!ready) return null; // or a spinner/loading screen

  return <>{children}</>;
}
