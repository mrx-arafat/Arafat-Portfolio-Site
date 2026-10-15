import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import { expect, it } from "vitest";
import { MdxContent } from "@/components/mdx-content";

it("should name empty markdown table headers while preserving named headers", async () => {
  const stream = await renderToReadableStream(createElement(MdxContent, {
    source: "| | Named | **Formatted** |\n| --- | --- | --- |\n| Row | Value | Other |\n\n~~~js\nconsole.log(1)\n~~~",
  }));
  const html = await new Response(stream).text();

  expect(html).toContain('<th><span class="sr-only">Row label</span></th>');
  expect(html).toContain("<th>Named</th>");
  expect(html).toContain("<th><strong>Formatted</strong></th>");
  const regions = [...html.matchAll(/<(div|pre)\b(?=[^>]*tabindex="0")(?=[^>]*role="group")(?=[^>]*aria-label="Scrollable (table|code)")[^>]*>/g)];
  expect(regions.map((match) => `${match[1]}:${match[2]}`)).toEqual(["div:table", "pre:code"]);
});
