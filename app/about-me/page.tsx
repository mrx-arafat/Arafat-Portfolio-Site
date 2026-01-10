"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Server,
  Cloud,
  Lock,
  GitBranch,
  Terminal,
  Cpu,
  Network,
  Eye,
  Target,
  Layers,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { playClickSound } from "@/utils/sound";

export default function AboutMe() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const heroText =
    "Application Security Engineer focused on system-level security, infrastructure behavior, and real-world risk in cloud platforms.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= heroText.length) {
        setTypingText(heroText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  const whatIDo = [
    {
      icon: Server,
      title: "Infrastructure Analysis",
      description:
        "Analyze how application features interact with infrastructure components like servers, Docker, Nginx, networking, DNS, and filesystem permissions.",
    },
    {
      icon: Eye,
      title: "Hidden Risk Detection",
      description:
        "Identify security risks that are invisible at the application or framework level but become critical in production.",
    },
    {
      icon: GitBranch,
      title: "Independent R&D",
      description:
        "Perform independent research to understand how complex infrastructure components behave in real environments.",
    },
    {
      icon: Layers,
      title: "Security Modeling",
      description:
        "Translate infrastructure understanding into clear system behavior and security models that developers can implement safely.",
    },
  ];

  const focusAreas = [
    {
      icon: Lock,
      title: "Permission & Isolation Boundaries",
      description: "Ensuring proper separation between tenants and services",
    },
    {
      icon: Shield,
      title: "Infrastructure Access Control",
      description: "Managing who and what can access critical infrastructure",
    },
    {
      icon: Cpu,
      title: "Deployment & Config Safety",
      description: "Securing the deployment pipeline and configurations",
    },
    {
      icon: AlertTriangle,
      title: "Multi-Tenant Risk Scenarios",
      description: "Identifying risks in shared infrastructure environments",
    },
    {
      icon: Network,
      title: "Failure Mode Analysis",
      description:
        "Understanding behavior during restarts, scaling, or misconfiguration",
    },
  ];

  const myApproach = [
    {
      question: "Does this feature work?",
      answer:
        "How does this behave when it's deployed, misused, scaled, restarted, or partially broken?",
    },
    {
      question: "Is the code secure?",
      answer:
        "What happens when this code runs on real servers with real permissions and real network conditions?",
    },
    {
      question: "Did the tests pass?",
      answer:
        "What risks exist that tests can't catch — multi-tenant isolation, infrastructure permissions, deployment edge cases?",
    },
  ];

  const currentFocus = [
    "Cloud platform security",
    "Infrastructure-aware application security",
    'Secure "one-click" product design',
    "Threat modeling at the system level",
    "Using AI tools to accelerate security analysis and R&D",
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Matrix-style background */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2ed573]/20 to-transparent" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#2ed573] text-xs font-mono opacity-30"
            style={{
              left: `${i * 5}%`,
              animation: `fall ${3 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
            }}
          >
            {[...Array(20)].map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/dashboard"
            onClick={() => playClickSound()}
            className="inline-flex items-center gap-2 text-[#2ed573] hover:text-[#2ed573]/80 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#2ed573]/10 flex items-center justify-center group-hover:bg-[#2ed573]/20 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="font-mono text-sm">cd ~/dashboard</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="relative">
          {/* Terminal Window */}
          <div className="bg-[#0f0f14] rounded-xl border border-[#2ed573]/30 overflow-hidden shadow-2xl shadow-[#2ed573]/5">
            {/* Terminal Header */}
            <div className="bg-[#1a1a24] px-4 py-3 flex items-center gap-2 border-b border-[#2ed573]/20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[#2ed573]/60 text-sm font-mono ml-4">
                arafat@xcloud:~
              </span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-[#2ed573]/60 font-mono text-sm mb-4">
                <span>$</span>
                <span>cat about_me.txt</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                About{" "}
                <span className="text-[#2ed573] relative">
                  Arafat
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#2ed573]/50" />
                </span>
              </h1>

              <div className="text-lg md:text-xl text-white/80 font-mono leading-relaxed max-w-4xl">
                <span className="text-[#2ed573]">&gt;</span> {typingText}
                <span
                  className={`inline-block w-3 h-5 bg-[#2ed573] ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`}
                />
              </div>

              <div className="mt-8 p-4 bg-[#2ed573]/5 rounded-lg border border-[#2ed573]/20">
                <p className="text-white/70 leading-relaxed">
                  I help cloud products stay secure by validating how
                  application features behave in real production environments —
                  across infrastructure, networking, and security boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#2ed573]/20 rounded-lg" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-[#2ed573]/20 rounded-lg" />
        </div>
      </section>

      {/* Core Identity Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Who I Am */}
          <div className="bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 p-6 hover:border-[#2ed573]/40 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-[#2ed573]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Who I Am</h2>
                <span className="text-[#2ed573]/60 text-sm font-mono">
                  core_identity.sh
                </span>
              </div>
            </div>

            <div className="space-y-4 text-white/80">
              <p>
                I&apos;m an{" "}
                <span className="text-[#2ed573] font-semibold">
                  Application Security Engineer
                </span>{" "}
                working at the intersection of application security,
                infrastructure, and cloud platforms.
              </p>

              <p>
                My work focuses on ensuring that cloud product features are
                <span className="text-[#2ed573]"> secure</span>,
                <span className="text-[#2ed573]"> reliable</span>, and
                <span className="text-[#2ed573]">
                  {" "}
                  behave correctly in real-world production environments
                </span>
                — not just at the code level, but across servers, networking,
                containers, permissions, and deployment workflows.
              </p>

              <div className="pt-4 border-t border-[#2ed573]/10">
                <p className="text-[#2ed573] font-mono text-sm">
                  $ ./philosophy.sh
                </p>
                <p className="mt-2 text-white italic">
                  &quot;I don&apos;t just test features. I{" "}
                  <span className="text-[#2ed573] font-semibold">
                    validate system behavior
                  </span>
                  .&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Current Role */}
          <div className="bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 p-6 hover:border-[#2ed573]/40 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-[#2ed573]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Current Role</h2>
                <span className="text-[#2ed573]/60 text-sm font-mono">
                  @ xCloud
                </span>
              </div>
            </div>

            <div className="space-y-4 text-white/80">
              <p>
                At{" "}
                <span className="text-[#2ed573] font-semibold">xCloud</span>, I
                work on a production cloud hosting platform where security meets
                real infrastructure challenges daily.
              </p>

              <p>
                A key part of my work is acting as a{" "}
                <span className="text-[#2ed573] font-semibold">
                  bridge between development and infrastructure
                </span>{" "}
                — helping teams turn complex backend systems into safe,
                repeatable, &quot;one-click&quot; product features.
              </p>

              <div className="mt-4 p-3 bg-[#2ed573]/5 rounded-lg border border-[#2ed573]/10">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2ed573]" />
                  <span className="text-sm">
                    Production cloud hosting platform
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#2ed573]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">What I Actually Do</h2>
            <span className="text-[#2ed573]/60 text-sm font-mono">
              $ ./daily_operations.sh --verbose
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {whatIDo.map((item, index) => (
            <div
              key={index}
              className="group relative bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 p-6 hover:border-[#2ed573]/50 transition-all duration-300 cursor-pointer"
              onClick={() =>
                setActiveSection(activeSection === item.title ? null : item.title)
              }
            >
              {/* 3D Effect */}
              <div className="absolute inset-0 bg-[#2ed573]/5 rounded-xl translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-200 -z-10" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#2ed573]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2ed573]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#2ed573]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    {item.title}
                    <ChevronRight
                      className={`w-4 h-4 text-[#2ed573] transition-transform ${activeSection === item.title ? "rotate-90" : ""}`}
                    />
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How I Add Value Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-[#2ed573]/10 to-transparent rounded-xl border border-[#2ed573]/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2ed573]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#2ed573]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">How I Add Value</h2>
              <span className="text-[#2ed573]/60 text-sm font-mono">
                $ ./value_proposition.sh
              </span>
            </div>
          </div>

          <div className="mb-8 p-4 bg-[#0f0f14]/50 rounded-lg border-l-4 border-[#2ed573]">
            <p className="text-white/90 text-lg">
              Most security issues don&apos;t come from a single line of code.
              They come from{" "}
              <span className="text-[#2ed573] font-semibold">
                how systems interact under real conditions
              </span>
              .
            </p>
            <p className="text-[#2ed573] mt-2 font-mono text-sm">
              That&apos;s where I specialize.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className="bg-[#0f0f14] rounded-lg p-4 border border-[#2ed573]/10 hover:border-[#2ed573]/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <area.icon className="w-5 h-5 text-[#2ed573]" />
                  <h3 className="text-white font-medium text-sm">
                    {area.title}
                  </h3>
                </div>
                <p className="text-white/60 text-xs">{area.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#0f0f14]/50 rounded-lg">
            <p className="text-white/80 text-sm">
              <span className="text-[#2ed573]">$</span> I routinely catch
              problems that look &quot;fine&quot; in the application layer but
              become{" "}
              <span className="text-red-400 font-semibold">critical risks</span>{" "}
              once deployed to real servers.
            </p>
          </div>
        </div>
      </section>

      {/* How I Think Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#2ed573]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">How I Think</h2>
            <span className="text-[#2ed573]/60 text-sm font-mono">
              $ ./mindset.sh --systems-perspective
            </span>
          </div>
        </div>

        <p className="text-white/80 mb-8 max-w-2xl">
          I approach security from a{" "}
          <span className="text-[#2ed573] font-semibold">
            systems perspective
          </span>
          . My goal is to reduce real operational and security risk, not just
          pass tests.
        </p>

        <div className="space-y-4">
          {myApproach.map((item, index) => (
            <div
              key={index}
              className="bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-5 border-b md:border-b-0 md:border-r border-[#2ed573]/10">
                  <span className="text-red-400/70 text-xs font-mono mb-2 block">
                    // Instead of asking:
                  </span>
                  <p className="text-white/60 italic">
                    &quot;{item.question}&quot;
                  </p>
                </div>
                <div className="p-5 bg-[#2ed573]/5">
                  <span className="text-[#2ed573]/70 text-xs font-mono mb-2 block">
                    // I ask:
                  </span>
                  <p className="text-white font-medium">
                    &quot;{item.answer}&quot;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Focus Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 pb-24">
        <div className="bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#2ed573]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Current Focus</h2>
              <span className="text-[#2ed573]/60 text-sm font-mono">
                $ ./growth_trajectory.sh
              </span>
            </div>
          </div>

          <p className="text-white/80 mb-6">
            I&apos;m growing as a{" "}
            <span className="text-[#2ed573] font-semibold">
              Product-Focused DevSecOps / Platform Security Engineer
            </span>
            , with deep interest in:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentFocus.map((focus, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[#2ed573]/5 rounded-lg border border-[#2ed573]/10"
              >
                <CheckCircle className="w-4 h-4 text-[#2ed573] flex-shrink-0" />
                <span className="text-white/90 text-sm">{focus}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-[#2ed573]/10 to-transparent rounded-lg border-l-4 border-[#2ed573]">
            <p className="text-white font-medium">
              My value is{" "}
              <span className="text-[#2ed573]">above the framework layer</span>,
              where application behavior meets real infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            onClick={() => playClickSound()}
            className="group relative"
          >
            <div className="absolute inset-0 bg-[#1f9b53] rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200" />
            <div className="relative bg-[#2ed573] text-[#0f0f0f] font-bold py-4 px-8 rounded-lg flex items-center gap-3">
              <Lock className="w-5 h-5" />
              <span>Get In Touch</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            href="/projects"
            onClick={() => playClickSound()}
            className="group relative"
          >
            <div className="absolute inset-0 bg-[#2ed573]/20 rounded-lg translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200" />
            <div className="relative bg-[#0f0f14] text-[#2ed573] font-bold py-4 px-8 rounded-lg flex items-center gap-3 border border-[#2ed573]/50">
              <Terminal className="w-5 h-5" />
              <span>View Projects</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
