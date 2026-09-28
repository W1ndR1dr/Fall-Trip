import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ScreenProps } from '@/app/routes';
import { drawPrompts } from '@/content/kids.js';
import { activities } from '@/content/trip.js';
import { haptic } from '@/lib/feedback';
import { Button, Card, Eyebrow, Page, Section, spring } from '@/ui';
import { Shuffle } from '@/ui/icons';
import { Leaf } from '@/art';
import './KidsPages.css';

export default function Draw(_props: ScreenProps) {
  const [i, setI] = useState(0);
  const next = () => {
    haptic();
    setI((n) => (n + 1 + Math.floor(Math.random() * (drawPrompts.length - 1))) % drawPrompts.length);
  };
  const { rubbing, pressing } = activities;
  return (
    <Page title="Drawing" back={{ href: '/kids', label: 'Kids' }} subtitle="Ideas for the car, the table and the trail." sky="dawn" width="wide">
      <Card className="kb-prompt">
        <Eyebrow>Draw this</Eyebrow>
        <div className="kb-prompt-stage" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p key={i} className="kb-prompt-text" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring.glide}>
              {drawPrompts[i]}
            </motion.p>
          </AnimatePresence>
        </div>
        <Button icon={Shuffle} onClick={next} size="lg">
          Another idea
        </Button>
      </Card>

      <Section title="Make with leaves">
        <div className="kb-grid">
          {[rubbing, pressing].map((x, k) => (
            <Card key={x.title} inset={false} className="kb-steps-card">
              <div className="kb-steps-head">
                <span className="kb-steps-leaf" aria-hidden="true">
                  <Leaf pigment={k ? 'red' : 'gold'} />
                </span>
                <h3 className="t-title-3">{x.title}</h3>
              </div>
              <ol className="kb-steps t-body">
                {x.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </Section>
    </Page>
  );
}
