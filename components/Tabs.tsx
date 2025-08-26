'use client';
import { useId, useState, KeyboardEvent } from 'react';

type TabItem = { label: string; content: React.ReactNode };

export default function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') setActive((i) => (i + 1) % items.length);
    if (e.key === 'ArrowLeft')
      setActive((i) => (i - 1 + items.length) % items.length);
  };

  return (
    <div className="w-full">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex gap-2 border-b border-gray-200"
      >
        {items.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={i}
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={[
                'px-4 py-2 text-sm font-medium outline-none w-full',
                selected
                  ? 'border-b-2 border-blue-600 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {items.map((t, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={active !== i}
          className="pt-4 w-full"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
