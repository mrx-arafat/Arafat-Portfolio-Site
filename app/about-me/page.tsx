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
  Crosshair,
  Bot,
} from "lucide-react";
import { playClickSound } from "@/utils/sound";

export default function AboutMe() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const heroText =
    "Hello! I'm Arafat. I make sure systems don't just work. They survive production.";

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
      title: "Docker Environments",
      description:
        "Analyze how application features interact with containerized environments, resource limits, and container orchestration.",
    },
    {
      icon: Network,
      title: "Nginx & Networking",
      description:
        "Examine networking layers, reverse proxy configurations, DNS behavior, and traffic routing under real conditions.",
    },
    {
      icon: Lock,
      title: "Permissions & Filesystem",
      description:
        "Investigate filesystem permissions, access controls, and privilege boundaries that applications depend on in production.",
    },
    {
      icon: Layers,
      title: "Multi-Tenant Isolation",
      description:
        "Validate isolation boundaries, firewall rules, and resource separation in shared infrastructure environments.",
    },
  ];

  const iLookFor = [
    {
      icon: AlertTriangle,
      title: "Assumptions That Won't Hold",
      description:
        "Finding where development assumptions break under real production conditions",
    },
    {
      icon: Shield,
      title: "Isolation Gaps",
      description:
        "Detecting boundaries that aren't as airtight as they appear",
    },
    {
      icon: Lock,
      title: "Over-Generous Permissions",
      description:
        "Identifying access that's broader than necessary across services",
    },
    {
      icon: Eye,
      title: "Silent Deployment Risk",
      description:
        "Spotting deployment flows that introduce risk without visible indicators",
    },
    {
      icon: Target,
      title: "Escalation Paths",
      description:
        "If something can escalate, leak, collide, or fail under pressure — I want to know before users do",
    },
  ];

  const myApproach = [
    {
      question: "Does it work?",
      answer:
        "What breaks when this scales, misbehaves, or partially fails?",
    },
    {
      question: "Is it optimized for passing tests?",
      answer:
        "Is it optimized for reduced operational risk and predictable behavior under failure?",
    },
    {
      question: "Is the security strict enough?",
      answer:
        "Is the security precise enough — strong isolation boundaries, real resilience, not just rigid rules?",
    },
  ];

  const focusPillars = [
    {
      icon: GitBranch,
      title: "DevSecOps & Automation",
      description:
        "I work across the full DevSecOps pipeline — from securing infrastructure to automating complex workflows. Not just security automation. All kinds of automation that make processes faster, repeatable, and reliable.",
      areas: [
        "CI/CD pipeline security",
        "Infrastructure automation",
        "Workflow orchestration",
        "Secure deployment systems",
      ],
    },
    {
      icon: Bot,
      title: "AI, ML & Large Language Models",
      description:
        "Actively building with AI, machine learning, and LLMs — not just following the trend. Adapting these tools for real use cases, integrating them into workflows, and exploring how they reshape what's possible in security and automation.",
      areas: [
        "LLM-powered tooling",
        "AI-driven security analysis",
        "Intelligent automation",
        "ML-assisted workflows",
      ],
    },
    {
      icon: Target,
      title: "Real-World Problem Solving",
      description:
        "I don't define myself by a single domain. Security, DevOps, AI — these are tools. The real focus is identifying problems that matter and building solutions that work in production, not just in theory.",
      areas: [
        "Production-grade solutions",
        "Cross-domain thinking",
        "Systems-level debugging",
        "Scalable architecture",
      ],
    },
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
                  Most production failures don&apos;t happen because someone
                  wrote bad code. They happen because systems behave differently
                  under real conditions.
                </p>
                <p className="text-[#2ed573] mt-2 font-medium">
                  That gap — between &quot;it works&quot; and &quot;it survives
                  production&quot; — is where I work.
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
                working at the intersection of product features, infrastructure
                systems, and real-world operational constraints.
              </p>

              <p>
                I focus on what happens{" "}
                <span className="text-[#2ed573] font-semibold">
                  after deployment
                </span>
                . When containers restart, permissions drift, tenants share
                resources, networks behave unpredictably, and edge cases meet
                scale.
              </p>

              <div className="pt-4 border-t border-[#2ed573]/10">
                <p className="text-[#2ed573] font-mono text-sm">
                  $ echo $FOCUS
                </p>
                <p className="mt-2 text-white italic">
                  &quot;That&apos;s where risk hides.&quot;
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
                <a
                  href="https://startise.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2ed573] font-semibold hover:underline"
                >
                  Startise
                </a>
                , working on a production-grade cloud hosting platform (
                <a
                  href="https://xcloud.host/about-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2ed573] font-semibold hover:underline"
                >
                  xCloud
                </a>
                ), where security isn&apos;t abstract — it&apos;s operational.
              </p>

              <p>
                I act as a{" "}
                <span className="text-[#2ed573] font-semibold">
                  bridge between development and infrastructure
                </span>
                , helping turn complex backend workflows into secure, repeatable
                &quot;one-click&quot; product features — without breaking tenant
                isolation, introducing hidden privilege paths, or creating
                fragile deployment chains.
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

      {/* What I Actually Do Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#2ed573]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              What I Actually Do
            </h2>
            <span className="text-[#2ed573]/60 text-sm font-mono">
              $ ./daily_operations.sh --verbose
            </span>
          </div>
        </div>

        <p className="text-white/80 mb-6 max-w-3xl">
          I analyze how product features interact with real infrastructure. Not
          in theory.{" "}
          <span className="text-[#2ed573] font-semibold">
            In production-like environments.
          </span>
        </p>

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

      {/* I Look For Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-[#2ed573]/10 to-transparent rounded-xl border border-[#2ed573]/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2ed573]/20 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-[#2ed573]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">What I Look For</h2>
              <span className="text-[#2ed573]/60 text-sm font-mono">
                $ ./risk_detection.sh
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {iLookFor.map((area, index) => (
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
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-[#2ed573]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Why It Matters</h2>
              <span className="text-[#2ed573]/60 text-sm font-mono">
                $ diff dev.log production.log
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 bg-[#0f0f14] rounded-lg border border-red-400/20">
              <span className="text-red-400/70 text-xs font-mono mb-3 block">
                // Most teams test:
              </span>
              <p className="text-white/60 text-lg italic">
                &quot;Does it work?&quot;
              </p>
            </div>
            <div className="p-5 bg-[#2ed573]/5 rounded-lg border border-[#2ed573]/20">
              <span className="text-[#2ed573]/70 text-xs font-mono mb-3 block">
                // I test:
              </span>
              <p className="text-white text-lg font-medium">
                &quot;What breaks when this scales, misbehaves, or partially
                fails?&quot;
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#2ed573]/10 to-transparent rounded-lg border-l-4 border-[#2ed573]">
            <p className="text-white/90">
              That difference is small in development.{" "}
              <span className="text-[#2ed573] font-semibold">
                It&apos;s massive in production.
              </span>
            </p>
            <p className="text-white/70 mt-2 text-sm">
              I routinely catch issues that look fine at the application layer —
              but become{" "}
              <span className="text-red-400 font-semibold">
                high-impact risks
              </span>{" "}
              once deployed to real infrastructure.
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
          I don&apos;t optimize for passing tests. I optimize for:
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

        <div className="mt-8 p-4 bg-[#0f0f14] rounded-lg border border-[#2ed573]/20">
          <p className="text-white font-medium">
            Security isn&apos;t about being strict.{" "}
            <span className="text-[#2ed573]">It&apos;s about being precise.</span>
          </p>
        </div>
      </section>

      {/* Current Focus Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#2ed573]/10 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-[#2ed573]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Current Focus &amp; Trajectory
            </h2>
            <span className="text-[#2ed573]/60 text-sm font-mono">
              $ ./growth_trajectory.sh
            </span>
          </div>
        </div>

        <div className="mb-8 p-4 bg-[#0f0f14] rounded-lg border border-[#2ed573]/20">
          <p className="text-white/90">
            Security alone doesn&apos;t solve real-world problems. The world
            runs on{" "}
            <span className="text-[#2ed573] font-semibold">
              AI, automation, and speed
            </span>{" "}
            — I&apos;m building at that intersection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {focusPillars.map((pillar, index) => (
            <div
              key={index}
              className="group bg-[#0f0f14] rounded-xl border border-[#2ed573]/20 p-6 hover:border-[#2ed573]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-[#2ed573]/10 flex items-center justify-center mb-4 group-hover:bg-[#2ed573]/20 transition-colors">
                <pillar.icon className="w-6 h-6 text-[#2ed573]" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">
                {pillar.title}
              </h3>

              <p className="text-white/70 text-sm leading-relaxed mb-4">
                {pillar.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-[#2ed573]/10">
                {pillar.areas.map((area, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-[#2ed573] flex-shrink-0" />
                    <span className="text-white/60 text-xs">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-[#2ed573]/10 to-transparent rounded-lg border-l-4 border-[#2ed573]">
          <p className="text-white font-medium">
            I&apos;m not just a security engineer who uses AI. I&apos;m a{" "}
            <span className="text-[#2ed573]">problem solver</span> who thinks
            in systems, automates relentlessly, and secures everything I build.
          </p>
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
