export default async function handler(req, res) {
  const firebaseUrl = "https://count-72f08-default-rtdb.firebaseio.com/L.json"; // Pastikan URL valid

  try {
    // Get current value (untuk cek jumlah views)
    const getRes = await fetch(firebaseUrl);
    const current = await getRes.json();

    // Cek jika current null atau undefined, berikan nilai default 0
    const updated = (current || 0) + 1;

    // Update to Firebase
    const updateRes = await fetch(firebaseUrl, {
      method: 'PUT', // PUT digunakan untuk menimpa data
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    if (!updateRes.ok) {
      throw new Error("Failed to update data");
    }

    // Kirim kembali jumlah views yang sudah diperbarui
    res.status(200).json({ views: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update counter' });
  }
}
