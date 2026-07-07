const { put, list } = require('@vercel/blob');

const seedTestimonials = [
  { name: 'Mariana', text: 'Funcionou demais! Ele autorizou em menos de 1 minuto 😂' },
  { name: 'Carlos', text: 'Genial! Nunca pensei que ia ser tão fácil pedir esse presente.' },
  { name: 'Ana Paula', text: 'O coração crescendo é hilário, recomendo demais!' }
];

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'testimonials/' });
      const recent = blobs.slice(-20);
      const items = [];

      for (const b of recent) {
        try {
          const r = await fetch(b.url);
          if (r.ok) items.push(await r.json());
        } catch (e) {
          // skip broken entries
        }
      }

      const combined = items.length >= 3 ? items : items.concat(seedTestimonials);
      res.status(200).json({ testimonials: combined });
    } catch (e) {
      res.status(200).json({ testimonials: seedTestimonials });
    }
    return;
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const name = String(body.name || '').slice(0, 40).trim();
    const text = String(body.text || '').slice(0, 220).trim();

    if (!name || !text) {
      res.status(400).json({ error: 'missing fields' });
      return;
    }

    try {
      const id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      await put('testimonials/' + id + '.json', JSON.stringify({ name, text }), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false
      });
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'save failed' });
    }
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
