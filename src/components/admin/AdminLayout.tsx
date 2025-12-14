import { ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { setupStorage } from '@/lib/storage-setup';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingBag, Package, Star, Calendar, BarChart3, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setupStorage();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success('Logged out');
    navigate('/admin/login');
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/reviews', icon: Star, label: 'Reviews' },
    { path: '/admin/catering', icon: Calendar, label: 'Catering' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className="w-72 min-h-screen bg-white border-r border-gray-200 p-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Cravings Delight</h2>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
