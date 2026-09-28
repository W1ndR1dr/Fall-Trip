// The count at the top of a checklist: a rolling number, "of 47 packed".
import { NumberRoller } from '@/ui';
import { Check } from '@/ui/icons';

export function CountHead({ done, total, word }: { done: number; total: number; word: string }) {
  const all = done >= total;
  return (
    <div className="pl-count">
      <span className="pl-count-n">
        <NumberRoller value={done} label={`${done} of ${total} ${word}`} />
      </span>
      <span className="pl-count-of" aria-hidden="true">
        of {total} {word}
      </span>
      {all && (
        <span className="pl-count-all">
          <Check size={14} weight="bold" aria-hidden="true" />
          All done
        </span>
      )}
    </div>
  );
}
