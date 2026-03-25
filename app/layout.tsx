import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { MusicProvider } from "@/components/music-provider";
import StructuredData from "./components/StructuredData";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://profile.arafatops.com"),
  title: {
    default:
      "Easin Arafat | Application Security Engineer @ Startise | Cybersecurity Expert",
    template: "%s | Easin Arafat",
  },
  description:
    "Easin Arafat is an Application Security Engineer at Startise. MIST graduate and Former President of MIST Cyber Security Club. Cybersecurity expert in Bangladesh specializing in application security, penetration testing, web development, and DevSecOps.",
  keywords:
    "Easin Arafat, Arafat, easin arafat, Application Security Engineer, Cybersecurity, Web Developer, Entrepreneur, Startise, xCloud, Security Expert, Bangladesh, MIST, MIST Cyber Security Club, Cyber Security Bangladesh, Easin Arafat MIST, Application Security Engineer Bangladesh, Cybersecurity Expert Bangladesh, Penetration Testing, DevSecOps, Secure Coding, arafatops",
  authors: [{ name: "Easin Arafat", url: "https://profile.arafatops.com" }],
  creator: "Easin Arafat",
  publisher: "Easin Arafat",
  alternates: {
    canonical: "https://profile.arafatops.com",
  },
  openGraph: {
    title:
      "Easin Arafat | Application Security Engineer @ Startise | Cybersecurity Expert",
    description:
      "Easin Arafat is an Application Security Engineer at Startise. MIST graduate and Former President of MIST Cyber Security Club. Cybersecurity expert in Bangladesh specializing in application security, penetration testing, web development, and DevSecOps.",
    url: "https://profile.arafatops.com",
    siteName: "Easin Arafat - Portfolio",
    images: [
      {
        url: "/images/profile.webp",
        width: 800,
        height: 600,
        alt: "Easin Arafat - Application Security Engineer at Startise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Easin Arafat | Application Security Engineer @ Startise | Cybersecurity Expert",
    description:
      "Easin Arafat is an Application Security Engineer at Startise. MIST graduate and Former President of MIST Cyber Security Club. Cybersecurity expert in Bangladesh.",
    images: ["/images/profile.webp"],
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
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <StructuredData />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MusicProvider>{children}</MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
