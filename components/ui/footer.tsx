import { cacheLife } from "next/cache";
import { profile } from "@/content/profile";

async function year() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border px-4 pt-24 pb-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs tracking-[0.14em] text-accent uppercase">Let&apos;s build something</p>
        <p className="mt-4 font-display text-[clamp(56px,15vw,240px)] leading-[0.85] font-extrabold tracking-[-0.05em] uppercase" data-outro>
          Ritik <span className="text-accent">Thakur</span>
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-sm text-muted">
          <ul className="flex flex-wrap gap-6">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="transition-colors hover:text-accent" {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {s.label === "Email" ? profile.email : s.label}
                </a>
              </li>
            ))}
          </ul>
          <p>© {await year()} {profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
