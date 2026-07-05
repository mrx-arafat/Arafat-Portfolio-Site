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
    <main className="min-h-screen bg-surface-base text-terminal-green p-4 md:p-8 grid-dots">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader path="~/docs/blog-api" command="man blog-publish" />

        <div className="flex items-center mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-terminal-green hover:text-terminal-green/80 bg-surface-raised px-3 py-2 rounded-md border border-terminal-green/20 hover:border-terminal-green/40 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">cd ../blog</span>
          </Link>
        </div>

        <article className="bg-surface-raised rounded-2xl border border-terminal-green/20 p-6 md:p-10">
          <div className="blog-prose">
            <MdxContent source={doc} />
          </div>
        </article>
      </div>
    </main>
  );
}
