// Preisrechner. Alle Preise in Euro, hier anpassen.
const PRICES = {
  web: {
    base: 450,      // One-Pager inkl. Design
    page: 90,       // jede weitere Seite
    form: 80,
    news: 250,
    lang: 200,
    texts: 40,      // pro Seite
    setup: 50,
    care: 25,       // pro Monat
  },
  stream: { scenes: 120, cam: 30, alerts: 60, panels: 40, emote: 25 },
  grafik: { logo: 250, cards: 60, social: 90, banner: 50 },
  rush: 0.2,        // Aufschlag bei Eilauftrag
};

const LABELS = {
  form: 'Kontaktformular', news: 'News-Bereich', lang: 'Zweite Sprache', setup: 'Domain & Hosting',
  scenes: 'Szenen', cam: 'Webcam-Rahmen', alerts: 'Alerts', panels: 'Panels',
  logo: 'Logo', cards: 'Visitenkarte', social: 'Social-Media-Vorlagen', banner: 'Banner',
};

const form = document.getElementById('calc');
const euro = (n) => n.toLocaleString('de-DE') + ' €';

function calculate() {
  const data = new FormData(form);
  const type = data.get('type');
  const lines = [];
  let monthly = 0;

  if (type === 'web') {
    const pages = Number(data.get('pages'));
    lines.push([pages === 1 ? 'One-Pager' : `Website, ${pages} Seiten`, PRICES.web.base + (pages - 1) * PRICES.web.page]);
    for (const opt of data.getAll('web')) {
      if (opt === 'care') monthly = PRICES.web.care;
      else if (opt === 'texts') lines.push([`Texte (${pages} Seiten)`, pages * PRICES.web.texts]);
      else lines.push([LABELS[opt], PRICES.web[opt]]);
    }
  } else if (type === 'stream') {
    for (const opt of data.getAll('stream')) lines.push([LABELS[opt], PRICES.stream[opt]]);
    const emotes = Math.min(30, Math.max(0, parseInt(data.get('emotes'), 10) || 0));
    if (emotes) lines.push([`${emotes} Emotes`, emotes * PRICES.stream.emote]);
  } else {
    for (const opt of data.getAll('grafik')) lines.push([LABELS[opt], PRICES.grafik[opt]]);
  }

  let sum = lines.reduce((s, [, p]) => s + p, 0);
  if (data.get('speed') === 'rush' && sum) {
    const extra = Math.round(sum * PRICES.rush / 10) * 10;
    lines.push(['Eilaufschlag', extra]);
    sum += extra;
  }
  return { type, lines, sum, monthly };
}

function render() {
  const type = new FormData(form).get('type');
  form.querySelectorAll('fieldset[data-type]').forEach((fs) => { fs.hidden = fs.dataset.type !== type; });
  document.getElementById('pagesOut').textContent = form.pages.value;

  const { lines, sum, monthly } = calculate();
  document.getElementById('total').textContent = sum ? 'ca. ' + euro(sum) : '–';

  const m = document.getElementById('monthly');
  m.hidden = !monthly;
  m.textContent = `plus ${euro(monthly)} pro Monat für Pflege`;

  const list = document.getElementById('lines');
  list.replaceChildren(...lines.map(([label, price]) => {
    const li = document.createElement('li');
    li.append(label, Object.assign(document.createElement('span'), { textContent: euro(price) }));
    return li;
  }));

  const body = ['Hallo Lukas,', '', 'ich interessiere mich für folgendes:', '',
    ...lines.map(([l, p]) => `- ${l} (${euro(p)})`),
    ...(monthly ? [`- Laufende Pflege (${euro(monthly)}/Monat)`] : []),
    '', `Richtwert laut Rechner: ${euro(sum)}`, '', 'Kurz zum Projekt:', ''].join('\n');
  document.getElementById('calcMail').href =
    'mailto:contact@voidcrafts.de?subject=' + encodeURIComponent('Projektanfrage') + '&body=' + encodeURIComponent(body);
}

form.addEventListener('input', render);
form.addEventListener('submit', (e) => e.preventDefault());
render();
