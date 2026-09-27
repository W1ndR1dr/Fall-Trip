import * as store from '../store.js';
import { esc, kids, toast } from '../ui.js';
import { icons, leaves } from '../art.js';
import { head, page } from './common.js';
import { RETRIEVED } from '../content/trip.js';
import { applyTheme } from '../app.js';

export function settingsView() {
  const saved = store.get('kids', ['', '', '']);
  const parents = store.get('parents', ['Mom', 'Dad']);
  const theme = store.get('theme', 'auto');
  const works = store.storageWorks();
  return {
    title: 'Settings',
    html: page(`${head('Settings', '#/', 'Stays on this device')}
      ${works ? '' : '<p class="note">This browser is blocking storage (private mode?). The app works, but checkmarks and names will be forgotten when you close it.</p>'}
      <form class="card" data-form autocomplete="off">
        <h3>Explorers</h3>
        <p class="small muted">Names are saved only in this browser on this device. They are never sent anywhere or put on the website.</p>
        ${[0, 1, 2].map((i) => `<div class="field"><label for="k${i}">Explorer ${i + 1}</label><input id="k${i}" name="k${i}" value="${esc(saved[i] || '')}" placeholder="Explorer ${i + 1}" maxlength="24"></div>`).join('')}
        <h3 style="margin-top:14px">Grown-ups (journal labels)</h3>
        ${[0, 1].map((i) => `<div class="field"><label for="p${i}">Grown-up ${i + 1}</label><input id="p${i}" name="p${i}" value="${esc(parents[i] || '')}" maxlength="24"></div>`).join('')}
        <h3 style="margin-top:14px">Where we're staying</h3>
        <div class="field"><label for="lodging">Lodging name or address (for the Maps button)</label><input id="lodging" name="lodging" value="${esc(store.get('lodging', ''))}" placeholder="e.g. the condo's street address"></div>
        <button class="btn" type="submit">${icons.check}Save</button>
      </form>
      <section class="card section"><h3>Theme</h3><p class="small muted">Auto follows the iPhone's Light/Dark setting. Dark is best for stargazing.</p>
        <div class="seg" role="group" aria-label="Theme">${['auto', 'light', 'dark'].map((t) => `<button type="button" data-theme="${t}" aria-pressed="${t === theme}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div></section>
      <section class="card section"><h3>Sounds</h3><div class="seg" role="group" aria-label="Sounds">${[['on', true], ['off', false]].map(([l, v]) => `<button type="button" data-sound="${l}" aria-pressed="${store.get('sound', true) === v}">${l === 'on' ? 'On' : 'Off'}</button>`).join('')}</div></section>
      <section class="card section"><h3>Preview "Today" mode</h3><p class="small muted">See what the home screen shows during the trip.</p>
        <div class="btn-row">${[['Fri 5:30 pm', '2026-10-09T17:30:00-07:00'], ['Sat 9:30 am', '2026-10-10T09:30:00-07:00'], ['Sun 8:15 am', '2026-10-11T08:15:00-07:00']].map(([l, v]) => `<button class="btn ghost small" type="button" data-now="${v}">${l}</button>`).join('')}
        <button class="btn ghost small" type="button" data-now="">Real time</button></div></section>
      <section class="card section"><h3>Start fresh</h3><p class="small muted">Clears names, checkmarks, and journal on this device.</p><button class="btn ghost" type="button" data-wipe>Erase this device's trip data</button></section>`),
    mount(root) {
      root.querySelector('[data-form]').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        store.set('kids', [0, 1, 2].map((i) => String(f.get('k' + i) || '').trim()));
        store.set('parents', [0, 1].map((i) => String(f.get('p' + i) || '').trim() || ['Mom', 'Dad'][i]));
        store.set('lodging', String(f.get('lodging') || '').trim());
        toast('Saved on this device');
      });
      root.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => {
        store.set('theme', b.dataset.theme);
        applyTheme();
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
    html: page(`${head('Add to Home Screen', '#/', 'iPhone and iPad')}
      <section class="card"><ol style="font-size:1.1rem;line-height:1.7">
        <li>Open this page in <b>Safari</b>.</li>
        <li>Tap the <b>Share</b> button ${icons.share} (bottom of the screen on iPhone; top right on iPad).</li>
        <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
        <li>Keep the name <b>Fall Trip</b> and tap <b>Add</b>.</li>
        <li>Open it once from the Home Screen <b>while you still have signal</b>. Wait for "Saved for offline."</li>
        <li>Test it: turn on <b>Airplane Mode</b> and open Fall Trip. Everything should still work.</li>
      </ol></section>
      <p class="note section">Do this on every device (both the iPhone and the iPad). Each device keeps its own names, checkmarks, and journal.</p>`),
  };
}

export function aboutView() {
  return {
    title: 'About',
    html: page(`${head('About & credits', '#/', 'Fall Trip')}
      <section class="card"><div style="display:flex;gap:12px;align-items:center"><div style="width:56px">${leaves.aspen()}</div><p>A family guide for an Eastern Sierra fall color weekend, made to celebrate the season as God's creation. Built to work offline in the canyons.</p></div>
      <p class="small muted">Trip facts (hours, closures, color, roads, weather) were checked on ${esc(RETRIEVED)} and are refreshed before the trip. Always recheck live conditions: see "Before we go."</p>
      <p class="small muted">Build <span data-version>…</span></p></section>

      <section class="card section"><h3>Scripture</h3>
        <p class="small">Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved.</p>
        <p class="small">Scripture quotations marked (NIV) are taken from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.</p>
        <p class="small muted">This app quotes 25 verses from each translation, well within both publishers' free-quotation limits. "For the Beauty of the Earth" (Folliott S. Pierpoint, 1864) is in the public domain. Bible links open YouVersion (bible.com).</p></section>

      <section class="card section"><h3>Art, type, and code</h3>
        <p class="small">All illustrations are original and drawn in code for this app. No photos, no copyrighted characters.</p>
        <p class="small">Fonts (SIL Open Font License 1.1, license files included): Young Serif (The Young Serif Project Authors), Atkinson Hyperlegible (Braille Institute of America), Andika (SIL International), and Caveat (The Caveat Project Authors).</p>
        <p class="small">No analytics, no trackers, no ads. Nothing leaves your device.</p></section>

      <section class="card section"><h3>Sources</h3>
        <p class="small">Fall color: CaliforniaFallColor.com, Mono County Tourism, Visit Bishop, Visit Mammoth. Roads and parks: NPS Yosemite, Caltrans, Inyo National Forest, California State Parks. Weather and sky: NOAA/NWS, NCEI climate normals, U.S. Naval Observatory. Geology: USGS. The full list with dates is in <code>research-notes.md</code> in the project repository.</p></section>

      <section class="card section"><h3>Privacy</h3><p class="small">This site is public but hidden from search engines. It contains no names, addresses, or confirmation numbers. Anything you type (names, lodging, journal) stays in this browser only.</p></section>`),
    mount(root) {
      fetch('./version.json').then((r) => r.json()).then((v) => {
        root.querySelector('[data-version]').textContent = `${v.version} · ${new Date(v.built).toLocaleString()}`;
      }).catch(() => { root.querySelector('[data-version]').textContent = 'dev'; });
    },
  };
}
