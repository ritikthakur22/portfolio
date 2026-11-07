import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { Curtain } from "@/components/motion/curtain";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import { PaletteLoader } from "@/components/ui/palette-loader";
import { ResumeDialog } from "@/components/ui/resume-dialog";
import { profile } from "@/content/profile";
import { jsonLdScript, personJsonLd, SITE_TITLE, SITE_URL, TAB_TITLE } from "@/lib/seo";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700", "800"] });
const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TAB_TITLE, template: `%s | ${TAB_TITLE}` },
  description: profile.summary,
  applicationName: "Ritik Thakur",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: ["Ritik Thakur", "software developer", "React developer", "React Native", "Next.js", "Android developer", "Nepal", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: SITE_URL, siteName: "Ritik Thakur", title: SITE_TITLE, description: profile.summary, locale: "en_US" },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: profile.summary },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0e" },
    { media: "(prefers-color-scheme: light)", color: "#f6f6f2" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd())} />
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <SmoothScroll />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Curtain />
          <ChatLauncher />
          <PaletteLoader />
          <ResumeDialog />
        </Providers>
      </body>
    </html>
  );
}
