import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

import { usePageView } from "@/hooks/usePageView";

export function Layout({ children }: LayoutProps) {
  usePageView();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-warm">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
