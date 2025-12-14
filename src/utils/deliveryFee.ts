import { supabase } from '@/lib/supabase';

export async function calculateDeliveryFee(postcode: string): Promise<number> {
  if (!postcode || postcode.length < 3) return 0; // No fee until valid postcode
  
  // Extract postcode prefix (e.g., "HU1 2AB" -> "HU1")
  const prefix = postcode.toUpperCase().replace(/\s+/g, '').match(/^[A-Z]+\d+/)?.[0];
  
  if (!prefix) return 0;
  
  try {
    // Check if postcode exists in delivery_zones table
    const { data: zone } = await supabase
      .from('delivery_zones')
      .select('delivery_fee')
      .eq('postcode_prefix', prefix)
      .eq('is_active', true)
      .single();
    
    if (zone) {
      return zone.delivery_fee;
    }
    
    // Fallback to settings-based fees
    const { data: settings } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['delivery_fee_hull', 'delivery_fee_outside']);
    
    const settingsMap = settings?.reduce((acc, s) => ({ ...acc, [s.setting_key]: parseFloat(s.setting_value) }), {}) || {};
    
    const hullFee = settingsMap.delivery_fee_hull || 10.00;
    const outsideFee = settingsMap.delivery_fee_outside || 20.00;
    
    return isHullPostcode(postcode) ? hullFee : outsideFee;
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    // Final fallback
    return isHullPostcode(postcode) ? 10.00 : 20.00;
  }
}

export function isHullPostcode(postcode: string): boolean {
  if (!postcode) return false;
  
  const prefix = postcode.toUpperCase().replace(/\s+/g, '').match(/^[A-Z]+\d+/)?.[0];
  return prefix ? prefix.startsWith('HU') : false;
}