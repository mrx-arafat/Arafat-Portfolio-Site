import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { getAllPosts, getCategories, getCategoryInfo } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { postListSchema } from "@/components/blog/json-ld";
import { PostCard } from "@/components/blog/post-card";
import { Chip, CircuitTrace, Keycap, PageHeader, SectionHeading } from "@/components/open-circuit";
import styles from "../reading.module.css";

interface Props {
  params: Promise<{ category: string }>;
}

interface CategoryVoice {
  headline: string;
  intro: string;
}

const CATEGORY_VOICE: Record<string, CategoryVoice> = {
  engineering: {
    headline: "I explain the part that breaks.",
    intro: "System design, performance, DevOps and AI tooling. I put the details in writing. Saves me explaining them twice.",
  },
  security: {
    headline: "I put the flaws on paper.",
    intro: "My security write-ups. Vulnerabilities, exploitability and a few very bad assumptions. I brought details.",
  },
  business: {
    headline: "I have opinions. And numbers.",
    intro: "AI spending, layoffs, the future of work. I read the numbers before I added my opinion. Seems fair.",
  },
  life: {
    headline: "I have life advice. Obviously.",
    intro: "Logic, reasoning and life. I wrote down my thinking. You can borrow it.",
  },
  psychology: {
    headline: "I have thoughts on your thoughts.",
    intro: "Confidence, purpose, influence, power. I wrote the psychology essays. You supply the self-recognition.",
  },
};

export async function generateStaticParams(): Promise<{ category: string }[]> {
  const cats = await getCategories();
  return cats.map((c) => ({ category: c.name }));
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const info = getCategoryInfo(category);
  return pageMetadata({
    title: info.title,
    description: info.description,
    path: `/blogs/${category}`,
    ogCard: { category, prompt: "ls --sort=latest" },
  });
}

export default async function CategoryPage({ params }: Props): Promise<ReactElement> {
  const { category } = await params;
  const posts = (await getAllPosts()).filter((p) => p.category === category);
  if (posts.length === 0) notFound();

  const info = getCategoryInfo(category);
  const path = `/blogs/${category}`;
  const voice = CATEGORY_VOICE[category] ?? {
    headline: "I already wrote about this.",
    intro: "My essays, in one place. I kept the links. You can keep up.",
  };

  return (
    <main className={`oc-shell oc-page ${styles.page}`}>
      <JsonLd
        data={postListSchema({
          type: "CollectionPage",
          name: info.title,
          description: info.description,
          path,
          posts,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs" },
            { name: info.label, path },
          ],
        })}
      />
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/blogs">cd ..</Link><span aria-hidden="true">/</span><span aria-current="page">{category}</span>
      </nav>
      <PageHeader
        command={`$ ls ~/blogs/${category} --sort=latest`}
        title={voice.headline}
        description={voice.intro}
        note="my take, in writing"
      >
        <div className={styles.actions}>
          <Chip>{posts.length} post{posts.length === 1 ? "" : "s"}</Chip>
          <span className="oc-small oc-muted">My {info.label.toLowerCase()} essays / newest first</span>
        </div>
      </PageHeader>
      <CircuitTrace>
        <section className="oc-zone" aria-labelledby="category-posts-heading">
          <SectionHeading path={`write/${category}`} title="I put it all here." note="my essays on the subject" id="category-posts-heading" />
          <ol className={styles.postList}>
            {posts.map((post) => (
              <li key={post.slug}><PostCard post={post} /></li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Keycap href="/blogs" command="$ cd ~/blogs">Back to all writing</Keycap>
          </div>
        </section>
      </CircuitTrace>
    </main>
  );
}
