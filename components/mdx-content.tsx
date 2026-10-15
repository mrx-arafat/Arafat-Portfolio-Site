import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";
import { rehypeSingleH1 } from "@/components/blog/rehype-single-h1";

const SCROLL_REGION_FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terminal-amber";

interface MdxContentProps {
  /** Raw MDX source (frontmatter already stripped). */
  source: string;
  /** URL prefix for resolving relative image refs, e.g. /blog-assets/security/2026-07-05-slug */
  assetBase?: string;
  /**
   * Title the surrounding page already renders as its heading. When set, the
   * body never emits an `h1`: a leading heading repeating the title is dropped
   * and any other `# heading` renders as an `h2`.
   */
  title?: string;
  /** Optional syntax palette; paired themes emit CSS variables for the reading surface. */
  codeTheme?: PrettyCodeOptions["theme"];
}

function resolveSrc(src: string | undefined, assetBase?: string): string {
  if (!src) return "";
  if (!assetBase || /^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `${assetBase}/${src.replace(/^\.\//, "")}`;
}

function hasText(children: ReactNode): boolean {
  return Children.toArray(children).some((child) =>
    (typeof child === "string" && child.trim().length > 0) ||
    typeof child === "number" ||
    (isValidElement<{ children?: ReactNode }>(child) && hasText(child.props.children))
  );
}

/** Server component rendering post MDX with the site's terminal styling. */
export function MdxContent({ source, assetBase, title, codeTheme = "vitesse-black" }: MdxContentProps): ReactElement {
  const components = {
    img: (props: ComponentPropsWithoutRef<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={resolveSrc(typeof props.src === "string" ? props.src : undefined, assetBase)}
        alt={props.alt ?? ""}
        loading="lazy"
        decoding="async"
        className="rounded-xl border border-terminal-green/20 my-6 max-w-full"
      />
    ),
    // Wide tables scroll inside this box instead of widening the page on mobile.
    table: (props: ComponentPropsWithoutRef<"table">) => (
      <div className={`blog-table-scroll ${SCROLL_REGION_FOCUS}`} tabIndex={0} role="group" aria-label="Scrollable table">
        <table {...props} />
      </div>
    ),
    pre: (props: ComponentPropsWithoutRef<"pre">) => (
      <pre
        {...props}
        tabIndex={0}
        role="group"
        aria-label="Scrollable code"
        className={`${props.className ?? ""} ${SCROLL_REGION_FOCUS}`.trim()}
      />
    ),
    th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
      <th {...props}>
        {children}
        {!hasText(children) && <span className="sr-only">Row label</span>}
      </th>
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
            // Before rehype-slug so demoted headings still get ids and links.
            [rehypeSingleH1, { title }],
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [
              rehypePrettyCode,
              { theme: codeTheme, keepBackground: false },
            ],
          ],
        },
      }}
    />
  );
}
