'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MetadataProps {
  data: Record<string, any[]>;
}

export default function PlaceCoordinatesBlock({ data }: MetadataProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-5 pt-5" id="map-coordinates-block">
      <div className="w-full">
        <h5>{t('Map')}</h5>
      </div>
      <div>
        <ul className="list-disc pl-6 space-y-2">
          {Object.entries(data).map(([key, list]) => {
            if (!Array.isArray(list) || list.length === 0) return null;

            return (
              <li key={key} className="space-y-2 gap-2">
                {/* Use flex/grid INSIDE the li, not on it */}
                <div className="grid grid-cols-[auto,1fr] gap-x-2 items-start">
                  {t(key)}:&nbsp;
                  {list.map((val, idx) => {
                    const label = String(val?.value ?? '');

                    return (
                      <React.Fragment
                        key={`${key}-${idx}-${val?.id ?? val?.externalUrl ?? label}`}
                      >
                        {label}
                        {idx < list.length - 1 && <span aria-hidden>,</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
