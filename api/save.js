const { put } = require('@vercel/blob');

function randomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 7; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  const config = {
    n: String(body.n || '').slice(0, 60).trim(),
    t: String(body.t || '').slice(0, 120).trim(),
    d: String(body.d || '').slice(0, 300).trim(),
    pu: String(body.pu || '').slice(0, 600).trim(),
    wn: String(body.wn || '').replace(/\D/g, '').slice(0, 20),
    wm: String(body.wm || '').slice(0, 300).trim(),
    bt: ['both', 'gift', 'auth'].includes(body.bt) ? body.bt : 'both'
  };

  if (!config.n || !config.t || !config.d || !config.wn || !config.wm) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  if (!/^https?:\/\//i.test(config.pu)) {
    res.status(400).json({ error: 'invalid product url' });
    return;
  }

  try {
    const id = randomId();
    await put('links/' + id + '.json', JSON.stringify(config), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    res.status(200).json({ id: id });
  } catch (e) {
    res.status(500).json({ error: 'save failed' });
  }
};
