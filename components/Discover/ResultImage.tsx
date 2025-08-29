// ResultImage.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ResultImage({
  id,
  onFound,
}: {
  id: string;
  onFound?: (hasImage: boolean) => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  console.log('RESULT IMAGE STARTED');
  const url = `${process.env.NEXT_PUBLIC_THUMBNAILS_URL}${id}&width=400`; // 👈 build your url with id

  useEffect(() => {
    let active = true;

    async function checkImage() {
      try {
        const res = await fetch(url, { method: 'HEAD' }); // only ask for headers
        if (!active) return;
        if (res.ok) {
          console.log('IMAGE ok ');
          console.log(url);
          setSrc(url);
          onFound?.(true);
        } else {
          setSrc(null); // 404 or other error
          onFound?.(false);
        }
      } catch (e) {
        if (active) {
          setSrc(null);
          onFound?.(false);
        }
      }
    }

    checkImage();
    return () => {
      active = false;
    };
  }, [id, onFound]);

  if (!src) return null;

  return (
    <img
      src={url}
      alt={`Preview ${id}`}
      className="max-h-32 w-auto object-contain rounded"
      loading="lazy"
    />
  );
}
