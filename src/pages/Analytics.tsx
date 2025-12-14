import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, TrendingUp, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';


interface PageViewStats {
  page_path: string;
  view_count: number;
}

export default function Analytics() {
  const [totalViews, setTotalViews] = useState(0);
  const [topPages, setTopPages] = useState<PageViewStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('7');

  useEffect(() => {
    fetchAnalytics();
  }, [dateFilter]);

  async function fetchAnalytics() {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateFilter));
      const { count } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', daysAgo.toISOString());

      setTotalViews(count || 0);

      const { data } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('viewed_at', daysAgo.toISOString())
        .order('viewed_at', { ascending: false })
        .limit(1000);

      if (data) {
        const pathCounts = data.reduce((acc, { page_path }) => {
          acc[page_path] = (acc[page_path] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const sorted = Object.entries(pathCounts)
          .map(([page_path, view_count]) => ({ page_path, view_count }))
          .sort((a, b) => b.view_count - a.view_count)
          .slice(0, 10);

        setTopPages(sorted);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="h-full max-h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground">Website performance overview</p>
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Today</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="180">6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Total Views</p>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Unique Pages</p>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{topPages.length}</p>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Top Page</p>
              <TrendingUp className="h-4 w-4 text-golden" />
            </div>
            <p className="text-sm font-bold truncate">{topPages[0]?.page_path || 'N/A'}</p>
            <p className="text-xs text-muted-foreground">{topPages[0]?.view_count || 0} views</p>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Avg/Day</p>
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{Math.round(totalViews / parseInt(dateFilter))}</p>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-card rounded-lg border flex-1 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-display text-lg font-bold">Top Pages</h2>
          </div>
          <div className="h-full overflow-auto">
            {topPages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No page views yet
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {topPages.map(({ page_path, view_count }, index) => {
                  const percentage = ((view_count / totalViews) * 100).toFixed(1);
                  return (
                    <div key={page_path} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{page_path}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-golden" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{view_count}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
