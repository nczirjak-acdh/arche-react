import React from 'react';
import { useState } from 'react';
import ResultImage from './ResultImage';

type ResultItem = ApiResponse['results'];

const ResultBlock = ({ data = [] }: { data?: [] }) => {
  console.log('DATA:::');
  console.log(data);
  console.log(data.totalCount);
  console.log(data.pageSize);

  //' + apiUrl + '&width=600
  return (
    <div className="flex flex-col rounded-[12px] border border-[#e1e1e1] bg-white relative">
      <div className="flex flex-col lg:flex-row w-full gap-4 p-5">
        <div className="w-full lg:w-[30%] space-y-4">Results ... </div>
        <div className="w-full lg:w-[40%] space-y-4">Pager</div>
        <div className="w-full lg:w-[30%] space-y-4">
          <select className=" smartPageSize" id="smartPageSize">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col w-full p-2">
        <hr className="my-4 border-[#E1EDF3]" />
      </div>
      <div className="">
        {data.map((item) => {
          const [hasImage, setHasImage] = useState(false);

          return (
            <div key={item.id} className="rounded-lg p-5">
              <div className="w-full pl-5">
                <h5 className="font-semibold ">
                  <a href={`/browser/metadata/${item.id}`}>
                    {item.title?.en || item.title?.de || `#${item.id}`}
                  </a>
                </h5>
              </div>

              {/* Description + Image row */}
              <div
                className={`flex w-full p-5 gap-4 ${
                  hasImage ? 'flex-row' : 'flex-col'
                }`}
              >
                <div className={hasImage ? 'w-2/3' : 'w-full'}>
                  {item.description && (
                    <p className="text-sm text-gray-700">
                      {item.description.en || item.description.de || ''}
                    </p>
                  )}
                </div>

                {hasImage && (
                  <div className="w-1/3">
                    <ResultImage id={item.url} onFound={setHasImage} />
                  </div>
                )}
              </div>

              {/* Metadata row */}
              <div className="flex items-center gap-2 pl-5 pt-2 pb-2">
                <span className="px-2 py-1 rounded-[12px] bg-[#5B595B] text-white h-fit inline-block">
                  {item.class && item.class[0]
                    ? item.class[0].replace(
                        'https://vocabs.acdh.oeaw.ac.at/schema#',
                        'acdh:'
                      )
                    : ''}
                </span>
                <span>accessress</span>
              </div>

              <hr className="my-4 border-[#E1EDF3]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultBlock;
