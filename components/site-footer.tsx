import type { ReactElement } from "react";
import Link from "next/link";

import styles from "./site-footer.module.css";

const LINKS = [{ href: "/", label: "dashboard" }, { href: "/about", label: "about" }, { href: "/featured", label: "featured" }, { href: "/projects", label: "projects" }, { href: "/security-research", label: "security-research" }, { href: "/articles", label: "articles" }, { href: "/blogs", label: "blog" }, { href: "/notes", label: "notes" }, { href: "/skills", label: "skills" }, { href: "/faq", label: "faq" }, { href: "/contact", label: "contact" }] as const;

/** Close the circuit with the existing routes and a quiet production promise. */
export function SiteFooter(): ReactElement {
  return <footer className={`oc-footer ${styles.footer}`}><div className="oc-shell"><div className="oc-footer-top"><p className="oc-footer-tagline">systems that survive production<span className="oc-green" aria-hidden="true">_</span></p><Link className="oc-route" href="/contact">cd contact -&gt;</Link></div><nav className="oc-footer-nav" aria-label="Footer navigation">{LINKS.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}<a href="/blogs/rss.xml">rss</a></nav><div className="oc-footer-bottom"><Link className={styles.identityLink} href="/">EASIN ARAFAT / OPEN CIRCUIT</Link><div className="oc-social-links"><a href="https://github.com/mrx-arafat" rel="me">GitHub -&gt;</a><a href="https://www.linkedin.com/in/e4rafat" rel="me">LinkedIn -&gt;</a><a href="https://medium.com/@easinxarafat" rel="me">Medium -&gt;</a></div><Link className="oc-route" href="/#main-content">cd ~ ^</Link></div></div></footer>;
}
