const defaultChoices = {
  color: { label: 'Skin color', options: [['pale','Pale'],['ivory','Ivory'],['fair','Fair'],['peach','Peach'],['beige','Beige'],['tan','Tan'],['olive','Olive'],['honey','Honey'],['caramel','Caramel'],['brown','Brown'],['chestnut','Chestnut'],['deep','Deep brown'],['dark','Dark'],['ebony','Ebony']] },
  hairColor: { label: 'Hair color', options: [['black','Black'],['brown','Brown'],['blonde','Blonde'],['orange','Orange'],['red','Red'],['pink','Pink'],['purple','Purple'],['blue','Blue'],['green','Green'],['silver','Silver'],['white','White'],['rainbow','Rainbow']] },
  hair: { label: 'Hair style', options: [['short','Short'],['medium','Medium'],['long','Long'],['bob','Bob'],['pixie','Pixie'],['ponytail','Ponytail'],['braids','Braids'],['bun','Bun'],['curly','Curly'],['straight','Straight']] },
  expression: { label: 'Expression', options: [['neutral','Neutral'],['smile','Smile'],['laugh','Laughing'],['wink','Wink'],['serious','Serious'],['angry','Angry'],['sad','Sad'],['surprised','Surprised'],['blush','Blushing'],['confident','Confident']] },
  gesture: { label: 'Hand gesture', options: [['down','Hands down'],['wave','Wave'],['peace','Peace sign'],['hip','Hand on hip'],['crossed','Crossed arms'],['heart','Heart hands'],['point','Pointing'],['fist','Raised fist'],['face','Hand near face'],['open','Open arms']] },
  body: { label: 'Body', options: [['slim','Slim'],['petite','Petite'],['average','Average'],['athletic','Athletic'],['curvy','Curvy'],['thick','Thick'],['plus','Plus size'],['muscular','Muscular']] },
  bust: { label: 'Breast type / size', options: [['flat','Flat'],['small','Small'],['medium','Medium'],['large','Large'],['xlarge','Extra large'],['xxlarge','Very large'],['natural','Natural'],['athletic','Athletic']] },
  clothing: { label: 'Clothing color', options: [['black','Black'],['white','White'],['red','Red'],['pink','Pink'],['blue','Blue'],['purple','Purple'],['green','Green'],['yellow','Yellow'],['orange','Orange'],['silver','Silver'],['gold','Gold'],['rainbow','Rainbow']] },
  background: { label: 'Background', options: [['studio','Studio'],['beach','Beach'],['sunset','Sunset'],['city','City'],['club','Strip club'],['rooftop','Rooftop'],['forest','Forest'],['space','Space'],['casino','Casino'],['street','Street'],['cyberpunk','Cyberpunk'],['desert','Desert']] }
};

let choices = defaultChoices;
const selections = {};
const gallery = document.querySelector('#gallery');
const preview = document.querySelector('#previewImage');

const PLACEHOLDER_CA = 'CommingSoon';

function toast(msg) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1800);
}

function isRealMint(ca) {
  if (!ca) return false;
  const v = String(ca).trim();
  if (!v || /^comm?ing\s*soon$/i.test(v) || v.toLowerCase() === 'comingsoon') return false;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v);
}

function applyBuyState(ca, dex) {
  const real = isRealMint(ca);
  const href = real ? (dex || `https://pump.fun/coin/${ca}`) : null;
  document.querySelectorAll('#buyBtn, #buyBtnHero').forEach((btn) => {
    if (real && href) {
      const a = document.createElement('a');
      a.id = btn.id;
      a.className = btn.className.replace('is-disabled', '').trim() + ' buy-btn';
      a.href = href;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = btn.id === 'buyBtnHero' ? 'BUY / PUMP SWAP' : 'BUY ON PUMP';
      btn.replaceWith(a);
    } else {
      btn.disabled = true;
      btn.classList.add('is-disabled');
      btn.removeAttribute('href');
      if (btn.id === 'buyBtnHero') btn.textContent = 'BUY / PUMP SWAP · COMING SOON';
      else btn.textContent = 'BUY · COMING SOON';
    }
  });
}

function buildControls() {
  const grid = document.querySelector('#selectGrid');
  grid.replaceChildren();
  for (const [key, item] of Object.entries(choices)) {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    const label = document.createElement('label');
    label.textContent = item.label;
    label.htmlFor = `pick-${key}`;
    const select = document.createElement('select');
    select.id = `pick-${key}`;
    select.setAttribute('aria-label', item.label);
    select.innerHTML = item.options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    selections[key] = item.options[0]?.[0] || '';
    select.addEventListener('change', (e) => { selections[key] = e.target.value; });
    wrap.append(label, select);
    grid.append(wrap);
  }
}

function addGallery(src, prepend = true) {
  const card = document.createElement('article');
  card.className = 'gallery-card';
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.loading = 'lazy';
  card.append(img);
  card.addEventListener('click', () => {
    preview.src = src;
    preview.classList.add('visible');
  });
  if (prepend) gallery.prepend(card);
  else gallery.append(card);
}

function renderGallery(items) {
  gallery.replaceChildren();
  items.forEach((item) => addGallery(item.url, false));
}

async function loadGallery() {
  try {
    const r = await fetch('/api/gallery');
    if (r.ok) {
      renderGallery(await r.json());
      return;
    }
  } catch {}
  const fallback = [
    '01-hero','02-stand','03-wink','04-yacht','05-cyber','06-casino',
    '07-beach','08-rooftop','09-space','10-studio','11-street','12-banner'
  ].map((n) => ({ url: `/media/${n}.jpg` }));
  renderGallery(fallback);
}

async function loadSettings() {
  try {
    const s = await (await fetch('/api/settings')).json();
    const ca = s.ca || PLACEHOLDER_CA;
    document.querySelectorAll('#copyCa, #copyCaHero').forEach((el) => { el.dataset.ca = ca; });
    const footerCa = document.querySelector('#footerCa');
    if (footerCa) footerCa.textContent = ca;
    const heroCa = document.querySelector('#copyCaHero');
    if (heroCa) heroCa.textContent = `CA: ${ca}`;

    const x = document.querySelector('#xLink');
    const tg = document.querySelector('#tgLink');
    if (x) x.href = s.community || s.twitter || 'https://x.com/TRUMoneyPrinter';
    if (tg) tg.href = s.telegram || 'https://t.me/trumpofficialcommunity';

    applyBuyState(ca, s.dex);

    if (s.options) {
      choices = Object.fromEntries(
        Object.entries(s.options).map(([key, options]) => [
          key,
          { label: defaultChoices[key]?.label || key, options }
        ])
      );
    }
  } catch {
    applyBuyState(PLACEHOLDER_CA, '');
  }
  buildControls();
}

async function generate() {
  const button = document.querySelector('#generate');
  const label = button.querySelector('span');
  const oldLabel = label?.textContent || 'GENERATE';
  if (label) label.textContent = 'Printing money avatar...';
  button.disabled = true;
  try {
    const r = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections })
    });
    const data = await r.json().catch(() => ({}));
    const image = data.imageUrl || data.url;
    if (image) {
      preview.src = image;
      preview.classList.add('visible');
      addGallery(image, true);
      toast('Generated · album updated');
    } else {
      toast('Generation failed — try again');
    }
  } catch {
    toast('Generation failed — try again');
  } finally {
    button.disabled = false;
    if (label) label.textContent = oldLabel;
  }
}

async function copyCa(fromEl) {
  const ca = (fromEl && fromEl.dataset.ca) || document.querySelector('#copyCa')?.dataset.ca || PLACEHOLDER_CA;
  try {
    await navigator.clipboard?.writeText(ca);
    toast(`Copied: ${ca}`);
  } catch {
    toast(ca);
  }
}

function dollars() {
  const host = document.querySelector('#particles');
  if (!host) return;
  host.replaceChildren();
  const colors = ['#22c55e', '#7CFF6B', '#ffd24a', '#fbbf24', '#86efac', '#ffffff', '#ff4f93'];
  for (let i = 0; i < 64; i++) {
    const d = document.createElement('i');
    d.className = 'dollar-particle';
    d.textContent = '$';
    const size = 16 + Math.random() * 70;
    d.style.left = `${Math.random() * 100}%`;
    d.style.fontSize = `${size}px`;
    d.style.color = colors[i % colors.length];
    d.style.filter = `blur(${1 + Math.random() * 3.5}px)`;
    d.style.setProperty('--op', `${0.35 + Math.random() * 0.5}`);
    d.style.setProperty('--angle', `${-50 + Math.random() * 100}deg`);
    d.style.setProperty('--drift', `${-130 + Math.random() * 260}px`);
    d.style.setProperty('--z', `${-80 + Math.random() * 160}px`);
    d.style.animationDuration = `${9 + Math.random() * 14}s`;
    d.style.animationDelay = `-${Math.random() * 22}s`;
    host.append(d);
  }
}

document.querySelector('#generate').addEventListener('click', generate);
document.querySelector('#copyCa').addEventListener('click', (e) => copyCa(e.currentTarget));
document.querySelector('#copyCaHero')?.addEventListener('click', (e) => copyCa(e.currentTarget));
document.querySelector('#shuffle').addEventListener('click', () => {
  for (const [key, item] of Object.entries(choices)) {
    const value = item.options[Math.floor(Math.random() * item.options.length)][0];
    const select = document.querySelector(`#pick-${key}`);
    if (select) select.value = value;
    selections[key] = value;
  }
  toast('Settings shuffled');
});

dollars();
loadSettings().then(loadGallery);
