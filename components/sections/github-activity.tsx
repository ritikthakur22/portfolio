import { cacheLife } from "next/cache";
import { Ripple } from "@/components/motion/ripple";
import { fetchGithubActivity } from "@/lib/github";
import { SectionHeading } from "./section-heading";

async function getGithubActivity() {
  "use cache";
  cacheLife("days");
  return fetchGithubActivity(process.env.GITHUB_TOKEN);
}

const level = (n: number) =>
  n === 0 ? "var(--surface-2)" : `color-mix(in srgb, var(--accent) ${n < 3 ? 30 : n < 6 ? 55 : n < 10 ? 80 : 100}%, var(--surface-2))`;

export async function GithubActivity() {
  const data = await getGithubActivity();
  if (!data) return null;
  return (
    <section id="github" className="scroll-mt-20 px-4 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading intro={`${data.total} contributions on GitHub in the last year.`}>Always building.</SectionHeading>
        <Ripple className="overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="GitHub contributions, scroll sideways for the full year">
          <div className="flex w-max gap-[3px]" role="img" aria-label={`GitHub contribution graph: ${data.total} contributions in the last year`}>
            {data.weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]" style={{ "--w": i } as React.CSSProperties}>
                {week.map((d) => (
                  <span key={d.date} data-cell title={`${d.count} on ${d.date}`} className="size-[11px] rounded-[3px]" style={{ background: level(d.count) }} />
                ))}
              </div>
            ))}
          </div>
        </Ripple>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.repos.map((r) => (
            <li key={r.name}>
              <a href={r.url} target="_blank" rel="noreferrer" className="block h-full rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent">
                <span className="font-mono text-sm text-accent">{r.name}</span>
                {r.description && <span className="mt-2 line-clamp-2 block text-sm text-muted">{r.description}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
