import { createClient } from '@supabase/supabase-js'

// Debugging: Log env vars (cek di Vercel Logs)
console.log('Supabase URL:', process.env.SUPABASE_URL?.slice(0, 10) + '...')
console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY?.slice(0, 10) + '...')

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: false
    }
  }
)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

  try {
    // 1. Get current count
    const { data, error } = await supabase
      .from('visitor_counter')
      .select('count')
      .eq('id', 1)
      .single()

    // 2. Handle missing record
    const currentCount = data?.count ?? 0
    const newCount = currentCount + 1

    // 3. Update count
    const { error: updateError } = await supabase
      .from('visitor_counter')
      .upsert({ id: 1, count: newCount })

    if (updateError) throw updateError

    return res.status(200).json({
      success: true,
      visitors: newCount
    })

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      supabaseError: error.code
    })

    return res.status(500).json({
      success: false,
      error: 'Internal error',
      requestId: req.headers['x-vercel-id']
    })
  }
}