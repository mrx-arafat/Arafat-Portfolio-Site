import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import StructuredData from "./components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Easin Arafat | Application Security Engineer @ MIST | Cybersecurity Expert",
  description:
    "Easin Arafat is an Application Security Engineer at Startise and a proud member of MIST Cyber Security Club. Leading cybersecurity expert in Bangladesh specializing in application security, web development, and business solutions.",
  keywords:
    "Easin Arafat, Arafat, Application Security Engineer, Cybersecurity, Web Developer, Entrepreneur, Startise, Security Expert, Bangladesh, MIST, MIST Cyber Security Club, Cyber Security Bangladesh, Easin Arafat MIST, Application Security Engineer Bangladesh, Cybersecurity Expert Bangladesh",
  authors: [{ name: "Easin Arafat" }],
  creator: "Easin Arafat",
  openGraph: {
    title:
      "Easin Arafat | Application Security Engineer @ MIST | Cybersecurity Expert",
    description:
      "Easin Arafat is an Application Security Engineer at Startise and a proud member of MIST Cyber Security Club. Leading cybersecurity expert in Bangladesh specializing in application security, web development, and business solutions.",
    url: "http://profile.arafatbytes.live",
    siteName: "Easin Arafat Portfolio",
    images: [
      {
        url: "/images/profile.jpg",
        width: 800,
        height: 600,
        alt: "Easin Arafat - Application Security Engineer & MIST Cyber Security Club Member",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Easin Arafat | Application Security Engineer @ MIST | Cybersecurity Expert",
    description:
      "Easin Arafat is an Application Security Engineer at Startise and a proud member of MIST Cyber Security Club. Leading cybersecurity expert in Bangladesh specializing in application security, web development, and business solutions.",
    images: ["/images/profile.jpg"],
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
    google: "your-google-site-verification-code",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
