"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Instagram,
  Linkedin,
  Facebook,
  Globe,
  BookOpen,
} from "lucide-react";

export function Profile() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/mrx-arafat",
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/e4rafat/",
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/e4rafat",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/e4rafat",
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      name: "TryHackMe",
      url: "https://tryhackme.com/p/KingBOB",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      name: "Medium",
      url: "https://medium.com/@easinxarafat",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-lg">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
        <Image
          src="/images/profile.jpg"
          alt="Arafat's Profile"
          width={128}
          height={128}
          className="object-cover"
          priority
          unoptimized={true}
        />
      </div>
      <h2 className="text-2xl font-bold text-primary">Easin Arafat</h2>
      <p className="text-muted-foreground text-center">
        Application Security Engineer at Startise
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-primary/10 rounded-full transition-colors duration-200 ease-in-out"
            title={link.name}
          >
            {link.icon}
            <span className="sr-only">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
