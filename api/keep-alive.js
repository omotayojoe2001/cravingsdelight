import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // Verify cron secret for security
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Ping database to keep it active
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      message: 'Supabase keep-alive successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
