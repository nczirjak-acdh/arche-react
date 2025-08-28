import React from 'react';
type ResultItem = ApiResponse['results'];

const ResultBlock = ({ data = [] }: { data?: ResultItem }) => {
  return (
    <div>
      <ul className="space-y-3">
        {data.map((item) => (
          <li key={item.id} className="rounded-lg border p-4">
            <h3 className="font-semibold">
              {item.title?.en || item.title?.de || `#${item.id}`}
            </h3>
            {item.description && (
              <p className="text-sm text-gray-700">
                {item.description.en || item.description.de || ''}
              </p>
            )}
            <a href={item.url} className="text-blue-600 hover:underline">
              Open
            </a>
          </li>
        ))}

        {/*
        {results.map((item) => (
          <ResultItem key={item.id} item={item} lang={lang as 'en' | 'de'} />
        ))}
              */}
      </ul>
    </div>
  );
};

export default ResultBlock;
