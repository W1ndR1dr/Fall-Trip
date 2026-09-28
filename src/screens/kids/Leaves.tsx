// Why leaves change: scroll and the leaf goes from summer green to fall gold
// and red, with a bar for each color in the leaf. Or drag the slider.
//   Green  chlorophyll fades when days get short and nights get cold.
//   Gold   carotenoids were there all summer, hidden under the green.
//   Red    anthocyanins are made fresh in fall.
// Text from src/content/kids.js (leafScience).
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { Leaf } from '@/art';
import { leafScience } from '@/content/kids.js';
import { Button, Card, Page, Section, useCalm, usePageScroll } from '@/ui';
import { Leaf as LeafIcon, LeafPip } from '@/ui/icons';
import './Leaves.css';

type Pigment = { key: 'chl' | 'car' | 'ant'; name: string; color: string; kid: string };
const S = leafScience as {
  intro: string;
  pigments: Pigment[];
  steps: { at: number; title: string; text: string }[];
  wonder: string;
  bonus: string[];
};

// The story, as scroll anchors: where each chapter sits on the summer → fall
// scale (0..1). The first two are both summer.
const CHAPTERS = [
  { title: 'Leaves make food', text: S.intro, at: 0, pig: 'green' },
  ...S.steps.map((s, i) => ({ title: s.title, text: s.text, at: [0.06, 0.42, 0.72, 1][i] ?? s.at, pig: ['green', 'green', 'gold', 'red'][i] ?? 'gold' })),
];

// Pigment amounts along the season.
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const chl = (p: number) => 0.04 + 0.96 * (1 - smooth(0.14, 0.62, p));
const CAR = 0.72; // the same all year: it is only hidden
const ant = (p: number) => 0.64 * smooth(0.74, 0.98, p);

const COLOR_WORD: Record<Pigment['key'], string> = { chl: 'Green', car: 'Gold', ant: 'Red' };
const state = (key: Pigment['key'], p: number) => {
  if (key === 'chl') {
    const c = chl(p);
    return c > 0.75 ? 'Lots' : c > 0.2 ? 'Fading' : 'Almost gone';
  }
  if (key === 'car') return chl(p) > 0.5 ? 'Hidden' : 'Showing';
  const a = ant(p);
  return a < 0.03 ? 'None yet' : a < 0.4 ? 'A little' : 'Made new';
};
const season = (p: number) => (p < 0.2 ? 'Summer' : p < 0.57 ? 'Short days, chilly nights' : p < 0.86 ? 'Gold shows through' : 'Some leaves turn red');
const curly = (t: string) => t.replace(/"([^"]*)"/g, '“$1”').replace(/'/g, '’');

export default function Leaves(_props: ScreenProps) {
  return (
    <Page
      title="Why leaves change"
      back={{ href: '/kids', label: 'Kids' }}
      subtitle="Scroll down and watch the leaf. Or slide from summer to fall."
      sky="day"
      width="wide"
    >
      <Story />
    </Page>
  );
}

/** Everything inside the Page, so usePageScroll() sees its scroll container. */
function Story() {
  const calm = useCalm();
  const scroller = usePageScroll();
  const { scrollY } = useScroll({ container: scroller });

  // `target` is where the story is (scroll or slider); `p` follows it with a
  // soft spring so the leaf eases between states.
  const target = useMotionValue(0);
  const sprung = useSpring(target, { stiffness: 120, damping: 30, mass: 0.6 });
  const stepped = useMotionValue(0);
  const p: MotionValue<number> = calm ? stepped : sprung;

  const chapterEls = useRef<(HTMLElement | null)[]>([]);
  const anchors = useRef<{ y: number; at: number }[]>([]);
  const slider = useRef<HTMLInputElement>(null);
  const layout = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const manualAt = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [words, setWords] = useState(() => ({ chl: state('chl', 0), car: state('car', 0), ant: state('ant', 0), season: season(0) }));

  // Chapter centers, in scroll-content px.
  const measure = useCallback(() => {
    const sc = scroller.current;
    if (!sc) return;
    const top = sc.getBoundingClientRect().top - sc.scrollTop;
    anchors.current = CHAPTERS.map((c, i) => {
      const el = chapterEls.current[i];
      const r = el?.getBoundingClientRect();
      return { y: r ? r.top - top + r.height / 2 : 0, at: c.at };
    });
  }, [scroller]);

  const follow = useCallback(
    (y: number) => {
      const sc = scroller.current;
      const a = anchors.current;
      if (!sc || !a.length) return;
      // The stage's backing band only once it is stuck under the nav bar.
      const st = stage.current;
      const lt = layout.current;
      if (st && lt) st.toggleAttribute('data-stuck', st.getBoundingClientRect().top - lt.getBoundingClientRect().top > 1);
      if (dragging.current) return;
      if (manualAt.current !== null) {
        if (Math.abs(y - manualAt.current) < 24) return;
        manualAt.current = null;
      }
      const wide = window.matchMedia('(min-width: 700px)').matches;
      const line = y + sc.clientHeight * (wide ? 0.5 : 0.64);
      let v = a[0].at;
      let idx = 0;
      if (line >= a[a.length - 1].y) {
        v = a[a.length - 1].at;
        idx = a.length - 1;
      } else {
        for (let i = 0; i < a.length - 1; i++) {
          if (line >= a[i].y && line < a[i + 1].y) {
            const t = (line - a[i].y) / (a[i + 1].y - a[i].y);
            v = a[i].at + (a[i + 1].at - a[i].at) * t;
            idx = t > 0.5 ? i + 1 : i;
            break;
          }
        }
      }
      setActive(idx);
      if (calm) {
        // Reduced motion: one still state per chapter, cross-faded.
        const at = a[idx].at;
        target.set(at);
        if (stepped.get() !== at) animate(stepped, at, { duration: 0.2, ease: 'easeOut' });
      } else target.set(v);
    },
    [scroller, calm, target, stepped],
  );

  // A passive effect: the Page's scroll container ref attaches after this
  // component's layout effects run.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    measure();
    follow(sc.scrollTop);
    const ro = new ResizeObserver(() => {
      measure();
      follow(sc.scrollTop);
    });
    ro.observe(sc);
    chapterEls.current.forEach((el) => el && ro.observe(el));
    document.fonts?.ready.then(() => {
      measure();
      follow(sc.scrollTop);
    });
    return () => ro.disconnect();
  }, [measure, follow, scroller]);

  useMotionValueEvent(scrollY, 'change', follow);

  // Words and the slider thumb follow the story.
  useMotionValueEvent(target, 'change', (v) => {
    const el = slider.current;
    if (el && !dragging.current) el.value = String(Math.round(v * 1000));
    el?.style.setProperty('--p', v.toFixed(3));
    const next = { chl: state('chl', v), car: state('car', v), ant: state('ant', v), season: season(v) };
    setWords((w) => (w.chl === next.chl && w.car === next.car && w.ant === next.ant && w.season === next.season ? w : next));
  });
  useEffect(() => {
    slider.current?.style.setProperty('--p', '0');
  }, []);

  const onSlide = (v: number) => {
    target.set(v);
    if (calm) stepped.set(v);
    const a = anchors.current;
    if (a.length) {
      let idx = 0;
      a.forEach((x, i) => {
        if (v >= x.at - 0.12) idx = i;
      });
      setActive(idx);
    }
  };

  // Visuals from p.
  const green = useTransform(p, (v) => chl(v));
  const red = useTransform(p, (v) => (ant(v) / 0.64) * 0.92);
  const rot = useTransform(p, (v) => (calm ? 0 : -8 + 12 * v));
  const chlBar = useTransform(p, (v) => chl(v));
  const carOpacity = useTransform(p, (v) => 0.4 + 0.6 * (1 - chl(v)));
  const antBar = useTransform(p, (v) => ant(v));
  const glowGreen = useTransform(p, (v) => chl(v));
  const glowGold = useTransform(p, (v) => 1 - chl(v));
  const glowRed = useTransform(p, (v) => ant(v) / 0.64);

  const bars: { key: Pigment['key']; scale: MotionValue<number> | number; opacity?: MotionValue<number> }[] = [
    { key: 'chl', scale: chlBar },
    { key: 'car', scale: CAR, opacity: carOpacity },
    { key: 'ant', scale: antBar },
  ];
  const pig = (k: Pigment['key']) => S.pigments.find((x) => x.key === k)!;

  return (
    <>
      <div className="lv-layout" ref={layout}>
        <div className="lv-stage-wrap" ref={stage}>
          <Card className="lv-stage" inset={false}>
            <div className="lv-stage-top">
              <div className="lv-leaf" aria-hidden="true">
                <motion.span className="lv-glow lv-glow-green" style={{ opacity: glowGreen }} />
                <motion.span className="lv-glow lv-glow-gold" style={{ opacity: glowGold }} />
                <motion.span className="lv-glow lv-glow-red" style={{ opacity: glowRed }} />
                <motion.span className="lv-leaf-art" style={{ rotate: rot }}>
                  <span className="lv-layer">
                    <Leaf pigment="gold" />
                  </span>
                  <motion.span className="lv-layer" style={{ opacity: green }}>
                    <Leaf pigment="green" />
                  </motion.span>
                  <motion.span className="lv-layer" style={{ opacity: red }}>
                    <Leaf pigment="red" />
                  </motion.span>
                </motion.span>
              </div>
              <div className="lv-bars">
                {bars.map((b) => {
                  const pg = pig(b.key);
                  return (
                    <div key={b.key} className="lv-bar">
                      <div className="lv-bar-head">
                        <span className="lv-bar-name">
                          <b>{COLOR_WORD[b.key]}</b> <span>{pg.name.toLowerCase()}</span>
                        </span>
                        <span className="lv-bar-state">{words[b.key]}</span>
                      </div>
                      <div className="lv-track" aria-hidden="true">
                        <motion.span className="lv-fill" style={{ scaleX: b.scale, opacity: b.opacity ?? 1, background: pg.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lv-slider">
              <span className="lv-end" aria-hidden="true">
                Summer
              </span>
              <input
                ref={slider}
                type="range"
                min={0}
                max={1000}
                step={1}
                defaultValue={0}
                aria-label="Season, from summer to fall"
                aria-valuetext={words.season}
                onPointerDown={() => (dragging.current = true)}
                onPointerUp={() => {
                  dragging.current = false;
                  manualAt.current = scroller.current?.scrollTop ?? 0;
                }}
                onPointerCancel={() => (dragging.current = false)}
                onKeyDown={() => (manualAt.current = scroller.current?.scrollTop ?? 0)}
                onInput={(e) => onSlide(Number((e.target as HTMLInputElement).value) / 1000)}
              />
              <span className="lv-end" aria-hidden="true">
                Fall
              </span>
            </div>
          </Card>
        </div>

        <ol className="lv-chapters">
          {CHAPTERS.map((c, i) => (
            <li key={i} ref={(el) => void (chapterEls.current[i] = el)} className="lv-chapter" data-active={i === active || undefined} style={{ ['--pig' as string]: `var(--pig-${c.pig})` }}>
              <span className="lv-step num" aria-hidden="true">
                {i + 1}
              </span>
              <h2 className="lv-chapter-title">{c.title}</h2>
              <p className="lv-chapter-text">{curly(c.text)}</p>
            </li>
          ))}
        </ol>
      </div>

      <Section title="The three colors" className="lv-after">
        <Card>
          <ul className="lv-pigments">
            {S.pigments.map((pg) => (
              <li key={pg.key}>
                <span className="lv-swatch" style={{ background: pg.color }} aria-hidden="true" />
                <span>
                  <b className="lv-pig-name">{pg.name}</b>
                  <span className="lv-pig-text">{curly(pg.kid)}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title="Aspen facts">
        <Card>
          <ul className="lv-facts">
            {S.bonus.map((b, i) => (
              <li key={i}>
                <LeafPip on color="var(--pig-gold)" size={10} className="lv-fact-pip" />
                <span>{curly(b)}</span>
              </li>
            ))}
          </ul>
          <Button href="/kids/hunt" icon={LeafIcon} className="lv-hunt-btn">
            Find a flat aspen stem
          </Button>
        </Card>
      </Section>

      <Section title="Something to wonder about">
        <p className="t-reading gutter-text lv-wonder">{curly(S.wonder)}</p>
      </Section>
    </>
  );
}
