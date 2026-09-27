// Overlays: Sheet (Vaul), Toast, Fold (disclosure), EmptyState.
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, lazy, useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { CaretDown, X, type Icon } from './icons';
import { fade, spring, useCalm } from './motion';
import { Pressable } from './Pressable';

// ---------------------------------------------------------------------------
// Sheet

export type SheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Required: the sheet's heading (also its accessible name). */
  title: ReactNode;
  /** Hide the visible heading (still announced). */
  hideTitle?: boolean;
  description?: ReactNode;
  /** An element that opens the sheet when tapped (uncontrolled use). */
  trigger?: ReactNode;
  children?: ReactNode;
  /** Sticky footer (primary action). */
  footer?: ReactNode;
  /** Fractions of the viewport, e.g. [0.5, 0.92]. */
  snapPoints?: (number | string)[];
};

const loadSheet = () => import('./SheetImpl');
const SheetImpl = lazy(loadSheet);
/** Warm the sheet code (the shell does this when idle). */
export const preloadSheet = () => loadSheet().catch(() => {});

/**
 * Bottom sheet (Vaul): drag to dismiss, rubber-band, the page behind scales
 * back onto black like iOS. Keyboard focus moves into it on open. Use for
 * hints, choices and small forms, not for pages.
 */
export function Sheet(props: SheetProps) {
  return (
    <Suspense fallback={props.trigger ?? null}>
      <SheetImpl {...props} />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// Toast: one at a time, above the tab bar, announced politely.

export type ToastInput = {
  title: ReactNode;
  body?: ReactNode;
  icon?: Icon;
  action?: { label: string; onClick: () => void };
  /** ms; 0 keeps it until dismissed. Default 3200 (0 when there is an action). */
  duration?: number;
};
type ToastItem = ToastInput & { id: number };

let current: ToastItem | null = null;
let seq = 0;
let timer: number | undefined;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

/** Show a toast. Returns a function that dismisses it. */
export function toast(t: ToastInput): () => void {
  const id = ++seq;
  current = { ...t, id };
  window.clearTimeout(timer);
  const ms = t.duration ?? (t.action ? 0 : 3200);
  if (ms) timer = window.setTimeout(() => dismissToast(id), ms);
  emit();
  return () => dismissToast(id);
}
export function dismissToast(id?: number) {
  if (id !== undefined && current?.id !== id) return;
  current = null;
  emit();
}

/** Rendered once by the shell. */
export function Toaster() {
  const t = useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => current,
    () => null,
  );
  const calm = useCalm();
  return (
    // The container is the live region (one announcement per toast); the
    // toast itself carries no role, so nothing is read twice.
    <div className="toaster" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {t && (
          <motion.div
            key={t.id}
            className="toast"
            initial={calm ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={calm ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97, transition: fade.base }}
            transition={calm ? fade.base : spring.glide}
            // Swipe down to dismiss.
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.08, bottom: 0.9 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 24 || info.velocity.y > 400) dismissToast(t.id);
            }}
          >
            {t.icon && <t.icon size={20} weight="bold" aria-hidden="true" className="toast-icon" />}
            <div className="toast-text">
              <div className="toast-title">{t.title}</div>
              {t.body && <div className="toast-body">{t.body}</div>}
            </div>
            {t.action && (
              <Pressable
                className="toast-action"
                onClick={() => {
                  t.action!.onClick();
                  dismissToast(t.id);
                }}
                scale={0.94}
              >
                {t.action.label}
              </Pressable>
            )}
            <button type="button" className="toast-close" aria-label="Dismiss" onClick={() => dismissToast(t.id)}>
              <X size={14} weight="bold" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fold: a disclosure ("2 earlier · 7:00 and 8:15")

export type FoldProps = {
  /** Always-visible summary; bold part first ("2 earlier"). */
  summary: ReactNode;
  /** Muted detail after the summary ("7:00 and 8:15"). */
  detail?: ReactNode;
  /** Leading node (e.g. a done dot). */
  lead?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function Fold({ summary, detail, lead, children, defaultOpen = false, className = '' }: FoldProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const calm = useCalm();
  return (
    <div className={`fold ${className}`} data-open={open || undefined}>
      <Pressable className="fold-summary" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} scale={0.98}>
        {lead}
        <span className="fold-text">
          <b>{summary}</b>
          {detail && <span> · {detail}</span>}
        </span>
        <motion.span className="fold-caret" animate={{ rotate: open ? 180 : 0 }} transition={calm ? { duration: 0 } : spring.snap} aria-hidden="true">
          <CaretDown size={16} weight="bold" />
        </motion.span>
      </Pressable>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="fold-body"
            initial={calm ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={calm ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={calm ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={calm ? fade.base : spring.glide}
          >
            <div className="fold-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState

export function EmptyState({ icon: I, art, title, children, action }: { icon?: Icon; art?: ReactNode; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      {art ?? (I && (
        <span className="empty-icon" aria-hidden="true">
          <I size={26} />
        </span>
      ))}
      <p className="t-headline empty-title">{title}</p>
      {children && <p className="t-callout empty-body">{children}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
