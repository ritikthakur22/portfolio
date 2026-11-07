import { expect, test, vi } from "vitest";
import { fetchGithubActivity } from "@/lib/github";

const repo = (name: string, isFork = false) => ({ name, url: `https://github.com/ritikthakur22/${name}`, description: null, pushedAt: "2026-11-01T00:00:00Z", isFork });
const payload = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 7,
          weeks: [{ contributionDays: [{ date: "2026-11-01", contributionCount: 3 }, { date: "2026-11-02", contributionCount: 4 }] }],
        },
      },
      repositories: { nodes: [repo("a"), repo("test"), repo("fork", true), repo("b"), repo("prank"), repo("c"), repo("d"), repo("e"), repo("f"), repo("g"), repo("simulation")] },
    },
  },
};
const ok = (body: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }));

test("maps the contribution calendar", async () => {
  const r = await fetchGithubActivity("t", ok(payload));
  expect(r?.total).toBe(7);
  expect(r?.weeks).toEqual([[{ date: "2026-11-01", count: 3 }, { date: "2026-11-02", count: 4 }]]);
});

test("repos skip forks and junk repos, max 6", async () => {
  const r = await fetchGithubActivity("t", ok(payload));
  expect(r?.repos.map((x) => x.name)).toEqual(["a", "b", "c", "d", "e", "f"]);
  expect(r?.repos[0].description).toBe("");
});

test("returns null without a token", async () => {
  const f = ok(payload);
  expect(await fetchGithubActivity(undefined, f)).toBeNull();
  expect(f).not.toHaveBeenCalled();
});

test("returns null on a failed request", async () => {
  expect(await fetchGithubActivity("t", vi.fn(async () => new Response("no", { status: 502 })))).toBeNull();
  expect(await fetchGithubActivity("t", vi.fn(async () => { throw new Error("offline"); }))).toBeNull();
  expect(await fetchGithubActivity("t", ok({ errors: [{ message: "bad" }] }))).toBeNull();
});
