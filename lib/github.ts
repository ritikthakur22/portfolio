export type GithubActivity = {
  weeks: { date: string; count: number }[][];
  total: number;
  repos: { name: string; url: string; description: string; pushedAt: string }[];
};

const HIDDEN = new Set(["test", "simulation", "prank", "ritikthakur22"]);

const QUERY = `query {
  user(login: "ritikthakur22") {
    contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
    repositories(first: 20, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes { name url description pushedAt isFork }
    }
  }
}`;

type Raw = {
  data?: {
    user: {
      contributionsCollection: { contributionCalendar: { totalContributions: number; weeks: { contributionDays: { date: string; contributionCount: number }[] }[] } };
      repositories: { nodes: { name: string; url: string; description: string | null; pushedAt: string; isFork: boolean }[] };
    };
  };
};

/** Returns null whenever the data can't be fetched, so the section simply hides. */
export async function fetchGithubActivity(token: string | undefined, fetchImpl: typeof fetch = fetch): Promise<GithubActivity | null> {
  if (!token) return null;
  try {
    const res = await fetchImpl("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
    });
    if (!res.ok) return null;
    const user = ((await res.json()) as Raw).data?.user;
    if (!user) return null;
    const cal = user.contributionsCollection.contributionCalendar;
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
      repos: user.repositories.nodes
        .filter((r) => !r.isFork && !HIDDEN.has(r.name))
        .slice(0, 6)
        .map((r) => ({ name: r.name, url: r.url, description: r.description ?? "", pushedAt: r.pushedAt })),
    };
  } catch {
    return null;
  }
}
