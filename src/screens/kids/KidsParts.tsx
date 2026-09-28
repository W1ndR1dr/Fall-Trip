// Shared bits for the smaller kids pages (tracks, sky, photos, …).
import type { ReactNode } from 'react';
import { useChecklist } from '@/lib/store';
import { chime, haptic } from '@/lib/feedback';
import { Card, Checkbox, ProgressBar, announce } from '@/ui';
import './KidsPages.css';

/** "3 of 8 seen" with a bar. */
export function Tally({ done, total, word }: { done: number; total: number; word: string }) {
  return (
    <Card className="kb-tally">
      <div className="kb-tally-row">
        <span className="kb-tally-num num">{done}</span>
        <span className="t-callout kb-dim">
          of {total} {word}
        </span>
      </div>
      <ProgressBar value={total ? done / total : 0} tone="neutral" label={word} valueText={`${done} of ${total} ${word}`} />
    </Card>
  );
}

/** A checklist bound to a stored key, with the announcement and a chime on the last one. */
export function useKidList(key: string, ids: string[], word: string) {
  const list = useChecklist(key);
  const done = ids.filter((id) => list.has(id)).length;
  const toggle = (id: string) => {
    const on = list.toggle(id);
    const n = done + (on ? 1 : -1);
    haptic();
    announce(`${n} of ${ids.length} ${word}`);
    if (on && n === ids.length) chime();
  };
  return { has: list.has, toggle, done, total: ids.length };
}

/** A card with art, a title, text and a big "we saw it" check. */
export function FindCard({ art, title, children, checked, onToggle, checkLabel }: { art?: ReactNode; title: string; children?: ReactNode; checked: boolean; onToggle: () => void; checkLabel: string }) {
  return (
    <Card inset={false} className={`kb-find ${checked ? 'is-on' : ''}`}>
      {art && <div className="kb-find-art">{art}</div>}
      <div className="kb-find-body">
        <h3 className="t-title-3 kb-find-title">{title}</h3>
        {children}
      </div>
      <div className="kb-find-check">
        <Checkbox checked={checked} onChange={onToggle} label={`${checkLabel}: ${title}`} size={30} />
      </div>
    </Card>
  );
}
