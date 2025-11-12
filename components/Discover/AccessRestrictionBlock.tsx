// components/AccessBadge.tsx
'use client';

import React from 'react';

type LevelKey = 'public' | 'academic' | 'restricted';

const COLORS: Record<LevelKey, string> = {
  public: '#1dd1a1',
  academic: '#ff9f43',
  restricted: '#ee5253',
};

// pair -> your CSS class
const PAIR_CLASS: Record<`${LevelKey}-${LevelKey}`, string> = {
  'public-academic': 'btn-toolbar-public-academic',
  'academic-public': 'btn-toolbar-academic-public',
  'public-restricted': 'btn-toolbar-public-restricted',
  'restricted-public': 'btn-toolbar-restricted-public',
  'academic-restricted': 'btn-toolbar-academic-restricted',
  'restricted-academic': 'btn-toolbar-restricted-academic',
};

const SINGLE_CLASS: Record<LevelKey, string> = {
  public: 'btn-toolbar-public',
  academic: 'btn-toolbar-academic',
  restricted: 'btn-toolbar-restricted',
};

function parseLevels(input: string): LevelKey[] {
  // supports separators "/", "," or just spaces
  // matches: public: 18, academic: 1, restricted: 0 ...
  const re = /\b(public|academic|restricted)\s*:\s*(\d+)/gi;
  const seen: Set<LevelKey> = new Set();
  const inOrder: LevelKey[] = [];

  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    const key = m[1].toLowerCase() as LevelKey;
    const count = Number(m[2]);
    if (!seen.has(key) && Number.isFinite(count) && count > 0) {
      seen.add(key);
      inOrder.push(key);
    }
  }
  return inOrder;
}

export default function AccessRestrictionBlock({
  value,
  label = value, // what to show as text inside the badge
  className = '',
}: {
  value: string; // e.g. "public: 18 / academic: 1 / restricted: 1"
  label?: React.ReactNode;
  className?: string;
}) {
  const levels = parseLevels(value);

  let dynamicClass = '';
  let dynamicStyle: React.CSSProperties | undefined;

  if (levels.length === 1) {
    dynamicClass = SINGLE_CLASS[levels[0]];
  } else if (levels.length === 2) {
    const pairKey = `${levels[0]}-${levels[1]}` as `${LevelKey}-${LevelKey}`;
    dynamicClass = PAIR_CLASS[pairKey] ?? '';
  } else if (levels.length >= 3) {
    // 3+ -> make a tri-color gradient (0/50/100%)
    dynamicStyle = {
      background: `linear-gradient(90deg, ${COLORS[levels[0]]} 0%, ${COLORS[levels[1]]} 50%, ${COLORS[levels[2]]} 100%)`,
      color: '#fff',
    };
  } else {
    // no matches -> neutral style
    dynamicStyle = { background: '#6b7280', color: '#fff' }; // gray-500
  }

  return (
    <div
      className={[
        'inline-flex items-center rounded-[12px] py-1 pl-2 pr-2 text-sm text-[12px] shadow-sm',
        dynamicClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={dynamicStyle}
      aria-label={typeof label === 'string' ? label : undefined}
      title={typeof label === 'string' ? label : undefined}
    >
      {label}
    </div>
  );
}
