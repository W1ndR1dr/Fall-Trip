// One devotion on one scrolling page: 01 Look, 02 Read, 03 Wonder, 04 Pray,
// 05 Do, so a family reading together sees everything. A stepper docked above
// the tab bar follows the section in view, jumps on tap, and ends in "Mark done".
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { chime, haptic } from '@/lib/feedback';
import { useKids } from '@/lib/family';
import { useStored } from '@/lib/store';
import { Button, Card, Checkbox, EmptyState, IconButton, KidChip, NightVisionOffer, Page, announce, spring, useCalm } from '@/ui';
import { ArrowDown, ArrowUp, ArrowsClockwise, BookOpenText, Check, NotePencil } from '@/ui/icons';
import { BarTitle, LargePrintButton, LeafBurst, useLargePrint } from './bits';
import { STEP_LABEL, eyebrowOf, findDevotion, hasTurns, stepsOf, turnsFor, type Devotion as Dev, type StepKey } from './data';
import { PassageCard } from './Passage';

export default function Devotion({ params }: ScreenProps) {
  const d = findDevotion(params.id);
  if (!d) {
    return (
      <Page title="Devotion" back={{ href: '/faith', label: 'Devotions' }} sky="candle">
        <EmptyState icon={BookOpenText} title="This devotion isn't here" action={<Button href="/faith">All devotions</Button>}>
          The link may be from an older version of the app.
        </EmptyState>
      </Page>
    );
  }
  return <DevotionPage key={d.id} d={d} />;
}

// ---------------------------------------------------------------------------
// Scroll-spy: a continuous position (0 … n−1) from the page scroll, so the
// stepper lens tracks the reading position, not just the nearest section.

// The screen renders <Page>, so it sits above the page's scroll context: the
// scroll container is found from the sections themselves.
const scrollerOf = (el: Element | null | undefined) => (el?.closest('.page') as HTMLElement | null) ?? null;

function useScrollSpy(count: number) {
  const sections = useRef<(HTMLElement | null)[]>([]);
  const anchors = useRef<number[]>([]);
  const p = useMotionValue(0);
  const [cur, setCur] = useState(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const sc = scrollerOf(sections.current[0]);
    if (!sc) return;
    const update = () => {
      const a = anchors.current;
      if (!a.length) return;
      const y = sc.scrollTop;
      let v = 0;
      if (y >= a[count - 1]) v = count - 1;
      else if (y > a[0]) {
        for (let i = 0; i < count - 1; i++) {
          if (y < a[i + 1]) {
            v = i + (y - a[i]) / Math.max(1, a[i + 1] - a[i]);
            break;
          }
        }
      }
      p.set(v);
      setCur(Math.max(0, Math.min(count - 1, Math.round(v))));
    };
    const measure = () => {
      const base = sc.getBoundingClientRect().top - sc.scrollTop;
      const bar = sc.querySelector<HTMLElement>('.navbar')?.offsetHeight ?? 60;
      const max = Math.max(0, sc.scrollHeight - sc.clientHeight);
      // Where each section's heading sits just under the bar.
      const a = sections.current.slice(0, count).map((el) => (el ? Math.max(0, el.getBoundingClientRect().top - base - bar - 14) : 0));
      // Sections too close to the end to reach the top share the last stretch.
      const k = a.findIndex((t) => t > max);
      if (k >= 0) {
        const lo = k > 0 ? a[k - 1] : 0;
        for (let i = k; i < count; i++) a[i] = lo + ((max - lo) * (i - k + 1)) / (count - k);
      }
      anchors.current = a;
      update();
    };
    measure();
    const ro = new ResizeObserver(measure);
    const body = sc.querySelector('.page-body');
    if (body) ro.observe(body);
    ro.observe(sc);
    sc.addEventListener('scroll', update, { passive: true });
    // Any touch, wheel or key stops a jump in flight (interruptible).
    const stop = () => anim.current?.stop();
    sc.addEventListener('wheel', stop, { passive: true });
    sc.addEventListener('touchstart', stop, { passive: true });
    sc.addEventListener('keydown', stop);
    return () => {
      ro.disconnect();
      sc.removeEventListener('scroll', update);
      sc.removeEventListener('wheel', stop);
      sc.removeEventListener('touchstart', stop);
      sc.removeEventListener('keydown', stop);
      anim.current?.stop();
    };
  }, [count, p]);

  const scrollTo = useCallback((top: number, calm: boolean) => {
      const sc = scrollerOf(sections.current[0]);
      if (!sc) return;
      anim.current?.stop();
      if (calm) sc.scrollTop = top;
      else anim.current = animate(sc.scrollTop, top, { ...spring.glide, onUpdate: (v) => (sc.scrollTop = v) });
    }, []);

  const jump = useCallback((i: number, calm: boolean) => scrollTo(i === 0 ? 0 : (anchors.current[i] ?? 0), calm), [scrollTo]);
  return { sections, p, cur, jump, scrollTo };
}

// ---------------------------------------------------------------------------

function DevotionPage({ d }: { d: Dev }) {
  const kids = useKids();
  const calm = useCalm();
  const steps = stepsOf(d);
  const [nudge, setNudge] = useStored<number>(`turn:${d.id}`, 0);
  const [done, setDone] = useStored<boolean>(`done:${d.id}`, false);
  const [large] = useLargePrint();
  const turns = hasTurns(d) ? turnsFor(d.id, nudge) : null;
  const spy = useScrollSpy(steps.length);
  const heads = useRef<(HTMLHeadingElement | null)[]>([]);
  const [spins, setSpins] = useState(0);
  const [burst, setBurst] = useState({ page: 0, dock: 0 });
  const step = steps[spy.cur];

  const rotate = () => {
    const n = ((Number(nudge) || 0) + 1) % 3;
    setNudge(n);
    setSpins((s) => s + 1);
    haptic(8);
    const t = turnsFor(d.id, n);
    announce(`${kids[t.reader]} reads. ${kids[t.prayer]} prays.`);
  };

  const toggleDone = (from: 'page' | 'dock') => {
    const next = done !== true;
    setDone(next);
    if (next) {
      setBurst((b) => ({ ...b, [from]: b[from] + 1 }));
      chime([523, 659, 784]);
      haptic(14);
      announce(`${d.title}: done`);
    } else {
      announce(`${d.title}: not done`);
    }
  };

  const jumpTo = (i: number) => {
    spy.jump(i, calm);
    heads.current[i]?.focus({ preventScroll: true });
  };

  const onNext = () => {
    if (spy.cur < steps.length - 1) jumpTo(spy.cur + 1);
    else if (done !== true) toggleDone('dock');
    else {
      spy.scrollTo(0, calm);
      scrollerOf(heads.current[0])?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    }
  };

  const text = large ? 'dv-kid' : 't-reading';

  const body = (k: StepKey) => {
    switch (k) {
      case 'look':
        return <p className={`${text} gutter-text`}>{d.look}</p>;
      case 'read':
        return (
          <>
            <PassageCard refs={d.read} note={d.readNote} />
            {d.why && (
              <p className="t-footnote gutter-text dv-why">
                <b>Why this passage here.</b> {d.why}
              </p>
            )}
          </>
        );
      case 'wonder':
        return <p className={`${text} gutter-text`}>{d.wonder}</p>;
      case 'pray':
        return (
          <div className="gutter-text">
            <p className={`${text} dv-prayer`}>{d.pray}</p>
          </div>
        );
      case 'do':
        return (
          <>
            <p className={`${text} gutter-text`}>{d.do}</p>
            {d.hymn && (
              <Card className="dv-hymn">
                <p className="t-eyebrow">Sing</p>
                <h3 className="t-title-3 dv-hymn-title">{d.hymn.title}</h3>
                <p className={`${large ? 'dv-kid' : 't-reading'} dv-hymn-lines`}>
                  {d.hymn.lines.map((l, i) => (
                    <span key={i}>
                      {l}
                      <br />
                    </span>
                  ))}
                </p>
                <p className="t-caption">{d.hymn.credit}</p>
              </Card>
            )}
          </>
        );
    }
  };

  return (
    <Page
      title={d.title}
      eyebrow={eyebrowOf(d)}
      back={{ href: '/faith', label: 'Devotions' }}
      barCenter={<BarTitle title={d.title} />}
      actions={<LargePrintButton />}
      sky="candle"
      dock={<Stepper steps={steps} p={spy.p} cur={spy.cur} done={done === true} onJump={jumpTo} onNext={onNext} burst={burst.dock} />}
    >
      {turns && (
        <div className="dv-turns gutter" role="group" aria-label="Whose turn">
          <TurnChip index={turns.reader} name={kids[turns.reader]} detail="reads" active={step === 'read'} />
          <TurnChip index={turns.prayer} name={kids[turns.prayer]} detail="prays" active={step === 'pray'} />
          <IconButton
            className="dv-rotate"
            variant="plain"
            label="Switch turns"
            onClick={rotate}
            icon={
              <motion.span className="inline-flex" animate={{ rotate: spins * 180 }} transition={calm ? { duration: 0 } : spring.glide}>
                <ArrowsClockwise size={20} aria-hidden="true" />
              </motion.span>
            }
          />
        </div>
      )}
      {d.id === 'm-stars' && (
        <div className="mt-4">
          <NightVisionOffer />
        </div>
      )}

      {steps.map((k, i) => (
        <section key={k} ref={(el) => void (spy.sections.current[i] = el)} className="dv-sec" aria-labelledby={`dv-${d.id}-${k}`} data-step={k}>
          <div className="dv-sec-head gutter-text">
            <h2 id={`dv-${d.id}-${k}`} ref={(el) => void (heads.current[i] = el)} tabIndex={-1} className="dv-h">
              <span className="dv-num num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t-eyebrow dv-label">{STEP_LABEL[k]}</span>
            </h2>
            {turns && k === 'read' && <span className="t-footnote dv-who">{kids[turns.reader]} reads</span>}
            {turns && k === 'pray' && <span className="t-footnote dv-who">{kids[turns.prayer]} prays</span>}
          </div>
          {body(k)}
        </section>
      ))}

      <div className="dv-finish gutter">
        <div className="dv-done-wrap">
          <LeafBurst fire={burst.page} />
          <Button size="lg" block variant={done ? 'tonal' : 'secondary'} aria-pressed={done === true} onClick={() => toggleDone('page')} icon={<Checkbox checked={done === true} decorative size={22} />} className="dv-done">
            {done ? 'Done' : 'Mark done'}
          </Button>
        </div>
        <Button size="lg" icon={NotePencil} href="/faith/journal">
          Journal
        </Button>
      </div>
    </Page>
  );
}

function TurnChip({ index, name, detail, active }: { index: number; name: string; detail: string; active: boolean }) {
  return (
    <span className="dv-turn">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={index} className="inline-flex" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring.glide}>
          <KidChip index={index} name={name} detail={detail} active={active} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// The docked stepper

function Stepper({ steps, p, cur, done, onJump, onNext, burst }: { steps: StepKey[]; p: MotionValue<number>; cur: number; done: boolean; onJump: (i: number) => void; onNext: () => void; burst: number }) {
  const x = useTransform(p, (v) => `${v * 100}%`);
  const last = cur >= steps.length - 1;
  const mode = !last ? 'next' : done ? 'top' : 'done';
  const nextLabel = mode === 'next' ? `Next: ${STEP_LABEL[steps[cur + 1]]}` : mode === 'done' ? 'Mark done' : 'Back to top';
  const calm = useCalm();
  return (
    <div className="dock-surface dv-dock">
      <nav className="dv-stepper" aria-label="Sections">
        <div className="dv-steps" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, ['--n' as string]: steps.length }}>
          <motion.span className="dv-lens" style={{ x }} aria-hidden="true" />
          {steps.map((k, i) => (
            <StepButton key={k} i={i} p={p} label={STEP_LABEL[k]} current={i === cur} passed={i < cur} onClick={() => onJump(i)} />
          ))}
        </div>
        <span className="dv-next-wrap">
          <LeafBurst fire={burst} count={7} spread={0.8} />
          <motion.button type="button" className="dv-next" data-mode={mode} aria-label={nextLabel} title={nextLabel} onClick={onNext} whileTap={calm ? undefined : { scale: 0.9 }} transition={spring.snap}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={mode}
                className="dv-next-icon"
                initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={calm ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: 30 }}
                transition={calm ? { duration: 0.12 } : spring.pop}
              >
                {mode === 'next' ? <ArrowDown size={20} weight="bold" /> : mode === 'done' ? <Check size={20} weight="bold" /> : <ArrowUp size={20} weight="bold" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </span>
      </nav>
    </div>
  );
}

function StepButton({ i, p, label, current, passed, onClick }: { i: number; p: MotionValue<number>; label: string; current: boolean; passed: boolean; onClick: () => void }) {
  const color = useTransform(p, (v) => (Math.abs(v - i) < 0.5 ? 'var(--text)' : 'var(--text-2)'));
  return (
    <motion.button type="button" className="dv-step" style={{ color }} aria-current={current ? 'step' : undefined} onClick={onClick} whileTap={{ scale: 0.94 }} transition={spring.snap}>
      {label}
      <span className="dv-step-dot" data-on={passed || undefined} aria-hidden="true" />
    </motion.button>
  );
}
