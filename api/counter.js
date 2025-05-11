import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS (Allows your frontend to call this API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  try {
    // Increment visitor count (Auto-initializes to 1 if key doesn't exist)
    const visitors = await kv.incr('visitor_count');

    // Return the updated count
    return res.status(200).json({
      success: true,
      visitors
    });

  } catch (error) {
    console.error('KV Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update counter',
      details: error.message
    });
  }
}