import Markdown from "react-markdown";
import type { Block } from "@/lib/content";
import { CmsImage } from "./CmsImage";

export function BlockRenderer({ blocks }: { blocks: Block[] | undefined }) {
  if (!blocks?.length) return null;

  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block) => {
        const key = block.id;
        switch (block.type) {
          case "rich-text":
            return (
              <div key={key} className="prose dark:prose-invert max-w-none">
                <Markdown>{block.body ?? ""}</Markdown>
              </div>
            );
          case "quote":
            return (
              <blockquote key={key} className="border-l-4 border-foreground/30 pl-4 italic">
                <p>{block.body}</p>
                {block.title && <footer className="mt-2 text-sm not-italic opacity-70">— {block.title}</footer>}
              </blockquote>
            );
          case "media":
            return <CmsImage key={key} media={block.file} className="w-full rounded-lg" />;
          case "slider":
            return (
              <div key={key} className="flex snap-x gap-4 overflow-x-auto">
                {block.files.map((file) => (
                  <CmsImage
                    key={file.url}
                    media={file}
                    sizes="80vw"
                    className="w-4/5 shrink-0 snap-center rounded-lg"
                  />
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
