import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CmsPage } from "@/components/CmsPage";
import { getPage, getPages } from "@/lib/content";

export async function generateStaticParams() {
  const pages = (await getPages()).filter((page) => page.slug !== "home");
  if (!pages.length) return [{ slug: "__placeholder__" }];
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getPage(slug);
  return page ? { title: page.title } : {};
}

export default function Page(props: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<p className="opacity-60">Loading…</p>}>
      <PageContent params={props.params} />
    </Suspense>
  );
}

async function PageContent({ params }: Pick<PageProps<"/[slug]">, "params">) {
  const { slug } = await params;

  const page = await getPage(slug);
  if (!page) notFound();

  return <CmsPage page={page} />;
}
