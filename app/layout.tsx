// app/layout.tsx  (NO "use client")
import './globals.css';
import { cookies } from 'next/headers';
import RootShell from './RootShell.client';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR: read cookie (fallback en) so <html lang> is correct on first paint
  const lang = (await cookies()).get('i18nextLng')?.value ?? 'en';

  return (
    <html lang={lang}>
      <body>
        {/* move all client logic into this shell */}
        <RootShell initialLang={lang}>{children}</RootShell>
      </body>
    </html>
  );
}
