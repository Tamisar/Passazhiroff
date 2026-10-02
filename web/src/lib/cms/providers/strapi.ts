import 'server-only';
import { strapi } from '@strapi/client';
import type { CmsProvider, Query } from '../types';

export function createStrapiProvider({ url, token }: { url: string; token?: string }): CmsProvider {
  const client = strapi({ baseURL: `${url}/api`, auth: token || undefined });

  return {
    async list(type, query = {}) {
      const { data } = await client.collection(type).find({
        filters: toStrapiFilters(query.filters),
        sort: query.sort,
      });
      return data.map((item) => normalize(item, url));
    },

    async get(type) {
      const { data } = await client.single(type).find();
      return normalize(data, url);
    },
  };
}

function toStrapiFilters(filters: Query['filters'] = {}) {
  return Object.fromEntries(Object.entries(filters).map(([field, value]) => [field, { $eq: value }]));
}

function normalize(value: unknown, baseUrl: string): unknown {
  if (Array.isArray(value)) return value.map((item) => normalize(item, baseUrl));
  if (value === null || typeof value !== 'object') return value;

  const object = value as Record<string, unknown>;
  if ('mime' in object) return toMedia(object, baseUrl);

  const { documentId, __component, id, ...fields } = object;
  const result: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(fields)) result[key] = normalize(field, baseUrl);

  if (typeof __component === 'string') {
    const type = __component.split('.').pop()!;
    result.type = type;
    result.id = `${type}-${id}`;
  } else {
    result.id = String(documentId ?? id);
  }
  return result;
}

function toMedia(file: Record<string, unknown>, baseUrl: string) {
  const url = String(file.url);
  return {
    url: url.startsWith('/') ? baseUrl + url : url,
    alt: (file.alternativeText as string | null) ?? null,
    width: (file.width as number | null) ?? null,
    height: (file.height as number | null) ?? null,
    mime: String(file.mime),
  };
}
