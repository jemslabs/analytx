import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import ProblemSolutionSection from "@/components/ProblemSolutionSection"
import FeaturesSection from "@/components/FeatureSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import PricingSection from "@/components/PricingSection"
import Footer from "@/components/FooterSection"

export default function Home() {
  return (
    <main className="bg-muted text-foreground">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
