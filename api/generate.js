const { pickByBackground } = require('../lib/gallery');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};
  const selections = body.selections || {};
  const background = selections.background || 'studio';

  // Fake generation latency so the UI feels like real gen
  await sleep(900 + Math.floor(Math.random() * 1100));

  const pick = pickByBackground(background);
  res.status(200).json({
    ok: true,
    imageUrl: pick.url,
    id: pick.id,
    matchedBackground: background,
    mode: 'gallery-seed'
  });
};
