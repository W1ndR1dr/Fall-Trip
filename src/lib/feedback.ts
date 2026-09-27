// Sound and haptics. The chime is synthesized with WebAudio (no files, works
// offline) and respects the Sounds setting.
import { get } from './store';

let actx: AudioContext | undefined;

export function chime(notes: number[] = [659, 784, 988]) {
  if (get<boolean>('sound', true) === false) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    actx = actx || new AC();
    const t0 = actx.currentTime;
    notes.forEach((f, i) => {
      const o = actx!.createOscillator();
      const g = actx!.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.09 + 0.5);
      o.connect(g).connect(actx!.destination);
      o.start(t0 + i * 0.09);
      o.stop(t0 + i * 0.09 + 0.55);
    });
  } catch {
    /* ignore */
  }
}

/** Light tap feedback where supported (Android; iOS Safari ignores vibrate). */
export function haptic(ms = 10) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}
