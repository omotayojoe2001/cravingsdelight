import { Layout } from "@/components/layout/Layout";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { CateringSidebar } from "@/components/menu/CateringSidebar";
import { SEOHead } from "@/components/SEOHead";

const Menu = () => {
  return (
    <Layout>
      <SEOHead 
        title="Menu - Authentic African Dishes | Cravings Delight Hull"
        description="Browse our menu of authentic African cuisine. Jollof rice, Efo Riro, Peppersoup, Egusi, Okra soup, and more. Available in 2L & 3L bowls or full coolers. Order online for delivery in Hull."
        keywords="African food menu, Nigerian dishes, Jollof rice, Efo Riro, Peppersoup, Egusi soup, Okra soup, African meal delivery Hull"
      />
      <div className="container mx-auto px-4 md:px-12 lg:px-20 xl:px-28 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <MenuGrid />
          </div>
          <aside className="hidden lg:block">
            <CateringSidebar />
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
