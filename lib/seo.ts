import { profile } from "@/content/profile";
import { featuredProjects, projects } from "@/content/projects";
import type { Project } from "@/content/types";

export const SITE_URL = "https://www.ritikthakur.com.np";
export const SITE_TITLE = "Ritik Thakur | Software Developer, Web & Mobile Apps";
const sameAs = profile.socials.filter((s) => s.href.startsWith("https")).map((s) => s.href);

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    image: `${SITE_URL}${profile.photo}`,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressCountry: "NP" },
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education[0].org },
    worksFor: { "@type": "Organization", name: profile.experience[0].org },
    knowsAbout: profile.skills.flatMap((g) => g.items),
    sameAs,
  };
}

export function projectJsonLd(p: Project) {
  const play = p.playStoreId && `https://play.google.com/store/apps/details?id=${p.playStoreId}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.summary,
    url: `${SITE_URL}/projects/${p.slug}`,
    applicationCategory: "Application",
    operatingSystem: p.platforms.join(", "),
    image: `${SITE_URL}${p.image}`,
    author: { "@type": "Person", name: profile.name, url: SITE_URL },
    ...(play ? { installUrl: play, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : {}),
  };
}

export function breadcrumbJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/projects/${p.slug}` },
    ],
  };
}

/** Plain-text summary for AI search tools (llmstxt.org format). */
export function llmsTxt() {
  return [
    `# ${profile.name}`,
    "",
    `> ${profile.title}. ${profile.summary}`,
    "",
    `Email: ${profile.email}. Location: ${profile.location}. ${profile.availability}.`,
    "",
    "## Featured projects",
    ...featuredProjects.map((p) => `- [${p.name}](${SITE_URL}/projects/${p.slug}): ${p.tagline}. ${p.summary}`),
    "",
    "## More projects",
    ...projects.filter((p) => !p.featured).map((p) => `- [${p.name}](${p.links[0].href}): ${p.summary}`),
    "",
    "## Experience",
    ...profile.experience.map((r) => `- ${r.title}, ${r.org} (${r.period})`),
    "",
    "## Links",
    ...sameAs.map((u) => `- ${u}`),
    `- [Resume](${SITE_URL}${profile.resumePath})`,
    "",
  ].join("\n");
}

export const jsonLdScript = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
