import { z } from 'zod';

export const Media = z.object({
  url: z.string(),
  alt: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  mime: z.string(),
});

export const Block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('rich-text'), id: z.string(), body: z.string().nullable() }),
  z.object({ type: z.literal('quote'), id: z.string(), title: z.string().nullable(), body: z.string().nullable() }),
  z.object({ type: z.literal('media'), id: z.string(), file: Media.nullable() }),
  z.object({ type: z.literal('slider'), id: z.string(), files: z.array(Media) }),
]);

export const Global = z.object({ siteName: z.string(), siteDescription: z.string() });

export const Page = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  menuOrder: z.number().nullable(),
  blocks: z.array(Block),
});

export type Media = z.infer<typeof Media>;
export type Block = z.infer<typeof Block>;
export type Global = z.infer<typeof Global>;
export type Page = z.infer<typeof Page>;
