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
