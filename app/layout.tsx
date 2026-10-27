import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { MusicProvider } from "@/components/music-provider";
import StructuredData from "./components/StructuredData";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PROFILE_URLS, SITE_NAME, SITE_URL } from "@/lib/seo";
import { MotionProvider } from "@/components/open-circuit/motion-provider";
import { BOOT_FIRST_PAINT_CSS, BOOT_SESSION_SCRIPT } from "./components/boot-session";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const SITE_TITLE = "Easin Arafat - Application Security Engineer | Startise";
const SITE_DESCRIPTION =
  "Easin Arafat is an Application Security Engineer at Startise working on the xCloud hosting platform, and a Patchstack security researcher from Bangladesh.";
const SITE_OG_IMAGE =
  "/api/og?title=Easin%20Arafat&meta=Application%20Security%20Engineer&path=home&prompt=whoami&category=portfolio";

/**
 * Sitewide defaults only. Anything URL-specific (canonical, og:url) is left to
 * each route: metadata is inherited, so a canonical set here would make every
 * page without its own claim to be the home page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Easin Arafat",
    "n0_arafat_n0",
    "Application Security Engineer",
    "security researcher",
    "Startise",
    "xCloud",
    "Patchstack",
    "WordPress security",
    "MIST Cyber Security Club",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/blogs/rss.xml", title: "Easin Arafat - Blog RSS" },
      ],
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Easin Arafat - Application Security Engineer at Startise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@easinxarafat",
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "pYAZYagCwPSH8cy4oTyuuj3h9P_Gh2ttJzwjc2WZBH0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={`oc-enhanced ${inter.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: BOOT_FIRST_PAINT_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SESSION_SCRIPT }} />
        <link rel="icon" href="/favicon.png" />
        {PROFILE_URLS.map((url) => <link rel="me" href={url} key={url} />)}
        <StructuredData />
        <script dangerouslySetInnerHTML={{ __html: 'try{document.documentElement.dataset.motion=localStorage.getItem("open-circuit-motion")==="off"||matchMedia("(prefers-reduced-motion: reduce)").matches?"off":"on"}catch(e){document.documentElement.dataset.motion=matchMedia("(prefers-reduced-motion: reduce)").matches?"off":"on"}' }} />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
          <MusicProvider>
            <a className="oc-skip" href="#main-content">Skip to content</a>
            <SiteNav />
            <div id="main-content" tabIndex={-1}>{children}</div>
            <SiteFooter />
          </MusicProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
