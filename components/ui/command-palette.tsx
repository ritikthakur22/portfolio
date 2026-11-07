import { ArrowRight, Bot, Copy, Download, FolderOpen, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { CURTAIN_EVENT } from "@/components/motion/curtain";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/motion";

type Action = { id: string; label: string; hint: string; icon: React.ReactNode; keywords?: string; run: () => void };

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");

  const actions = useMemo<Action[]>(() => {
    const go = (hash: string) => () => {
      if (location.pathname === "/") document.getElementById(hash)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      else router.push(`/#${hash}`);
    };
    const section = (id: string, label: string) => ({ id: `go-${id}`, label: `Go to ${label}`, hint: "Section", icon: <ArrowRight className="size-4" />, run: go(id) });
    return [
      section("work", "Work"),
      section("about", "About"),
      section("experience", "Experience"),
      section("skills", "Skills"),
      section("contact", "Contact"),
      ...featuredProjects.map((p) => ({
        id: `p-${p.slug}`,
        label: p.name,
        hint: "Case study",
        keywords: p.tagline,
        icon: <FolderOpen className="size-4" />,
        run: () => {
          const href = `/projects/${p.slug}`;
          if (prefersReducedMotion()) router.push(href);
          else dispatchEvent(new CustomEvent(CURTAIN_EVENT, { detail: { href, label: p.name } }));
        },
      })),
      { id: "theme", label: "Toggle theme", hint: "Light / dark", keywords: "dark light mode", icon: <SunMoon className="size-4" />, run: () => setTheme(resolvedTheme === "light" ? "dark" : "light") },
      {
        id: "email",
        label: "Copy email address",
        hint: profile.email,
        keywords: "contact mail",
        icon: <Copy className="size-4" />,
        run: () => void navigator.clipboard?.writeText(profile.email).then(() => setToast("Email copied")),
      },
      {
        id: "resume",
        label: "Download resume",
        hint: "PDF",
        keywords: "cv",
        icon: <Download className="size-4" />,
        run: () => {
          const a = Object.assign(document.createElement("a"), { href: profile.resumePath, download: "Ritik_Thakur_Resume.pdf" });
          a.click();
        },
      },
      { id: "chat", label: "Ask the AI about Ritik", hint: "Chat", keywords: "bot assistant question", icon: <Bot className="size-4" />, run: () => dispatchEvent(new Event("open-chat")) },
    ];
  }, [router, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? actions.filter((a) => `${a.label} ${a.keywords ?? ""}`.toLowerCase().includes(q)) : actions;
  }, [actions, query]);

  useEffect(() => {
    const d = dialog.current!;
    if (open && !d.open) {
      setQuery("");
      setActive(0);
      setToast("");
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  function run(a: Action | undefined) {
    if (!a) return;
    a.run();
    if (a.id !== "email") onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = results.length;
      if (n) setActive((i) => (i + (e.key === "ArrowDown" ? 1 : n - 1)) % n);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Command palette"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      className="m-auto mt-[14vh] w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-border bg-surface p-0 text-text shadow-[0_30px_80px_rgb(0_0_0/0.45)] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <input
        ref={input}
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-list"
        aria-activedescendant={results[active] ? `opt-${results[active].id}` : undefined}
        aria-label="Search commands"
        value={query}
        onChange={(e) => (setQuery(e.target.value), setActive(0))}
        onKeyDown={onKeyDown}
        placeholder="Type a command or search"
        className="w-full border-b border-border bg-transparent px-5 py-4 font-mono text-[15px] outline-none"
      />
      <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {results.map((a, i) => (
          <li
            key={a.id}
            id={`opt-${a.id}`}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setActive(i)}
            onClick={() => run(a)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-accent-soft aria-selected:text-accent"
          >
            <span className="text-accent">{a.icon}</span>
            {a.label}
            <span className="ml-auto truncate text-xs text-muted">{a.hint}</span>
          </li>
        ))}
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches. Try “work”, “theme” or a project name.</li>}
      </ul>
      <p className="flex justify-between border-t border-border px-5 py-2.5 font-mono text-[11px] text-muted" aria-live="polite">
        <span>↑↓ to move, Enter to run, Esc to close</span>
        <span className="text-accent">{toast}</span>
      </p>
    </dialog>
  );
}
