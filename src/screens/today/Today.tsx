// Today ("/"): the home screen. Its phase comes from the trip clock (and the
// Settings preview time): before the trip a countdown, every destination, and
// the route story; during the trip Now / Next; after, a look back.
import { lazy, Suspense, useSyncExternalStore } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useStored } from '@/lib/store';
import { tripPhase, useNow } from '@/lib/time';
import { Card, IconButton, ListGroup, NavRow, Page, Section, Button } from '@/ui';
import { DeviceMobile, GearSix, Info, LeafMark, UserCircle } from '@/ui/icons';
import { After } from './After';
import { Bento } from './Bento';
import { During } from './During';
import { DayStrip, Hero } from './Hero';
import './today.css';

// The story's terrain and scroll machinery load after first paint.
const loadStory = () => import('./Story');
const Story = lazy(loadStory);

// Warm the lazy chunks once the app is idle (they are precached anyway), so
// neither the story nor the Now card's map ever shows its placeholder.
if (typeof window !== 'undefined') {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  const warm = () => void Promise.all([loadStory(), import('./NowMap')]).catch(() => {});
  if (w.requestIdleCallback) w.requestIdleCallback(warm, { timeout: 2500 });
  else setTimeout(warm, 1200);
}

export default function Today(_props: ScreenProps) {
  const now = useNow(15_000);
  const phase = tripPhase(now);
  if (phase === 'during') return <During now={now} />;
  if (phase === 'after') return <After />;
  return <Before now={now} />;
}

const Wordmark = (
  <span className="td-wordmark">
    <LeafMark size={20} />
    Fall Trip
  </span>
);

function Before({ now }: { now: Date }) {
  return (
    <Page title="Today" docTitle="Fall Trip" hideTitle sky="dawn" leading={Wordmark} actions={<IconButton href="/settings" icon={GearSix} label="Settings" />}>
      <Hero now={now} />
      <DayStrip now={now} />
      <NamesCard />
      <div className="section">
        <Bento />
      </div>
      <Section title="The drive" serif note="Friday · about 8 hours, over Tioga Pass" className="td-drive">
        <Suspense fallback={<div className="td-story-wait" />}>
          <Story />
        </Suspense>
      </Section>
      <Footer />
    </Page>
  );
}

/** A gentle nudge until the kids' names are in Settings (they stay on this device). */
function NamesCard() {
  const [saved] = useStored<unknown>('kids', null);
  const has = Array.isArray(saved) && saved.some((n) => typeof n === 'string' && n.trim());
  if (has) return null;
  return (
    <div className="section">
      <Card className="td-names">
        <span className="td-names-icon" aria-hidden="true">
          <UserCircle size={22} weight="bold" />
        </span>
        <span className="td-names-text">
          <span className="t-headline">Add the kids’ names</span>
          <span className="t-footnote">So the leaf hunt, reading turns and journal know who’s who. Names stay on this device.</span>
        </span>
        <Button href="/settings" size="sm" className="td-names-btn">
          Add names
        </Button>
      </Card>
    </div>
  );
}

const standaloneQuery = typeof window !== 'undefined' ? window.matchMedia('(display-mode: standalone)') : null;
function useStandalone() {
  return useSyncExternalStore(
    (fn) => {
      standaloneQuery?.addEventListener('change', fn);
      return () => standaloneQuery?.removeEventListener('change', fn);
    },
    () => !!standaloneQuery?.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true,
    () => false,
  );
}

function Footer() {
  const standalone = useStandalone();
  return (
    <div className="section td-footer">
      <ListGroup>
        {!standalone && <NavRow href="/install" icon={DeviceMobile} title="Install on your Home Screen" subtitle="Then it opens with no signal, on Tioga Road and in the canyons" />}
        <NavRow href="/about" icon={Info} title="About and sources" />
      </ListGroup>
    </div>
  );
}


