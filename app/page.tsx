import PortfolioNav from "@/components/PortfolioNav";
import EngineeringHero from "@/components/EngineeringHero";
import Studio from "@/components/Studio";
import WorkIndex from "@/components/WorkIndex";
import ProfileChapters from "@/components/ProfileChapters";

export default function Portfolio() {
  return (
    <>
      <PortfolioNav />
      <main id="main-content" tabIndex={-1}>
        <EngineeringHero />
        <Studio />
        <WorkIndex />
        <ProfileChapters />
      </main>
    </>
  );
}
