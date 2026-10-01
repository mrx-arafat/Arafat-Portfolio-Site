/** The subset of a hast node this plugin reads and rewrites. */
export interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const HEADING_TAG = /^h[1-6]$/;
/** `.blog-prose h1` size, kept so a demoted heading still outranks real h2 sections. */
const DEMOTED_STYLE = "font-size:1.75rem";

function textOf(node: HastNode): string {
  return node.value ?? (node.children ?? []).map(textOf).join("");
}

/** Compare headings by their letters and digits only, so punctuation and quote style do not matter. */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function demoteH1(node: HastNode): void {
  if (node.type === "element" && node.tagName === "h1") {
    node.tagName = "h2";
    node.properties = { ...node.properties, style: DEMOTED_STYLE };
  }
  node.children?.forEach(demoteH1);
}

/**
 * Rehype plugin for bodies rendered under a page that already shows `title`
 * as its H1: drops a leading heading that only repeats that title and turns
 * every remaining body `h1` into an `h2`, so the page keeps exactly one H1.
 * Without a `title` the body owns the page heading and is left untouched.
 * Run it before rehype-slug so the demoted headings still get ids and links.
 */
export function rehypeSingleH1({
  title,
}: {
  title?: string;
}): (tree: HastNode) => void {
  return (tree) => {
    if (!title) return;
    const children = tree.children ?? [];
    const first = children.findIndex(
      (node) => !(node.type === "text" && !node.value?.trim())
    );
    const lead = children[first];
    if (
      lead?.type === "element" &&
      HEADING_TAG.test(lead.tagName ?? "") &&
      normalize(textOf(lead)) === normalize(title)
    ) {
      children.splice(first, 1);
    }
    demoteH1(tree);
  };
}
