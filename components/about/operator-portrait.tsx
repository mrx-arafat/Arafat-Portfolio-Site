"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";

/** Decrypt Arafat's portrait from its terminal treatment, and encrypt it back. */
export function OperatorPortrait(): ReactElement {
  const [decoded, setDecoded] = useState(false);

  return (
    <figure className={`oc-portrait ${decoded ? "oc-decoded" : ""}`}>
      <figcaption className="oc-sr">Easin Arafat, Application Security Engineer at Startise working on xCloud, AI tooling and review-gated automation.</figcaption>
      <div className="oc-portrait-frame">
        <Image src="/images/profile.webp" width={1110} height={931} alt="Easin Arafat working at a laptop beside a terminal display" priority sizes="(min-width: 1120px) 40vw, (min-width: 640px) 44vw, 90vw" />
        <div className="oc-binary" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span key={index}>01001010110100010101100101101001011010100110101001101001010101101010010110101001101010011010</span>)}</div>
        <div className="oc-scanlines" aria-hidden="true" />
        <div className="oc-scan-beam" aria-hidden="true" />
        <div className="oc-reticle" aria-hidden="true" />
        <span className="oc-photo-top" aria-hidden="true">YES, THAT&apos;S ME. EASIN ARAFAT.</span>
        <div className="oc-portrait-caption" aria-hidden="true"><strong>I kept the receipts.</strong>9 CVEs DISCLOSED<br />STARTISE / XCLOUD</div>
      </div>
      <button className="oc-decode" type="button" aria-pressed={decoded} onClick={() => setDecoded(!decoded)}>
        <span>{decoded ? "Encrypt photo" : "Decrypt photo"}</span>
        <span aria-hidden="true">[ {decoded ? "encrypt" : "decrypt"} -&gt; ]</span>
      </button>
    </figure>
  );
}
