import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase.from('page_views').insert({
          page_path: location.pathname,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent
        });
        
        if (error) {
          console.error('Page view insert error:', error);
        } else {
          console.log('Page view tracked:', location.pathname);
        }
      } catch (error) {
        console.error('Page view tracking error:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
}
