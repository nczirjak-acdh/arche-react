// lib/helpers.ts
export function getDataByProperty(
  properties: Record<string, any>,
  language: string,
  property: string
) {
  const propData = properties?.[property];
  if (!propData) return [];
  const keys = Object.keys(propData);
  const firstKey = keys[0];
  const first = firstKey !== undefined ? propData[firstKey] : undefined;

  if (propData[language]) return propData[language];
  if (propData.und) return propData.und;
  if (firstKey !== undefined && !Number.isNaN(Number(firstKey)))
    return propData;
  if (first !== undefined) return Array.isArray(first) ? first : [first];
  return [];
}

export function humanLang<T extends Record<string, string> | undefined>(
  obj: T,
  lang = 'en'
) {
  if (!obj) return '';
  return obj[lang] ?? obj.en ?? Object.values(obj)[0] ?? '';
}

export function titleId(label: unknown): string {
  const s = (label ?? '').toString();
  return s
    .normalize('NFD') // split accents
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^\w\s-]/g, '') // drop non word/space/hyphen
    .trim()
    .replace(/\s+/g, '_') // spaces -> underscores
    .toLowerCase();
}

export const toNumber = (v: string | null, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
