// Appearance. Automatic follows the device; Light/Dark override it.
// Night vision is separate: when on, <html data-theme="night"> regardless of
// the theme preference (red, dim, for stargazing).
// The resolved theme lives on <html data-theme="light|dark|night">; the inline
// script in index.html applies it before first paint (keep the two in sync).
import { useSyncExternalStore } from 'react';
import { get, set, subscribe } from './store';

export type ThemePref = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark' | 'night';

// Must equal --bg of each palette in src/ui/tokens.css (and the manifest for light).
export const THEME_COLOR: Record<ResolvedTheme, string> = { light: '#f4eee5', dark: '#0e0a07', night: '#050202' };

const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export function resolvedTheme(pref: ThemePref = get<ThemePref>('theme', 'auto'), night = get<boolean>('nightVision', false)): ResolvedTheme {
  if (night) return 'night';
  if (pref === 'light' || pref === 'dark') return pref;
  return media?.matches ? 'dark' : 'light';
}

export function applyTheme() {
  const pref = get<ThemePref>('theme', 'auto');
  const t = resolvedTheme(pref);
  const root = document.documentElement;
  if (root.dataset.theme !== t) root.dataset.theme = t;
  root.style.colorScheme = t === 'light' ? 'light' : 'dark';
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    // With an override (or night vision), both media variants show the chosen color.
    const c = pref === 'auto' && t !== 'night' ? (m.media.includes('dark') ? THEME_COLOR.dark : THEME_COLOR.light) : THEME_COLOR[t];
    if (m.content !== c) m.content = c;
  });
  listeners.forEach((fn) => fn());
}

const listeners = new Set<() => void>();
function onTheme(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Change a theme setting, cross-fading the whole page when the browser
 * supports View Transitions (instant with reduced motion).
 */
function transition(fn: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (doc.startViewTransition && !calm) doc.startViewTransition(fn);
  else fn();
}

export function setThemePref(pref: ThemePref) {
  transition(() => {
    set('theme', pref);
    applyTheme();
  });
}

export function setNightVision(on: boolean) {
  transition(() => {
    set('nightVision', on);
    applyTheme();
  });
}

/** The resolved theme, re-rendering when it changes (device, Settings, night vision). */
export function useTheme(): { theme: ResolvedTheme; pref: ThemePref; nightVision: boolean } {
  const theme = useSyncExternalStore(onTheme, () => resolvedTheme(), () => 'light' as ResolvedTheme);
  const pref = useSyncExternalStore(subscribe, () => get<ThemePref>('theme', 'auto'), () => 'auto' as ThemePref);
  const nightVision = useSyncExternalStore(subscribe, () => get<boolean>('nightVision', false), () => false);
  return { theme, pref, nightVision };
}

media?.addEventListener('change', () => applyTheme());
// Settings changed in another tab, or erased: re-resolve.
if (typeof window !== 'undefined') subscribe(() => {
  const t = resolvedTheme();
  if (document.documentElement.dataset.theme !== t) applyTheme();
});
