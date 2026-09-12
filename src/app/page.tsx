import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import GithubRepositories from "@/components/GithubRepositories";
import TimelineSection from "@/components/TimelineSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-zinc-100">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <GithubRepositories />
      <TimelineSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
