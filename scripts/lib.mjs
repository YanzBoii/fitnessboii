// Données de démo et navigation partagées par screenshots.mjs et audit-mobile.mjs.
// Prérequis : `npm run emulators` et `npm run preview:emu`.

export const APP = process.env.APP_URL || 'http://localhost:4173';
export const AUTH = 'http://127.0.0.1:9099';
export const FS = 'http://127.0.0.1:8080/v1/projects/demo-fitnessboii/databases/(default)/documents';
export const OWNER = { Authorization: 'Bearer owner', 'content-type': 'application/json' };
export const EMAIL = 'demo@fitnessboii.test';
export const PASSWORD = 'demo-only-123';
export const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

// ---------- Données de démo ----------
const pad = n => String(n).padStart(2, '0');
const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const r25 = v => Math.round(v / 2.5) * 2.5;

const EX = {
  'l-cpm': ['Chest press', 'Machine chest press', 'pecs', 4, 10, 55], 'l-cpi': ['Chest press incliné', 'Machine incliné convergente', 'pecs', 3, 10, 40],
  'l-pf': ['Pec fly', 'Machine pec fly / butterfly', 'pecs', 3, 12, 35], dm: ['Shoulder press', 'Machine épaules', 'epaules', 3, 10, 30],
  'l-elm': ['Élévations latérales machine', 'Machine élévations latérales', 'epaules', 3, 12, 20], tri: ['Extension triceps', 'Poulie haute — corde', 'bras', 3, 12, 22.5],
  tv: ['Tirage vertical', 'Lat pulldown', 'dos', 4, 10, 55], ro: ['Rowing assis', 'Machine rowing', 'dos', 4, 10, 50],
  'l-tb': ['Rowing T-bar', 'Machine T-bar', 'dos', 4, 10, 40], 'l-rf': ['Reverse fly', 'Machine pec fly (sens inverse)', 'epaules', 3, 12, 25],
  'l-cum': ['Curl biceps machine', 'Machine curl biceps', 'bras', 3, 12, 25], 'l-cm': ['Curl marteau', 'Haltères', 'bras', 3, 12, 12.5],
  pr: ['Presse à cuisses', 'Presse 45°', 'jambes', 4, 10, 140], 'l-hs': ['Hack squat', 'Machine hack squat', 'jambes', 4, 10, 70],
  le: ['Leg extension', 'Machine leg extension', 'jambes', 3, 12, 45], 'l-lca': ['Leg curl assis', 'Machine ischios assis', 'jambes', 3, 12, 40],
  'l-add': ['Adducteurs', 'Machine adducteurs', 'jambes', 3, 15, 50], mo: ['Mollets debout', 'Machine mollets debout', 'jambes', 4, 15, 60]
};
const NOTES = { 'l-cpm': 'Siège cran 4, poignées basses', pr: 'Pieds hauts, largeur épaules' };
const PROGRAMS = [
  { id: 'push', name: 'Push', icon: 'fitness_center', subtitle: 'Pecs · Épaules · Bras', days: [0], ex: ['l-cpm', 'l-cpi', 'l-pf', 'dm', 'l-elm', 'tri'] },
  { id: 'pull', name: 'Pull', icon: 'rowing', subtitle: 'Dos · Bras · Épaules', days: [2], ex: ['tv', 'ro', 'l-tb', 'l-rf', 'l-cum', 'l-cm'] },
  { id: 'legs', name: 'Legs', icon: 'directions_run', subtitle: 'Jambes', days: [4, 5], ex: ['pr', 'l-hs', 'le', 'l-lca', 'l-add', 'mo'] }
];

// Encodage des valeurs Firestore REST.
const val = v => {
  if (v === null) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } };
};
const put = async (path, data) => {
  const r = await fetch(`${FS}/${path}`, { method: 'PATCH', headers: OWNER, body: JSON.stringify({ fields: val(data).mapValue.fields }) });
  if (!r.ok) throw new Error(`${path}: ${await r.text()}`);
};

export async function seed(mode) {
  await fetch(`${AUTH}/emulator/v1/projects/demo-fitnessboii/accounts`, { method: 'DELETE' });
  await fetch(`${FS.replace('/v1/', '/emulator/v1/').replace('/documents', '/documents')}`, { method: 'DELETE' });
  const res = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true })
  })).json();
  const uid = res.localId;
  await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/demo-fitnessboii/accounts:update`, {
    method: 'POST', headers: OWNER, body: JSON.stringify({ localId: uid, emailVerified: true })
  });

  await put(`users/${uid}`, {
    name: 'Léo', goalType: 'force', level: 'inter', split: 'ppl', bodyWeight: 78, height: 180, goal: 3, rest: 90,
    autoTimer: true, remind: false, theme: 'rubis', mode, onboarded: true, createdAt: addDays(new Date(), -120)
  });
  for (const [i, p] of PROGRAMS.entries()) {
    await put(`users/${uid}/programs/${p.id}`, {
      name: p.name, subtitle: p.subtitle, icon: p.icon, days: p.days, order: i,
      exercises: p.ex.map(id => {
        const [name, machine, group, sets, reps] = EX[id];
        return { id, name, machine, group, sets, reps, weight: 0, ...(NOTES[id] ? { note: NOTES[id] } : {}) };
      })
    });
  }

  // 16 semaines d'historique : lun/mer/ven, quelques séances sautées, progression régulière.
  const today = new Date();
  let n = 0;
  for (let i = 112; i >= 1; i--) {
    const d = addDays(today, -i), wd = (d.getDay() + 6) % 7;
    if (![0, 2, 4].includes(wd) || [17, 38, 59, 66, 87].includes(i)) continue;
    const p = PROGRAMS[[0, 2, 4].indexOf(wd)];
    const progress = (112 - i) / 112;
    const perf = {};
    p.ex.forEach((id, k) => {
      const [name, , group, , reps, base] = EX[id];
      perf[id] = { w: r25(base * (0.86 + progress * 0.22 + ((i + k) % 3) * 0.01)), r: reps - ((i + k) % 2), name, group };
    });
    await put(`users/${uid}/sessionLogs/${key(d)}`, { date: key(d), programId: p.id, programName: p.name, minutes: 48 + (i % 17), perf, createdAt: d });
    n++;
  }

  // Séance en cours (Legs) : 2 exercices faits.
  const legs = PROGRAMS[2];
  const ex = Object.fromEntries(legs.ex.map((id, k) => [id, { w: r25(EX[id][5] * 1.07), r: EX[id][4], done: k < 2 }]));
  await put(`users/${uid}/session/current`, { programId: 'legs', startedAt: Date.now() - 23 * 60000 - 14000, cur: 2, ex });
  console.log(`démo : ${n} séances, mode ${mode}`);
}

// ---------- Captures ----------
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function login(page) {
  // Firestore garde une connexion ouverte : jamais « networkidle ».
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await page.evaluate(() => {
    localStorage.setItem('fitnessboii-install-dismissed', '1');
    localStorage.setItem('fitnessboii-tab', 'home');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(2500);
  if (await page.$('main')) return; // session déjà ouverte dans ce contexte
  const switchBtn = await page.waitForSelector('xpath/.//button[contains(., "Se connecter")]');
  await switchBtn.click();
  await sleep(400);
  await page.type('input[type=email]', EMAIL);
  await page.type('input[placeholder="Mot de passe"]', PASSWORD);
  await page.keyboard.press('Enter');
  await page.waitForSelector('main', { timeout: 20000 });
  await sleep(2500);
}

export async function tab(page, label) {
  await page.evaluate(l => {
    const b = [...document.querySelectorAll('button')].find(x => x.getAttribute('aria-label') === l || x.textContent.trim().endsWith(l));
    b.click();
  }, label);
  await sleep(1800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
}


export const connect = async puppeteer => process.env.BROWSER_URL
  ? puppeteer.connect({ browserURL: process.env.BROWSER_URL, defaultViewport: null })
  : puppeteer.launch({ executablePath: BROWSER, headless: true, args: ['--hide-scrollbars'] });
