// Kids: one big tile per kids page. The leaf hunt leads, with each kid's
// progress; the other tiles carry their own counts once there are any.
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { ScreenProps } from '@/app/routes';
import { Specimen } from '@/art';
import { carGames, drawPrompts, hunt, sky, tracks, trivia } from '@/content/kids.js';
import { activities } from '@/content/trip.js';
import { useKids } from '@/lib/family';
import { useChecklist, useStored } from '@/lib/store';
import { isAfterDark, sunTimes, timeParts, tripDay, useNow } from '@/lib/time';
import { Card, KidAvatar, Page, ProgressRing, fadeUp, stagger, useFirstVisit } from '@/ui';
import { CaretRight, Users } from '@/ui/icons';
import { CozyArt, DrawArt, GamesArt, LeavesArt, PhotoArt, SkyArt } from './KidsHomeArt';
import './KidsHome.css';

type Hunt = { id: string; bonus?: boolean };
const REGULAR = (hunt as Hunt[]).filter((h) => !h.bonus).map((h) => h.id);
const BONUS = (hunt as Hunt[]).filter((h) => h.bonus).length;
const TRACK_IDS = (tracks as { id: string }[]).map((t) => t.id);
const SKY_IDS = (sky.finds as { id: string }[]).map((f) => f.id);
const PHOTO_IDS = (activities.photos as { id: string }[]).map((p) => p.id);
const inList = (ids: readonly string[], of: readonly string[]) => ids.filter((id) => of.includes(id)).length;

type Tile = { href: string; title: string; detail: ReactNode; art: ReactNode; status?: ReactNode; tone?: 'night' };

export default function KidsHome(_props: ScreenProps) {
  const kids = useKids();
  const [savedNames] = useStored<unknown>('kids', null);
  const hasNames = Array.isArray(savedNames) && savedNames.some((n) => typeof n === 'string' && n.trim());
  const hunts = [useChecklist('hunt:0'), useChecklist('hunt:1'), useChecklist('hunt:2')].map((l) => inList(l.ids, REGULAR));
  const seenTracks = inList(useChecklist('tracks').ids, TRACK_IDS);
  const skyFound = inList(useChecklist('sky').ids, SKY_IDS);
  const photosTaken = inList(useChecklist('photos').ids, PHOTO_IDS);
  const first = useFirstVisit('kids-home');

  // Night sky: on trip days, when it gets dark (or that it is dark now).
  const now = useNow(60_000);
  const day = tripDay(now);
  let skyStatus: ReactNode = null;
  let skyTone: Tile['tone'];
  if (isAfterDark(now)) {
    skyStatus = 'It’s dark now';
    skyTone = 'night';
  } else if (day) {
    const { time, period } = timeParts(sunTimes(day).dark);
    skyStatus = (
      <>
        Dark at {time}
        <span className="t-period">{period}</span>
      </>
    );
  }

  const tiles: Tile[] = [
    { href: '/kids/leaves', title: 'Why leaves change', detail: 'Green, gold and red', art: <LeavesArt /> },
    {
      href: '/kids/tracks',
      title: 'Animal tracks',
      detail: seenTracks ? `${seenTracks} of ${TRACK_IDS.length} seen` : `${TRACK_IDS.length} to look for`,
      art: <Specimen id="track" found />,
    },
    { href: '/kids/rocks', title: 'Rocks and volcanoes', detail: 'Tufa, obsidian, pumice', art: <Specimen id="tufa" found /> },
    {
      href: '/kids/sky',
      title: 'Night sky',
      detail: skyStatus ?? (skyFound ? `${skyFound} of ${SKY_IDS.length} found` : 'New Moon on Saturday'),
      tone: skyTone,
      art: <SkyArt />,
    },
    { href: '/kids/games', title: 'Car games', detail: `${carGames.length} games, ${trivia.length} questions`, art: <GamesArt /> },
    { href: '/kids/draw', title: 'Drawing', detail: `${drawPrompts.length} ideas and leaf rubbings`, art: <DrawArt /> },
    {
      href: '/kids/photos',
      title: 'Photo challenges',
      detail: photosTaken ? `${photosTaken} of ${PHOTO_IDS.length} taken` : `${PHOTO_IDS.length} photos to take`,
      art: <PhotoArt />,
    },
    { href: '/kids/cozy', title: 'Cozy corner', detail: 'Cocoa, caramel apples, books', art: <CozyArt /> },
  ];

  return (
    <Page title="Kids" subtitle="Things to find, read and make." sky="dawn" width="wide">
      {!hasNames && (
        <div className="kh-nudge-wrap">
          <Card href="/settings" className="kh-nudge" inset={false}>
            <span className="kh-nudge-icon" aria-hidden="true">
              <Users size={20} weight="bold" />
            </span>
            <span className="kh-nudge-text">
              <span className="t-headline">Add the kids’ names</span>
              <span className="t-footnote">Names show on the hunt and devotions.</span>
            </span>
            <CaretRight size={16} weight="bold" className="kh-chev" aria-hidden="true" />
          </Card>
        </div>
      )}

      <motion.ul className="kh-grid" initial={first ? 'hidden' : false} animate="show" variants={stagger(tiles.length + 1)}>
        <motion.li variants={fadeUp} className="kh-hunt-li">
          <Card href="/kids/hunt" pad="none" inset={false} className="kh-hunt">
            <span className="kh-hunt-art" aria-hidden="true">
              <span className="kh-hunt-leaf kh-hunt-leaf-3">
                <Specimen id="birch" found />
              </span>
              <span className="kh-hunt-leaf kh-hunt-leaf-2">
                <Specimen id="red" found />
              </span>
              <span className="kh-hunt-leaf kh-hunt-leaf-1">
                <Specimen id="aspen" found />
              </span>
            </span>
            <span className="kh-hunt-text">
              <span className="kh-hunt-title">Leaf hunt</span>
              <span className="kh-detail num">
                {REGULAR.length} things to find, plus {BONUS} bonus
              </span>
            </span>
            <span className="kh-hunt-kids">
              {kids.map((name, i) => (
                <span key={i} className="kh-kid">
                  <ProgressRing value={hunts[i] / REGULAR.length} size={40} stroke={2.5} color={`var(--kid-${i + 1})`}>
                    <KidAvatar index={i} size={30} />
                  </ProgressRing>
                  <span className="kh-kid-text">
                    <span className="kh-kid-name">{name}</span>
                    <span className="kh-kid-count num">
                      {hunts[i] === REGULAR.length ? 'All found' : `${hunts[i]} of ${REGULAR.length}`}
                    </span>
                  </span>
                </span>
              ))}
            </span>
          </Card>
        </motion.li>
        {tiles.map((t) => (
          <motion.li key={t.href} variants={fadeUp} className="kh-li">
            <Card href={t.href} pad="none" inset={false} className="kh-tile">
              <span className="kh-art" aria-hidden="true">
                {t.art}
              </span>
              <span className="kh-tile-text">
                <span className="kh-title">{t.title}</span>
                <span className={`kh-detail num ${t.tone === 'night' ? 'kh-detail-night' : ''}`}>
                  {t.tone === 'night' && <span className="kh-night-dot" aria-hidden="true" />}
                  {t.detail}
                </span>
              </span>
            </Card>
          </motion.li>
        ))}
      </motion.ul>
    </Page>
  );
}
