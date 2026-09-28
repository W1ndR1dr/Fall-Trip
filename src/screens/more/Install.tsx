import type { ScreenProps } from '@/app/routes';
import { Card, Page, Section } from '@/ui';
import { Export, Plus } from '@/ui/icons';
import './more.css';

const STEPS: [string, React.ReactNode][] = [
  ['Open this page in Safari.', null],
  [
    'Tap Share. It is at the bottom on iPhone and at the top right on iPad.',
    <span key="s" className="mo-glyph" aria-hidden="true">
      <Export size={22} />
    </span>,
  ],
  [
    'Scroll down and tap Add to Home Screen, then Add.',
    <span key="p" className="mo-glyph" aria-hidden="true">
      <Plus size={22} />
    </span>,
  ],
  ['Open Fall Trip once from the Home Screen while you have signal. It saves itself for offline use.', null],
  ['Check it: turn on Airplane Mode and open it again. Every screen should still work.', null],
];

export default function Install(_props: ScreenProps) {
  return (
    <Page title="Add to Home Screen" back={{ href: '/settings', label: 'Settings' }} subtitle="So it works like an app, with no signal." sky="plain">
      <Card>
        <ol className="mo-steps">
          {STEPS.map(([text, glyph], i) => (
            <li key={i}>
              <span className="mo-step-n num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="t-body mo-step-text">{text}</span>
              {glyph}
            </li>
          ))}
        </ol>
      </Card>
      <Section>
        <p className="t-callout mo-dim gutter-text">Do this on every iPhone and iPad. Each device keeps its own names, checkmarks and journal.</p>
      </Section>
    </Page>
  );
}
