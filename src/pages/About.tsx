import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { brandContent } from "@/data/menu";
import { Mail, Instagram } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const About = () => {
  return (
    <Layout>
      <SEOHead 
        title="About Us - Authentic African Cuisine Story | Cravings Delight Hull"
        description="Learn about Cravings Delight, Hull's premier African cuisine restaurant. Discover our story, values, and commitment to authentic Nigerian and West African food. Quality, culture, and excellence."
        keywords="about Cravings Delight, African restaurant Hull, Nigerian food story, authentic African cuisine, West African heritage"
      />
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="text-golden font-medium text-sm tracking-wide uppercase mb-2 block">
                Our Story
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                About <span className="text-gradient-wine">Cravings Delight</span>
              </h1>
            </div>

            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft mb-12">
              <p className="text-lg text-foreground leading-relaxed mb-6">
                {brandContent.aboutStory}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {brandContent.servicesBlurb}
              </p>
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: "Authenticity",
                  description:
                    "Every dish is crafted using traditional recipes and premium African ingredients.",
                },
                {
                  title: "Excellence",
                  description:
                    "We take pride in delivering meals that meet the highest standards of quality.",
                },
                {
                  title: "Culture",
                  description:
                    "Our food tells the story of our rich and versatile African heritage.",
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-card rounded-xl p-6 text-center shadow-soft"
                >
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-primary rounded-2xl p-8 text-primary-foreground text-center"
            >
              <h2 className="font-display text-2xl font-bold mb-6">
                Get in Touch
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a
                  href={`mailto:${brandContent.contactEmail}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-medium">{brandContent.contactEmail}</span>
                </a>
                <a
                  href={`https://instagram.com/${brandContent.instagramHandle.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="font-medium">{brandContent.instagramHandle}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
