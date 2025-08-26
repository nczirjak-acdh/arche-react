import { Metadata } from './Objects/metadata';
import { PUBLIC_CONFIG } from '@/config/public';

export async function fetchMetadata(id: string, lang: string) {
  console.log('METADATA API:');
  console.log('ID');
  console.log(id);

  console.log('LANG:');
  console.log(lang);

  const res = await fetch(
    `${PUBLIC_CONFIG.apiBase}/browser/api/expert/${id}/${lang}`,
    {
      // Optionally add headers, method, etc.
      //next: { revalidate: 2 }, // Revalidate cache every 60 seconds (optional)
    }
  );

  console.log(res);

  if (!res.ok) {
    throw new Error(`Failed to fetch metadata for ID ${id}`);
  }

  const raw = await res.json();

  const meta = new Metadata(raw, lang);
  return meta; // 🔥 return a class instance
}
