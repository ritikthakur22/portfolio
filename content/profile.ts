import type { Link, Role, SkillGroup } from "./types";

export const profile = {
  name: "Ritik Thakur",
  title: "Software Developer, Web & Mobile Applications",
  tagline: "I build and ship web, Android and cross-platform apps.",
  summary:
    "Computer Engineering student and software developer. I build React frontends and backend APIs in a professional team, and I've shipped Android apps to Google Play along with my own products across web and mobile. I work with React Native, PostgreSQL, FastAPI, Linux, CI/CD and cloud deployment.",
  email: "contact@ritikthakur.com.np",
  location: "Nepal",
  availability: "Open to remote freelance & full-time roles · Nepal & international",
  socials: [
    { label: "GitHub", href: "https://github.com/ritikthakur22" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ritik-thakur-a82b73412" },
    { label: "Email", href: "mailto:contact@ritikthakur.com.np" },
  ] satisfies Link[],
  resumePath: "/resume.pdf" as const,
  photo: "/ritik.webp",
  experience: [
    {
      title: "Software Developer Intern",
      org: "Baudhika Learning Pvt. Ltd.",
      period: "Sep 2026 – Present",
      points: [
        "Build React frontend features and work on backend API development.",
        "Help with React Native app development and Android production releases through Google Play Console.",
        "Contribute to early-stage products, including a hiring platform and a school and college ERP.",
      ],
    },
    {
      title: "Independent Software Developer",
      org: "Self-Directed / Open Source",
      period: "2025 – Present",
      points: [
        "Build and maintain my own Android, web and cross-platform apps, from development through testing and release.",
        "Manage GitHub repositories, app releases, cloud deployments and CI/CD workflows.",
      ],
    },
  ] satisfies Role[],
  education: [
    {
      title: "Bachelor of Computer Engineering",
      org: "Advanced College of Engineering and Management (ACEM), Tribhuvan University",
      period: "2080 BS – 2084 BS",
      points: ["Expected graduation: 2084 BS."],
    },
    {
      title: "Higher Secondary Education (+2), Science",
      org: "MIT, Janakpur, Nepal",
      period: "2078 – 2080 BS",
      points: ["GPA 3.02 / 4.00."],
    },
  ] satisfies Role[],
  skills: [
    { name: "Languages", items: ["C", "C++", "C#", "Java", "Python", "JavaScript", "TypeScript", "Kotlin", "Dart"] },
    { name: "Frontend", items: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS"] },
    { name: "Mobile", items: ["React Native", "Expo", "Android", "Jetpack Compose", "Flutter", "Capacitor"] },
    { name: "Backend & APIs", items: ["FastAPI", "Node.js", "NestJS", "Express", "REST APIs", "Firebase Auth"] },
    { name: "Database & ORM", items: ["PostgreSQL (Neon)", "SQLite", "Prisma"] },
    { name: "DevOps & Cloud", items: ["Git", "GitHub Actions", "CI/CD", "Vercel", "Render", "Cloudflare", "VPS"] },
    {
      name: "AI & agentic engineering",
      items: ["LLM APIs (Groq, OpenRouter)", "Local models (Ollama, Hermes)", "RAG", "AI coding agents (CLI, IDE, cloud)"],
    },
    { name: "Security", items: ["Linux hardening", "Android kernels", "End-to-end encryption"] },
    { name: "Systems & Tools", items: ["Linux", "Bash", "ADB", "Android Studio", "VS Code", "Visual Studio", "Gradle"] },
  ] satisfies SkillGroup[],
  stats: [
    { value: "5", label: "shipped projects" },
    { value: "3", label: "apps on Google Play" },
    { value: "2025", label: "building independently" },
  ],
};
