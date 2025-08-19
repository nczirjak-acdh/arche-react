// config/public.ts
export const PUBLIC_CONFIG = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE ?? '',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'App',
} as const;
