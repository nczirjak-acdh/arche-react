'use client';
import { useState } from 'react';

interface MetadataProps {
  data: Record<string, any[]>;
}

export default function SummaryBlock({ data }: MetadataProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const formatYear = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).getFullYear();
  };

  const hasKey = (key: string) =>
    Array.isArray(data[key]) && data[key].length > 0;

  return (
    <div className="w-full" id="av-summary">
      <ul className="list-disc list-inside space-y-2">
        {/* Research Discipline */}
        {hasKey('acdh:hasRelatedDiscipline') && (
          <li>
            <strong>Research Discipline:</strong>{' '}
            {data['acdh:hasRelatedDiscipline']
              .map((item) => item.value)
              .join(', ')}
          </li>
        )}

        {/* Subject */}
        {hasKey('acdh:hasSubject') && (
          <li>
            <strong>Subject:</strong>{' '}
            {data['acdh:hasSubject'].map((item) => item.value).join(', ')}
          </li>
        )}

        {/* Spatial Coverage */}
        {hasKey('acdh:hasSpatialCoverage') && (
          <li>
            <strong>Spatial Coverage:</strong>{' '}
            {data['acdh:hasSpatialCoverage']
              .map((item) => item.value)
              .join(', ')}
          </li>
        )}

        {/* Coverage Date */}
        {(hasKey('acdh:hasCoverageStartDate') ||
          hasKey('acdh:hasCoverageEndDate')) && (
          <li>
            <div className="flex gap-2">
              <span className="font-semibold">Coverage Date:</span>
              <span>
                {hasKey('acdh:hasCoverageStartDate') &&
                  hasKey('acdh:hasCoverageEndDate') &&
                  (() => {
                    const start = formatYear(
                      data['acdh:hasCoverageStartDate'][0]?.value
                    );
                    const end = formatYear(
                      data['acdh:hasCoverageEndDate'][0]?.value
                    );
                    return start === end ? start : `${start} - ${end}`;
                  })()}
                {hasKey('acdh:hasCoverageStartDate') &&
                  !hasKey('acdh:hasCoverageEndDate') &&
                  formatYear(data['acdh:hasCoverageStartDate'][0]?.value)}
                {!hasKey('acdh:hasCoverageStartDate') &&
                  hasKey('acdh:hasCoverageEndDate') &&
                  formatYear(data['acdh:hasCoverageEndDate'][0]?.value)}
              </span>
            </div>
          </li>
        )}

        {/* Era */}
        {hasKey('acdh:hasTemporalCoverage') && (
          <li>
            <strong>Era:</strong> {data['acdh:hasTemporalCoverage'][0].value}
          </li>
        )}
      </ul>

      {/* Description */}
      {hasKey('acdh:hasDescription') && (
        <div className="mt-4">
          {(() => {
            const desc = data['acdh:hasDescription'][0].value.replace(
              /\\n/g,
              '\n'
            );
            const isLong = desc.length > 200;
            const shortText = desc.slice(0, 200);

            return (
              <>
                <p className="whitespace-pre-line">
                  {showFullDesc || !isLong ? desc : `${shortText}...`}
                </p>
                {isLong && (
                  <button
                    className="text-blue-600 underline mt-1"
                    onClick={() => setShowFullDesc((prev) => !prev)}
                  >
                    {showFullDesc ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Note */}
      {hasKey('acdh:hasNote') && (
        <ul className="mt-4 list-disc list-inside">
          <li>
            <strong>Note:</strong> {data['acdh:hasNote'][0].value}
          </li>
        </ul>
      )}
    </div>
  );
}
