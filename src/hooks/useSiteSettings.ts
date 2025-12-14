import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
  contact_email: string;
  instagram_handle: string;
  instagram_url: string;
  whatsapp_number: string;
  business_location: string;
  order_processing_time: string;
  shipping_note: string;
}

const defaultSettings: SiteSettings = {
  contact_email: 'cravingsdelight2025@gmail.com',
  instagram_handle: '@cravings_delighthull',
  instagram_url: 'https://instagram.com/cravings_delighthull',
  whatsapp_number: '+447741069639',
  business_location: 'Hull, United Kingdom',
  order_processing_time: '3-5 WORKING DAYS AFTER PAYMENT',
  shipping_note: 'Once order is placed please give 4-5 working days for orders to be processed and shipped'
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value');

        if (!error && data) {
          const settingsMap = data.reduce((acc, { setting_key, setting_value }) => {
            acc[setting_key] = setting_value;
            return acc;
          }, {} as Record<string, string>);

          setSettings({ ...defaultSettings, ...settingsMap });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}
