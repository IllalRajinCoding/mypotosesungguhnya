// api/visitors.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  let count = await kv.get('visitorCount') || 0;
  count = parseInt(count) + 1;
  await kv.set('visitorCount', count.toString());

  res.status(200).json({
    totalVisitors: count,
    lastVisit: new Date().toISOString()
  });
}