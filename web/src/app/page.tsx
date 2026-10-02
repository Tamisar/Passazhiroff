import { notFound } from "next/navigation";
import { CmsPage } from "@/components/CmsPage";
import { getPage } from "@/lib/content";

export default async function Home() {
  const page = await getPage("home");
  if (!page) notFound();

  return <CmsPage page={page} />;
}
