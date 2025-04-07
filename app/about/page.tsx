"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function About() {
  const [activeSection, setActiveSection] = useState("cybersecurity")

  const sections = {
    cybersecurity: {
      title: "Cybersecurity Research & Offensive Security",
      content:
        "Specializing in application security with a focus on identifying vulnerabilities and implementing robust security measures. Experienced in penetration testing, security assessments, and developing secure coding practices.",
    },
    business: {
      title: "Business & Mindset",
      content:
        "Approaching security challenges with an entrepreneurial mindset. Balancing technical security requirements with business objectives to create solutions that protect assets while enabling innovation and growth.",
    },
    webdev: {
      title: "Web Development",
      content:
        "Building secure web applications with modern frameworks and best practices. Experienced in developing applications with security built-in from the ground up, following OWASP guidelines and secure coding standards.",
    },
    automation: {
      title: "Automation & Testing",
      content:
        "Creating automated security testing pipelines and tools to enhance development workflows. Implementing continuous security testing in CI/CD pipelines and developing custom tools for security automation.",
    },
  }

  return (
    <main className="min-h-screen bg-[#1a1b26] text-white p-8">
      <Link href="/" className="inline-flex items-center text-[#3b5bdb] hover:text-[#4c6ef5] mb-12">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About Arafat</h1>

        <p className="text-lg mb-12">
          Application Security Engineer with an entrepreneurial mindset. Building secure solutions while pursuing
          business innovation.
        </p>

        <h2 className="text-2xl font-semibold mb-6">Areas of Focus</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setActiveSection("cybersecurity")}
            className={`px-4 py-2 rounded-md transition-colors ${activeSection === "cybersecurity" ? "bg-[#3b5bdb] text-white" : "bg-[#2a2c3b] text-white/70 hover:bg-[#3b5bdb]/50"}`}
          >
            Cybersecurity
          </button>
          <button
            onClick={() => setActiveSection("business")}
            className={`px-4 py-2 rounded-md transition-colors ${activeSection === "business" ? "bg-[#3b5bdb] text-white" : "bg-[#2a2c3b] text-white/70 hover:bg-[#3b5bdb]/50"}`}
          >
            Business & Mindset
          </button>
          <button
            onClick={() => setActiveSection("webdev")}
            className={`px-4 py-2 rounded-md transition-colors ${activeSection === "webdev" ? "bg-[#3b5bdb] text-white" : "bg-[#2a2c3b] text-white/70 hover:bg-[#3b5bdb]/50"}`}
          >
            Web Development
          </button>
          <button
            onClick={() => setActiveSection("automation")}
            className={`px-4 py-2 rounded-md transition-colors ${activeSection === "automation" ? "bg-[#3b5bdb] text-white" : "bg-[#2a2c3b] text-white/70 hover:bg-[#3b5bdb]/50"}`}
          >
            Automation & Testing
          </button>
        </div>

        <div className="bg-[#2a2c3b] p-6 rounded-lg animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4">{sections[activeSection as keyof typeof sections].title}</h3>
          <p className="text-white/80 leading-relaxed">{sections[activeSection as keyof typeof sections].content}</p>
        </div>
      </div>
    </main>
  )
}

