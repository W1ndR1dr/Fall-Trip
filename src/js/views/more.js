import * as store from '../store.js';
import { esc, toast } from '../ui.js';
import { head, page, slip, icons } from './common.js';
import { RETRIEVED } from '../content/trip.js';
import { applyTheme } from '../app.js';

export function settingsView() {
  const saved = store.get('kids', ['', '', '']);
  const parents = store.get('parents', ['Mom', 'Dad']);
  const theme = store.get('theme', 'auto');
  const works = store.storageWorks();
  return {
    title: 'Settings',
    html: page(`${head('The Flyleaf', { back: '#/', section: 'settings', lede: 'Everything written here stays on this device.' })}
      ${works ? '' : slip('<p class="note-hand">This browser is blocking storage (private mode?). The journal still works, but names and checkmarks will be forgotten when it closes.</p>', { key: 'nostore', cls: 'kraft' })}
      <form data-form autocomplete="off">
      ${slip(`<span class="tape corner-l"></span><div class="kicker">This journal belongs to</div>
        ${[0, 1, 2].map((i) => `<div class="field"><label for="k${i}">Explorer ${['one', 'two', 'three'][i]}</label><input id="k${i}" name="k${i}" value="${esc(saved[i] || '')}" placeholder="write a name" maxlength="24"></div>`).join('')}
        <div class="kicker" style="margin-top:14px">and the grown-ups</div>
        ${[0, 1].map((i) => `<div class="field"><label for="p${i}">Grown-up ${i + 1}</label><input id="p${i}" name="p${i}" value="${esc(parents[i] || '')}" maxlength="24"></div>`).join('')}
        <p class="note-hand">Names never leave this device and never appear on the website.</p>`, { key: 'flyleaf' })}
      ${slip(`<div class="kicker">Where we’re staying</div><div class="field"><label for="lodging">Lodging name or address, for the Maps button</label><input id="lodging" name="lodging" value="${esc(store.get('lodging', ''))}" placeholder="the condo’s address"></div>`, { key: 'lodging', cls: 'kraft' })}
      <button class="btn" type="submit">${icons.check}Save</button>
      </form>
      ${slip(`<div class="kicker">Light</div><p class="note-hand">"Auto" follows the iPhone. Lantern light is kindest to night eyes when stargazing.</p>
        <div class="tabs-kraft" role="group" aria-label="Theme">${[['auto', 'AUTO'], ['light', 'DAYLIGHT'], ['dark', 'LANTERN']].map(([t, l]) => `<button type="button" data-theme="${t}" aria-pressed="${t === theme}">${l}</button>`).join('')}</div>
        <div class="kicker" style="margin-top:16px">Sounds</div>
        <div class="tabs-kraft" role="group" aria-label="Sounds">${[['on', true, 'ON'], ['off', false, 'OFF']].map(([k, v, l]) => `<button type="button" data-sound="${k}" aria-pressed="${store.get('sound', true) === v}">${l}</button>`).join('')}</div>`, { key: 'light' })}
      ${slip(`<div class="kicker">Peek at "today" mode</div><p class="note-hand">See what the first page shows during the trip.</p>
        <div class="btn-row">${[['Fri 5:30 pm', '2026-10-09T17:30:00-07:00'], ['Sat 9:30 am', '2026-10-10T09:30:00-07:00'], ['Sun 8:15 am', '2026-10-11T08:15:00-07:00']].map(([l, v]) => `<button class="btn line small" type="button" data-now="${v}">${l}</button>`).join('')}
        <button class="btn line small" type="button" data-now="">real time</button></div>`, { key: 'peek' })}
      ${slip(`<div class="kicker">Start fresh</div><p>Erase names, checkmarks, and the journal on this device.</p><button class="btn line" type="button" data-wipe>Erase this device’s trip data</button>`, { key: 'wipe', cls: 'kraft' })}`),
    mount(root) {
      root.querySelector('[data-form]').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        store.set('kids', [0, 1, 2].map((i) => String(f.get('k' + i) || '').trim()));
        store.set('parents', [0, 1].map((i) => String(f.get('p' + i) || '').trim() || ['Mom', 'Dad'][i]));
        store.set('lodging', String(f.get('lodging') || '').trim());
        toast('Written in the journal ✓');
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
    html: page(`${head('Keep It in Your Pocket', { back: '#/', section: 'iPhone & iPad' })}
      ${slip(`<ol style="font-size:1.12rem;line-height:1.75;padding-left:1.2em">
        <li>Open this page in <b>Safari</b>.</li>
        <li>Tap <b>Share</b> ${icons.share} (bottom of the screen on iPhone; top right on iPad).</li>
        <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
        <li>Keep the name <b>Fall Trip</b> and tap <b>Add</b>.</li>
        <li>Open it once from the Home Screen <b>while you have signal</b>, and wait for “Saved for offline.”</li>
        <li>Test it: turn on <b>Airplane Mode</b> and open Fall Trip. Every page should still work.</li></ol>`, { key: 'install', tape: 't2' })}
      <p class="note-hand">Do this on each device. Each one keeps its own names, checkmarks, and journal.</p>`),
  };
}

export function aboutView() {
  return {
    title: 'About',
    html: page(`${head('Colophon', { back: '#/', section: 'about & credits' })}
      ${slip(`<img class="art" src="img/art/spec-aspen.webp" alt="" style="width:74px;float:right;margin:-6px 0 6px 10px">
        <p>A family field journal for an Eastern Sierra fall color weekend, made to celebrate the season as God’s creation. It works offline in the canyons.</p>
        <p class="note-hand">Trip facts (hours, closures, color, roads, weather) were gathered ${esc(RETRIEVED)} and refreshed before the trip. Always recheck live conditions under "Before We Go."</p>
        <p class="typed small muted">BUILD <span data-version>…</span></p>`, { key: 'colophon' })}
      ${slip(`<div class="kicker">Scripture</div>
        <p class="small">Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved.</p>
        <p class="small">Scripture quotations marked (NIV) are taken from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.</p>
        <p class="note-hand">The journal quotes 25 verses from each translation, well within both publishers’ limits. “For the Beauty of the Earth” (Folliott S. Pierpoint, 1864) is in the public domain. Bible links open YouVersion (bible.com).</p>`, { key: 'scripture', cls: 'kraft' })}
      ${slip(`<div class="kicker">Paint, paper & type</div>
        <p class="small">Every illustration was painted for this journal in code (ink and watercolor simulated with SVG filters). No photos, no clip art, no copyrighted characters.</p>
        <p class="small">Type (SIL Open Font License 1.1; licenses included): IM Fell English (Igino Marini), Alegreya (Juan Pablo del Peral / Huerta Tipográfica), Kalam (Indian Type Foundry), Courier Prime (Quote-Unquote Apps), Andika (SIL International).</p>
        <p class="small">No analytics, no trackers, no ads. Nothing you write leaves this device.</p>`, { key: 'paint' })}
      ${slip(`<div class="kicker">Sources</div><p class="small">Fall color: CaliforniaFallColor.com, Mono County Tourism, Visit Bishop, Visit Mammoth. Roads & parks: NPS Yosemite, Caltrans, Inyo National Forest, California State Parks. Weather & sky: NOAA/NWS, NCEI, U.S. Naval Observatory. Geology: USGS. The full list with dates is in <span class="typed">research-notes.md</span> in the project repository.</p>
        <p class="note-hand">This site is public but hidden from search engines. It holds no names, addresses, or confirmation numbers.</p>`, { key: 'sources' })}`),
    mount(root) {
      fetch('./version.json').then((r) => r.json()).then((v) => { root.querySelector('[data-version]').textContent = `${v.version} · ${new Date(v.built).toLocaleDateString()}`; })
        .catch(() => { root.querySelector('[data-version]').textContent = 'dev'; });
    },
  };
}
