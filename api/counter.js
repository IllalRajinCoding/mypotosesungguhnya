import fs from 'fs';
import path from 'path';

// Path to JSON file (will be created in .vercel/output directory)
const counterPath = path.join(process.cwd(), 'data', 'visitors.json');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  try {
    let count = 0;

    // Read existing count or create new file
    try {
      const data = fs.readFileSync(counterPath, 'utf-8');
      count = JSON.parse(data).count || 0;
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Create directory if doesn't exist
        fs.mkdirSync(path.dirname(counterPath), { recursive: true });
        fs.writeFileSync(counterPath, JSON.stringify({ count: 0 }));
      } else {
        throw err;
      }
    }

    // Increment count on POST request
    if (req.method === 'POST') {
      count++;
      fs.writeFileSync(counterPath, JSON.stringify({ count }));
    }

    res.status(200).json({ visitors: count });
  } catch (err) {
    console.error('Counter error:', err);
    res.status(500).json({ error: 'Failed to update counter' });
  }
}