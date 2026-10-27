"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";
import { PORTRAIT_PATH } from "@/lib/seo";

interface DecryptPhotoProps { src?: string; alt?: string; caption?: string; className?: string; priority?: boolean }
/** Decrypt the photograph from its terminal treatment, and encrypt it back. */
export function DecryptPhoto({ src = PORTRAIT_PATH, alt = "Easin Arafat working at a laptop beside a terminal display", caption = "Easin Arafat, Application Security Engineer at Startise", className = "", priority = false }: DecryptPhotoProps): ReactElement {
  const [decoded, setDecoded] = useState(false);
  return <figure className={`oc-portrait ${decoded ? "oc-decoded" : ""} ${className}`}><figcaption className="oc-sr">{caption}</figcaption><div className="oc-portrait-frame"><Image src={src} unoptimized={src === PORTRAIT_PATH} width={1110} height={931} alt={alt} priority={priority} sizes="(min-width: 1120px) 40vw, (min-width: 640px) 44vw, 90vw" /><div className="oc-binary" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span key={index}>01001010110100010101100101101001011010100110101001101001010101101010010110101001101010011010</span>)}</div><div className="oc-scanlines" aria-hidden="true" /><div className="oc-scan-beam" aria-hidden="true" /><div className="oc-reticle" aria-hidden="true" /><span className="oc-photo-top" aria-hidden="true">UID: ARAFAT / OPERATOR VERIFIED</span><div className="oc-portrait-caption" aria-hidden="true"><strong>One operator. A whole fleet.</strong>MODE: SUPERINTELLIGENCE<br />REVIEW GATE: ARMED</div></div><button className="oc-decode" type="button" aria-pressed={decoded} onClick={() => setDecoded(!decoded)}><span>{decoded ? "Restore terminal view" : "Reveal the operator"}</span><span aria-hidden="true">[ {decoded ? "encrypt" : "decrypt"} -&gt; ]</span></button></figure>;
}
