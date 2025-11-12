'use client';
import React from 'react';
import ResultImage from './ResultImage';
import type { PagerItem, ResultItem } from '@/lib/types/types';
import Pager from './Pager';
import AccessRestrictionBlock from './AccessRestrictionBlock';

export default function ResultBlock({
  data = [] as ResultItem[],
  pagerData = [] as PagerItem[],
  messages = '',
}: {
  data?: ResultItem[];
  pagerData?: PagerItem[];
  messages?: string;
}) {
  console.log(data);
  return (
    <div className="flex flex-col rounded-[12px] border border-[#e1e1e1] bg-white relative">
      {/* Top row */}
      <div className="flex flex-col lg:flex-row w-full gap-4 p-5">
        <div className="w-full lg:w-[15%] space-y-4">
          {pagerData.totalCount} Result(s)
        </div>
        <div className="w-full lg:w-[70%] space-y-4">
          <Pager data={pagerData}></Pager>
        </div>
        <div className="w-full lg:w-[15%] space-y-4">
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

      {messages?.trim() && (
        <div
          className="flex flex-col p-2 m-4 bg-amber-400 font-[#66666] w-[95%] text-center"
          dangerouslySetInnerHTML={{ __html: messages }}
        ></div>
      )}

      {/* Results */}

      <div>
        {data.map((item) => (
          <ResultRow key={item.id} item={item} />
        ))}
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4 p-5">
        <div className="w-full lg:w-[15%] space-y-4">
          {pagerData.totalCount} Result(s)
        </div>
        <div className="w-full lg:w-[70%] space-y-4">
          <Pager data={pagerData}></Pager>
        </div>
        <div className="w-full lg:w-[15%] space-y-4">
          <select className="smartPageSize" id="smartPageSize">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
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

  const accessRestrictionSummary =
    item.accessRestrictionSummary?.en ||
    item.accessRestrictionSummary?.de ||
    (typeof item.accessRestrictionSummary === 'string'
      ? item.accessRestrictionSummary
      : '');

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
        className={`w-full flex gap-4 p-5 ${hasImage ? 'lg:w-[100%]' : 'lg:w-[100%]'}`}
      >
        <div className={hasImage ? 'lg:w-[75%]' : 'lg:w-[100%]'}>
          {desc && <p className="text-sm text-gray-700">{desc}</p>}
        </div>

        {/* Always render ResultImage so it can probe and set hasImage */}
        <div className={hasImage ? ' flex lg:w-[25%]' : 'hidden'}>
          {/* If your thumbnail API expects the *api url* in the id, pass item.url (as you had) */}
          <ResultImage id={item.url} onFound={setHasImage} />
        </div>
      </div>

      <div className="flex items-center gap-2 pl-5 pt-2 pb-2">
        <span className="w-max flex btn-detail-type-gray">{classBadge}</span>
        <span>
          <AccessRestrictionBlock
            value={accessRestrictionSummary}
          ></AccessRestrictionBlock>
        </span>
      </div>

      <hr className="my-4 border-[#E1EDF3]" />
    </div>
  );
}
