import type { ReactNode } from 'react';
import type { ScreenProps } from '@/app/routes';
import { rocks } from '@/content/kids.js';
import { Card, Page } from '@/ui';
import { MapPin } from '@/ui/icons';
import { Specimen } from '@/art';
import { PlaceThumb } from '../activities/parts';
import './KidsPages.css';

const ART: Record<string, ReactNode> = {
  granite: <Specimen id="granite" found />,
  tufa: <Specimen id="tufa" found />,
  obsidian: <Specimen id="obsidian" found />,
};
const PLACE: Record<string, [string, number]> = {
  pumice: ['panum', 5],
  panum: ['panum', 7],
  caldera: ['hotcreek', 34],
  islands: ['southtufa', 16],
};

export default function Rocks(_props: ScreenProps) {
  return (
    <Page title="Rocks and volcanoes" back={{ href: '/kids', label: 'Kids' }} subtitle="Some of this land is younger than castles." sky="dawn" width="wide">
      <div className="kb-grid">
        {rocks.map((r) => (
          <Card key={r.id} inset={false} className="kb-rock">
            <div className="kb-rock-art" aria-hidden="true">
              {ART[r.id] ?? (PLACE[r.id] && <PlaceThumb id={PLACE[r.id][0]} km={PLACE[r.id][1]} size="100%" className="kb-rock-map" />)}
            </div>
            <div className="kb-rock-body">
              <h3 className="t-title-3">{r.title}</h3>
              <p className="t-footnote kb-where">
                <MapPin size={13} weight="fill" aria-hidden="true" />
                {r.where}
              </p>
              <p className="t-body">{r.text}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="t-footnote kb-dim gutter-text kb-foot">Look, touch and take pictures, but leave rocks, obsidian and pumice where you found them.</p>
    </Page>
  );
}
