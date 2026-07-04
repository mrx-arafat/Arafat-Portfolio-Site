import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MdxContent } from "@/components/mdx-content";
import { TerminalHeader } from "@/components/blog/terminal-header";

export const metadata: Metadata = {
  title: "Blog Publish API",
  description:
    "API reference for publishing posts to arafatops.com — endpoints, auth, fields, and examples.",
  alternates: { canonical: "https://www.arafatops.com/docs/blog-api" },
};

export default function BlogApiDocsPage() {
  // Single source of truth: the repo markdown doc, read at build time
  const doc = fs.readFileSync(
    path.join(process.cwd(), "docs", "api", "blog-publish.md"),
    "utf8"
  );

  return (
    <main className="min-h-screen bg-[#121212] text-[#2ed573] p-4 md:p-8 grid-dots">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader path="~/docs/blog-api" command="man blog-publish" />

        <div className="flex items-center mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 bg-[#0f0f0f] px-3 py-2 rounded-md border border-[#2ed573]/20 hover:border-[#2ed573]/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ../blog</span>
          </Link>
        </div>

        <article className="bg-[#0f0f0f] rounded-2xl border border-[#2ed573]/20 p-6 md:p-10">
          <div className="blog-prose">
            <MdxContent source={doc} />
          </div>
        </article>
      </div>
    </main>
  );
}
