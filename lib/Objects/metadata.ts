// lib/Metadata.ts
export type AnyObj = Record<string, any>;

function addExternalURLIfNeeded<T extends AnyObj>(v: T): T {
  // PHP: if (isset($v['property'])) { $this->addExternalURL($v); }
  // You can augment here if needed (e.g., build a clickable URL from `property`).
  return v;
}

export class Metadata {
  private data: Record<string, any>;
  private mainId: string;
  private mainLang: string;
  private properties: Record<string, any> = {};

  constructor(data: AnyObj, language: string) {
    this.data = data.data;
    this.mainId = this.data.id;
    this.mainLang = language;
    //iterate data into properties
    this.#transformProperties();
  }

  #transformProperties() {
    for (const [prop, v] of Object.entries(this.data)) {
      if (!v || Array.isArray(v) || typeof v !== 'object') continue;
      const propvals = Object.values(v) as AnyObj[];
      for (const bucket of propvals) {
        if (!bucket || typeof bucket !== 'object') continue;

        // 1️⃣ Try preferred language
        let chosen = bucket[this.mainLang];

        // 2️⃣ If missing, get the first language bucket
        if (!chosen) {
          const firstAvailable = Object.values(bucket)[0];
          chosen = firstAvailable;
        }

        if (!chosen) continue;

        // 3️⃣ Now handle array vs. single object
        const store = (val: any) => {
          if (Array.isArray(val)) {
            this.properties[prop] = val.map(addExternalURLIfNeeded);
          } else if (val && typeof val === 'object') {
            const item = addExternalURLIfNeeded(val);
            if (item?.type === 'REL') {
              if (!Array.isArray(this.properties[prop]))
                this.properties[prop] = [];
              this.properties[prop].push(item);
            } else {
              this.properties[prop] = item;
            }
          }
        };

        store(chosen);
      }
    }
  }

  getId(): string {
    return this.data.id;
  }

  getTitle(): string | null {
    const titleNode = this.properties['acdh:hasTitle'];

    const value = titleNode?.[0]?.value;
    if (value) return value;

    return 'Untitled';
  }

  getDataByProperty(property: string): any[] {
    const propData = this.properties?.[property];
    if (!propData) return [];

    // Get the "first" element (similar to PHP reset())
    const firstKey = Object.keys(propData)[0];
    const first = propData[firstKey];

    // If there's a value for the current language
    if (propData[this.language]) {
      return propData[this.language];
    }
    // Else, if there's a value for 'und'
    else if (propData['und']) {
      return propData['und'];
    }
    // Else, if the keys are integers, return the whole array
    else if (typeof firstKey === 'string' && !isNaN(Number(firstKey))) {
      return propData;
    }
    // Else, return the first element wrapped in an array
    else if (first !== undefined) {
      return Array.isArray(first) ? first : [first];
    }

    return [];
  }

  getAcdhType(): string | null {
    return this.properties['rdf:type']?.[0]?.value || '';
  }

  getAcdhTypeNiceFormat(): string | null {
    const full = this.getAcdhType();
    return full.replace('https://vocabs.acdh.oeaw.ac.at/schema#', '') || full;
  }

  getShortDescription(): string {
    return (
      this.properties['acdh:hasDescription']?.[0]?.value?.slice(0, 100) ||
      'No description'
    );
  }

  getAvailableDate(): string | null {
    const dateString =
      this.properties['acdh:hasAvailableDate']?.[0]?.value || '';
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
    const identifiers = this.properties['acdh:hasIdentifier'];
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

  #fetchCardsData(props: Record<string, string>) {
    const result: Record<string, any[]> = {};

    for (const [k, v] of Object.entries(props)) {
      let bucket = this.properties?.[k];

      if (!bucket) continue;

      // Normalize to array
      if (!Array.isArray(bucket)) {
        bucket = [bucket];
      }
      for (const val of bucket) {
        if (
          val &&
          typeof val === 'object' &&
          'value' in val &&
          val.value != null
        ) {
          (result[v] ||= []).push(val);
        }
      }
    }
    return result;
  }

  getSizeData() {
    const props: Record<string, string> = {
      'acdh:hasExtent': 'Extent',
      'acdh:hasNumberOfItems': 'Number Of Items',
      'acdh:hasBinarySize': 'Binary Size',
    };
    return this.#fetchCardsData(props);
  }

  getPlaceAddress() {
    const props: Record<string, string> = {
      'acdh:hasAddressLine1': 'Address Line 1',
      'acdh:hasAddressLine2 ': 'Address Line 2',
      'acdh:hasPostcode': 'Postcode',
      'acdh:hasCity': 'City',
      'acdh:hasRegion': 'Region',
      'acdh:hasCountry': 'Country',
    };
    return this.#fetchCardsData(props);
  }

  getTechnicalData() {
    let props: Record<string, string> = {};
    const lower = this.getAcdhType()?.toLowerCase();
    if (lower === 'topcollection' || lower === 'collection') {
      props = {
        'acdh:hasLifeCycleStatus': 'Life Cycle Status',
        'acdh:hasExtent': 'Extent',
        'acdh:hasNumberOfItems': 'Number Of Items',
        'acdh:hasBinarySize': 'Binary Size',
      };
    }

    if (lower === 'metadata' || lower === 'resource') {
      props = {
        'acdh:hasCategory': 'Category',
        'acdh:hasFormat': 'File format',
        'acdh:hasBinarySize': 'File Size',
        'acdh:hasExtent': 'Extent',
      };
    }

    return this.#fetchCardsData(props);
  }

  getFundingData() {
    let props: Record<string, string> = {
      'acdh:hasFunder': 'Funder',
    };

    const lower = this.getAcdhType()?.toLowerCase();

    if (lower === 'topcollection' || lower === 'project') {
      props = {
        'acdh:hasFunder': 'Funder',
        'acdh:hasNonLinkedIdentifier': 'Project number',
      };
    }
    return this.#fetchCardsData(props);
  }

  getLicenseData() {
    const props: Record<string, string> = {
      'acdh:hasLicense': 'Licence',
      'acdh:hasLicenseSummary': 'Licence Summary',
      'acdh:hasAccessRestriction': 'Access Restriction',
      'acdh:hasAccessRestrictionSummary': 'Access Restriction Summary',
      'acdh:hasRightsInformation': 'Rights Information',
      'acdh:hasLicensor': 'Licensor',
      'acdh:hasOwner': 'Owner',
    };
    return this.#fetchCardsData(props);
  }

  getCreditsData() {
    const props: Record<string, string> = {
      'acdh:hasPrincipalInvestigator': 'Principal Investigator',
      'acdh:hasContact': 'Contact',
      'acdh:hasEditor': 'Editor',
      'acdh:hasAuthor': 'Author',
      'acdh:hasCreator': 'Creator',
      'acdh:hasContributor': 'In collaboration with',
      'acdh:hasDigitisingAgent': 'Digitised by',
    };

    return this.#fetchCardsData(props);
  }

  getExpertTableData(): Record<string, any> {
    return this.properties;
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
