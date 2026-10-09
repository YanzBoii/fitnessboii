// Image vitrine du README : 4 écrans téléphone sur fond dégradé (variantes claire et sombre).
// Prérequis : captures dans docs/screenshots (node scripts/screenshots.mjs).
// Usage : BROWSER_URL=http://127.0.0.1:9333 node scripts/showcase.mjs
import { copyFileSync, readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const RAW = 'docs/screenshots/raw';
const DIR = 'docs/screenshots';
/** Captures versionnées (README) et captures du manifeste PWA (fenêtre d'installation Android/PC). */
const README = ['desktop-home-light', 'desktop-perfs-dark', 'desktop-auth', 'phone-onboarding', 'phone-programs-dark', 'phone-settings-light'];
const MANIFEST = ['phone-home-dark', 'phone-session-dark', 'desktop-home-dark'];
const SCREENS = ['home', 'session', 'builder', 'perfs'];
const W = 1800, H = 1000, PHONE = 372, GAP = 54;

const THEME = {
  dark: {
    bg: 'radial-gradient(900px 600px at 50% -10%, rgba(236,40,78,.38), transparent 70%), radial-gradient(700px 500px at 100% 100%, rgba(110,15,40,.35), transparent 70%), #0c080a',
    frame: '#1a1013', ring: 'rgba(255,92,124,.22)', shadow: '0 40px 90px -20px rgba(0,0,0,.75), 0 0 60px -10px rgba(236,40,78,.25)'
  },
  light: {
    bg: 'radial-gradient(900px 600px at 50% -10%, rgba(236,40,78,.20), transparent 70%), radial-gradient(700px 500px at 100% 100%, rgba(255,130,154,.22), transparent 70%), #f5f1ee',
    frame: '#ffffff', ring: 'rgba(28,20,14,.08)', shadow: '0 40px 90px -24px rgba(60,20,30,.30), 0 8px 24px -10px rgba(60,20,30,.18)'
  }
};

function html(mode) {
  const t = THEME[mode];
  const left = (W - (SCREENS.length * PHONE + (SCREENS.length - 1) * GAP)) / 2;
  const phones = SCREENS.map((s, i) => {
    const img = readFileSync(`${RAW}/phone-${s}-${mode}.png`).toString('base64');
    const top = i % 2 ? 70 : 130;
    return `<div class="phone" style="left:${left + i * (PHONE + GAP)}px; top:${top}px">
      <img src="data:image/png;base64,${img}"></div>`;
  }).join('');
  return `<!doctype html><html><head><style>
    * { margin:0; box-sizing:border-box }
    body { width:${W}px; height:${H}px; overflow:hidden; background:${t.bg}; position:relative }
    .phone { position:absolute; width:${PHONE}px; height:${Math.round(PHONE * 844 / 390)}px; padding:10px; border-radius:54px;
      background:${t.frame}; box-shadow:${t.shadow}, inset 0 0 0 1px ${t.ring} }
    .phone img { width:100%; height:100%; display:block; border-radius:44px; object-fit:cover; object-position:top }
  </style></head><body>${phones}</body></html>`;
}

const browser = await puppeteer.connect({ browserURL: process.env.BROWSER_URL || 'http://127.0.0.1:9333', defaultViewport: null });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  for (const mode of ['dark', 'light']) {
    await page.setContent(html(mode), { waitUntil: 'load' });
    await page.screenshot({ path: `${DIR}/showcase-${mode}.png` });
    console.log('showcase', mode);
  }
  await page.close();
  README.forEach(n => copyFileSync(`${RAW}/${n}.png`, `${DIR}/${n}.png`));
  MANIFEST.forEach(n => copyFileSync(`${RAW}/${n}.png`, `public/screenshots/${n}.png`));
  console.log('copies :', README.length + MANIFEST.length);
} finally {
  await browser.disconnect();
}
