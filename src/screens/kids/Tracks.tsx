import type { ScreenProps } from '@/app/routes';
import { tracks } from '@/content/kids.js';
import { Page } from '@/ui';
import { TrackGlyph } from './TracksArt';
import { FindCard, Tally, useKidList } from './KidsParts';

const IDS = tracks.map((t) => t.id);

export default function Tracks(_props: ScreenProps) {
  const l = useKidList('tracks', IDS, 'seen');
  return (
    <Page title="Animal tracks" back={{ href: '/kids', label: 'Kids' }} subtitle="Look in mud, sand and dust near water, early in the morning." sky="dawn" width="wide">
      <Tally done={l.done} total={l.total} word="seen" />
      <div className="kb-grid">
        {tracks.map((t) => (
          <FindCard
            key={t.id}
            title={t.name}
            checked={l.has(t.id)}
            onToggle={() => l.toggle(t.id)}
            checkLabel="We saw one"
            art={
              <div className="kb-mud">
                <TrackGlyph id={t.id} />
              </div>
            }
          >
            <p className="t-body">{t.clue}</p>
            <p className="t-footnote kb-dim">{t.where}</p>
          </FindCard>
        ))}
      </div>
      <p className="t-footnote kb-dim gutter-text kb-foot">Never feed wildlife. Keep food in the car or indoors; black bears live here.</p>
    </Page>
  );
}
