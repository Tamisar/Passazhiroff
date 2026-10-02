import Image from "next/image";
import type { Media } from "@/lib/content";

type Props = {
  media: Media | null | undefined;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

export function CmsImage({ media, className, sizes = "100vw", preload }: Props) {
  if (!media || !media.mime.startsWith("image/")) return null;

  return (
    <Image
      src={media.url}
      alt={media.alt ?? ""}
      width={media.width ?? 1200}
      height={media.height ?? 800}
      sizes={sizes}
      preload={preload}
      className={className}
    />
  );
}
