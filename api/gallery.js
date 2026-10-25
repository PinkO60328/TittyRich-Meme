const { GALLERY } = require('../lib/gallery');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  res.status(200).json(GALLERY.map(({ id, url }) => ({ id, url })));
};
