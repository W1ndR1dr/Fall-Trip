// The passage card: ESV/NIV inside the card, Scripture in Newsreader with
// verse numbers, "Open in YouVersion", and the publisher's notice directly
// under the text. Switching translation morphs the words: the words both
// translations share hold their place and glide; the rest dissolve.
import { AnimatePresence, motion } from 'motion/react';
import { Fragment, type ReactNode } from 'react';
import { Card, Divider, ExternalLink, Segmented, fade, spring, useCalm } from '@/ui';
import { AutoHeight, useLargePrint, useTranslation } from './bits';
import { NOTICE, diffTokens, passageUrl, versesOf, type Translation } from './data';

const TR_OPTIONS = [
  { value: 'ESV' as const, label: 'ESV' },
  { value: 'NIV' as const, label: 'NIV' },
];

/** "LORD" is set in small capitals, as printed Bibles do. */
function lordify(text: string): ReactNode {
  if (!text.includes('LORD')) return text;
  const parts = text.split('LORD');
  return parts.map((p, i) => (
    <Fragment key={i}>
      {p}
      {i < parts.length - 1 && <span className="sc-lord">Lord</span>}
    </Fragment>
  ));
}
const plainLord = (t: string) => t.replace(/LORD/g, 'Lord');

export function TranslationSwitch({ className = '' }: { className?: string }) {
  const [tr, setTr] = useTranslation();
  return <Segmented size="sm" label="Bible translation" value={tr} onChange={setTr} options={TR_OPTIONS} className={`psg-seg ${className}`} />;
}

/** Scripture text with verse numbers. Animated word diff between translations. */
export function ScriptureText({ passage, tr, className = '' }: { passage: string; tr: Translation; className?: string }) {
  const calm = useCalm();
  const [large] = useLargePrint();
  const cls = `${large ? 'psg-kid' : 't-scripture'} psg-text ${className}`;

  if (calm) {
    // Reduced motion: a plain cross-fade.
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={tr} className={cls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade.base}>
          {versesOf(passage, tr).map((v) => (
            <Fragment key={v.n}>
              <sup className="t-verse">{v.n}</sup>
              {lordify(v.text)}{' '}
            </Fragment>
          ))}
        </motion.p>
      </AnimatePresence>
    );
  }

  const tokens = diffTokens(passage)[tr];
  const spoken = versesOf(passage, tr)
    .map((v) => `${v.n} ${plainLord(v.text)}`)
    .join(' ');
  return (
    <p className={cls}>
      <span className="sr-only">{spoken}</span>
      <span className="psg-words" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          {tokens.map((t) =>
            t.kind === 'verse' ? (
              <motion.sup
                key={t.key}
                layout="position"
                className="t-verse psg-v"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ...fade.slow, delay: 0.14 } }}
                exit={{ opacity: 0, transition: fade.quick }}
                transition={spring.glide}
              >
                {t.text}
              </motion.sup>
            ) : (
              <motion.span
                key={t.key}
                layout="position"
                className="psg-w"
                initial={{ opacity: 0, filter: 'blur(3px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.32, delay: 0.14, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, filter: 'blur(3px)', transition: { duration: 0.14, ease: 'easeOut' } }}
                transition={spring.glide}
              >
                {lordify(t.text)}
              </motion.span>
            ),
          )}
        </AnimatePresence>
      </span>
    </p>
  );
}

/** The publisher's required notice for the translation on screen. */
export function Notice({ tr }: { tr: Translation }) {
  return (
    <AutoHeight>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={tr} className="t-caption psg-notice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade.base}>
          {NOTICE[tr]}
        </motion.p>
      </AnimatePresence>
    </AutoHeight>
  );
}

export type PassageCardProps = {
  refs: string[];
  /** A line of context above the text ("This is from the very beginning…"). */
  note?: string;
  className?: string;
};

export function PassageCard({ refs, note, className = '' }: PassageCardProps) {
  const [tr] = useTranslation();
  return (
    <Card className={`psg ${className}`}>
      {refs.map((ref, i) => (
        <div key={ref} className="psg-block">
          {i > 0 && <Divider className="psg-div" />}
          <div className="psg-head">
            <h3 className="psg-ref">
              {ref}
              <span className="psg-tr"> · {tr}</span>
            </h3>
            {i === 0 && <TranslationSwitch />}
          </div>
          {i === 0 && note && <p className="t-callout psg-note">{note}</p>}
          <AutoHeight>
            <ScriptureText passage={ref} tr={tr} />
          </AutoHeight>
          <ExternalLink href={passageUrl(ref, tr)} className="psg-yv">
            Open in YouVersion
          </ExternalLink>
        </div>
      ))}
      <Divider className="psg-div psg-div-notice" />
      <Notice tr={tr} />
    </Card>
  );
}
