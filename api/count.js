const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'links/' });
    res.status(200).json({ count: blobs.length });
  } catch (e) {
    res.status(200).json({ count: 0 });
  }
};
