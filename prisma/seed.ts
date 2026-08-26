// prisma/seed.ts

import { PrismaClient, SkillFamiliarity, Status } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter});

async function main() {
  console.log("🌱 Seeding database...");

  // --------------------------------------------------------
  // 1. HERO SECTION (Upsert with Int ID = 1)
  // --------------------------------------------------------
  await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Sanket Kumbhar",
      role: "Full Stack Developer",
      tagline:
        "Building scalable web applications, real-time architectures, and efficient distributed systems with modern TypeScript and PostgreSQL.",
      primaryCtaText: "View / Download Resume",
      primaryCtaUrl: "/resume.pdf",
      secondaryCtaText: "Explore Projects",
      secondaryCtaUrl: "#projects",
      statusBadge: "[ Available for Full-Time Roles 🟢 ]",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  });
  console.log("✅ Hero section seeded");

  // --------------------------------------------------------
  // 2. ABOUT ME SECTION (Upsert Singleton with Json fields)
  // --------------------------------------------------------
  await prisma.aboutSection.upsert({
    where: { id: "about_singleton" },
    update: {},
    create: {
      id: "about_singleton",
      heading: "About Me",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      location: "Kolhapur, Maharashtra, India",
      stats: [
        { label: "DSA Solved", value: "350+" },
        { label: "Projects Completed", value: "8+" },
        { label: "Primary Stack", value: "Next.js / MERN" },
        { label: "Architecture", value: "100% Typed" },
      ],
      background: {
        summary:
          "Full-stack engineer with an MCA background, dedicated to building responsive interfaces, normalized database architectures, and high-performance server actions.",
        passions: ["System Architecture", "C++ Algorithm Tracing", "Specialty Coffee Brewing", "Open Source"],
      },
      highlights: [
        "Specialized in Next.js App Router, Prisma ORM, and PostgreSQL.",
        "Experienced in role-based auth, secure JWTs, and cloud storage pipelines.",
        "Strong foundation in algorithmic problem-solving, recursion, and tree/graph patterns.",
      ],
    },
  });
  console.log("✅ About section seeded");

  // --------------------------------------------------------
  // 3. SKILL CATEGORIES & SKILLS (With SkillFamiliarity Enum)
  // --------------------------------------------------------
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();

  const skillData = [
    {
      name: "Frontend Development",
      order: 1,
      skills: [
        { name: "React.js", iconKey: "react", familiarity: SkillFamiliarity.CORE, order: 1 },
        { name: "Next.js", iconKey: "nextjs", familiarity: SkillFamiliarity.CORE, order: 2 },
        { name: "TypeScript", iconKey: "typescript", familiarity: SkillFamiliarity.CORE, order: 3 },
        { name: "Tailwind CSS", iconKey: "tailwind", familiarity: SkillFamiliarity.CORE, order: 4 },
        { name: "HTML5 / CSS3", iconKey: "html", familiarity: SkillFamiliarity.CORE, order: 5 },
      ],
    },
    {
      name: "Backend & Database",
      order: 2,
      skills: [
        { name: "Node.js", iconKey: "nodejs", familiarity: SkillFamiliarity.CORE, order: 1 },
        { name: "Express.js", iconKey: "express", familiarity: SkillFamiliarity.CORE, order: 2 },
        { name: "PostgreSQL", iconKey: "postgresql", familiarity: SkillFamiliarity.CORE, order: 3 },
        { name: "Prisma ORM", iconKey: "prisma", familiarity: SkillFamiliarity.CORE, order: 4 },
        { name: "REST APIs", iconKey: "api", familiarity: SkillFamiliarity.CORE, order: 5 },
        { name: "MongoDB", iconKey: "mongodb", familiarity: SkillFamiliarity.FAMILIAR, order: 6 },
      ],
    },
    {
      name: "Core CS & Algorithms",
      order: 3,
      skills: [
        { name: "C++", iconKey: "cpp", familiarity: SkillFamiliarity.CORE, order: 1 },
        { name: "Data Structures & Algorithms", iconKey: "dsa", familiarity: SkillFamiliarity.CORE, order: 2 },
        { name: "OOP Principles", iconKey: "oop", familiarity: SkillFamiliarity.CORE, order: 3 },
        { name: "Database Design", iconKey: "db", familiarity: SkillFamiliarity.CORE, order: 4 },
      ],
    },
    {
      name: "AI & Modern Tooling",
      order: 4,
      skills: [
        { name: "Gemini API", iconKey: "gemini", familiarity: SkillFamiliarity.CORE, order: 1 },
        { name: "Git & GitHub", iconKey: "github", familiarity: SkillFamiliarity.CORE, order: 2 },
        { name: "Postman", iconKey: "postman", familiarity: SkillFamiliarity.CORE, order: 3 },
        { name: "Linux / Bash", iconKey: "linux", familiarity: SkillFamiliarity.FAMILIAR, order: 4 },
        { name: "Vercel", iconKey: "vercel", familiarity: SkillFamiliarity.CORE, order: 5 },
      ],
    },
  ];

  for (const cat of skillData) {
    await prisma.skillCategory.create({
      data: {
        name: cat.name,
        order: cat.order,
        skills: {
          create: cat.skills,
        },
      },
    });
  }
  console.log("✅ Skills & Categories seeded");

  // --------------------------------------------------------
  // 4. PROJECTS (With Category, Type, Points & TechStack)
  // --------------------------------------------------------
  await prisma.project.deleteMany();

  await prisma.project.createMany({
    data: [
      {
        title: "AI Kanban Job Tracker",
        category: "Full Stack Web & AI",
        type: "Personal Project",
        description:
          "Workflow dashboard designed to track job applications across stages with automated job link scraping and AI summary extraction.",
        points: [
          "Engineered drag-and-drop Kanban workflow with real-time UI state revalidation.",
          "Integrated Gemini API to extract salary bounds, key skills, and requirements directly from job URLs.",
          "Constructed relational data schemas in PostgreSQL utilizing Prisma ORM and Next.js Server Actions.",
        ],
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Gemini API"],
        imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
        liveUrl: "https://example.com/job-tracker",
        githubUrl: "https://github.com/example/job-tracker",
        featured: true,
        order: 1,
      },
      {
        title: "StudyHub AI Assistant",
        category: "AI & Education",
        type: "Fellowship Project",
        description:
          "Collaborative study assistant that synthesizes complex lecture notes into structured roadmaps and revision cards.",
        points: [
          "Constructed high-throughput Server Actions to stream AI completions directly to client views.",
          "Implemented modular component architecture with Retro UI design tokens.",
          "Lowered client bundle weight by offloading markdown compilation to React Server Components.",
        ],
        techStack: ["Next.js", "React", "Node.js", "Gemini AI", "Tailwind CSS"],
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
        liveUrl: "https://example.com/studyhub",
        githubUrl: "https://github.com/example/studyhub-ai",
        featured: true,
        order: 2,
      },
      {
        title: "Store Rating & Review Platform",
        category: "Full Stack Web",
        type: "Production Build",
        description:
          "E-commerce feedback engine with role-based access control (RBAC), verified user reviews, and analytical ratings aggregation.",
        points: [
          "Implemented secure JWT authentication and role-based route middleware for Admins and Customers.",
          "Formulated complex SQL aggregation pipelines to compute weighted average ratings in real time.",
        ],
        techStack: ["React", "Node.js", "Express", "PostgreSQL", "Prisma"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
        liveUrl: "https://example.com/store-rating",
        githubUrl: "https://github.com/example/store-rating",
        featured: false,
        order: 3,
      },
    ],
  });
  console.log("✅ Projects seeded");

  // --------------------------------------------------------
  // 5. EXPERIENCE (With Status Enum & Description)
  // --------------------------------------------------------
  await prisma.experience.deleteMany();

  await prisma.experience.createMany({
    data: [
      {
        role: "Software Engineering Fellow",
        company: "Headstarter",
        location: "Remote",
        startDate: "July 2024",
        endDate: "August 2024",
        status: Status.COMPLETED,
        description:
          "Collaborated in an agile team to architect and ship 5 full-stack web applications and AI tools in an intensive fellowship.",
        points: [
          "Constructed full-stack features using Next.js, Node.js, and generative AI APIs.",
          "Led team code reviews, CI/CD pipeline deployments, and weekly agile retrospectives.",
        ],
        order: 1,
      },
      {
        role: "Web Developer Intern",
        company: "iGAP Technologies",
        location: "Kolhapur, India",
        startDate: "June 2024",
        endDate: "July 2024",
        status: Status.COMPLETED,
        description: "Built scalable backend REST APIs and managed client-side UI workflows.",
        points: [
          "Developed REST API endpoints using Node.js and Express to serve dynamic application feeds.",
          "Collaborated with senior engineers on database normalization and SQL indexing.",
        ],
        order: 2,
      },
      {
        role: "React Developer Intern",
        company: "PRIVA Technologies",
        location: "Remote",
        startDate: "May 2023",
        endDate: "September 2023",
        status: Status.COMPLETED,
        description: "Engineered responsive frontend interfaces and modernized client state management.",
        points: [
          "Constructed responsive brand pages from Figma specifications with modern React hooks.",
          "Refactored legacy UI components, reducing redundant re-renders.",
        ],
        order: 3,
      },
    ],
  });
  console.log("✅ Experience entries seeded");

  // --------------------------------------------------------
  // 6. EDUCATION (With Description & Points)
  // --------------------------------------------------------
  await prisma.education.deleteMany();

  await prisma.education.createMany({
    data: [
      {
        degree: "Master of Computer Applications (MCA)",
        institution: "CSIBER",
        location: "Kolhapur, Maharashtra",
        startYear: "2023",
        endYear: "2025",
        grade: "First Class with Distinction",
        description:
          "Post-graduate program specializing in advanced web technologies, distributed systems, algorithms, and database architecture.",
        points: [
          "Core Coursework: Advanced Data Structures, Database Systems, Full-Stack Web Development.",
          "Constructed an academic portal management system as a capstone project.",
        ],
        order: 1,
      },
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "CSIBER",
        location: "Kolhapur, Maharashtra",
        startYear: "2019",
        endYear: "2022",
        grade: "First Class with Distinction",
        description:
          "Foundational degree in Computer Science, Object-Oriented Programming, and Software Engineering.",
        points: [
          "Core Coursework: C++, Java, Data Structures, Computer Networks, and Software Engineering.",
          "Graduated with distinction and led college technical project exhibitions.",
        ],
        order: 2,
      },
    ],
  });
  console.log("✅ Education entries seeded");

  // --------------------------------------------------------
  // 7. UNIVERSAL SOCIAL LINKS
  // --------------------------------------------------------
  await prisma.socialLink.deleteMany();

  await prisma.socialLink.createMany({
    data: [
      {
        title: "View / Download Resume",
        url: "/resume.pdf",
        iconKey: "resume",
        isPrimary: true,
        order: 1,
      },
      {
        title: "GitHub",
        url: "https://github.com/",
        iconKey: "github",
        isPrimary: false,
        order: 2,
      },
      {
        title: "LinkedIn",
        url: "https://linkedin.com/in/",
        iconKey: "linkedin",
        isPrimary: false,
        order: 3,
      },
      {
        title: "LeetCode",
        url: "https://leetcode.com/",
        iconKey: "leetcode",
        isPrimary: false,
        order: 4,
      },
      {
        title: "Contact Email",
        url: "mailto:sanketkumbhar.dev@gmail.com",
        iconKey: "mail",
        isPrimary: false,
        order: 5,
      },
    ],
  });
  console.log("✅ Universal social links seeded");

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });