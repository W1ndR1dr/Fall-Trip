import type { ScreenProps } from '@/app/routes';
import { recipes } from '@/content/trip.js';
import { Card, Eyebrow, Fold, Page, Section } from '@/ui';
import { BookOpen, Coffee } from '@/ui/icons';
import './KidsPages.css';

const READS: [string, string, string][] = [
  ['Owl Moon', 'Jane Yolen', 'A quiet night walk. Good before stargazing.'],
  ['Frederick', 'Leo Lionni', 'A mouse who saves up colors and words for winter.'],
  ['Leaf Man', 'Lois Ehlert', 'Collage leaves that travel. Try making one.'],
  ['Fletcher and the Falling Leaves', 'Julia Rawlinson', 'A fox worries about his tree.'],
  ['Winnie-the-Pooh', 'A. A. Milne', 'Read the Poohsticks chapter, then play it at a creek bridge.'],
  ['The Hobbit, chapter one', 'J. R. R. Tolkien', 'A read-aloud for the evening.'],
];

export default function Cozy(_props: ScreenProps) {
  return (
    <Page title="Cozy corner" back={{ href: '/kids', label: 'Kids' }} subtitle="Recipes for the lodging kitchen, and books to read aloud." sky="candle" width="wide">
      <Section title="Recipes">
        <div className="kb-grid">
          {recipes.map((r, i) => (
            <Card key={r.id} inset={false} className="kb-recipe">
              <div className="kb-recipe-head">
                <Coffee size={20} aria-hidden="true" />
                <h3 className="t-title-3">{r.title}</h3>
              </div>
              <Eyebrow>Ingredients</Eyebrow>
              <ul className="kb-ingredients t-body">
                {r.ingredients.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <Fold summary="Steps" detail={`${r.steps.length} steps`} defaultOpen={i === 0}>
                <ol className="kb-steps t-body">
                  {r.steps.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              </Fold>
              {'note' in r && r.note && <p className="t-footnote kb-dim kb-note">{r.note}</p>}
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Books to read aloud" note="Booky Joint in Mammoth sells new and used books">
        <Card>
          <ul className="kb-books">
            {READS.map(([t, a, w]) => (
              <li key={t}>
                <BookOpen size={18} aria-hidden="true" />
                <span>
                  <span className="t-headline">
                    <i>{t}</i>
                  </span>{' '}
                  <span className="t-footnote kb-dim">{a}</span>
                  <span className="t-callout kb-dim kb-book-why">{w}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </Page>
  );
}
