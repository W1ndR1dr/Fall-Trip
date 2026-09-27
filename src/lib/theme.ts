// Appearance: Automatic follows the device; Light/Dark override it.
// The resolved theme lives on <html data-theme="light|dark">; the inline
// script in index.html applies it before first paint.
import { get } from './store';

export type ThemePref = 'auto' | 'light' | 'dark';

// Must match the page background tokens in the stylesheet.
export const THEME_COLOR = { light: '#f6f1e7', dark: '#121110' };

const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export function resolvedTheme(pref: ThemePref = get<ThemePref>('theme', 'auto')): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return media?.matches ? 'dark' : 'light';
}

export function applyTheme() {
  const pref = get<ThemePref>('theme', 'auto');
  const t = resolvedTheme(pref);
  const root = document.documentElement;
  root.dataset.theme = t;
  root.style.colorScheme = t;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    // With an override, both media variants must show the chosen color.
    m.content = pref === 'auto' ? (m.media.includes('dark') ? THEME_COLOR.dark : THEME_COLOR.light) : THEME_COLOR[t];
  });
}

media?.addEventListener('change', () => applyTheme());
