'use client';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MetadataProps {
  data: Record<string, any[]>;
}

export default function PublicationSummaryBlock({ data }: MetadataProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-5 pt-5" id="map-description-block">
      <div>
        <ul className="list-disc pl-6 space-y-2 marker:text-slate-500">
          {Object.entries(data).map(([key, list]) => {
            if (!Array.isArray(list) || list.length === 0) return null;

            return (
              <li key={key} className="list-item">
                {/* put flex on a child, not on the <li> */}
                <div className="flex items-start gap-2 flex-wrap">
                  <b className="shrink-0">{t(key)}:</b>

                  <div className="break-words">
                    {list.map((val, idx) => {
                      const label = String(val?.value ?? '');

                      if (val?.externalUrl) {
                        return (
                          <React.Fragment key={idx}>
                            <a
                              href={val.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {label}
                            </a>
                            {idx < list.length - 1 && ', '}
                          </React.Fragment>
                        );
                      }

                      if (val?.id != null) {
                        return (
                          <React.Fragment key={idx}>
                            <a
                              href={`/browser/metadata/${val.id}`}
                              id="archeHref"
                            >
                              {label}
                            </a>
                            {idx < list.length - 1 && ', '}
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={idx}>
                          <span style={{ whiteSpace: 'pre-line' }}>
                            {label}
                          </span>
                          {idx < list.length - 1 && ', '}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
