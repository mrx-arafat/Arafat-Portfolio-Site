import HomeClient from "./components/HomeClient";

export default function Home() {
  return (
    <>
      <HomeClient />
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
