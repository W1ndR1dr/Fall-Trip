import * as store from '../store.js';
import { esc, toast } from '../ui.js';
import { head, page, card, icons } from './common.js';
import { RETRIEVED } from '../content/trip.js';
import { applyTheme } from '../app.js';

export function settingsView() {
  const saved = store.get('kids', ['', '', '']);
  const parents = store.get('parents', ['Mom', 'Dad']);
  const theme = store.get('theme', 'auto');
  const works = store.storageWorks();
  return {
    title: 'Settings',
    html: page(`${head('Settings', { back: '#/', lede: 'Everything here is stored only on this device.' })}
      <div class="stack">
      ${works ? '' : card('<p>This browser is blocking storage (Private Browsing?). The app works, but names and checkmarks won’t be saved.</p>', 'tint')}
      <form data-form autocomplete="off" class="stack">
        ${card(`<h3>Kids</h3>${[0, 1, 2].map((i) => `<div class="field"><label for="k${i}">Child ${i + 1}</label><input id="k${i}" name="k${i}" value="${esc(saved[i] || '')}" placeholder="Name" maxlength="24"></div>`).join('')}
          <h3 style="margin-top:18px">Parents</h3><p class="small muted">Used as labels in the journal.</p>
          ${[0, 1].map((i) => `<div class="field"><label for="p${i}">Parent ${i + 1}</label><input id="p${i}" name="p${i}" value="${esc(parents[i] || '')}" maxlength="24"></div>`).join('')}`)}
        ${card(`<h3>Lodging</h3><div class="field"><label for="lodging">Name or address</label><input id="lodging" name="lodging" value="${esc(store.get('lodging', ''))}" placeholder="Used for the Maps button"></div>`)}
        <div><button class="btn" type="submit">${icons.check}Save</button></div>
      </form>
      ${card(`<h3>Appearance</h3><p class="small muted">Automatic follows your iPhone. Dark is easier on your eyes when stargazing.</p>
        <div class="segmented" role="group" aria-label="Appearance">${[['auto', 'Automatic'], ['light', 'Light'], ['dark', 'Dark']].map(([t, l]) => `<button type="button" data-theme="${t}" aria-pressed="${t === theme}">${l}</button>`).join('')}</div>
        <h3 style="margin-top:20px">Sounds</h3>
        <div class="segmented" role="group" aria-label="Sounds" style="margin-top:8px">${[['on', true, 'On'], ['off', false, 'Off']].map(([k, v, l]) => `<button type="button" data-sound="${k}" aria-pressed="${store.get('sound', true) === v}">${l}</button>`).join('')}</div>`)}
      ${card(`<h3>Preview trip mode</h3><p class="small muted">See what the home screen shows during the trip.</p>
        <div class="btn-row">${[['Fri 5:30 pm', '2026-10-09T17:30:00-07:00'], ['Sat 9:30 am', '2026-10-10T09:30:00-07:00'], ['Sun 8:15 am', '2026-10-11T08:15:00-07:00']].map(([l, v]) => `<button class="btn small secondary" type="button" data-now="${v}">${l}</button>`).join('')}
        <button class="btn small soft" type="button" data-now="">Real time</button></div>`)}
      ${card(`<h3>Reset</h3><p class="small muted">Erase names, checkmarks, and journal entries on this device.</p><div class="btn-row"><button class="btn small secondary" type="button" data-wipe>Erase data</button></div>`)}
      </div>`),
    mount(root) {
      root.querySelector('[data-form]').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        store.set('kids', [0, 1, 2].map((i) => String(f.get('k' + i) || '').trim()));
        store.set('parents', [0, 1].map((i) => String(f.get('p' + i) || '').trim() || ['Mom', 'Dad'][i]));
        store.set('lodging', String(f.get('lodging') || '').trim());
        toast('Saved');
      });
      root.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => {
        store.set('theme', b.dataset.theme); applyTheme();
        root.querySelectorAll('[data-theme]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      }));
      root.querySelectorAll('[data-sound]').forEach((b) => b.addEventListener('click', () => {
        store.set('sound', b.dataset.sound === 'on');
        root.querySelectorAll('[data-sound]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      }));
      root.querySelectorAll('[data-now]').forEach((b) => b.addEventListener('click', () => {
        b.dataset.now ? store.set('debugNow', b.dataset.now) : store.remove('debugNow');
        location.hash = '#/';
      }));
      root.querySelector('[data-wipe]').addEventListener('click', () => {
        if (!confirm('Erase all Fall Trip data on this device?')) return;
        try { Object.keys(localStorage).filter((k) => k.startsWith('falltrip:')).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
        location.hash = '#/';
        location.reload();
      });
    },
  };
}

export function installView() {
  return {
    title: 'Install',
    html: page(`${head('Install', { back: '#/', lede: 'Add Fall Trip to the Home Screen so it works without a signal.' })}
      ${card(`<ol style="font-size:1.05rem;line-height:1.7;padding-left:1.2em;margin:0">
        <li>Open this page in <b>Safari</b>.</li>
        <li>Tap <b>Share</b> ${icons.share}: at the bottom on iPhone, at the top right on iPad.</li>
        <li>Tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>
        <li>Open it once from the Home Screen while you have signal.</li>
        <li>Check it: turn on Airplane Mode and open it again. Every screen should work.</li></ol>`)}
      <p class="small muted" style="margin-top:14px">Do this on both the iPhone and the iPad. Each device keeps its own names, checkmarks, and journal.</p>`),
  };
}

export function aboutView() {
  return {
    title: 'About',
    html: page(`${head('About', { back: '#/', lede: 'A guide for one family’s fall weekend in the Eastern Sierra. It works offline.' })}
      <div class="stack">
      ${card(`<p>Hours, closures, fall color, roads, and weather were checked on ${esc(RETRIEVED)} and refreshed before the trip. Always recheck live conditions on the Before you go page.</p><p class="small faint">Version <span data-version>…</span></p>`)}
      ${card(`<h3>Scripture</h3>
        <p class="small">Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved.</p>
        <p class="small">Scripture quotations marked (NIV) are taken from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.</p>
        <p class="small muted">25 verses are quoted from each translation, well within both publishers’ limits. “For the Beauty of the Earth” (Folliott S. Pierpoint, 1864) is in the public domain. Bible links open YouVersion (bible.com).</p>`)}
      ${card(`<h3>Art and type</h3>
        <p class="small">The illustrations were made for this app as code-generated watercolor and ink. There are no photos or third-party artwork.</p>
        <p class="small">Fonts, all under the SIL Open Font License (license files included): Instrument Serif and Instrument Sans (The Instrument Project Authors), Newsreader (Production Type), and Andika (SIL International).</p>
        <p class="small">No analytics, trackers, or ads. What you type stays on this device.</p>`)}
      ${card(`<h3>Sources</h3><p class="small">Fall color: CaliforniaFallColor.com, Mono County Tourism, Visit Bishop, Visit Mammoth. Roads and parks: NPS Yosemite, Caltrans, Inyo National Forest, California State Parks. Weather and sky: NOAA/NWS, NCEI, U.S. Naval Observatory. Geology: USGS. A full list with dates is in <code>research-notes.md</code> in the project repository.</p>
        <p class="small muted">This site is public but hidden from search engines. It contains no names, addresses, or confirmation numbers.</p>`)}
      </div>`),
    mount(root) {
      fetch('./version.json').then((r) => r.json()).then((v) => { root.querySelector('[data-version]').textContent = `${v.version} · ${new Date(v.built).toLocaleDateString()}`; })
        .catch(() => { root.querySelector('[data-version]').textContent = 'dev'; });
    },
  };
}
