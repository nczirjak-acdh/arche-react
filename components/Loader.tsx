// components/Loader.tsx
'use client';

import Image from 'next/image';

export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-6">
      <Image
        src="/public/images/arche_logo_flip_47px.gif"
        alt="Loading"
        width={48}
        height={48}
      />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
