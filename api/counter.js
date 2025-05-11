import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize counter if it doesn't exist
    let visitors = await kv.get('visitors');
    if (visitors === null) {
      await kv.set('visitors', 0);
      visitors = 0;
    }

    // Increment counter for POST requests
    if (req.method === 'POST') {
      visitors = await kv.incr('visitors');
    }

    return res.status(200).json({
      success: true,
      visitors: Number(visitors)
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