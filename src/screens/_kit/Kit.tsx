// Kitchen sink: every primitive in every state, in the current theme.
// Open #/_kit. Not in the tab bar or the offline route list.
import { motion } from 'motion/react';
import { useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { FRIDAY_DRIVE, FRIDAY_DRIVE_EAST, Leaf, MapLabel, RouteLine, SPECIMEN_IDS, Specimen, StopDot, Terrain, WaterLabel, cameraFor, cropAround, stop, stopFeet, useCamera, type Crop } from '@/art';
import { setNightVision, setThemePref, useTheme, type ThemePref } from '@/lib/theme';
import {
  Button,
  Card,
  CheckRow,
  Checkbox,
  Chip,
  Divider,
  EmptyState,
  Eyebrow,
  ExternalLink,
  Fold,
  IconButton,
  IconWell,
  KidAvatar,
  KidChip,
  KidPicker,
  LeaveBy,
  ListGroup,
  ListRow,
  LiveCard,
  LivePill,
  MapsButton,
  NavRow,
  NightVisionOffer,
  NumberRoller,
  OfflineChip,
  Page,
  Pips,
  ProgressBar,
  ProgressRing,
  Section,
  Segmented,
  Sheet,
  Switch,
  Tag,
  TextField,
  announce,
  fadeUp,
  stagger,
  toast,
  useSettledOrder,
} from '@/ui';
import {
  ArrowRight,
  ArrowsClockwise,
  Backpack,
  BookOpenText,
  CalendarDots,
  CaretRight,
  Car,
  Check,
  Coffee,
  Compass,
  DotsThree,
  GearSix,
  Leaf as LeafIcon,
  LeafMark,
  Lightbulb,
  ListChecks,
  MapsDiamond,
  Moon,
  MoonStars,
  Mountains,
  SpeakerHigh,
  Trash,
  Tree,
} from '@/ui/icons';

const SWATCHES = [
  ['bg', 'Page'],
  ['bg-2', 'Card'],
  ['bg-3', 'Well'],
  ['text', 'Ink'],
  ['text-2', 'Ink 2'],
  ['text-3', 'Ink 3'],
  ['accent', 'Sun (fill)'],
  ['accent-mark', 'Mark'],
  ['accent-text', 'Amber text'],
  ['ember', 'Ember'],
  ['night', 'Night'],
  ['ok', 'Open'],
  ['danger', 'Closed'],
  ['water', 'Water'],
  ['kid-1', 'Kid 1'],
  ['kid-2', 'Kid 2'],
  ['kid-3', 'Kid 3'],
] as const;

const PACK = ['Warm jackets', 'Hats and gloves', 'Headlamps', 'Binoculars', 'Cocoa and thermos'];

export default function Kit(_props: ScreenProps) {
  const { pref, nightVision } = useTheme();
  const [day, setDay] = useState<'fri' | 'sat' | 'sun'>('sat');
  const [tr, setTr] = useState<'ESV' | 'NIV'>('ESV');
  const [sw, setSw] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [done, setDone] = useState<string[]>(['Headlamps']);
  const [n, setN] = useState(12);
  const [found, setFound] = useState(6);
  const [kid, setKid] = useState(0);
  const [name, setName] = useState('');
  const [chip, setChip] = useState('All');
  const [sheet, setSheet] = useState(false);
  const [dock, setDock] = useState(false);
  const [step, setStep] = useState<'look' | 'read' | 'wonder' | 'pray' | 'do'>('read');
  const order = useSettledOrder(PACK, (p) => p, (p) => done.includes(p));

  const tioga = stop('route', 'tioga')!;
  const east = cropAround('eastside', [82, 296], 240, 358 / 150);
  const BASE: Crop = [0, 52, 420, 377];
  const SHOTS: Record<string, Crop> = { Overview: BASE, 'Tioga Pass': cropAround('route', tioga, 210, 420 / 377), 'Mono Lake': cropAround('route', stop('route', 'monolake')!, 170, 420 / 377) };
  const cam = useCamera(cameraFor(BASE, BASE));
  const [shot, setShot] = useState('Overview');

  return (
    <Page
      title="Kit"
      eyebrow="Design system"
      subtitle="Every primitive in every state. Switch themes below."
      back={{ href: '/', label: 'Today' }}
      actions={<IconButton icon={GearSix} label="Settings" href="/settings" />}
      sky="dawn"
      width="wide"
      dock={
        dock ? (
          <div className="dock-surface">
            <Segmented
              label="Section"
              value={step}
              onChange={setStep}
              options={[
                { value: 'look', label: 'Look' },
                { value: 'read', label: 'Read' },
                { value: 'wonder', label: 'Wonder' },
                { value: 'pray', label: 'Pray' },
                { value: 'do', label: 'Do' },
              ]}
            />
          </div>
        ) : undefined
      }
    >
      <Section title="Theme">
        <div className="flex flex-col gap-3 gutter">
          <Segmented<ThemePref>
            label="Appearance"
            value={pref}
            onChange={setThemePref}
            options={[
              { value: 'auto', label: 'Automatic' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </div>
        <div className="mt-3">
          <ListGroup>
            <ListRow icon={MoonStars} title="Night vision" subtitle="Red and dim, for stargazing" trailing={<Switch checked={nightVision} onChange={setNightVision} label="Night vision" />} />
            <ListRow icon={DotsThree} title="Page dock" subtitle="The devotion stepper's slot above the tab bar" trailing={<Switch checked={dock} onChange={setDock} label="Page dock" />} />
          </ListGroup>
        </div>
        <div className="mt-3">
          <NightVisionOffer force />
        </div>
      </Section>

      <Section title="Type">
        <Card className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <span className="t-countdown" style={{ fontSize: 'calc(96rem / 17)' }}>
              <NumberRoller value={n} />
            </span>
            <span className="flex flex-col gap-1.5 pb-2">
              <span className="t-units">days</span>
              <span className="t-footnote num">
                <b className="text-text">2</b> hr <b className="text-text">19</b> min
              </span>
            </span>
          </div>
          <Divider />
          <p className="t-large-title">Large title</p>
          <p className="t-title-1">Title 1 · Lundy beaver ponds</p>
          <p className="t-title-2">Title 2 · The drive</p>
          <p className="t-title-3">Title 3 · Section serif</p>
          <p className="t-scripture">
            <sup className="t-verse">11</sup>And God said, “Let the earth sprout vegetation, plants yielding seed.”
          </p>
          <p className="t-reading">Look at the aspens. Every leaf on the hill is shaking at once.</p>
          <p className="t-headline">Headline · Conway Summit overlook</p>
          <p className="t-body">Body · The classic view of aspens sweeping down toward Mono Lake.</p>
          <p className="t-callout">Callout · Basin Café (Sat 7–8:45) or a picnic from Mono Market.</p>
          <p className="t-footnote">Footnote · 10 min drive · Stay 20 min</p>
          <p className="t-caption">Caption · ESV® Bible © 2001 by Crossway.</p>
          <Eyebrow>Eyebrow · Saturday, Oct 10</Eyebrow>
          <Eyebrow tone="accent">Eyebrow accent · Now</Eyebrow>
          <p className="t-kid">Andika · Find a red leaf!</p>
          <p className="t-body num">
            Tabular · 7:00<span className="t-period">am</span> 11:45<span className="t-period">am</span> 12:45<span className="t-period">pm</span>
          </p>
          <div className="flex gap-2">
            <Button size="sm" icon={ArrowsClockwise} onClick={() => setN((v) => v - 1)}>
              Roll
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setN((v) => v + 9)}>
              +9
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="Color" note="Light carries meaning: amber, ember and glow mark only what is live, found, golden hour, the route, or a deadline.">
        <div className="grid grid-cols-3 gap-2 gutter sm:grid-cols-6">
          {SWATCHES.map(([t, l]) => (
            <div key={t} className="flex flex-col gap-1.5">
              <span className="block h-12 rounded-tile shadow-raised" style={{ background: `var(--${t})` }} />
              <span className="t-caption">
                <b className="text-text-2">{l}</b>
                <br />--{t}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <Card className="flex flex-col gap-4">
          {(['primary', 'secondary', 'tonal', 'ghost'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3">
              <Button variant={v} size="lg" icon={v === 'primary' ? Check : undefined}>
                {v === 'primary' ? 'Found it' : 'Large'}
              </Button>
              <Button variant={v} icon={BookOpenText}>
                {v[0].toUpperCase() + v.slice(1)}
              </Button>
              <Button variant={v} size="sm" iconEnd={CaretRight}>
                Small
              </Button>
              <Button variant={v} size="sm" disabled>
                Disabled
              </Button>
            </div>
          ))}
          <Divider />
          <div className="flex flex-wrap items-center gap-3">
            <MapsButton variant="primary" q="Lundy Canyon Trailhead, Lundy, CA" place="Lundy Canyon" />
            <MapsButton q="Conway Summit" />
            <MapsButton size="sm" q="Lee Vining" label="Directions" />
            <IconButton icon={DotsThree} label="More" variant="plain" weight="bold" />
            <IconButton icon={Lightbulb} label="Hint" variant="glass" />
            <IconButton icon={SpeakerHigh} label="Sound" variant="plain" pressed />
            <IconButton icon={ArrowRight} label="Next" variant="primary" size="lg" />
            <IconButton icon={Trash} label="Delete" variant="ghost" size="sm" />
          </div>
          <p className="t-body">
            Road status: <ExternalLink href="https://www.nps.gov/yose/planyourvisit/conditions.htm">Tioga Road conditions</ExternalLink>
          </p>
        </Card>
      </Section>

      <Section title="Now" action={<a href="#/plan/sat">Saturday plan <CaretRight size={14} weight="bold" /></a>}>
        <LiveCard>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <LivePill />
            <span className="t-footnote num">Since 9:15</span>
            <span className="ml-auto">
              <LeaveBy time="10:50" />
            </span>
          </div>
          <h3 className="t-title-1 mt-2">Lundy beaver ponds</h3>
          <p className="t-footnote mt-1 text-text-2">1–2 mi, gentle · No restrooms at trailhead</p>
          <ProgressBar className="mt-4" value={0.16} label="Time at Lundy" start={<>15 min in</>} end={<b>1 hr 15 left</b>} valueText="15 minutes in, 1 hour 15 left" />
          <div className="mt-4 flex flex-wrap gap-2">
            <MapsButton variant="primary" q="Lundy Canyon Trailhead, Lundy, CA" place="Lundy Canyon" />
            <Button icon={BookOpenText}>Devotion</Button>
          </div>
        </LiveCard>
        <div className="mt-3">
          <Card href="/plan/sat" className="flex items-center gap-3">
            <IconWell icon={CalendarDots} />
            <span className="flex-1">
              <span className="t-headline block">Tappable card</span>
              <span className="t-footnote">Press it: 60 ms delay, spring scale</span>
            </span>
            <CaretRight size={16} weight="bold" className="text-text-3" />
          </Card>
        </div>
      </Section>

      <Section title="Lists">
        <ListGroup>
          <NavRow href="/plan" icon={CalendarDots} title="Plan" subtitle="Fri · Sat · Sun" />
          <NavRow href="/kids/hunt" icon={LeafIcon} iconTone="accent" title="Leaf hunt" detail="6 of 11" />
          <ListRow icon={SpeakerHigh} title="Sounds" trailing={<Switch checked={sw} onChange={setSw} label="Sounds" />} />
          <ListRow icon={Moon} title="Disabled switch" trailing={<Switch checked={sw2} onChange={setSw2} label="Disabled" disabled />} />
          <ListRow href="https://www.nps.gov/yose/" icon={Mountains} title="Yosemite (NPS)" subtitle="Opens outside the app" />
          <ListRow onClick={() => toast({ title: 'Nothing erased', body: 'This is the kit.' })} title="Erase all data" destructive />
        </ListGroup>
        <div className="mt-3">
          <ListGroup label="Rows without icons">
            <ListRow title="Plain row" detail="Detail" />
            <ListRow title="Two lines" subtitle="With a subtitle under the title" />
          </ListGroup>
        </div>
      </Section>

      <Section title="Controls">
        <div className="flex flex-col gap-3 gutter">
          <Segmented
            label="Day"
            value={day}
            onChange={setDay}
            options={[
              { value: 'fri', label: 'Fri 9' },
              { value: 'sat', label: 'Sat 10' },
              { value: 'sun', label: 'Sun 11' },
            ]}
          />
          <div className="flex items-center gap-3">
            <Segmented size="sm" label="Translation" value={tr} onChange={setTr} options={[{ value: 'ESV', label: 'ESV' }, { value: 'NIV', label: 'NIV' }]} />
            <Checkbox checked={sw} onChange={setSw} label="Checkbox" />
            <Checkbox checked={!sw} onChange={(v) => setSw(!v)} label="Checkbox 2" color="var(--kid-3)" tickColor="var(--kid-3-ink)" />
            <Switch checked={sw} onChange={setSw} label="Switch" />
          </div>
          <TextField label="Kid 1's name" value={name} onChange={setName} placeholder="Kid 1" hint="Stays on this device." />
        </div>
        <div className="mt-3">
          <ListGroup label="Packing">
            {order.map((p) => (
              <CheckRow key={p} title={p} subtitle={p === 'Headlamps' ? 'One per person' : undefined} detail={p === 'Warm jackets' ? '×5' : undefined} checked={done.includes(p)} onChange={(v) => setDone((d) => (v ? [...d, p] : d.filter((x) => x !== p)))} />
            ))}
          </ListGroup>
        </div>
      </Section>

      <Section title="Tags and chips">
        <div className="flex flex-col gap-3 gutter">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="now">Now</Tag>
            <Tag tone="fixed">Fixed</Tag>
            <Tag tone="choose">Choose one</Tag>
            <Tag tone="ember">Last gas</Tag>
            <Tag tone="night">After dark</Tag>
            <Tag tone="ok">Open</Tag>
            <Tag>Bonus</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LivePill />
            <LeaveBy time="10:50" />
            <OfflineChip force />
            <Chip icon={Tree} tone="accent">
              Near peak
            </Chip>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Near base', 'Short', 'Low energy'].map((c) => (
              <Chip key={c} selected={chip === c} onClick={() => setChip(c)} size="md">
                {c}
              </Chip>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Progress">
        <Card className="flex flex-col gap-5">
          <ProgressBar value={found / 11} label="Found" start="Start" end={<b>{found} of 11</b>} />
          <ProgressBar value={0.6} tone="neutral" label="Packed" start="Packed" end="12 of 20" />
          <div className="flex flex-wrap items-center gap-4">
            <ProgressRing value={found / 11} color="var(--kid-1)" label={`${found} of 11`}>
              <KidAvatar index={0} size={32} />
            </ProgressRing>
            <ProgressRing value={4 / 11} color="var(--kid-2)" label="4 of 11">
              <KidAvatar index={1} size={32} />
            </ProgressRing>
            <ProgressRing value={0} color="var(--kid-3)" label="0 of 11">
              <KidAvatar index={2} size={32} />
            </ProgressRing>
            <Pips total={11} filled={found} variant="leaf" label={`${found} of 11 found`} />
            <Pips total={8} filled={3} label="Chapter 3 of 8" />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                const f = Math.min(11, found + 1);
                setFound(f);
                announce(`${f} of 11 found`);
              }}
              icon={LeafIcon}
            >
              Find one
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFound(0)}>
              Reset
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="Kids">
        <KidPicker className="gutter" label="Whose hunt" value={kid} onChange={setKid} names={['Kid 1', 'Kid 2', 'Kid 3']} details={['6 found', '4 found', '0 found']} progress={[6 / 11, 4 / 11, 0]} />
        <div className="mt-3 flex flex-wrap items-center gap-2 gutter">
          <KidChip index={1} name="Kid 2" detail="reads" active />
          <KidChip index={2} name="Kid 3" detail="prays" />
          <IconButton icon={ArrowsClockwise} label="Rotate turns" variant="plain" />
          <KidAvatar index={0} />
          <KidAvatar index={1} />
          <KidAvatar index={2} />
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-col gap-3 gutter">
          <div className="flex flex-wrap gap-2">
            <Button icon={Lightbulb} onClick={() => setSheet(true)}>
              Open sheet
            </Button>
            <Button onClick={() => toast({ title: 'Saved', body: 'Your list is on this device.', icon: Check })}>Toast</Button>
            <Button onClick={() => toast({ title: 'Update ready', body: 'Reload to use the new version.', icon: ArrowsClockwise, action: { label: 'Reload', onClick: () => {} } })}>Update toast</Button>
          </div>
          <Fold summary="2 earlier" detail="7:00 and 8:15" lead={<Checkbox checked decorative size={22} />}>
            <ListGroup>
              <ListRow title="Breakfast at the condo" detail="7:00" />
              <ListRow title="Drive to Lundy" detail="8:15" />
            </ListGroup>
          </Fold>
        </div>
        <Card className="mt-3">
          <EmptyState icon={Backpack} title="Nothing packed yet" action={<Button size="sm">Start packing</Button>}>
            Check things off as they go in the car.
          </EmptyState>
        </Card>
        <Sheet open={sheet} onOpenChange={setSheet} title="Quaking aspen leaf" footer={<Button variant="primary" size="lg" block icon={Check} onClick={() => setSheet(false)}>Found it</Button>}>
          <div className="mx-auto mb-4 h-36 w-36">
            <Specimen id="aspen" found />
          </div>
          <p className="t-reading">Roundish with a little point. Roll the stem between your fingers: it is flat like a ribbon. That is why aspen leaves shiver and quake in the tiniest breeze.</p>
        </Sheet>
      </Section>

      <Section title="The drive" serif note="Relief pre-rendered per theme; route, stops and labels are live SVG.">
        <div className="mb-2 gutter">
          <Segmented
            size="sm"
            label="Camera"
            value={shot}
            onChange={(v) => {
              setShot(v);
              cam.to(cameraFor(BASE, SHOTS[v]));
            }}
            options={Object.keys(SHOTS).map((k) => ({ value: k, label: k }))}
          />
        </div>
        <Terrain region="route" crop={BASE} camera={cam} fade="y" label="The drive from the Bay Area to Mammoth Lakes">
          <RouteLine points={FRIDAY_DRIVE} />
          <StopDot at={stop('route', 'craneflat')!} />
          <StopDot at={stop('route', 'olmsted')!} />
          <StopDot at={stop('route', 'tuolumne')!} />
          <StopDot at={stop('route', 'leevining')!} />
          <StopDot at={tioga} kind="major" />
          <StopDot at={stop('route', 'mammoth')!} kind="major" />
          <MapLabel at={stop('route', 'mammoth')!} title="Mammoth Lakes" sub="8:00 pm" size="lg" />
          <MapLabel at={stop('route', 'leevining')!} title="Lee Vining" sub="7:15 pm" side="left" />
          <MapLabel at={tioga} title="Tioga Pass" subAccent={`${stopFeet('tioga').toLocaleString('en-US')} ft`} sub="6:50 pm" />
          <MapLabel at={stop('route', 'olmsted')!} title="Olmsted Point" sub="5:40 pm" side="right" offset={[8, 10]} leader />
          <MapLabel at={stop('route', 'craneflat')!} title="Crane Flat" sub="5:00 pm" side="right" />
          <WaterLabel at={[stop('route', 'monolake')![0], stop('route', 'monolake')![1] + 2]}>Mono Lake</WaterLabel>
        </Terrain>
        <div className="mt-4">
          <Card pad="none">
            <Terrain region="eastside" crop={east} fade="bottom" style={{ height: 150 }}>
              <RouteLine points={FRIDAY_DRIVE_EAST} variant="muted" />
              <RouteLine points={[stop('eastside', 'lundy')!, [92, 318], [70, 300], stop('eastside', 'conway')!]} variant="next" />
              <StopDot at={stop('eastside', 'conway')!} />
              <StopDot at={stop('eastside', 'lundy')!} kind="here" />
              <MapLabel at={stop('eastside', 'conway')!} title="Conway Summit" sub="11:00 am" side="right" size="sm" />
              <MapLabel at={stop('eastside', 'lundy')!} title="Lundy Canyon" side="below" size="sm" />
            </Terrain>
            <div className="flex items-center gap-2 p-4 pt-1">
              <Car size={16} className="text-accent-text" />
              <span className="t-footnote">10 min drive to Conway Summit</span>
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Specimens" note="Outline to look for; full fall color when found.">
        <div className="grid grid-cols-2 gap-2 gutter sm:grid-cols-4">
          {SPECIMEN_IDS.map((id) => (
            <Card key={id} inset={false} pad="sm" className="flex flex-col gap-1">
              <div className="grid grid-cols-2 gap-1">
                <div className="aspect-square">
                  <Specimen id={id} />
                </div>
                <div className="aspect-square">
                  <Specimen id={id} found />
                </div>
              </div>
              <span className="t-caption text-center">{id}</span>
            </Card>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 gutter">
          {(['green', 'gold', 'red'] as const).map((p) => (
            <Card key={p} inset={false} pad="sm" className="flex flex-col items-center gap-1">
              <div className="h-20 w-20">
                <Leaf pigment={p} />
              </div>
              <span className="t-caption capitalize">{p}</span>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Glyphs">
        <Card className="flex flex-wrap items-center gap-5 text-text">
          <LeafMark size={28} />
          <MapsDiamond size={24} />
          <MapsDiamond size={24} weight="regular" />
          <Car size={24} />
          <Car size={24} weight="regular" />
          {[CalendarDots, Compass, LeafIcon, BookOpenText, ListChecks, Coffee].map((I, i) => (
            <I key={i} size={24} />
          ))}
        </Card>
      </Section>

      <Section title="Motion">
        <motion.ul className="flex flex-col gap-2 gutter" initial="hidden" animate="show" variants={stagger(6)}>
          {['List stagger: 35 ms apart', 'Capped at 0.25 s total', 'First visit only', 'Opacity only when calm', 'Settle springs for layout', 'Alive springs for delight'].map((t) => (
            <motion.li key={t} variants={fadeUp} className="t-callout rounded-tile bg-bg-2 px-4 py-3 shadow-card">
              {t}
            </motion.li>
          ))}
        </motion.ul>
      </Section>
    </Page>
  );
}
