import { Metadata, MetadataRaw } from './Objects/metadata';

export async function fetchMetadata(id: string, lang: string) {
  const res = await fetch(
    `https://arche-dev.acdh-dev.oeaw.ac.at/browser/api/expert/${id}/${lang}`,
    {
      // Optionally add headers, method, etc.
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds (optional)
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch metadata for ID ${id}`);
  }

  const raw: MetadataRaw = await res.json();

  const meta = new Metadata(raw);
  return meta.toJSON(); // 🔥 return a class instance
}
