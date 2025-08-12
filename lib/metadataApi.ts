import { Metadata } from './Objects/metadata';

export async function fetchMetadata(id: string, lang: string) {
  console.log('METADATA API CALL: ');

  console.log(lang);
  const res = await fetch(
    `https://arche-dev.acdh-dev.oeaw.ac.at/browser/api/expert/${id}/${lang}`,
    {
      // Optionally add headers, method, etc.
      next: { revalidate: 2 }, // Revalidate cache every 60 seconds (optional)
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch metadata for ID ${id}`);
  }

  const raw = await res.json();

  const meta = new Metadata(raw, lang);
  console.log('METAAAAAAAAA');
  console.log(meta.getDataByProperty('acdh:hasTitle'));
  console.log(meta.getDataByProperty('acdh:hasDescription'));
  //return meta;
  return meta; // 🔥 return a class instance
}
