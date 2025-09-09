export type PagerItem = {
  totalCount: number;
  maxCount: number;
  page: number;
  messages?: string;
  pageSize: number;
  searchIn?: string;
  allPins?: string[];
};

export type ResultItem = {
  id: number | string;
  url: string; // used by thumbnails api
  title?: Record<string, string>;
  description?: Record<string, string>;
  accessRestrictionSummary?: Record<string, string>;
  class?: string[];
};
