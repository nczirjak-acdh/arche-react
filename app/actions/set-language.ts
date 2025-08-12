// app/actions/set-language.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLanguage(lang: string, path = '/') {
  (await cookies()).set('i18nextLng', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  // If you're caching with ISR or tags, revalidate here:
  revalidatePath(path);
}
