import { Marquee } from "@/components/motion/marquee";
import { About } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { GithubActivity } from "@/components/sections/github-activity";
import { Hero } from "@/components/sections/hero";
import { MoreProjects } from "@/components/sections/more-projects";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { Skills } from "@/components/sections/skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Marquee words={["Web", "Android", "Cross-platform", "React", "Next.js", "FastAPI", "Kotlin"]} />
      <Experience />
      <ProjectsShowcase />
      <MoreProjects />
      <Skills />
      <Marquee reverse words={["Ship it", "Test it", "Deploy it", "Repeat"]} />
      <GithubActivity />
      <ContactSection />
    </>
  );
}
