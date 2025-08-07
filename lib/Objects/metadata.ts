// lib/Metadata.ts

export interface MetadataRaw {
  id: string;
  title: string;
  [key: string]: any; // allow extra props
}

export class Metadata {
  private data: MetadataRaw;
  private mainId: string;
  private mainLang: string;
  private properties: string[] = [];

  constructor(data: MetadataRaw) {
    this.data = data.data;
    this.mainId = this.data.id;
    this.mainLang = this.data.language;
  }

  getId(): string {
    return this.data.id;
  }

  getTitle(): string | null {
    const titleNode = this.data?.['acdh:hasTitle']?.[this.mainId];

    if (!titleNode) return 'Untitled';

    const langs = ['en', 'de', 'und'];

    for (const lang of langs) {
      const value = titleNode?.[lang]?.[0]?.value;
      if (value) return value;
    }

    return 'Untitled';
  }

  getAcdhType(): string | null {
    return (
      this.data?.['rdf:type']?.[this.mainId]?.[this.mainLang]?.[0]?.value || ''
    );
  }

  getAcdhTypeNiceFormat(): string | null {
    const full = this.getAcdhType();
    return full.replace('https://vocabs.acdh.oeaw.ac.at/schema#', '') || full;
  }

  getShortDescription(): string {
    return (
      this.data?.['rdf:type']?.[this.mainId]?.[
        this.mainLang
      ]?.[0]?.value?.slice(0, 100) || 'No description'
    );
  }

  getAvailableDate(): string | null {
    const dateString =
      this.data?.['acdh:hasAvailableDate']?.[this.mainId]?.[this.mainLang]?.[0]
        ?.value || '';
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return ''; // Invalid date check

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-indexed
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  getPidOrAcdhIdentifier(): string | null {
    const pidValue =
      this.data?.['acdh:hasPid']?.[this.mainId]?.[this.mainLang]?.[0]?.value;
    const hasValidPid =
      pidValue &&
      (pidValue.includes('http://') || pidValue.includes('https://'));

    if (hasValidPid) {
      return pidValue;
    }
    const acdhID = this.getAcdhIdentifier();
    if (acdhID) {
      return acdhID;
    }

    const oneID = this.getOneID();
    if (oneID) {
      return oneID;
    }

    return null;
  }

  getAcdhIdentifier(): string | null {
    const identifiers =
      this.data?.['acdh:hasIdentifier']?.[this.mainId]?.[this.mainLang];
    if (!Array.isArray(identifiers)) return null;

    for (const v of identifiers) {
      const value = v?.value;

      if (
        typeof value === 'string' &&
        value.includes('/id.acdh.oeaw.ac.at/') &&
        !value.includes('/id.acdh.oeaw.ac.at/cmdi/')
      ) {
        return value;
      }
    }

    return null;
  }

  getOneID(): string | null {
    const identifier =
      this.data?.['acdh:hasIdentifier']?.[this.mainId]?.[this.mainLang]?.[0]
        ?.value;

    if (!identifier) return null;

    return identifier;
  }

  getLicenseData(): array {
    const result: Record<string, any[]> = {};

    const props: Record<string, string> = {
      'acdh:hasLicense': 'Licence',
      'acdh:hasLicenseSummary': 'Licence Summary',
      'acdh:hasAccessRestriction': 'Access Restriction',
      'acdh:hasAccessRestrictionSummary': 'Access Restriction Summary',
      'acdh:hasRightsInformation': 'Rights Information',
      'acdh:hasLicensor': 'Licensor',
      'acdh:hasOwner': 'Owner',
    };

    Object.entries(props).forEach(([key, label]) => {
      console.log(`${key} => ${label}`);
      if (
        this.data?.['acdh:hasIdentifier']?.[this.mainId]?.[this.mainLang]?.[0]
          ?.value
      ) {
        return [];
      }
    });

    return [];
  }

  toJSON(): Record<string, any> {
    const result: Record<string, any> = {};

    const proto = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(proto).filter(
      (name) =>
        typeof this[name] === 'function' &&
        name.startsWith('get') &&
        name !== 'get' && // avoid edge case
        name !== 'toJSON'
    );

    for (const name of methodNames) {
      const key = name
        .replace(/^get/, '') // remove "get"
        .replace(/^[A-Z]/, (c) => c.toLowerCase()); // lowercase first letter

      result[key] = this[name]();
    }

    return result;
  }
}
