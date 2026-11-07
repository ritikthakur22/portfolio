import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-start justify-center px-4 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-accent">404</p>
        <h1 className="mt-4 font-display text-[clamp(48px,9vw,128px)] leading-[0.9] font-extrabold tracking-[-0.04em]">This page doesn&apos;t exist.</h1>
        <p className="mt-6 max-w-md text-lg text-muted">The link may be old or mistyped. The work is all on the home page.</p>
        <Link href="/" className="mt-10 inline-block rounded-full bg-accent px-7 py-3.5 font-medium text-accent-ink">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
