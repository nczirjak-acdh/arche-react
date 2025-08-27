import React from 'react';
import { humanLang } from '/lib/helpers/metadataHelpers';

const ResultItem = ({
  item,
  lang = 'en',
}: {
  item: ApiResult['results'][number];
  lang?: 'en' | 'de';
}) => {
  const title = humanLang(item.title, lang) || `#${item.id}`;
  const desc = humanLang(item.description, lang);
  const badge = item.class?.[0]?.split('#').pop() ?? 'Item';

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
          {badge}
        </span>
        <a
          href={item.url}
          className="truncate text-base font-semibold text-blue-700 hover:underline"
          title={title}
        >
          {title}
        </a>
      </div>
      {desc ? (
        <p className="mt-1 line-clamp-3 text-sm text-gray-700 whitespace-pre-line">
          {desc}
        </p>
      ) : null}
      <div className="mt-2 text-xs text-gray-500">
        {humanLang(item.accessRestrictionSummary, lang)}
      </div>
    </li>
  );
};

export default ResultItem;
