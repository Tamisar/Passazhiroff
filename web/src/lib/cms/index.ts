import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { createStrapiProvider } from './providers/strapi';
import type { Query } from './types';

export type { CmsProvider, Query } from './types';

const provider = createStrapiProvider({
  url: process.env.CMS_URL ?? 'http://localhost:1337',
  token: process.env.CMS_API_TOKEN,
});

export const CMS_TAG = 'cms';

export async function list(type: string, query?: Query) {
  'use cache';
  cacheLife('hours');
  cacheTag(CMS_TAG);
  return provider.list(type, query);
}

export async function get(type: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(CMS_TAG);
  return provider.get(type);
}
