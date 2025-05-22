"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { playClickSound } from "@/utils/sound";
import * as LucideIcons from "lucide-react";
import skillsData from "@/data/skills.json";

// Define a type for our skill
interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
}

export default function Skills() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    // Load skills from the JSON file
    setSkills(skillsData.skills);

    // Add entrance animation class to body
    document.body.classList.add("animate-slideInRight");

    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      document.body.classList.remove("animate-slideInRight");
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleCategoryClick = (category: string) => {
    playClickSound();
    setActiveCategory(activeCategory === category ? null : category);
  };

  // Get unique categories from skills
  const categories = Array.from(new Set(skills.map((skill) => skill.category)));

  // Filter skills by active category or show all if no category is selected
  const filteredSkills = activeCategory
    ? skills.filter((skill) => skill.category === activeCategory)
    : skills;

  // Dynamic icon component with fallback
  const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = (LucideIcons as any)[name];

    // If the icon doesn't exist, use a fallback
    if (!IconComponent) {
      // For ShieldCheck, use Shield as fallback
      if (name === "ShieldCheck") {
        const Shield = (LucideIcons as any)["Shield"];
        return <Shield size={16} />;
      }
      // For Lightbulb, use Lamp as fallback
      if (name === "Lightbulb") {
        const Lamp = (LucideIcons as any)["Lamp"];
        return <Lamp size={16} />;
      }
      // Default fallback
      const CircleDot = (LucideIcons as any)["CircleDot"];
      return <CircleDot size={16} />;
    }

    return <IconComponent size={16} />;
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] p-4 md:p-8 relative grid-dots">
      {/* Sound toggle button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-[#2ed573]/50 hover:text-[#2ed573] transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <Link
        href="/dashboard"
        className="inline-flex items-center text-[#2ed573] hover:text-[#2ed573]/80 mb-8"
        onClick={() => playClickSound()}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-[#1e272e] rounded-2xl overflow-hidden shadow-lg border border-[#2ed573]/20 mb-8">
          <div className="p-4 flex items-center gap-3 border-b border-[#2ed573]/10">
            <div className="w-6 h-6 flex justify-center flex-col gap-[2px]">
              <div className="flex gap-[2px]">
                <div className="w-[8px] h-[8px] bg-[#2ed573] rounded-sm"></div>
                <div className="w-[8px] h-[8px] bg-[#2ed573] rounded-sm"></div>
              </div>
              <div className="flex gap-[2px]">
                <div className="w-[8px] h-[8px] bg-[#2ed573] rounded-sm"></div>
                <div className="w-[8px] h-[8px] bg-[#2ed573] rounded-sm"></div>
              </div>
            </div>
            <h2 className="text-[#2ed573] font-medium tracking-wide">
              MY SKILLS
            </h2>
          </div>

          <div className="p-6">
            <p className="text-[#2ed573]/80 mb-6">
              These are the skills I've acquired throughout my journey in
              technology, security, and business. Each badge represents a skill
              or technology I'm proficient in.
            </p>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`${
                    activeCategory === category
                      ? "bg-[#2ed573] text-[#0f0f0f]"
                      : "bg-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30"
                  } capitalize`}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
              {activeCategory && (
                <Button
                  onClick={() => {
                    playClickSound();
                    setActiveCategory(null);
                  }}
                  className="bg-[#0f0f0f] text-[#2ed573] border border-[#2ed573]/30"
                  size="sm"
                >
                  Show All
                </Button>
              )}
            </div>

            {/* Skills badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-[#0f0f0f] p-4 rounded-lg border border-[#2ed573]/20 hover:border-[#2ed573]/50 transition-all hover:transform hover:scale-105 cursor-pointer"
                  onClick={() => playClickSound()}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#2ed573]/10 flex items-center justify-center text-[#2ed573]">
                      <DynamicIcon name={skill.icon} />
                    </div>
                    <h3 className="text-[#2ed573] font-medium">{skill.name}</h3>
                  </div>
                  <p className="text-[#2ed573]/70 text-sm">
                    {skill.description}
                  </p>
                  <div className="mt-3">
                    <Badge className="bg-[#2ed573]/20 text-[#2ed573] hover:bg-[#2ed573]/30 border-none">
                      {skill.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[#2ed573]/30 text-xs tracking-widest mt-8 text-center w-full max-w-7xl mx-auto px-4">
        <div className="border-t border-[#2ed573]/10 pt-4">
          ARAFAT © {new Date().getFullYear()} - ALL RIGHTS RESERVED
        </div>
      </div>
    </main>
  );
}
