// components/Loader.tsx
'use client';

import Image from 'next/image';
import loaderGif from '@/public/images/arche_logo_flip_47px.gif';

export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-6 w-full">
      <Image
        src={loaderGif}
        alt="Loading...."
        width={16}
        height={16}
        className="w-16 h-16"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
