// Quiet screen-reader announcements for state changes that have no visible
// text change of their own ("6 of 11 found", "Packed", "Turn: Kid 2 reads").
// The shell renders <Announcer/> once; screens call announce(text).
// Toasts are for things everyone should see; announce() is for everything
// else. It never shows anything on screen.
import { useSyncExternalStore } from 'react';

type Msg = { text: string; politeness: 'polite' | 'assertive'; n: number };
let msg: Msg = { text: '', politeness: 'polite', n: 0 };
const subs = new Set<() => void>();
let clearTimer: number | undefined;

/**
 * Announce `text` to screen readers. Repeating the same text announces it
 * again. Use 'assertive' only for something that must interrupt.
 */
export function announce(text: string, politeness: 'polite' | 'assertive' = 'polite') {
  // Clear first so an identical message is still a change.
  msg = { text: '', politeness, n: msg.n + 1 };
  subs.forEach((f) => f());
  requestAnimationFrame(() => {
    msg = { text, politeness, n: msg.n + 1 };
    subs.forEach((f) => f());
    window.clearTimeout(clearTimer);
    clearTimer = window.setTimeout(() => {
      msg = { ...msg, text: '' };
      subs.forEach((f) => f());
    }, 4000);
  });
}

/** Rendered once by the shell: two visually hidden live regions. */
export function Announcer() {
  const m = useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => msg,
    () => msg,
  );
  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {m.politeness === 'polite' ? m.text : ''}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {m.politeness === 'assertive' ? m.text : ''}
      </div>
    </>
  );
}
