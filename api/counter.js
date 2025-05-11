import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Dapatkan nilai counter saat ini
    const { data: current, error } = await supabase
      .from('visitor_counter')
      .select('count')
      .eq('id', 1)
      .single();

    if (error) throw error;

    // 2. Update counter (+1)
    const { data: updated, error: updateError } = await supabase
      .from('visitor_counter')
      .update({ count: current.count + 1 })
      .eq('id', 1)
      .select();

    if (updateError) throw updateError;

    // 3. Return nilai terbaru
    return res.status(200).json({
      success: true,
      visitors: updated[0].count
    });

  } catch (error) {
    console.error('Supabase Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update counter',
      details: error.message
    });
  }
}