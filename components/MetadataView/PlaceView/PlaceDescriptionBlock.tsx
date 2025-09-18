'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MetadataProps {
  data: Record<string, any[]>;
}

export default function PlaceDescriptionBlock({ data }: MetadataProps) {
  const { t } = useTranslation();

  console.log(data);

  return (
    <div className="w-full flex flex-col gap-5 pt-5" id="av-summary">
      <div className="w-full">
        <h5>{t('Address')}</h5>
      </div>
      <div>
        <ul>
          {Object.entries(data).map(([key, list]) => {
            if (!Array.isArray(list) || list.length === 0) return null;

            return (
              <div key={key} className="">
                <li className="w-full flex items-center gap-2">
                  <b>{t(key)}:</b>

                  {list.map((val, idx) => {
                    const content = (
                      <span style={{ whiteSpace: 'pre-line' }}>
                        {val.value ?? ''}
                      </span>
                    );

                    if (val.externalUrl) {
                      return (
                        <div key={idx}>
                          <a
                            href={val.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.value}
                          </a>
                          <br />
                        </div>
                      );
                    }

                    if (val.id != null) {
                      return (
                        <div key={idx}>
                          <a
                            href={`/browser/metadata/${val.id}`}
                            id="archeHref"
                          >
                            {val.value}
                          </a>
                          <br />
                        </div>
                      );
                    }

                    // default branch (Twig's `nl2br`)
                    return (
                      <div key={idx}>
                        {content}
                        <br />
                      </div>
                    );
                  })}
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
