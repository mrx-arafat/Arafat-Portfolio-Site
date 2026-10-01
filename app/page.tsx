import type { Metadata } from "next";
import type { ReactElement } from "react";

import { CLIENT_PROJECTS } from "@/components/client-work/content";
import {
  CaseStudiesPanel,
  LatestPostsPanel,
} from "@/components/dashboard/home-links";
import { JsonLd } from "@/components/seo/json-ld";
import cveData from "@/data/cve.json";
import { getAllPosts, type Post } from "@/lib/blog";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  isoDateTime,
  ogImageUrl,
  pageMetadata,
} from "@/lib/seo";

import HomeShell from "./components/HomeShell";

/**
 * Static route with hourly ISR: no request-time data (searchParams, cookies,
 * headers) is read here, so the page prerenders and is served from the edge
 * cache; the hourly refresh only picks up newly published posts.
 * The `?boot=1` query is handled client-side in HomeShell.
 */
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Easin Arafat - Application Security Engineer | Startise",
  description: `Easin Arafat is an Application Security Engineer at Startise, working on the xCloud hosting platform, and a security researcher with ${cveData.items.length} disclosed CVEs.`,
  path: "/",
  // The card reads as `$ whoami` -> name, so it keeps the short name as its
  // title instead of the full page title.
  ogImage: ogImageUrl({
    title: SITE_NAME,
    meta: "Application Security Engineer",
    path: "home",
    prompt: "whoami",
    category: "portfolio",
  }),
});

/** Home is the profile page for the sitewide Person node. Bump dateModified when the profile content changes. */
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: absoluteUrl("/"),
  name: "Easin Arafat - Application Security Engineer",
  dateCreated: isoDateTime("2025-04-08"),
  dateModified: isoDateTime("2026-10-01"),
  mainEntity: { "@id": `${SITE_URL}/#person` },
};

/** Published posts for the dashboard links; a failed fetch must not take the home page down. */
async function loadPosts(): Promise<Post[]> {
  try {
    return await getAllPosts();
  } catch (error) {
    console.error("Home: blog posts unavailable, rendering without them", error);
    return [];
  }
}

export default async function Home(): Promise<ReactElement> {
  const posts = await loadPosts();

  return (
    <>
      <JsonLd data={profilePageSchema} />
      {/* Pre-hydration: hide the boot overlay if this tab already booted or
          the URL carries ?boot=1, so reloads don't flash the intro
          (state catches up in HomeShell). */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{if(new URLSearchParams(location.search).get("boot")==="1"||sessionStorage.getItem("arafat-booted")==="1")document.documentElement.setAttribute("data-booted","")}catch(e){}',
        }}
      />
      <HomeShell
        caseStudies={<CaseStudiesPanel projects={CLIENT_PROJECTS} />}
        latestPosts={<LatestPostsPanel posts={posts} />}
      />
    </>
  );
}
