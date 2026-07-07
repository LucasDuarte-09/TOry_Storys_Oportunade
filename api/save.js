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

  const body = req.body || {};
  const config = {
    n: String(body.n || ''),
    t: String(body.t || ''),
    d: String(body.d || ''),
    pu: String(body.pu || ''),
    wn: String(body.wn || '').replace(/\D/g, ''),
    wm: String(body.wm || '')
  };

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
