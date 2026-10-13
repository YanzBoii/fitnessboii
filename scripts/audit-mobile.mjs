// Audit mobile : parcourt chaque écran sur plusieurs tailles de téléphone, capture et détecte
// les problèmes d'affichage courants. Prérequis : `npm run emulators` + `npm run preview:emu`.
// Usage : BROWSER_URL=http://127.0.0.1:9333 node scripts/audit-mobile.mjs  →  docs/screenshots/raw/audit/
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { APP, AUTH, OWNER, PASSWORD, connect, login, seed, sleep, tab } from './lib.mjs';

const OUT = 'docs/screenshots/raw/audit';
const VIEWPORTS = [[360, 740], [375, 667], [390, 844], [430, 932]];
const report = [];

/** Contrôles exécutés dans la page. */
function inspect() {
  const vw = innerWidth, vh = innerHeight;
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && +s.opacity > 0.05; };
  const label = el => (el.getAttribute('aria-label') || el.placeholder || el.value || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
  const issues = [];
  if (document.documentElement.scrollWidth > vw + 1) issues.push(`défilement horizontal (${document.documentElement.scrollWidth}px > ${vw}px)`);
  const all = [...document.querySelectorAll('body *')].filter(visible);
  // Débordement à droite/gauche de l'écran (hors éléments décoratifs).
  const out = all.filter(el => { const r = el.getBoundingClientRect(); return (r.right > vw + 2 || r.left < -2) && el.children.length === 0 && el.textContent.trim(); });
  if (out.length) issues.push('hors écran : ' + [...new Set(out.map(label))].slice(0, 4).join(' | '));
  // Contenu de champ coupé.
  const cut = [...document.querySelectorAll('input')].filter(visible).filter(i => i.scrollWidth > i.clientWidth + 1 && i.value);
  if (cut.length) issues.push('champ coupé : ' + cut.map(i => `« ${i.value} » (${i.clientWidth}px)`).join(', '));
  // Texte tronqué par overflow hidden.
  const trunc = all.filter(el => el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 1 && ['hidden', 'clip'].includes(getComputedStyle(el).overflowX));
  if (trunc.length) issues.push('texte tronqué : ' + [...new Set(trunc.map(label))].slice(0, 4).join(' | '));
  // Zoom automatique iOS : champs < 16px.
  const small = [...document.querySelectorAll('input, select, textarea')].filter(visible).filter(i => parseFloat(getComputedStyle(i).fontSize) < 16);
  if (small.length) issues.push(`zoom iOS (police < 16px) : ${small.length} champ(s) — ` + [...new Set(small.map(label))].slice(0, 3).join(' | '));
  // Zones tactiles trop petites.
  const tiny = [...document.querySelectorAll('button')].filter(visible).filter(b => { const r = b.getBoundingClientRect(); return (r.width < 32 || r.height < 32) && b.textContent.trim().length < 30; });
  if (tiny.length) issues.push('cible tactile < 32px : ' + [...new Set(tiny.map(b => `${label(b)} ${Math.round(b.getBoundingClientRect().width)}×${Math.round(b.getBoundingClientRect().height)}`))].slice(0, 4).join(' | '));
  // Texte qui se chevauche (frères proches en ligne).
  return { issues, vw, vh };
}

async function check(page, name) {
  await sleep(500);
  const r = await page.evaluate(inspect);
  // Bas de page : le dernier contenu doit rester visible au-dessus de la nav flottante.
  const bottom = await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(x => setTimeout(x, 300));
    const nav = [...document.querySelectorAll('nav')].find(n => getComputedStyle(n).position === 'fixed');
    const main = document.querySelector('main');
    if (!nav || !main || document.querySelector('[data-overlay]')) return null;
    const last = [...main.querySelectorAll('*')].filter(e => e.children.length === 0 && e.getBoundingClientRect().height > 0).pop();
    const lb = last?.getBoundingClientRect().bottom ?? 0, nt = nav.getBoundingClientRect().top;
    return lb > nt - 4 ? `dernier contenu sous la nav (${Math.round(lb)} > ${Math.round(nt)})` : null;
  });
  if (bottom) r.issues.push(bottom);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  report.push({ name, issues: r.issues });
  console.log(`${r.issues.length ? '✗' : '✓'} ${name}${r.issues.map(i => '\n    - ' + i).join('')}`);
}

const click = (page, text) => page.evaluate(t => {
  const b = [...document.querySelectorAll('button')].find(x => x.getAttribute('aria-label') === t || x.textContent.includes(t));
  if (!b) throw new Error('bouton introuvable : ' + t);
  b.click();
}, text);

async function newUser(email, verified) {
  const r = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true })
  })).json();
  if (verified) await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/demo-fitnessboii/accounts:update`, { method: 'POST', headers: OWNER, body: JSON.stringify({ localId: r.localId, emailVerified: true }) });
}

async function signIn(page, email) {
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  await sleep(2500);
  await click(page, 'Se connecter');
  await sleep(300);
  await page.type('input[type=email]', email);
  await page.type('input[placeholder="Mot de passe"]', PASSWORD);
  await page.keyboard.press('Enter');
  await sleep(3500);
}

async function phone(ctx, w, h) {
  const p = await ctx.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  return p;
}

async function run(browser, [w, h]) {
  const tag = `${w}x${h}`;
  await seed('dark');
  const ctx = await browser.createBrowserContext();

  // Écrans connectés.
  const p = await phone(ctx, w, h);
  await p.goto(APP, { waitUntil: 'domcontentloaded' });
  await sleep(2000);
  await check(p, `${tag}-auth`);
  await login(p);
  await p.evaluate(() => localStorage.removeItem('fitnessboii-install-dismissed'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await sleep(3000);
  await check(p, `${tag}-home`);
  await tab(p, 'Programmes');
  await check(p, `${tag}-programs`);
  await click(p, 'Lun'); await sleep(400);
  await check(p, `${tag}-programs-planday`);
  await click(p, 'Modifier'); await sleep(900);
  await click(p, 'Infos'); await sleep(400);
  await check(p, `${tag}-builder-edit`);
  await click(p, 'close'); await sleep(500);
  await click(p, 'Nouveau'); await sleep(900);
  await check(p, `${tag}-builder-new`);
  await click(p, 'close'); await sleep(500);
  await tab(p, 'Séance');
  await check(p, `${tag}-session`);
  await click(p, 'Valider'); await sleep(800);
  await check(p, `${tag}-session-rest`);
  await tab(p, 'Accueil');
  await check(p, `${tag}-rest-float`);
  await tab(p, 'Perfs');
  await check(p, `${tag}-perfs`);
  await tab(p, 'Réglages');
  await check(p, `${tag}-settings`);
  await click(p, 'Profil'); await sleep(900);
  await check(p, `${tag}-profile`);
  await p.evaluate(() => { const s = [...document.querySelectorAll('div')].find(d => getComputedStyle(d).overflowY === 'auto' && d.scrollHeight > d.clientHeight); if (s) s.scrollTop = s.scrollHeight; });
  await sleep(400);
  await p.screenshot({ path: `${OUT}/${tag}-profile-bottom.png` });
  await click(p, 'close'); await sleep(600);
  await tab(p, 'Séance');
  await click(p, 'Terminer'); await sleep(1500);
  await check(p, `${tag}-photo-prompt`);
  await p.close();
  await ctx.close();

  // Vérification d'email + questionnaire (nouveaux comptes).
  const c2 = await browser.createBrowserContext();
  await newUser(`unverified-${w}@fitnessboii.test`, false);
  const v = await phone(c2, w, h);
  await signIn(v, `unverified-${w}@fitnessboii.test`);
  await check(v, `${tag}-verify`);
  await v.close();
  await c2.close();

  const c3 = await browser.createBrowserContext();
  await newUser(`ob-${w}@fitnessboii.test`, true);
  const o = await phone(c3, w, h);
  await signIn(o, `ob-${w}@fitnessboii.test`);
  await check(o, `${tag}-ob0`);
  await click(o, 'Commencer'); await sleep(500);
  await o.type('input', 'Maximilien');
  await check(o, `${tag}-ob1`);
  await click(o, 'Continuer'); await sleep(500);
  await click(o, 'Prise de masse'); await check(o, `${tag}-ob2`);
  await click(o, 'Continuer'); await sleep(500);
  await click(o, 'Intermédiaire'); await check(o, `${tag}-ob3`);
  await click(o, 'Continuer'); await sleep(500);
  await check(o, `${tag}-ob4`);
  await click(o, 'Continuer'); await sleep(500);
  await click(o, 'Push / Pull / Legs'); await check(o, `${tag}-ob5`);
  await click(o, 'Continuer'); await sleep(500);
  await check(o, `${tag}-ob6`);
  await click(o, 'Continuer'); await sleep(500);
  await check(o, `${tag}-ob7`);
  await o.close();
  await c3.close();
}

mkdirSync(OUT, { recursive: true });
const browser = await connect(puppeteer);
try {
  for (const vp of (process.env.ONLY ? VIEWPORTS.filter(v => v[0] === +process.env.ONLY) : VIEWPORTS)) await run(browser, vp);
} finally {
  writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  const bad = report.filter(r => r.issues.length).length;
  console.log(`\n${report.length} écrans contrôlés, ${bad} avec des problèmes`);
  if (process.env.BROWSER_URL) await browser.disconnect(); else await browser.close();
}
