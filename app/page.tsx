import HomeShell from "./components/HomeShell";

export default function Home() {
  return (
    <>
      {/* Pre-hydration: hide the boot overlay if this tab already booted,
          so reloads don't flash the intro (state catches up in HomeShell). */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{if(sessionStorage.getItem("arafat-booted")==="1")document.documentElement.setAttribute("data-booted","")}catch(e){}',
        }}
      />
      <HomeShell />
      {/* SEO: Server-rendered content for search engine crawlers */}
      <div className="sr-only">
        <h1>Easin Arafat - Application Security Engineer</h1>
        <p>
          Easin Arafat is an Application Security Engineer at Startise, working
          on the xCloud cloud hosting platform. He is a graduate of the Military
          Institute of Science and Technology (MIST) and the Former President of
          MIST Cyber Security Club.
        </p>
        <h2>About Easin Arafat</h2>
        <p>
          Easin Arafat specializes in application security, penetration testing,
          DevSecOps, and secure coding practices. He works at the intersection of
          product features, infrastructure systems, and real-world operational
          constraints. His expertise spans Docker security, Nginx and networking,
          multi-tenant isolation, and CI/CD pipeline security.
        </p>
        <h2>Security Research and CVEs</h2>
        <p>
          Easin Arafat is a security researcher credited on the Patchstack
          Vulnerability Disclosure Program under the handle n0_arafat_n0. He has
          responsibly disclosed 9 CVEs in WordPress plugins, including
          CVE-2025-62039 (Sensitive Data Exposure, CVSS 7.5), CVE-2025-58680,
          CVE-2025-64277, CVE-2025-59562, CVE-2025-58981, CVE-2025-62932, and
          CVE-2025-62931 — covering Broken Access Control, Insecure Direct Object
          Reference (IDOR), and Sensitive Data Exposure.
        </p>
        <h2>Published Research and Recognition</h2>
        <p>
          Easin Arafat (Sheikh Easin Arafat) is a co-author of the peer-reviewed
          paper &quot;Adaptive User Interface for Mobile Banking Apps: Enhancing UX
          through Machine Learning&quot;, published in Array (Elsevier, Q1 journal,
          open access), DOI 10.1016/j.array.2026.100901. He was featured in The
          Daily Star for cybersecurity education and the events of the MIST Cyber
          Security Club, organized MIST LEETCON 2023 (Bangladesh&apos;s first
          international cybersecurity conference, 3,500+ participants), and was a
          2021 University Rover Challenge Global Champion with Team MIST Mongol
          Barota.
        </p>
        <h2>Professional Experience</h2>
        <ul>
          <li>Application Security Engineer at Startise (xCloud)</li>
          <li>Former President of MIST Cyber Security Club</li>
          <li>
            Graduate of Military Institute of Science and Technology (MIST),
            Bangladesh
          </li>
        </ul>
        <h2>Areas of Expertise</h2>
        <ul>
          <li>Application Security and Penetration Testing</li>
          <li>DevSecOps and Automation</li>
          <li>Web Development (React, Next.js, TypeScript)</li>
          <li>Cloud Security (Docker, Nginx, Multi-Tenant Isolation)</li>
          <li>AI, Machine Learning, and Large Language Models</li>
          <li>Cybersecurity Research and Offensive Security</li>
        </ul>
        <h2>Connect with Easin Arafat</h2>
        <nav>
          <a href="https://github.com/mrx-arafat">GitHub</a>
          <a href="https://www.linkedin.com/in/e4rafat">LinkedIn</a>
          <a href="https://medium.com/@easinxarafat">Medium Blog</a>
          <a href="https://www.facebook.com/e4rafat">Facebook</a>
          <a href="https://www.instagram.com/e4rafat/">Instagram</a>
        </nav>
      </div>
    </>
  );
}
