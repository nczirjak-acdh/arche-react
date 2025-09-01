'use client';
import React from 'react';
import ResultImage from './ResultImage';

type ResultItem = {
  id: number | string;
  url: string; // used by thumbnails api
  title?: Record<string, string>;
  description?: Record<string, string>;
  class?: string[];
};

export default function ResultBlock({
  data = [] as ResultItem[],
}: {
  data?: ResultItem[];
}) {
  return (
    <div className="flex flex-col rounded-[12px] border border-[#e1e1e1] bg-white relative">
      {/* Top row */}
      <div className="flex flex-col lg:flex-row w-full gap-4 p-5">
        <div className="w-full lg:w-[30%] space-y-4">Results …</div>
        <div className="w-full lg:w-[40%] space-y-4">Pager</div>
        <div className="w-full lg:w-[30%] space-y-4">
          <select className="smartPageSize" id="smartPageSize">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col w-full p-2">
        <hr className="my-4 border-[#E1EDF3]" />
      </div>

      {/* Results */}
      <div>
        {data.map((item) => (
          <ResultRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/** One row component so each row can have its own state */
function ResultRow({ item }: { item: ResultItem }) {
  const [hasImage, setHasImage] = React.useState(false);

  const title =
    item.title?.en ||
    item.title?.de ||
    (typeof item.title === 'string' ? item.title : '') ||
    `#${item.id}`;
  const desc =
    item.description?.en ||
    item.description?.de ||
    (typeof item.description === 'string' ? item.description : '');

  const classBadge =
    item.class && item.class[0]
      ? item.class[0].replace('https://vocabs.acdh.oeaw.ac.at/schema#', 'acdh:')
      : '';

  return (
    <div className="rounded-lg p-5">
      <div className="w-full pl-5">
        <h5 className="font-semibold">
          <a href={`/browser/metadata/${item.id}`}>{title}</a>
        </h5>
      </div>

      {/* Description + Image: adapt layout when image is found */}
      <div
        className={`grid gap-4 p-5 ${hasImage ? 'grid-cols-3' : 'grid-cols-1'}`}
      >
        <div className={hasImage ? 'col-span-2' : ''}>
          {desc && <p className="text-sm text-gray-700">{desc}</p>}
        </div>

        {/* Always render ResultImage so it can probe and set hasImage */}
        <div className={hasImage ? 'block' : 'hidden'}>
          {/* If your thumbnail API expects the *api url* in the id, pass item.url (as you had) */}
          <ResultImage id={item.url} onFound={setHasImage} />
        </div>
      </div>

      <div className="flex items-center gap-2 pl-5 pt-2 pb-2">
        <span className="inline-block px-2 py-1 rounded-[12px] bg-[#5B595B] text-white h-fit">
          {classBadge}
        </span>
        <span>accessress</span>
      </div>

      <hr className="my-4 border-[#E1EDF3]" />
    </div>
  );
}
