import { NextResponse, type NextRequest } from "next/server";
import { featuredProjects } from "@/content/projects";

const known = new Set(featuredProjects.map((p) => p.slug));

// Unknown case-study slugs would otherwise stream the page shell with a 200 before notFound() runs.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/\.[a-z0-9]+$/i.test(pathname)) return; // static files such as /projects/todo/1.webp
  const slug = pathname.split("/")[2];
  if (!known.has(slug)) return NextResponse.rewrite(new URL("/not-a-page", request.url));
}

export const config = { matcher: "/projects/:path+" };
