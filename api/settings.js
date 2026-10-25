const defaultChoices = {
  color: [['pale','Pale'],['ivory','Ivory'],['fair','Fair'],['peach','Peach'],['beige','Beige'],['tan','Tan'],['olive','Olive'],['honey','Honey'],['caramel','Caramel'],['brown','Brown'],['chestnut','Chestnut'],['deep','Deep brown'],['dark','Dark'],['ebony','Ebony']],
  hairColor: [['black','Black'],['brown','Brown'],['blonde','Blonde'],['orange','Orange'],['red','Red'],['pink','Pink'],['purple','Purple'],['blue','Blue'],['green','Green'],['silver','Silver'],['white','White'],['rainbow','Rainbow']],
  hair: [['short','Short'],['medium','Medium'],['long','Long'],['bob','Bob'],['pixie','Pixie'],['ponytail','Ponytail'],['braids','Braids'],['bun','Bun'],['curly','Curly'],['straight','Straight']],
  expression: [['neutral','Neutral'],['smile','Smile'],['laugh','Laughing'],['wink','Wink'],['serious','Serious'],['angry','Angry'],['sad','Sad'],['surprised','Surprised'],['blush','Blushing'],['confident','Confident']],
  gesture: [['down','Hands down'],['wave','Wave'],['peace','Peace sign'],['hip','Hand on hip'],['crossed','Crossed arms'],['heart','Heart hands'],['point','Pointing'],['fist','Raised fist'],['face','Hand near face'],['open','Open arms']],
  body: [['slim','Slim'],['petite','Petite'],['average','Average'],['athletic','Athletic'],['curvy','Curvy'],['thick','Thick'],['plus','Plus size'],['muscular','Muscular']],
  bust: [['flat','Flat'],['small','Small'],['medium','Medium'],['large','Large'],['xlarge','Extra large'],['xxlarge','Very large'],['natural','Natural'],['athletic','Athletic']],
  clothing: [['black','Black'],['white','White'],['red','Red'],['pink','Pink'],['blue','Blue'],['purple','Purple'],['green','Green'],['yellow','Yellow'],['orange','Orange'],['silver','Silver'],['gold','Gold'],['rainbow','Rainbow']],
  background: [['studio','Studio'],['beach','Beach'],['sunset','Sunset'],['city','City'],['club','Strip club'],['rooftop','Rooftop'],['forest','Forest'],['space','Space'],['casino','Casino'],['street','Street'],['cyberpunk','Cyberpunk'],['desert','Desert']]
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const ca = process.env.TOKEN_CA || 'CommingSoon';
  const isPlaceholder = /^comm?ing\s*soon$/i.test(String(ca).trim()) || String(ca).trim().toLowerCase() === 'comingsoon';

  res.status(200).json({
    name: 'Titty Rich Unlimited Money Printer',
    symbol: 'TRUMP',
    chain: 'Solana',
    ca,
    community: process.env.TWITTER_URL || 'https://x.com/',
    twitter: process.env.TWITTER_URL || 'https://x.com/',
    telegram: process.env.TELEGRAM_URL || 'https://t.me/',
    dex: isPlaceholder ? '' : (process.env.DEX_URL || `https://pump.fun/coin/${ca}`),
    options: defaultChoices
  });
};
