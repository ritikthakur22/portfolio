export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  platforms: string[];
  links: Link[];
  playStoreId?: string;
  /** Cover image path under /public, or "" to use a generated card. */
  image: string;
  images: string[];
  year: string;
  featured: boolean;
  /** Case-study paragraphs. Empty for non-featured projects. */
  body: string[];
  /** Small attribution shown at the foot of the case study. */
  credit?: string;
};

export type Role = { title: string; org: string; orgUrl?: string; period: string; points: string[] };

export type SkillGroup = { name: string; items: string[] };
