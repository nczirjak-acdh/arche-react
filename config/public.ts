// config/public.ts
export const PUBLIC_CONFIG = {
  apiBase: process.env.NEXT_PUBLIC_BASE_BROWSER_API ?? '',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'App',
} as const;
