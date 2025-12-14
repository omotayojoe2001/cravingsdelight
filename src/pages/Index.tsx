import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/sections/Hero";
import { FeaturedMenu } from "@/components/menu/FeaturedMenu";
import { Services } from "@/components/sections/Services";
import { CateringSection } from "@/components/sections/CateringSection";
import { ReviewSection } from "@/components/sections/ReviewSection";
import { SEOHead } from "@/components/SEOHead";
import { RecentReviewsSidebar } from "@/components/reviews/RecentReviewsSidebar";

const Index = () => {
  return (
    <Layout>
      <SEOHead />
      <Hero />
      <FeaturedMenu />
      <Services />
      <CateringSection />
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28 py-12">
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <ReviewSection />
          <aside className="hidden lg:block">
            <RecentReviewsSidebar />
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
