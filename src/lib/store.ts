// Persistence on this device only. Every access is wrapped so the app keeps
// working when storage is unavailable (Private Browsing, blocked site data,
// quota): values then live in memory for the session.
import { useCallback, useSyncExternalStore } from 'react';

const PREFIX = 'falltrip:';
const memory = new Map<string, unknown>();
const cache = new Map<string, { raw: string | null; value: unknown }>();
const listeners = new Set<() => void>();

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function get<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (raw === null) return memory.has(key) ? (memory.get(key) as T) : fallback;
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  try {
    const value = JSON.parse(raw) as T;
    cache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function set<T>(key: string, value: T): boolean {
  memory.set(key, value);
  let ok = true;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    ok = false;
  }
  emit();
  return ok;
}

export function remove(key: string) {
  memory.delete(key);
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
  emit();
}

/** Erase every Fall Trip key on this device. */
export function wipe() {
  memory.clear();
  cache.clear();
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  emit();
}

export function storageWorks(): boolean {
  try {
    const k = PREFIX + '__probe';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith(PREFIX)) emit();
  });
}

/** React state bound to a stored key. Re-renders every subscriber on change. */
export function useStored<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => get(key, fallback),
    () => fallback,
  );
  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = get(key, fallback);
      set(key, typeof next === 'function' ? (next as (p: T) => T)(prev) : next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, update];
}

/** A set of checked ids persisted under one key (packing, hunt, checklists). */
export function useChecklist(key: string) {
  const [ids, setIds] = useStored<string[]>(key, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string) => {
      let nowOn = false;
      setIds((prev) => {
        nowOn = !prev.includes(id);
        return nowOn ? [...prev, id] : prev.filter((x) => x !== id);
      });
      return nowOn;
    },
    [setIds],
  );
  const clear = useCallback(() => setIds([]), [setIds]);
  return { ids, has, toggle, clear, count: ids.length };
}
