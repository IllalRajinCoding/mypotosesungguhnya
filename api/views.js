export default async function handler(req, res) {
  const firebaseUrl = "https://count-72f08-default-rtdb.firebaseio.com/L.json"; // Ensure URL is correct

  try {
    // Get current value (ensure it's available in Firebase)
    const getRes = await fetch(firebaseUrl);

    // Check if the fetch request was successful
    if (!getRes.ok) {
      throw new Error(`Error fetching from Firebase: ${getRes.statusText}`);
    }

    const current = await getRes.json();

    // Set updated count (default to 0 if undefined or null)
    const updated = (current || 0) + 1;

    // Update the views in Firebase
    const updateRes = await fetch(firebaseUrl, {
      method: 'PUT', // PUT used to overwrite the data
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    if (!updateRes.ok) {
      throw new Error(`Error updating Firebase: ${updateRes.statusText}`);
    }

    // Respond with updated view count
    res.status(200).json({ views: updated });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: `Failed to update counter: ${err.message}` });
  }
}
