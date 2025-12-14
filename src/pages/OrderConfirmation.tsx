import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { brandContent } from "@/data/menu";

const OrderConfirmation = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your order. We have received your payment and will
              begin preparing your delicious meals.
            </p>

            {/* Processing Time */}
            <div className="bg-primary rounded-xl p-6 text-primary-foreground mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Processing Time</span>
              </div>
              <p className="text-xl font-bold">{brandContent.orderProcessing}</p>
              <p className="text-sm text-primary-foreground/80 mt-2">
                {brandContent.shippingNote}
              </p>
            </div>

            {/* Email Confirmation */}
            <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-golden" />
                <span className="font-medium">Confirmation Email</span>
              </div>
              <p className="text-muted-foreground text-sm">
                A confirmation email with your order details has been sent to
                your email address. If you have any questions, please contact us
                at{" "}
                <a
                  href={`mailto:${brandContent.contactEmail}`}
                  className="text-primary font-medium hover:underline"
                >
                  {brandContent.contactEmail}
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button variant="wine" size="lg">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderConfirmation;
