// src/components/admin/DynamicIcon.tsx
import React from "react";
import {
  Globe,
  Terminal,
  FileText,
  Code2,
  Layers,
  ExternalLink,
  Mail,
  FolderGit2,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Cpu,
  Database,
  Send,
  Server,
  Smartphone,
  Layout,
  LucideProps,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiMongodb,
  SiCplusplus,
  SiC,
  SiPython,
  SiHtml5,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiLinux,
  SiVercel,
  SiGooglegemini,
  SiGoogle,
  SiFirebase,
  SiRedux,
  SiGraphql,
  SiMysql,
  SiRedis,
  SiFigma,
  SiLeetcode,
  SiVite,
  SiWebpack,
  SiJest,
  SiSocketdotio,
  SiKubernetes,
  SiJsonwebtokens,
  SiSupabase,
  SiPostcss,
  SiSass,
  SiBootstrap,
  SiFramer,
  SiNetlify,
  SiCloudflare,
  SiUbuntu,
  SiNginx,
  SiSqlite,
  SiPrettier,
  SiEslint,
  SiNpm,
  SiPnpm,
  SiYarn,
  SiBun,
  SiRust,
  SiGo,
  SiOpenjdk,
  SiSpringboot,
  SiPhp,
  SiLaravel,
  SiDjango,
  SiFastapi,
  SiFlask,
  SiDotnet,
  SiAngular,
  SiVuedotjs,
  SiSvelte,
  SiAstro,
  SiFlutter,
  SiDart,
  SiSwift,
  SiKotlin,
} from "react-icons/si";
import {
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaDiscord,
  FaTelegram,
  FaEnvelope,
  FaInstagram,
  FaReddit,
  FaMedium,
  FaSpotify,
  FaStackOverflow,
  FaWhatsapp,
} from "react-icons/fa6";
import { IconType } from "react-icons";

// --------------------------------------------------------
// Explicit Icon Registry (Tree-Shakeable)
// --------------------------------------------------------
const ICON_REGISTRY: Record<string, IconType | React.ComponentType<any>> = {
  // Lucide UI Icons
  globe: Globe,
  terminal: Terminal,
  filetext: FileText,
  code2: Code2,
  layers: Layers,
  externallink: ExternalLink,
  mail: Mail,
  foldergit2: FolderGit2,
  sparkles: Sparkles,
  award: Award,
  briefcase: Briefcase,
  graduationcap: GraduationCap,
  star: Star,
  cpu: Cpu,
  database: Database,
  send: Send,
  server: Server,
  smartphone: Smartphone,
  layout: Layout,

  // Languages & Runtimes
  sitypescript: SiTypescript,
  sijavascript: SiJavascript,
  sipython: SiPython,
  sicplusplus: SiCplusplus,
  sic: SiC,
  sihtml5: SiHtml5,

  sinodedotjs: SiNodedotjs,
  sirus: SiRust,
  sigo: SiGo,
  siopenjdk: SiOpenjdk,
  siph: SiPhp,
  sidotnet: SiDotnet,
  sidart: SiDart,
  siswift: SiSwift,
  sikotlin: SiKotlin,
  sibun: SiBun,

  // Frameworks & Frontend
  sireact: SiReact,
  sinextdotjs: SiNextdotjs,
  sitailwindcss: SiTailwindcss,
  sivite: SiVite,
  siangular: SiAngular,
  sivuedotjs: SiVuedotjs,
  sisvelte: SiSvelte,
  siastro: SiAstro,
  siredux: SiRedux,
  sigraphql: SiGraphql,
  siframer: SiFramer,
  sibootstrap: SiBootstrap,
  sisass: SiSass,
  sipostcss: SiPostcss,
  siwebpack: SiWebpack,
  siflutter: SiFlutter,

  // Backend & Cloud & DB
  siexpress: SiExpress,
  sispringboot: SiSpringboot,
  silaravel: SiLaravel,
  sidjango: SiDjango,
  sifastapi: SiFastapi,
  siflask: SiFlask,
  sipostgresql: SiPostgresql,
  simongodb: SiMongodb,
  siprisma: SiPrisma,
  siredis: SiRedis,
  simysql: SiMysql,
  sisupabase: SiSupabase,
  sisqlite: SiSqlite,
  sifirebase: SiFirebase,
  sijsonwebtokens: SiJsonwebtokens,
  sisocketdotio: SiSocketdotio,
  sijest: SiJest,

  // DevOps & Cloud & AI
  sidocker: SiDocker,
  sigit: SiGit,
  sigithub: SiGithub,
  silinux: SiLinux,
  siubuntu: SiUbuntu,
  singinx: SiNginx,
  sivercel: SiVercel,
  sinetlify: SiNetlify,
  sicloudflare: SiCloudflare,
  sipostman: SiPostman,
  sikubernetes: SiKubernetes,
  sigooglegemini: SiGooglegemini,
  sigoogle: SiGoogle,
  sifigma: SiFigma,
  siprettier: SiPrettier,
  sieslint: SiEslint,
  sinpm: SiNpm,
  sipnpm: SiPnpm,
  siyarn: SiYarn,

  // Socials & Platforms
  falinkedin: FaLinkedin,
  sileetcode: SiLeetcode,
  faxtwitter: FaXTwitter,
  fayoutube: FaYoutube,
  fadiscord: FaDiscord,
  fatelegram: FaTelegram,
  faenvelope: FaEnvelope,
  fainstagram: FaInstagram,
  fareddit: FaReddit,
  famedium: FaMedium,
  faspotify: FaSpotify,
  fastackoverflow: FaStackOverflow,
  fawhatsapp: FaWhatsapp,
};

// --------------------------------------------------------
// Common Shorthand Aliases
// --------------------------------------------------------
export const ALIAS_MAP: Record<string, string> = {
  react: "sireact",
  "react.js": "sireact",
  nextjs: "sinextdotjs",
  "next.js": "sinextdotjs",
  typescript: "sitypescript",
  ts: "sitypescript",
  javascript: "sijavascript",
  js: "sijavascript",
  nodejs: "sinodedotjs",
  "node.js": "sinodedotjs",
  express: "siexpress",
  "express.js": "siexpress",
  postgresql: "sipostgresql",
  postgres: "sipostgresql",
  prisma: "siprisma",
  tailwind: "sitailwindcss",
  tailwindcss: "sitailwindcss",
  mongodb: "simongodb",
  cpp: "sicplusplus",
  "c++": "sicplusplus",
  c: "sic",
  python: "sipython",
  html: "sihtml5",
  html5: "sihtml5",
  css: "sicss3",
  css3: "sicss3",
  git: "sigit",
  github: "sigithub",
  docker: "sidocker",
  postman: "sipostman",
  linux: "silinux",
  vercel: "sivercel",
  gemini: "sigooglegemini",
  google: "sigoogle",
  firebase: "sifirebase",
  redux: "siredux",
  graphql: "sigraphql",
  mysql: "simysql",
  redis: "siredis",
  figma: "sifigma",
  aws: "siamazonwebservices",
  kubernetes: "sikubernetes",
  vite: "sivite",
  webpack: "siwebpack",
  jest: "sijest",
  socketio: "sisocketdotio",
  jwt: "sijsonwebtokens",
  jsonwebtokens: "sijsonwebtokens",
  supabase: "sisupabase",
  rust: "sirus",
  go: "sigo",
  golang: "sigo",
  java: "siopenjdk",
  springboot: "sispringboot",
  php: "siph",
  laravel: "silaravel",
  django: "sidjango",
  fastapi: "sifastapi",
  flask: "siflask",
  dotnet: "sidotnet",
  angular: "siangular",
  vue: "sivuedotjs",
  svelte: "sisvelte",
  astro: "siastro",
  flutter: "siflutter",
  dart: "sidart",
  swift: "siswift",
  kotlin: "sikotlin",
  openai: "siopenai",

  // Socials & Actions
  linkedin: "falinkedin",
  leetcode: "sileetcode",
  twitter: "faxtwitter",
  x: "faxtwitter",
  youtube: "fayoutube",
  discord: "fadiscord",
  telegram: "fatelegram",
  mail: "mail",
  email: "mail",
  resume: "filetext",
  cv: "filetext",
  code: "code2",
  globe: "globe",
  terminal: "terminal",
};

// --------------------------------------------------------
// Official Brand Colors
// --------------------------------------------------------
export const BRAND_COLOR_MAP: Record<string, string> = {
  // Languages
  sitypescript: "#3178C6",
  sijavascript: "#F7DF1E",
  sipython: "#3776AB",
  sicplusplus: "#00599C",
  sic: "#A8B9CC",
  sihtml5: "#E34F26",
  sicss3: "#1572B6",
  sinodedotjs: "#5FA04E",
  sirus: "#DEA584",
  sigo: "#00ADD8",
  siopenjdk: "#ED8B00",
  siph: "#777BB4",
  sidotnet: "#512BD4",
  sidart: "#0175C2",
  siswift: "#F05138",
  sikotlin: "#7F52FF",
  sibun: "#FBF0DF",

  // Frameworks & UI
  sireact: "#61DAFB",
  sinextdotjs: "#000000",
  sitailwindcss: "#06B6D4",
  siredux: "#764ABC",
  siexpress: "#000000",
  sigraphql: "#E10098",
  sivite: "#646CFF",
  siwebpack: "#8DD6F9",
  sijest: "#C21325",
  sisocketdotio: "#010101",
  siangular: "#DD0031",
  sivuedotjs: "#4FC08D",
  sisvelte: "#FF3E00",
  siastro: "#BC52EE",
  siframer: "#0055FF",
  sibootstrap: "#7952B3",
  sisass: "#CC6699",
  siflutter: "#02569B",

  // Databases & Backend
  sipostgresql: "#4169E1",
  simongodb: "#47A248",
  siprisma: "#2D3748",
  siredis: "#DC382D",
  simysql: "#4479A1",
  sisupabase: "#3ECF8E",
  sisqlite: "#003B57",
  sifirebase: "#FFCA28",
  sijsonwebtokens: "#EF3163",
  sispringboot: "#6DB33F",
  silaravel: "#FF2D20",
  sidjango: "#092E20",
  sifastapi: "#009688",
  siflask: "#000000",

  // DevOps & Cloud & AI
  sidocker: "#2496ED",
  sigit: "#F05032",
  sigithub: "#181717",
  silinux: "#FCC624",
  siubuntu: "#E95420",
  singinx: "#009639",
  sivercel: "#000000",
  sinetlify: "#00C7B7",
  sicloudflare: "#F38020",
  sipostman: "#FF6C37",
  siamazonwebservices: "#FF9900",
  sikubernetes: "#326CE5",
  sigooglegemini: "#8E75FF",
  siopenai: "#412991",
  sigoogle: "#4285F4",
  sifigma: "#F24E1E",

  // Socials
  falinkedin: "#0A66C2",
  sileetcode: "#FFA116",
  faxtwitter: "#000000",
  fayoutube: "#FF0000",
  fadiscord: "#5865F2",
  fatelegram: "#26A5E4",
  fainstagram: "#E4405F",
  fareddit: "#FF4500",
  famedium: "#000000",
  faspotify: "#1DB954",
  fastackoverflow: "#F58025",
  fawhatsapp: "#25D366",
};

export type IconCatalogCategory =
  | "All"
  | "Lucide"
  | "Simple Icons"
  | "Font Awesome";

export interface IconCatalogItem {
  key: string;
  label: string;
  category: Exclude<IconCatalogCategory, "All">;
}

export const AVAILABLE_ICONS: IconCatalogItem[] = [
  { key: "SiGithub", label: "GitHub", category: "Simple Icons" },
  { key: "FaLinkedin", label: "LinkedIn", category: "Font Awesome" },
  { key: "SiLeetcode", label: "LeetCode", category: "Simple Icons" },
  { key: "FileText", label: "Resume / PDF", category: "Lucide" },
  { key: "Mail", label: "Email", category: "Lucide" },
  { key: "Globe", label: "Website", category: "Lucide" },
  { key: "FaXTwitter", label: "Twitter / X", category: "Font Awesome" },
  { key: "SiReact", label: "React", category: "Simple Icons" },
  { key: "SiNextdotjs", label: "Next.js", category: "Simple Icons" },
  { key: "SiPostgresql", label: "PostgreSQL", category: "Simple Icons" },
  { key: "SiPrisma", label: "Prisma", category: "Simple Icons" },
  { key: "SiTailwindcss", label: "Tailwind CSS", category: "Simple Icons" },
  { key: "Terminal", label: "Terminal", category: "Lucide" },
  { key: "Code2", label: "Code", category: "Lucide" },
  { key: "Layers", label: "Stack", category: "Lucide" },
  { key: "ExternalLink", label: "External", category: "Lucide" },
];

export const ICON_CATALOG: IconCatalogItem[] = [
  ...AVAILABLE_ICONS,
  { key: "SiTypescript", label: "TypeScript", category: "Simple Icons" },
  { key: "SiJavascript", label: "JavaScript", category: "Simple Icons" },
  { key: "SiNodedotjs", label: "Node.js", category: "Simple Icons" },
  { key: "SiExpress", label: "Express.js", category: "Simple Icons" },
  { key: "SiMongodb", label: "MongoDB", category: "Simple Icons" },
  { key: "SiCplusplus", label: "C++", category: "Simple Icons" },
  { key: "SiPython", label: "Python", category: "Simple Icons" },
  { key: "SiDocker", label: "Docker", category: "Simple Icons" },
  { key: "SiGit", label: "Git", category: "Simple Icons" },
  { key: "SiLinux", label: "Linux", category: "Simple Icons" },
  { key: "SiVercel", label: "Vercel", category: "Simple Icons" },
  { key: "SiGooglegemini", label: "Gemini AI", category: "Simple Icons" },
  { key: "SiOpenai", label: "OpenAI", category: "Simple Icons" },
  { key: "SiFirebase", label: "Firebase", category: "Simple Icons" },
  { key: "SiSupabase", label: "Supabase", category: "Simple Icons" },
  { key: "SiRedux", label: "Redux", category: "Simple Icons" },
  { key: "SiGraphql", label: "GraphQL", category: "Simple Icons" },
  { key: "SiRedis", label: "Redis", category: "Simple Icons" },
  { key: "SiPostman", label: "Postman", category: "Simple Icons" },
  { key: "SiFigma", label: "Figma", category: "Simple Icons" },
  { key: "SiJsonwebtokens", label: "JWT", category: "Simple Icons" },
  { key: "SiAmazonwebservices", label: "AWS", category: "Simple Icons" },
  { key: "SiKubernetes", label: "Kubernetes", category: "Simple Icons" },
  { key: "FaYoutube", label: "YouTube", category: "Font Awesome" },
  { key: "FaDiscord", label: "Discord", category: "Font Awesome" },
  { key: "FaTelegram", label: "Telegram", category: "Font Awesome" },
  { key: "Cpu", label: "CPU", category: "Lucide" },
  { key: "Database", label: "Database", category: "Lucide" },
  { key: "Sparkles", label: "Sparkles", category: "Lucide" },
  { key: "Award", label: "Award", category: "Lucide" },
  { key: "Briefcase", label: "Briefcase", category: "Lucide" },
  { key: "GraduationCap", label: "Graduation Cap", category: "Lucide" },
  { key: "Star", label: "Star", category: "Lucide" },
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
  size,
  useBrandColor = false,
  style,
  ...props
}: DynamicIconProps) {
  const rawKey = (iconKey || name || "globe").trim().toLowerCase();
  const normalizedKey = (ALIAS_MAP[rawKey] || rawKey)
    .replace(/^(si:|fa:|tb:|lucide:)/i, "")
    .toLowerCase();

  const brandColor = useBrandColor
    ? BRAND_COLOR_MAP[normalizedKey] || BRAND_COLOR_MAP[rawKey]
    : undefined;

  const combinedStyle = brandColor ? { color: brandColor, ...style } : style;

  const IconComponent =
    ICON_REGISTRY[normalizedKey] ||
    ICON_REGISTRY[`si${normalizedKey}`] ||
    ICON_REGISTRY[`fa${normalizedKey}`] ||
    Globe;

  return (
    <IconComponent
      className={className}
      size={size}
      style={combinedStyle}
      {...props}
    />
  );
}
