const GALLERY = [
  { id: '01-hero', url: '/media/01-hero.jpg', tags: ['sunset', 'yacht', 'city'] },
  { id: '02-stand', url: '/media/02-stand.jpg', tags: ['studio', 'street'] },
  { id: '03-wink', url: '/media/03-wink.jpg', tags: ['studio', 'club'] },
  { id: '04-yacht', url: '/media/04-yacht.jpg', tags: ['beach', 'yacht', 'sunset'] },
  { id: '05-cyber', url: '/media/05-cyber.jpg', tags: ['cyberpunk', 'city', 'space'] },
  { id: '06-casino', url: '/media/06-casino.jpg', tags: ['casino', 'club'] },
  { id: '07-beach', url: '/media/07-beach.jpg', tags: ['beach', 'sunset', 'desert'] },
  { id: '08-rooftop', url: '/media/08-rooftop.jpg', tags: ['rooftop', 'city', 'sunset'] },
  { id: '09-space', url: '/media/09-space.jpg', tags: ['space'] },
  { id: '10-studio', url: '/media/10-studio.jpg', tags: ['studio'] },
  { id: '11-street', url: '/media/11-street.jpg', tags: ['street', 'city'] },
  { id: '12-banner', url: '/media/12-banner.jpg', tags: ['city', 'club', 'casino'] }
];

function pickByBackground(background) {
  const bg = String(background || '').toLowerCase();
  const matched = GALLERY.filter((g) => g.tags.some((t) => t === bg || bg.includes(t) || t.includes(bg)));
  const pool = matched.length ? matched : GALLERY;
  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = { GALLERY, pickByBackground };
