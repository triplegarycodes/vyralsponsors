import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ModulesSection } from "@/components/home/ModulesSection";
import { ProblemSolutionSection } from "@/components/home/ProblemSolutionSection";
import { NeoSection } from "@/components/home/NeoSection";
import { FutureSection } from "@/components/home/FutureSection";
import { MerchSection } from "@/components/home/MerchSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ModulesSection />
      <ProblemSolutionSection />
      <NeoSection />
      <FutureSection />
      <MerchSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
