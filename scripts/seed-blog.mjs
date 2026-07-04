/**
 * One-time import of content/ MDX files into the Supabase posts table.
 * Also reusable to import any hand-written MDX file later.
 *
 * Usage: node scripts/seed-blog.mjs
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

// Minimal .env.local loader (no dotenv dep)
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;
const rows = [];

// Essays: content/blog/<category>/<folder>/index.mdx
const blogRoot = path.join(process.cwd(), "content", "blog");
if (fs.existsSync(blogRoot)) {
  for (const category of fs.readdirSync(blogRoot)) {
    const catDir = path.join(blogRoot, category);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const folder of fs.readdirSync(catDir)) {
      const file = path.join(catDir, folder, "index.mdx");
      if (!fs.existsSync(file)) continue;
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      rows.push({
        type: "essay",
        category,
        slug: folder.replace(DATE_PREFIX, ""),
        title: data.title,
        description: data.description ?? "",
        content_md: content.trim(),
        tags: data.tags ?? [],
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
        draft: data.draft === true,
      });
    }
  }
}

// Notes: content/notes/YYYY/MM/*.mdx
const notesRoot = path.join(process.cwd(), "content", "notes");
if (fs.existsSync(notesRoot)) {
  for (const year of fs.readdirSync(notesRoot)) {
    for (const month of fs.readdirSync(path.join(notesRoot, year))) {
      const monthDir = path.join(notesRoot, year, month);
      for (const file of fs.readdirSync(monthDir)) {
        if (!file.endsWith(".mdx")) continue;
        const { data, content } = matter(fs.readFileSync(path.join(monthDir, file), "utf8"));
        rows.push({
          type: "note",
          category: null,
          slug: file.replace(/\.mdx$/, "").replace(DATE_PREFIX, ""),
          title: data.title,
          description: data.description ?? "",
          content_md: content.trim(),
          tags: data.tags ?? [],
          date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
          draft: data.draft === true,
        });
      }
    }
  }
}

if (rows.length === 0) {
  console.log("Nothing to import — content/ is empty.");
  process.exit(0);
}

const { error } = await supabase
  .from("posts")
  .upsert(rows, { onConflict: "type,slug" });
if (error) {
  console.error("Import failed:", error.message);
  process.exit(1);
}
console.log(`Imported ${rows.length} post(s):`);
for (const r of rows) console.log(`  [${r.type}] ${r.category ?? "-"}/${r.slug} (draft: ${r.draft})`);
