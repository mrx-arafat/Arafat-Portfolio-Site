import type { ReactElement, ReactNode } from "react";
import Link from "next/link";

interface SectionHeadingProps { path: string; note?: string; title?: ReactNode; id?: string; className?: string; level?: 2 | 3 }
/** Introduce a section with its shell path and an optional semantic heading. */
export function SectionHeading({ path, note, title, id, className = "", level = 2 }: SectionHeadingProps): ReactElement {
  const Heading = level === 3 ? "h3" : "h2";
  return <div className={className}><div className="oc-section-top"><p className="oc-command">$ ls ~/{path}</p>{note && <span className="oc-section-note">{note}</span>}</div>{title && <Heading id={id} className="oc-section-title">{title}</Heading>}</div>;
}
interface PageHeaderProps { title: ReactNode; description?: ReactNode; command?: string; note?: string; children?: ReactNode; id?: string; className?: string }
/** Render the page's single h1 with a terminal introduction. */
export function PageHeader({ title, description, command, note, children, id = "page-title", className = "" }: PageHeaderProps): ReactElement {
  return <header className={`oc-page-header ${className}`}>{command && <p className="oc-command">{command}{note && <span className="oc-page-note"> # {note}</span>}</p>}<h1 id={id}>{title}</h1>{description && <div className="oc-page-description">{description}</div>}{children}</header>;
}
interface KeycapBase { children: ReactNode; command?: string; variant?: "default" | "primary"; className?: string; "aria-label"?: string }
type KeycapProps = KeycapBase & ({ href: string; onClick?: never; type?: never; disabled?: never } | { href?: never; onClick?: () => void; type?: "button" | "submit" | "reset"; disabled?: boolean });
/** Render a physical command key as a real link or an action button. */
export function Keycap({ children, command, variant = "default", className = "", href, onClick, type = "button", disabled, "aria-label": label }: KeycapProps): ReactElement {
  const classes = `oc-keycap ${variant === "primary" ? "oc-primary" : ""} ${className}`;
  const content = <><strong>{children}</strong>{command && <code>{command}</code>}</>;
  return href !== undefined ? <Link href={href} className={classes} aria-label={label}>{content}</Link> : <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={label}>{content}</button>;
}
interface ChipProps { children: ReactNode; tone?: "green" | "amber" | "muted"; className?: string }
/** Label metadata with a solid, theme-aware colour. */
export function Chip({ children, tone = "green", className = "" }: ChipProps): ReactElement { return <span className={`oc-chip oc-tone-${tone} ${className}`}>{children}</span>; }
interface StatusTagProps { children?: ReactNode; tone?: "ok" | "warn" | "neutral"; className?: string }
/** Pair status colour with explicit bracketed text. */
export function StatusTag({ children, tone = "ok", className = "" }: StatusTagProps): ReactElement { return <span className={`oc-status oc-status-${tone} ${className}`}>[ {children ?? (tone === "warn" ? "WARN" : tone === "neutral" ? "INFO" : "OK")} ]</span>; }
interface ContentProps { children: ReactNode; className?: string }
/** Connect sections along the Open Circuit trace. */
export function CircuitTrace({ children, className = "" }: ContentProps): ReactElement { return <div className={`oc-flow ${className}`}>{children}</div>; }
interface CardProps extends ContentProps { title?: ReactNode; href?: string; id?: string; headingLevel?: 2 | 3 | 4 }
/** Present a bordered record; an optional title link stretches across the record. */
export function Card({ children, title, href, id, className = "", headingLevel = 3 }: CardProps): ReactElement {
  const Heading = headingLevel === 2 ? "h2" : headingLevel === 4 ? "h4" : "h3";
  return <article id={id} className={`oc-card ${className}`}>{title && <Heading>{href ? <Link className="oc-stretched" href={href}>{title}</Link> : title}</Heading>}<div className="oc-card-body">{children}</div></article>;
}
/** Set comfortable reading width, type, code and table styles. */
export function Prose({ children, className = "" }: ContentProps): ReactElement { return <div className={`oc-prose ${className}`}>{children}</div>; }
