import 'server-only';
import { z } from 'zod';
import { get, list } from '@/lib/cms';
import { Global, Page } from './schemas';

export type { Block, Global, Media, Page } from './schemas';

export const getGlobal = async () => Global.parse(await get('global'));

export const getPages = async () => z.array(Page).parse(await list('pages'));

export const getPage = async (slug: string) =>
  Page.optional().parse((await list('pages', { filters: { slug } }))[0]);

export const getMenu = async () =>
  (await getPages())
    .filter((page) => page.menuOrder !== null)
    .sort((a, b) => a.menuOrder! - b.menuOrder!);
