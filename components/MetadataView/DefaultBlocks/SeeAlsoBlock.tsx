import React from 'react';
import { useTranslation } from 'react-i18next';

const SeeAlsoBlock = ({ data = {} }: { data?: Record<string, unknown[]> }) => {
  const { t } = useTranslation();

  const hasKey = (key: string) =>
    Array.isArray(data[key]) && data[key].length > 0;

  return (
    <div className="lg:flex-row w-full pb-5">
      <div className="w-full flex gap-5 pt-5">
        <h5>{t('See Also')}</h5>
      </div>

      <div className="w-full pt-5">
        <ul className="list-disc list-inside space-y-2">
          {/* hasUrl */}
          {hasKey('acdh:hasUrl') && (
            <li>
              <strong>{t('URL')}:</strong>{' '}
              {data['acdh:hasUrl']
                .filter(
                  (u) => typeof u?.value === 'string' && u.value.trim() !== ''
                )
                .map((item, idx, arr) => {
                  const url = item.value as string;
                  const href = /^https?:\/\//i.test(url)
                    ? url
                    : `http://${url}`; // add protocol if missing
                  return (
                    <React.Fragment key={`${url}-${idx}`}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline break-all"
                      >
                        {url}
                      </a>
                      {idx < arr.length - 1 && ', '}
                    </React.Fragment>
                  );
                })}
            </li>
          )}

          {/* hasUrl */}
          {hasKey('acdh:hasRelatedProject') && (
            <li>
              <strong>{t('Related Project')}:</strong>{' '}
              {data['acdh:hasRelatedProject']
                .map((item) => item.value)
                .join(', ')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SeeAlsoBlock;
