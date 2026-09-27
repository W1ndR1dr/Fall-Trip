// Tiny persistence layer. Every call is wrapped so the app keeps working
// when storage is unavailable (private mode, blocked site data, quota).
const PREFIX = 'falltrip:';
const memory = new Map(); // fallback for this session when localStorage throws

export function get(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw !== null) return JSON.parse(raw);
  } catch (e) {
    if (memory.has(key)) return memory.get(key);
  }
  return memory.has(key) ? memory.get(key) : fallback;
}

export function set(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export function remove(key) {
  memory.delete(key);
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (e) {}
}

export function storageWorks() {
  try {
    const k = PREFIX + '__probe';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch (e) {
    return false;
  }
}

// Checklist helper: a Set of checked ids persisted under one key.
export function checklist(key) {
  const read = () => new Set(get(key, []));
  return {
    has: (id) => read().has(id),
    toggle(id) {
      const s = read();
      s.has(id) ? s.delete(id) : s.add(id);
      set(key, [...s]);
      return s.has(id);
    },
    count: () => read().size,
    all: () => read(),
    clear: () => set(key, []),
  };
}
