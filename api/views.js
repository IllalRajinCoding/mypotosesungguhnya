export default async function handler(req, res) {
  // Restrict to POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const firebaseUrl = process.env.FIREBASE_COUNTER_URL || "https://count-72f08-default-rtdb.firebaseio.com/L.json";

  try {
    // Get current value
    const getRes = await fetch(firebaseUrl);
    if (!getRes.ok) throw new Error(`Firebase fetch failed: ${getRes.statusText}`);

    const current = await getRes.json();
    const updated = (current || 0) + 1;

    // Atomic update
    const updateRes = await fetch(firebaseUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    if (!updateRes.ok) throw new Error(`Firebase update failed: ${updateRes.statusText}`);

    // Respond with CORS support
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ views: updated });
  } catch (err) {
    console.error("Counter error:", err.message);
    res.status(500).json({ error: `Failed to update counter: ${err.message}` });
  }
}