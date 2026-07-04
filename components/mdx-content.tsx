import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { ComponentPropsWithoutRef } from "react";

interface MdxContentProps {
  /** Raw MDX source (frontmatter already stripped). */
  source: string;
  /** URL prefix for resolving relative image refs, e.g. /blog-assets/security/2026-07-05-slug */
  assetBase?: string;
}

function resolveSrc(src: string | undefined, assetBase?: string): string {
  if (!src) return "";
  if (!assetBase || /^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `${assetBase}/${src.replace(/^\.\//, "")}`;
}

/** Server component rendering post MDX with the site's terminal styling. */
export function MdxContent({ source, assetBase }: MdxContentProps) {
  const components = {
    img: (props: ComponentPropsWithoutRef<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={resolveSrc(typeof props.src === "string" ? props.src : undefined, assetBase)}
        alt={props.alt ?? ""}
        loading="lazy"
        decoding="async"
        className="rounded-xl border border-[#2ed573]/20 my-6 max-w-full"
      />
    ),
  };

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [
              rehypePrettyCode,
              { theme: "vitesse-black", keepBackground: false },
            ],
          ],
        },
      }}
    />
  );
}
