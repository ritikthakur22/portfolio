import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Curtain } from "@/components/motion/curtain";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["500", "700", "800"] });
const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
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
        </Providers>
      </body>
    </html>
  );
}
