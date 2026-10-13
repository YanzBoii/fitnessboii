// Captures d'écran du README et du manifeste PWA.
// Prérequis : `npm run emulators` et `npm run preview:emu` (port 4173) lancés.
// Usage : BROWSER_URL=http://127.0.0.1:9333 node scripts/screenshots.mjs  →  docs/screenshots/raw/*.png
import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { APP, AUTH, OWNER, PASSWORD, connect, login, seed, sleep, tab } from './lib.mjs';

const OUT = 'docs/screenshots/raw'; // captures brutes (non versionnées), triées par showcase.mjs

async function shot(page, name, scrollTo) {
  if (scrollTo) {
    await page.evaluate(t => {
      const el = [...document.querySelectorAll('main section')].find(s => s.textContent.includes(t));
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16);
    }, scrollTo);
    await sleep(600);
  }
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('  ', name);
}

async function run(browser, mode) {
  await seed(mode);
  const ctx = await browser.createBrowserContext();

  // Téléphone
  const phone = await ctx.newPage();
  await phone.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await phone.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await login(phone);
  await shot(phone, `phone-home-${mode}`);
  await tab(phone, 'Séance');
  await shot(phone, `phone-session-${mode}`);
  await tab(phone, 'Programmes');
  await shot(phone, `phone-programs-${mode}`);
  await phone.evaluate(() => [...document.querySelectorAll('main button')].find(b => b.textContent.includes('Modifier')).click());
  await sleep(1200);
  await shot(phone, `phone-builder-${mode}`);
  await phone.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'close').click());
  await sleep(500);
  await tab(phone, 'Perfs');
  await shot(phone, `phone-perfs-${mode}`, 'Séances par semaine');
  await tab(phone, 'Réglages');
  await shot(phone, `phone-settings-${mode}`, 'Apparence');
  await phone.close();

  // Desktop
  const desk = await ctx.newPage();
  await desk.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await desk.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await login(desk);
  await shot(desk, `desktop-home-${mode}`);
  await tab(desk, 'Perfs');
  await shot(desk, `desktop-perfs-${mode}`, 'Séances par semaine');
  await tab(desk, 'Séance');
  await shot(desk, `desktop-session-${mode}`);
  await ctx.close();
}

async function design(browser) {
  const ctx = await browser.createBrowserContext();
  const desk = await ctx.newPage();
  await desk.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await desk.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await desk.goto(APP, { waitUntil: 'domcontentloaded' });
  await sleep(3000);
  await shot(desk, 'desktop-auth');

  // Nouveau compte sans profil → questionnaire, jusqu'à l'étape « type de programme ».
  const r = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'new@fitnessboii.test', password: PASSWORD, returnSecureToken: true })
  })).json();
  await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/demo-fitnessboii/accounts:update`, { method: 'POST', headers: OWNER, body: JSON.stringify({ localId: r.localId, emailVerified: true }) });
  const phone = await ctx.newPage();
  await phone.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await phone.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await phone.goto(APP, { waitUntil: 'domcontentloaded' });
  await sleep(2500);
  await (await phone.waitForSelector('xpath/.//button[contains(., "Se connecter")]')).click();
  await sleep(400);
  await phone.type('input[type=email]', 'new@fitnessboii.test');
  await phone.type('input[placeholder="Mot de passe"]', PASSWORD);
  await phone.keyboard.press('Enter');
  await sleep(3500);
  const click = t => phone.evaluate(x => [...document.querySelectorAll('button')].find(b => b.textContent.includes(x)).click(), t);
  await click('Commencer'); await sleep(500);
  await phone.type('input', 'Léo'); await click('Continuer'); await sleep(500);
  await click('Force'); await click('Continuer'); await sleep(500);
  await click('Intermédiaire'); await click('Continuer'); await sleep(500);
  await click('Continuer'); await sleep(500);
  await click('Push / Pull / Legs'); await sleep(400);
  await shot(phone, 'phone-onboarding');
  await ctx.close();
}

mkdirSync(OUT, { recursive: true });
const browser = await connect(puppeteer);
try {
  for (const mode of ['dark', 'light']) await run(browser, mode);
  await design(browser);
} finally {
  if (process.env.BROWSER_URL) await browser.disconnect(); else await browser.close();
}
