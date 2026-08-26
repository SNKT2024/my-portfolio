// src/components/admin/DynamicIcon.tsx
"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Globe, LucideProps } from "lucide-react";

// Alias resolver for common developer tools, legacy Prisma keys & brands
export const ALIAS_MAP: Record<string, string> = {
  // Languages & Runtimes
  sitypescript: "logos:typescript-icon",
  typescript: "logos:typescript-icon",
  ts: "logos:typescript-icon",
  sijavascript: "logos:javascript",
  javascript: "logos:javascript",
  js: "logos:javascript",
  sipython: "logos:python",
  python: "logos:python",
  sicplusplus: "logos:c-plusplus",
  "c++": "logos:c-plusplus",
  cpp: "logos:c-plusplus",
  sic: "logos:c",
  c: "logos:c",
  siopenjdk: "logos:java",
  java: "logos:java",
  sirus: "logos:rust",
  rust: "logos:rust",
  sigo: "logos:go",
  go: "logos:go",
  golang: "logos:go",
  siph: "logos:php",
  php: "logos:php",
  sidotnet: "logos:dotnet",
  dotnet: "logos:dotnet",
  sidart: "logos:dart",
  dart: "logos:dart",
  siswift: "logos:swift",
  swift: "logos:swift",
  sikotlin: "logos:kotlin-icon",
  kotlin: "logos:kotlin-icon",
  sihtml5: "logos:html-5",
  html: "logos:html-5",
  html5: "logos:html-5",
  sicss3: "logos:css-3",
  css: "logos:css-3",
  css3: "logos:css-3",
  sinodedotjs: "logos:nodejs-icon",
  nodejs: "logos:nodejs-icon",
  "node.js": "logos:nodejs-icon",
  sibun: "logos:bun",
  bun: "logos:bun",

  // Frameworks & Libraries[cite: 20]
  sireact: "logos:react",
  react: "logos:react",
  "react.js": "logos:react",
  sinextdotjs: "logos:nextjs-icon",
  nextjs: "logos:nextjs-icon",
  "next.js": "logos:nextjs-icon",
  sivuedotjs: "logos:vue",
  vue: "logos:vue",
  siangular: "logos:angular-icon",
  angular: "logos:angular-icon",
  sisvelte: "logos:svelte-icon",
  svelte: "logos:svelte-icon",
  siastro: "logos:astro-icon",
  astro: "logos:astro-icon",
  sitailwindcss: "logos:tailwindcss-icon",
  tailwind: "logos:tailwindcss-icon",
  tailwindcss: "logos:tailwindcss-icon",
  siredux: "logos:redux",
  redux: "logos:redux",
  sigraphql: "logos:graphql",
  graphql: "logos:graphql",
  siexpress: "simple-icons:express",
  express: "simple-icons:express",
  "express.js": "simple-icons:express",
  sidjango: "logos:django-icon",
  django: "logos:django-icon",
  sifastapi: "logos:fastapi-icon",
  fastapi: "logos:fastapi-icon",
  siflask: "logos:flask",
  flask: "logos:flask",
  sispringboot: "logos:spring-icon",
  springboot: "logos:spring-icon",
  silaravel: "logos:laravel",
  laravel: "logos:laravel",
  siflutter: "logos:flutter",
  flutter: "logos:flutter",

  // Databases & Backend[cite: 20]
  sipostgresql: "logos:postgresql",
  postgresql: "logos:postgresql",
  postgres: "logos:postgresql",
  simongodb: "logos:mongodb-icon",
  mongodb: "logos:mongodb-icon",
  siprisma: "logos:prisma",
  prisma: "logos:prisma",
  siredis: "logos:redis",
  redis: "logos:redis",
  simysql: "logos:mysql-icon",
  mysql: "logos:mysql-icon",
  sisupabase: "logos:supabase-icon",
  supabase: "logos:supabase-icon",
  sifirebase: "logos:firebase-icon",
  firebase: "logos:firebase-icon",
  sisqlite: "logos:sqlite",
  sqlite: "logos:sqlite",
  sijsonwebtokens: "logos:jwt-icon",
  jwt: "logos:jwt-icon",

  // DevOps, Cloud & AI[cite: 20]
  sidocker: "logos:docker-icon",
  docker: "logos:docker-icon",
  sikubernetes: "logos:kubernetes",
  kubernetes: "logos:kubernetes",
  sigit: "logos:git-icon",
  git: "logos:git-icon",
  sigithub: "logos:github-icon",
  github: "logos:github-icon",
  silinux: "logos:linux-tux",
  linux: "logos:linux-tux",
  siubuntu: "logos:ubuntu",
  ubuntu: "logos:ubuntu",
  singinx: "logos:nginx",
  nginx: "logos:nginx",
  siamazonwebservices: "logos:aws",
  aws: "logos:aws",
  sivercel: "logos:vercel-icon",
  vercel: "logos:vercel-icon",
  sinetlify: "logos:netlify-icon",
  netlify: "logos:netlify-icon",
  sicloudflare: "logos:cloudflare-icon",
  cloudflare: "logos:cloudflare-icon",
  sipostman: "logos:postman-icon",
  postman: "logos:postman-icon",
  sifigma: "logos:figma",
  figma: "logos:figma",
  sigooglegemini: "logos:google-gemini",
  gemini: "logos:google-gemini",
  siopenai: "logos:openai-icon",
  openai: "logos:openai-icon",

  // Socials & Actions[cite: 20]
  falinkedin: "logos:linkedin-icon",
  linkedin: "logos:linkedin-icon",
  sileetcode: "simple-icons:leetcode",
  leetcode: "simple-icons:leetcode",
  faxtwitter: "simple-icons:x",
  twitter: "logos:twitter",
  x: "simple-icons:x",
  fayoutube: "logos:youtube-icon",
  youtube: "logos:youtube-icon",
  fadiscord: "logos:discord-icon",
  discord: "logos:discord-icon",
  fatelegram: "logos:telegram",
  telegram: "logos:telegram",
  mail: "lucide:mail",
  email: "lucide:mail",
  filetext: "lucide:file-text",
  resume: "lucide:file-text",
  cv: "lucide:file-text",
  terminal: "lucide:terminal",
  code2: "lucide:code-2",
  code: "lucide:code-2",
  database: "lucide:database",
  globe: "lucide:globe",
};

export function resolveIconName(rawKey: string): string {
  if (!rawKey) return "lucide:globe";
  const clean = rawKey
    .trim()
    .toLowerCase()
    .replace(/^(si:|fa:|tb:|lucide:)/i, "");

  // 1. Direct alias match[cite: 20]
  if (ALIAS_MAP[clean]) {
    return ALIAS_MAP[clean];
  }

  // 2. Strip 'si', 'fa', 'lucide' prefixes if present
  if (ALIAS_MAP[`si${clean}`]) {
    return ALIAS_MAP[`si${clean}`];
  }
  if (ALIAS_MAP[`fa${clean}`]) {
    return ALIAS_MAP[`fa${clean}`];
  }

  // 3. If already formatted as Iconify key (e.g. "logos:rust" or "devicon:cplusplus")
  if (rawKey.includes(":")) {
    return rawKey;
  }

  // 4. Default fallback: logos prefix
  return `logos:${clean}`;
}

export const PRESET_ICONS = [
  { key: "logos:react", label: "React", category: "Tech" },
  { key: "logos:nextjs-icon", label: "Next.js", category: "Tech" },
  { key: "logos:typescript-icon", label: "TypeScript", category: "Tech" },
  { key: "logos:javascript", label: "JavaScript", category: "Tech" },
  { key: "logos:nodejs-icon", label: "Node.js", category: "Tech" },
  { key: "simple-icons:express", label: "Express", category: "Tech" },
  { key: "logos:postgresql", label: "PostgreSQL", category: "Tech" },
  { key: "logos:prisma", label: "Prisma", category: "Tech" },
  { key: "logos:tailwindcss-icon", label: "Tailwind CSS", category: "Tech" },
  { key: "logos:mongodb-icon", label: "MongoDB", category: "Tech" },
  { key: "logos:redis", label: "Redis", category: "Tech" },
  { key: "logos:c-plusplus", label: "C++", category: "Tech" },
  { key: "logos:python", label: "Python", category: "Tech" },
  { key: "logos:rust", label: "Rust", category: "Tech" },
  { key: "logos:go", label: "Go", category: "Tech" },
  { key: "logos:docker-icon", label: "Docker", category: "Tech" },
  { key: "logos:git-icon", label: "Git", category: "Tech" },
  { key: "logos:supabase-icon", label: "Supabase", category: "Tech" },
  { key: "logos:aws", label: "AWS", category: "Tech" },
  { key: "logos:google-gemini", label: "Gemini AI", category: "Tech" },
  { key: "logos:openai-icon", label: "OpenAI", category: "Tech" },
  { key: "logos:figma", label: "Figma", category: "Tech" },
  { key: "logos:github-icon", label: "GitHub", category: "Social" },
  { key: "logos:linkedin-icon", label: "LinkedIn", category: "Social" },
  { key: "simple-icons:leetcode", label: "LeetCode", category: "Social" },
  { key: "simple-icons:x", label: "X / Twitter", category: "Social" },
  { key: "lucide:terminal", label: "Terminal", category: "Lucide" },
  { key: "lucide:code-2", label: "Code", category: "Lucide" },
  { key: "lucide:database", label: "Database", category: "Lucide" },
  { key: "lucide:file-text", label: "Resume / PDF", category: "Lucide" },
  { key: "lucide:mail", label: "Email", category: "Lucide" },
  { key: "lucide:globe", label: "Website", category: "Lucide" },
];

export interface DynamicIconProps extends Omit<LucideProps, "ref" | "name"> {
  iconKey?: string | null;
  name?: string | null;
  className?: string;
  size?: number | string;
  useBrandColor?: boolean;
}

export function DynamicIcon({
  iconKey,
  name,
  className = "size-4",
  size = 20,
  style,
}: DynamicIconProps) {
  const iconString = resolveIconName(iconKey || name || "globe");

  return (
    <Icon
      icon={iconString}
      className={`inline-block shrink-0 ${className}`}
      width={size}
      height={size}
      style={style}
      fallback={<Globe className={className} size={size} style={style} />}
    />
  );
}
