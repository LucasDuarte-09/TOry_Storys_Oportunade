module.exports = async function handler(req, res) {
  const url = req.query.url;

  if (!url || !/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: 'invalid url' });
    return;
  }

  try {
    const r = await fetch('https://is.gd/create.php?format=simple&url=' + encodeURIComponent(url));
    const text = await r.text();

    if (!r.ok || /^Error:/i.test(text)) {
      res.status(502).json({ error: 'shortening failed' });
      return;
    }

    res.status(200).json({ short: text.trim() });
  } catch (e) {
    res.status(502).json({ error: 'shortening failed' });
  }
};
