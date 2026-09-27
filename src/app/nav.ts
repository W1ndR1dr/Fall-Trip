// Navigation model on top of hash routing (GitHub Pages).
// Every history entry we create carries its depth (`history.state.idx`), so a
// location change can tell push from pop. The shell uses that to pick the
// page transition:
//   push  drill-down (slides in from the right)
//   pop   back (slides out to the right)
//   fade  switching tabs (cross-fade, like iOS)
//   none  replace (e.g. switching the Plan day), no page transition
import { navigate as hashNavigate, useHashLocation } from 'wouter/use-hash-location';
import type { BaseLocationHook } from 'wouter';

export type NavMode = 'push' | 'pop' | 'fade' | 'none';
export type TabId = 'today' | 'plan' | 'activities' | 'kids' | 'faith' | 'none';

const currentPath = () => '/' + location.hash.replace(/^#?\/?/, '').split('?')[0];

/** Which tab a path belongs to (drives the tab bar and tab-switch fades). */
export function tabOf(path: string): TabId {
  const seg = path.split('/')[1] || '';
  if (seg === '') return 'today';
  if (['plan', 'route', 'pack', 'before'].includes(seg)) return 'plan';
  if (['explore', 'do', 'color', 'food'].includes(seg)) return 'activities';
  if (seg === 'kids') return 'kids';
  if (seg === 'faith') return 'faith';
  if (['settings', 'about', 'install'].includes(seg)) return 'today';
  return 'none';
}

function stamp(idx: number) {
  try {
    history.replaceState({ ...(history.state || {}), idx }, '');
  } catch {
    /* ignore */
  }
}

let idx = 0;
if (typeof window !== 'undefined') {
  const s = history.state as { idx?: number } | null;
  if (s && typeof s.idx === 'number') idx = s.idx;
  else stamp(0);
}

let pendingMode: NavMode | null = null;
let last = { from: typeof window !== 'undefined' ? currentPath() : '/', to: typeof window !== 'undefined' ? currentPath() : '/', mode: 'none' as NavMode };

if (typeof window !== 'undefined') {
  // Registered at import, before wouter subscribes, so the transition is
  // known by the time React re-renders for the new location.
  addEventListener('hashchange', () => {
    const to = currentPath();
    if (to === last.to) return;
    let n = (history.state as { idx?: number } | null)?.idx;
    if (typeof n !== 'number') {
      // A hash typed or linked from outside the router: treat as a push.
      n = idx + 1;
      stamp(n);
    }
    const dir: NavMode = n < idx ? 'pop' : n > idx ? 'push' : 'none';
    idx = n;
    const crossTab = tabOf(to) !== tabOf(last.to);
    const mode = pendingMode ?? (crossTab && dir !== 'none' ? 'fade' : dir);
    pendingMode = null;
    last = { from: last.to, to, mode };
  });
}

// Set by routes.tsx: loads a path's screen chunk so a page never slides in empty.
let preload: (path: string) => Promise<unknown> = () => Promise.resolve();
export function setPreloader(fn: (path: string) => Promise<unknown>) {
  preload = fn;
}

/** Navigate, stamping the new entry's depth. `replace` keeps the depth. */
export function navigate(to: string, opts: { replace?: boolean; mode?: NavMode } = {}) {
  const go = () => {
    if (opts.mode) pendingMode = opts.mode;
    hashNavigate(to, { replace: opts.replace, state: { idx: opts.replace ? idx : idx + 1 } });
  };
  // Wait (briefly) for the screen's code, then move. Already-loaded chunks
  // resolve in a microtask; a slow load gives up waiting after 300 ms.
  Promise.race([preload(to.split('?')[0]), new Promise((r) => setTimeout(r, 300))]).then(go, go);
}

/** wouter location hook: hash location + our depth-aware navigate. */
export const useStackLocation: BaseLocationHook = () => {
  const [loc] = useHashLocation();
  return [loc, navigate];
};
useStackLocation.hrefs = (href: string) => '#' + href;

/** The transition for the most recent navigation. */
export const lastNavigation = () => last;

/** True when there is an in-app page to go back to. */
export const canGoBack = () => idx > 0;

/**
 * Back: pops history when there is somewhere in-app to go, otherwise
 * replaces with `fallback` (a deep link opened cold still has a way up).
 */
export function goBack(fallback: string) {
  if (idx > 0) history.back();
  else navigate(fallback, { replace: true, mode: 'pop' });
}

// Per-path scroll memory (tab switches and back restore where you were).
export const scrollMemory = new Map<string, number>();

/** Display mode: the custom edge-swipe only runs in the installed app. */
export const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
