import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { profile } from "@/content/profile";
import { SectionHeading } from "./section-heading";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 px-4 py-28 sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
          <Image src={profile.photo} alt="Ritik Thakur at sunset in the hills" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </Reveal>
        <div>
          <SectionHeading>Engineering ideas into apps people use.</SectionHeading>
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">{profile.summary}</p>
            <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="text-muted">Based in</dt>
                <dd className="mt-1 text-base">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 text-base">
                  <a href={`mailto:${profile.email}`} className="underline decoration-border underline-offset-4 hover:decoration-accent">
                    {profile.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
