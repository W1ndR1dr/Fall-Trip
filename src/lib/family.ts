// Family members. Names are entered on-device only (Settings) and never ship
// with the site. Defaults are generic.
import { get, useStored } from './store';

export const DEFAULT_KIDS = ['Kid 1', 'Kid 2', 'Kid 3'];
export const DEFAULT_PARENTS = ['Mom', 'Dad'];

function clean(saved: unknown, defaults: string[]) {
  return Array.isArray(saved) && saved.length === defaults.length
    ? saved.map((n, i) => (typeof n === 'string' && n.trim()) || defaults[i])
    : defaults.slice();
}

export const kids = () => clean(get<unknown>('kids', null), DEFAULT_KIDS);
export const parents = () => clean(get<unknown>('parents', null), DEFAULT_PARENTS);
export const hasNames = () => {
  const s = get<unknown>('kids', null);
  return Array.isArray(s) && s.some((n) => typeof n === 'string' && n.trim());
};

export function useKids(): string[] {
  const [saved] = useStored<unknown>('kids', null);
  return clean(saved, DEFAULT_KIDS);
}
export function useParents(): string[] {
  const [saved] = useStored<unknown>('parents', null);
  return clean(saved, DEFAULT_PARENTS);
}
/** Kids then parents: the people who can write in the journal. */
export function useFamily(): string[] {
  return [...useKids(), ...useParents()];
}
