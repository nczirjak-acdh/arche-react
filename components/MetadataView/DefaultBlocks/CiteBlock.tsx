'use client';

import { useEffect, useMemo, useState } from 'react';
import Cite from 'citation-js';
import Image from 'next/image';
import loaderGif from '@/public/images/arche_logo_flip_47px.gif';

type Props = {
  /** URL that returns CSL-JSON (your example works out of the box) */
  src?: string;
  /** Default language for CSL (affects things like “and” vs “et al.”) */
  lang?: string; // e.g., 'en-US'
};

type FormatKey = 'APA_6TH' | 'HARVARD' | 'VANCOUVER' | 'JSON_CSL' | 'BIBLATEX';

const STYLE_URLS: Record<'APA_6TH' | 'HARVARD' | 'VANCOUVER', string> = {
  APA_6TH:
    'https://raw.githubusercontent.com/citation-style-language/styles/master/apa-6th-edition.csl',
  HARVARD:
    'https://raw.githubusercontent.com/citation-style-language/styles/master/harvard-cite-them-right.csl',
  VANCOUVER:
    'https://raw.githubusercontent.com/citation-style-language/styles/master/vancouver.csl',
};

export default function CiteBlock({
  src = 'https://arche-biblatex.acdh.oeaw.ac.at/?id=https://arche-dev.acdh-dev.oeaw.ac.at/api/262625&lang=en&format=application%2Fvnd.citationstyles.csl%2Bjson',
  lang = 'en-US',
}: Props) {
  const [cslJson, setCslJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [format, setFormat] = useState<FormatKey>('APA_6TH');
  const [output, setOutput] = useState('');
  const [copyOk, setCopyOk] = useState(false);

  // 1) Load CSL-JSON
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(src, { cache: 'no-store' });
        if (!res.ok)
          console.log(`Failed to load CSL-JSON (HTTP ${res.status})`);
        throw new Error(`Failed to load CSL-JSON (HTTP ${res.status})`);
        const json = await res.json();
        if (!cancelled) setCslJson(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  // 2) Fetch styles and REGISTER them with names
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const entries = await Promise.all(
          (Object.keys(STYLE_URLS) as Array<keyof typeof STYLE_URLS>).map(
            async (k) => {
              const r = await fetch(STYLE_URLS[k]);
              if (!r.ok) throw new Error(`Style ${k} HTTP ${r.status}`);
              const xml = await r.text();
              // Register with a stable name
              const name =
                k === 'APA_6TH'
                  ? 'apa-6th-edition'
                  : k === 'HARVARD'
                    ? 'harvard-cite-them-right'
                    : 'vancouver';
              // IMPORTANT: register once
              if (!Cite.CSL.register.getTemplate(name)) {
                Cite.CSL.register.addTemplate(name, xml);
              }
              return name;
            }
          )
        );
        if (!cancelled) setStylesLoaded(true);
      } catch (e) {
        // Styles missing? We’ll still allow JSON-CSL/BibLaTeX
        if (!cancelled) setStylesLoaded(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 3) Render on changes
  useEffect(() => {
    (async () => {
      try {
        setOutput('');
        setCopyOk(false);
        if (!cslJson) return;

        const cite = new Cite(cslJson);

        if (format === 'JSON_CSL') {
          setOutput(JSON.stringify(cslJson, null, 2));
          return;
        }

        if (format === 'BIBLATEX') {
          setOutput(cite.format('bibtex').trim());
          return;
        }

        if (!stylesLoaded) {
          setOutput('// Loading styles…');
          return;
        }

        // Use the REGISTERED template name here:
        const templateName =
          format === 'APA_6TH'
            ? 'apa-6th-edition'
            : format === 'HARVARD'
              ? 'harvard-cite-them-right'
              : 'vancouver';

        const formatted = cite.format('bibliography', {
          format: 'text', // or 'html'
          template: templateName, // <-- name, not XML
          lang,
        });

        const out = Array.isArray(formatted)
          ? formatted.join('\n')
          : (formatted as string);
        setOutput(out.trim());
      } catch (e: any) {
        setOutput(`// Failed to format citation: ${e?.message ?? e}`);
      }
    })();
  }, [cslJson, stylesLoaded, format, lang]);

  const options = useMemo(
    () => [
      { key: 'APA_6TH' as const, label: 'APA 6th' },
      { key: 'HARVARD' as const, label: 'Harvard (Cite Them Right)' },
      { key: 'VANCOUVER' as const, label: 'Vancouver' },
      { key: 'JSON_CSL' as const, label: 'JSON-CSL' },
      { key: 'BIBLATEX' as const, label: 'BibLaTeX' },
    ],
    []
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1200);
    } catch {
      setCopyOk(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
        <div className="flex justify-center items-center p-8">
          <Image
            src={loaderGif}
            alt="Loading...."
            width={64}
            height={64}
            className="w-16 h-16"
          />
        </div>
      </div>
    );
  }

  if (err) {
    return <div className="hidden"></div>;
  }

  return (
    <div className="w-full space-y-3 pt-5">
      <div className="flex flex-col items-start gap-6 self-stretch rounded-[12px] bg-[#EEF5F8] p-6">
        <div className="whitespace-pre-wrap">{output || '// No output'}</div>

        <div className="w-full flex justify-end">
          {!stylesLoaded &&
            (format === 'APA_6TH' ||
              format === 'HARVARD' ||
              format === 'VANCOUVER') && (
              <div className="flex justify-center items-center p-8">
                <Image
                  src={loaderGif}
                  alt="Loading...."
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
            )}

          <select
            id="fmt"
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatKey)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
          >
            {options.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copyOk ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
