import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { getGlobal, getMenu } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();
  return {
    title: { default: global.siteName, template: `%s · ${global.siteName}` },
    description: global.siteDescription,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [global, menu] = await Promise.all([getGlobal(), getMenu()]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-foreground/10">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold">
              {global.siteName}
            </Link>
            <div className="flex gap-4">
              {menu.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="text-sm opacity-70 hover:opacity-100">
                  {page.title}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
