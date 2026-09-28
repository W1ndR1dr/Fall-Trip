import type { ScreenProps } from '@/app/routes';
import { activities } from '@/content/trip.js';
import { CheckRow, ListGroup, Page } from '@/ui';
import { Tally, useKidList } from './KidsParts';

const PHOTOS = activities.photos;
const IDS = PHOTOS.map((p) => p.id);

export default function Photos(_props: ScreenProps) {
  const l = useKidList('photos', IDS, 'taken');
  return (
    <Page title="Photo challenges" back={{ href: '/kids', label: 'Kids' }} subtitle={`${PHOTOS.length} pictures to take this weekend.`} sky="dawn">
      <Tally done={l.done} total={l.total} word="taken" />
      <ListGroup>
        {PHOTOS.map((p) => (
          <CheckRow key={p.id} checked={l.has(p.id)} onChange={() => l.toggle(p.id)} title={p.text} />
        ))}
      </ListGroup>
      <p className="t-footnote kb-dim gutter-text kb-foot">For the night sky, rest the phone on something still. Night mode takes a long exposure by itself.</p>
    </Page>
  );
}
