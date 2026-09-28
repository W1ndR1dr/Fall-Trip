// Memory verse (Ecclesiastes 3:1): read it together, hide a word, say the
// whole verse, repeat until every word is hidden. Tap a hidden word to peek.
// Hidden words are saved per translation ('mv:ESV', 'mv:NIV') as word indices.
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { chime, haptic } from '@/lib/feedback';
import { useStored } from '@/lib/store';
import { Button, Card, Page, Pips, announce, fade, spring, useCalm } from '@/ui';
import { ArrowCounterClockwise, Check } from '@/ui/icons';
import { BarTitle, LargePrintButton, LeafBurst, useLargePrint, useTranslation } from './bits';
import { MEMORY_VERSE, memoryWords } from './data';
import { Notice, TranslationSwitch } from './Passage';

export default function VerseGame(_props: ScreenProps) {
  const [tr] = useTranslation();
  const [large] = useLargePrint();
  const calm = useCalm();
  const words = memoryWords(tr);
  const [raw, setRaw] = useStored<number[]>(`mv:${tr}`, []);
  const hidden = useMemo(() => new Set((Array.isArray(raw) ? raw : []).filter((i) => Number.isInteger(i) && i >= 0 && i < words.length)), [raw, words.length]);
  const all = hidden.size === words.length;
  const [peek, setPeek] = useState<number[]>([]);
  const timers = useRef(new Map<number, number>());
  const [burst, setBurst] = useState(0);
  const [wave, setWave] = useState(0); // "Show all": slots clear left to right

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);
  useEffect(() => setPeek([]), [tr]);

  const save = (s: Set<number>) => setRaw([...s].sort((a, b) => a - b));

  const hide = (i: number) => {
    if (hidden.has(i)) return;
    const s = new Set(hidden).add(i);
    save(s);
    haptic(8);
    if (s.size === words.length) {
      setBurst((b) => b + 1);
      chime([523, 659, 784, 1047]);
      announce('Every word is hidden. Say the whole verse together.');
    } else {
      announce(`${s.size} of ${words.length} hidden`);
    }
  };

  const peekAt = (i: number) => {
    haptic(6);
    setPeek((p) => (p.includes(i) ? p : [...p, i]));
    window.clearTimeout(timers.current.get(i));
    timers.current.set(
      i,
      window.setTimeout(() => setPeek((p) => p.filter((x) => x !== i)), 1800),
    );
  };

  const hideRandom = () => {
    const left = words.map((_, i) => i).filter((i) => !hidden.has(i));
    if (left.length) hide(left[Math.floor(Math.random() * left.length)]);
  };

  const reset = () => {
    setWave((w) => w + 1);
    setPeek([]);
    setRaw([]);
    haptic(8);
    announce('All words showing');
  };

  return (
    <Page
      title="Memory verse"
      eyebrow={MEMORY_VERSE}
      subtitle="Read it together. Hide a word, then say the whole verse. Keep going until every word is hidden."
      back={{ href: '/faith', label: 'Devotions' }}
      barCenter={<BarTitle title="Memory verse" />}
      actions={<LargePrintButton />}
      sky="candle"
    >
      <div className="section">
        <Card className="vg-card">
          <div className="vg-head">
            <span className="vg-count t-footnote num" aria-hidden="true">
              {hidden.size} of {words.length} hidden
            </span>
            <TranslationSwitch />
          </div>
          <div className="vg-stage">
            <LeafBurst fire={burst} count={16} spread={1.5} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={tr} className={`vg-words ${large ? 'vg-kid' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade.base}>
                {words.map((w, i) => (
                  <Word key={i} i={i} word={w} hidden={hidden.has(i)} peeking={peek.includes(i)} calm={calm} wave={wave} onHide={() => hide(i)} onPeek={() => peekAt(i)} />
                ))}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="vg-foot">
            <Pips total={words.length} filled={hidden.size} color="var(--night)" size={7} label={`${hidden.size} of ${words.length} words hidden`} />
          </div>
        </Card>
      </div>

      <div className="vg-actions gutter">
        <AnimatePresence mode="popLayout" initial={false}>
          {all ? (
            <motion.div key="done" className="vg-done" initial={calm ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={calm ? fade.base : spring.glide}>
              <span className="vg-done-icon" aria-hidden="true">
                <Check size={20} weight="bold" />
              </span>
              <div className="vg-done-text">
                <p className="t-headline">Every word is hidden</p>
                <p className="t-callout">Say the whole verse together, one more time.</p>
              </div>
              <Button size="md" icon={ArrowCounterClockwise} onClick={reset}>
                Start over
              </Button>
            </motion.div>
          ) : (
            <motion.div key="play" className="vg-play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade.base}>
              <Button size="lg" block onClick={hideRandom}>
                Hide a word
              </Button>
              <Button size="lg" variant="ghost" icon={ArrowCounterClockwise} onClick={reset} disabled={hidden.size === 0}>
                Show all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="t-footnote gutter-text vg-tip">Tap a word to hide it. Tap a hidden word to peek at it.</p>
      <div className="gutter-text vg-notice">
        <Notice tr={tr} />
      </div>
    </Page>
  );
}

function Word({ i, word, hidden, peeking, calm, wave, onHide, onPeek }: { i: number; word: string; hidden: boolean; peeking: boolean; calm: boolean; wave: number; onHide: () => void; onPeek: () => void }) {
  const showInk = !hidden || peeking;
  // After "Show all", slots clear in a quick left-to-right wave.
  const delay = !hidden && wave ? i * 0.022 : 0;
  return (
    <motion.button
      type="button"
      className="vg-word"
      data-hidden={hidden || undefined}
      data-peek={(hidden && peeking) || undefined}
      aria-pressed={hidden}
      aria-label={hidden ? (peeking ? `${word} (hidden)` : `Hidden word ${i + 1}. Peek`) : word}
      onClick={hidden ? onPeek : onHide}
      whileTap={calm ? undefined : { scale: 0.92 }}
      transition={spring.snap}
    >
      <motion.span
        className="vg-slot"
        aria-hidden="true"
        initial={false}
        animate={calm ? { opacity: hidden ? 1 : 0 } : { opacity: hidden ? 1 : 0, scaleX: hidden ? 1 : 0.35, scaleY: hidden ? 1 : 0.6 }}
        transition={calm ? { duration: 0 } : hidden ? spring.pop : { ...spring.snap, delay }}
      />
      <motion.span className="vg-ink" aria-hidden="true" initial={false} animate={{ opacity: showInk ? 1 : 0 }} transition={calm ? { duration: 0 } : { duration: hidden && !peeking ? 0.12 : 0.22, delay: !hidden ? delay : 0 }}>
        {word}
      </motion.span>
    </motion.button>
  );
}
