import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ScreenProps } from '@/app/routes';
import { carGames, trivia } from '@/content/kids.js';
import { Card, Page, Pressable, Section, spring } from '@/ui';
import { Question } from '@/ui/icons';
import './KidsPages.css';

export default function Games(_props: ScreenProps) {
  return (
    <Page title="Car games" back={{ href: '/kids', label: 'Kids' }} subtitle="No screens needed." sky="dawn" width="wide">
      <div className="kb-grid">
        {carGames.map((g, i) => (
          <Card key={g.title} inset={false} className="kb-game">
            <span className="kb-game-n num" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="t-title-3">{g.title}</h3>
            <p className="t-body kb-dim">{g.text}</p>
          </Card>
        ))}
      </div>

      <Section title="Trivia" note="Tap a card to see the answer">
        <div className="kb-grid">
          {trivia.map((t) => (
            <TriviaCard key={t.q} q={t.q} a={t.a} />
          ))}
        </div>
      </Section>

      <p className="t-footnote kb-dim gutter-text kb-foot">Car sickness: eyes on the horizon, a window cracked, crackers handy. Skip games on the curviest stretches.</p>
    </Page>
  );
}

function TriviaCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`kb-trivia surface surface-card pad-md surface-tappable ${open ? "is-open" : ""}`}>
      <span className="kb-trivia-q">
        <Question size={18} weight="bold" aria-hidden="true" />
        <span className="t-headline">{q}</span>
      </span>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.span key="a" className="kb-trivia-a t-kid" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring.glide}>
            {a}
          </motion.span>
        ) : (
          <motion.span key="h" className="kb-trivia-hint t-footnote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Tap to see the answer
          </motion.span>
        )}
      </AnimatePresence>
    </Pressable>
  );
}
