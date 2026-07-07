const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  const id = req.query.id;

  if (!id || !/^[A-Za-z0-9]+$/.test(id)) {
    res.status(400).send('Link inválido');
    return;
  }

  try {
    const { blobs } = await list({ prefix: 'links/' + id + '.json' });
    if (!blobs || blobs.length === 0) {
      res.status(404).send('Link não encontrado');
      return;
    }

    const r = await fetch(blobs[0].url);
    if (!r.ok) {
      res.status(404).send('Link não encontrado');
      return;
    }
    const config = await r.json();

    const params = new URLSearchParams();
    if (config.n) params.set('n', config.n);
    if (config.t) params.set('t', config.t);
    if (config.d) params.set('d', config.d);
    if (config.pu) params.set('pu', config.pu);
    if (config.wn) params.set('wn', config.wn);
    if (config.wm) params.set('wm', config.wm);

    res.writeHead(302, { Location: '/?' + params.toString() });
    res.end();
  } catch (e) {
    res.status(500).send('Algo deu errado');
  }
};
