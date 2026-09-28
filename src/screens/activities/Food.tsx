import type { ScreenProps } from '@/app/routes';
import { areas, RETRIEVED } from '@/content/trip.js';
import { Button, Card, MapsButton, Page, Pressable, Section } from '@/ui';
import { CaretRight, Clock, Coffee, WarningCircle } from '@/ui/icons';
import { ACTIVITIES, AREA_KEYS, type Activity } from './data';
import { StarButton } from './parts';
import './activities.css';

const foodish = (a: Activity) => a.kind === 'food' || (a.tags as string[] | undefined)?.includes('food');
const cozy = (a: Activity) => (a.tags as string[] | undefined)?.includes('cozy');
const COZY = ACTIVITIES.filter((a) => foodish(a) && cozy(a));
const MEALS = AREA_KEYS.map((k) => ({ k, items: ACTIVITIES.filter((a) => foodish(a) && !cozy(a) && a.area === k) })).filter((g) => g.items.length);

export default function Food(_props: ScreenProps) {
  return (
    <Page title="Food & coffee" subtitle={`October hours, checked ${RETRIEVED}.`} back={{ href: '/explore', label: 'Activities' }} sky="day" width="wide">
      <Card className="ac-closed">
        <div className="ac-closed-head t-headline">
          <WarningCircle size={18} weight="fill" aria-hidden="true" />
          Closed or changed
        </div>
        <p className="t-callout">
          Ohanas 395 in June Lake has closed. Carson Peak Inn is temporarily closed. Base Camp Café appears closed. The Tuolumne Meadows store and grill are
          closed for the season. Whoa Nellie Deli's closing date is unconfirmed.
        </p>
      </Card>

      <Section title="Cocoa, coffee & caramel apples">
        <div className="ac-grid">
          {COZY.map((a) => (
            <FoodCard key={a.id} a={a} />
          ))}
        </div>
      </Section>

      {MEALS.map((g) => (
        <Section key={g.k} title={areas[g.k].name}>
          <div className="ac-grid">
            {g.items.map((a) => (
              <FoodCard key={a.id} a={a} />
            ))}
          </div>
        </Section>
      ))}

      <Section title="Make it yourself">
        <Card href="/kids/cozy" className="ac-recipes">
          <Coffee size={22} aria-hidden="true" />
          <span className="ac-recipes-body">
            <span className="t-headline">Recipes</span>
            <span className="t-footnote ac-dim">Hot cocoa, spiced cider, caramel apples, and s'mores without a campfire</span>
          </span>
          <CaretRight size={16} aria-hidden="true" className="ac-chev" />
        </Card>
      </Section>
    </Page>
  );
}

function FoodCard({ a }: { a: Activity }) {
  return (
    <Card inset={false} className="ac-food">
      <div className="ac-food-head">
        <Pressable href={`/do/${a.id}`} className="ac-food-name t-headline">
          {a.name}
        </Pressable>
        <StarButton id={a.id} name={a.name} size="sm" />
      </div>
      <p className="t-callout ac-dim">{a.text}</p>
      {a.hours && (
        <p className="ac-hours t-footnote">
          <Clock size={14} aria-hidden="true" />
          <span>{a.hours}</span>
        </p>
      )}
      <div className="ac-food-actions">
        {a.maps?.q && <MapsButton q={a.maps.q} place={a.name} label="Maps" size="sm" />}
        <Button size="sm" variant="ghost" href={`/do/${a.id}`} iconEnd={CaretRight}>
          Details
        </Button>
      </div>
    </Card>
  );
}
