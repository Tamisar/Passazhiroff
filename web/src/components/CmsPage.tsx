import type { Page } from "@/lib/content";
import { BlockRenderer } from "./BlockRenderer";

export function CmsPage({ page }: { page: Page }) {
  return (
    <>
      <h1 className="text-3xl font-bold">{page.title}</h1>
      <div className="mt-8">
        <BlockRenderer blocks={page.blocks} />
      </div>
    </>
  );
}
