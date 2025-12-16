import { ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { setupStorage } from '@/lib/storage-setup';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, ShoppingBag, Package, Star, Calendar, BarChart3, Settings, LogOut, Menu, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    setUser(session.user);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success('Logged out');
    navigate('/admin/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/reviews', icon: Star, label: 'Reviews' },
    { path: '/admin/catering', icon: Calendar, label: 'Catering' },
    { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const Sidebar = ({ className = '' }) => (
    <aside className={`w-72 min-h-screen bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 ${className}`}>
      <div className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CD</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Cravings Delight</h2>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <Badge variant="secondary" className="text-xs">Pro</Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-11 transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
                      : 'hover:bg-white/80 hover:shadow-sm text-slate-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative">
              <Sidebar />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="font-semibold text-slate-900">Admin Dashboard</h1>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
