import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { brandContent } from "@/data/menu";
import { Mail, Instagram, MapPin } from "lucide-react";
import { ReviewSection } from "@/components/sections/ReviewSection";
import { SEOHead } from "@/components/SEOHead";
import { RecentReviewsSidebar } from "@/components/reviews/RecentReviewsSidebar";

const Contact = () => {
  return (
    <Layout>
      <SEOHead 
        title="Contact Us - Get in Touch | Cravings Delight Hull"
        description="Contact Cravings Delight for orders, catering inquiries, or questions. Email us or follow on Instagram. Located in Hull, UK. We're here to help with your African cuisine needs."
        keywords="contact Cravings Delight, African restaurant Hull contact, order African food Hull, catering inquiry"
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
                Get in Touch
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Contact <span className="text-gradient-wine">Us</span>
              </h1>
              <p className="text-muted-foreground">
                We would love to hear from you. Reach out for orders, catering inquiries,
                or just to say hello!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.a
                href={`mailto:${brandContent.contactEmail}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-elevated transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-golden/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-golden/20 transition-colors">
                  <Mail className="h-6 w-6 text-golden" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Email Us
                </h3>
                <p className="text-primary text-sm break-all">
                  {brandContent.contactEmail}
                </p>
              </motion.a>

              <motion.a
                href={`https://instagram.com/${brandContent.instagramHandle.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-elevated transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-golden/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-golden/20 transition-colors">
                  <Instagram className="h-6 w-6 text-golden" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Instagram
                </h3>
                <p className="text-primary text-sm">
                  {brandContent.instagramHandle}
                </p>
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl p-6 text-center shadow-soft"
              >
                <div className="w-14 h-14 rounded-full bg-golden/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-golden" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Location
                </h3>
                <p className="text-muted-foreground text-sm">
                  Hull, United Kingdom
                </p>
              </motion.div>
            </div>


          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            <ReviewSection />
            <aside>
              <RecentReviewsSidebar />
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
