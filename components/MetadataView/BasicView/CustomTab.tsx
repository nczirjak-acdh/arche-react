// components/Tabs.tsx
'use client';
import React from 'react';

export type TabItem = {
  key: string; // stable key (e.g., 'custom1')
  label: React.ReactNode; // tab label
  content: React.ReactNode; // content (your component that fetches)
};

export default function CustomTab({
  items,
  initial = 0,
  className = '',
}: {
  items: TabItem[];
  initial?: number;
  className?: string;
}) {
  const [active, setActive] = React.useState(
    Math.min(initial, items.length - 1)
  );

  // If items length shrinks or order changes, clamp active.
  React.useEffect(() => {
    if (active > items.length - 1) setActive(Math.max(0, items.length - 1));
  }, [items.length, active]);

  if (!items.length) return null;

  return (
    <div className={className}>
      <div className="flex gap-2 border-b">
        {items.map((it, i) => (
          <button
            key={it.key}
            onClick={() => setActive(i)}
            className={`rounded-t-md px-3 py-2 text-sm ${
              i === active
                ? 'border border-b-white bg-white text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div className="rounded-b-md border p-4">{items[active]?.content}</div>
    </div>
  );
}
