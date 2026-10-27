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
import { getGithubActivity, getGithubStats } from "@/lib/github-activity";
import {
  PORTRAIT_ID,
  PORTRAIT_PATH,
  SITE_URL,
  absoluteUrl,
  isoDateTime,
  pageMetadata,
} from "@/lib/seo";

import HomeShell from "./components/HomeShell";
import DashboardClient from "./components/DashboardClient";
import { PERSON } from "./components/StructuredData";

/**
 * Static route with ISR: no request-time data (searchParams, cookies,
 * headers) is read here, so the page prerenders and is served from the edge
 * cache. The GitHub activity fetch revalidates every few minutes, which sets
 * the effective refresh; the live card then keeps itself current client-side.
 * The `?boot=1` query is handled client-side in HomeShell.
 */
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Easin Arafat - Application Security Engineer | Startise",
  description: `Easin Arafat is an Application Security Engineer at Startise, working on the xCloud hosting platform, and a security researcher with ${cveData.items.length} disclosed CVEs.`,
  path: "/",
  ogImage: PORTRAIT_PATH,
});

/** Home is the profile page for the sitewide Person node. Bump dateModified when the profile content changes. */
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: absoluteUrl("/"),
  name: "Easin Arafat - Application Security Engineer",
  dateCreated: isoDateTime("2025-04-08"),
  dateModified: isoDateTime("2026-10-27"),
  mainEntity: PERSON,
  primaryImageOfPage: { "@id": PORTRAIT_ID },
  isPartOf: { "@id": `${SITE_URL}/#website` },
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
  const [posts, activity, stats] = await Promise.all([loadPosts(), getGithubActivity(), getGithubStats()]);
  const recentPosts = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map(post => ({ title: post.title, href: `/blogs/${post.category}/${post.slug}`, date: post.date }));

  return (
    <>
      <JsonLd data={profilePageSchema} />
      {/* Preserve the session/query skip decision before the native boot dialog mounts. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{if(new URLSearchParams(location.search).get("boot")==="1"||sessionStorage.getItem("arafat-booted")==="1")document.documentElement.setAttribute("data-booted","")}catch(e){}',
        }}
      />
      <HomeShell>
        <DashboardClient
          caseStudies={<CaseStudiesPanel projects={CLIENT_PROJECTS} />}
          latestPosts={<LatestPostsPanel posts={posts} />}
          recentPosts={recentPosts}
          activity={activity}
          stats={stats}
        />
      </HomeShell>
    </>
  );
}
