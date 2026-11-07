import * as si from "simple-icons";

// skill name (as written in content/profile.ts) → simple-icons export
const map: Record<string, keyof typeof si> = {
  React: "siReact",
  "React Native": "siReact",
  "Next.js": "siNextdotjs",
  "Tailwind CSS": "siTailwindcss",
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  Python: "siPython",
  Kotlin: "siKotlin",
  Dart: "siDart",
  Flutter: "siFlutter",
  Android: "siAndroid",
  Expo: "siExpo",
  FastAPI: "siFastapi",
  "Node.js": "siNodedotjs",
  NestJS: "siNestjs",
  Express: "siExpress",
  "Firebase Auth": "siFirebase",
  "PostgreSQL (Neon)": "siPostgresql",
  SQLite: "siSqlite",
  Prisma: "siPrisma",
  Git: "siGit",
  "GitHub Actions": "siGithubactions",
  Vercel: "siVercel",
  Render: "siRender",
  Cloudflare: "siCloudflare",
  Linux: "siLinux",
  Bash: "siGnubash",
  "Local models (Ollama, Hermes)": "siOllama",
  "C++": "siCplusplus",
  C: "siC",
  "Jetpack Compose": "siJetpackcompose",
  "Android Studio": "siAndroidstudio",
  Gradle: "siGradle",
  HTML5: "siHtml5",
  CSS3: "siCss",
  Capacitor: "siCapacitor",
  Java: "siOpenjdk",
  "C#": "siDotnet",
};

export function TechIcon({ name }: { name: string }) {
  const icon = map[name] ? (si[map[name]] as { path: string } | undefined) : undefined;
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0 fill-current">
      <path d={icon.path} />
    </svg>
  );
}
