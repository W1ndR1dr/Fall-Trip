// Page template: one scroll container per screen, an iOS-style navigation bar
// whose large title collapses into a compact glass bar, safe areas, and the
// bottom padding that keeps content clear of the floating tab bar.
//
//   <Page title="Leaf hunt" back={{ href: '/kids', label: 'Kids' }} actions={<IconButton …/>}>
//     …sections…
//   </Page>
//
// Exactly one <h1> per screen: Page renders it from `title` (visually hidden
// with `hideTitle` when the screen has its own hero).
import { motion, useScroll, useTransform } from 'motion/react';
import { useContext, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { FrameContext, ScrollContext } from '@/app/frame';
import { goBack, scrollMemory } from '@/app/nav';
import { CaretLeft } from './icons';
import { useCalm } from './motion';

export type Sky = 'dawn' | 'day' | 'candle' | 'plain' | 'none';

export type PageProps = {
  /** The screen's name: the <h1>, the compact bar title and document.title. */
  title: string;
  children?: ReactNode;
  /** Back button target (used when there is no in-app history) and label. */
  back?: { href: string; label?: string };
  /** Replaces the back button (e.g. Today's wordmark). */
  leading?: ReactNode;
  /** Trailing nav actions: IconButtons or a text Button. */
  actions?: ReactNode;
  /** Small line above the large title (Eyebrow styling). */
  eyebrow?: ReactNode;
  /** A line under the large title. */
  subtitle?: ReactNode;
  /** Keep the h1 for screen readers but don't show a large title (hero screens). */
  hideTitle?: boolean;
  /** Compact title always visible; no large title. */
  compact?: boolean;
  /** Content in the compact bar's center instead of the title (e.g. a Segmented). */
  barCenter?: ReactNode;
  /** Ambient light at the top of the page: where the sun is. */
  sky?: Sky;
  /** Content column: readable (680 px on iPad), wide (980), or full. */
  width?: 'readable' | 'wide' | 'full';
  /** Docked above the tab bar (e.g. the devotion stepper). Adds bottom space. */
  dock?: ReactNode;
  /** Override document.title (defaults to "<title> · Fall Trip"). */
  docTitle?: string;
  className?: string;
  style?: CSSProperties;
};

export function Page(props: PageProps) {
  const { title, children, sky = 'plain', width = 'readable', dock, docTitle, className = '', style } = props;
  const frame = useContext(FrameContext);
  const scroller = useRef<HTMLDivElement>(null);
  const calm = useCalm();

  // document.title follows the visible page.
  useEffect(() => {
    if (!frame.present) return;
    document.title = docTitle ?? (title === 'Today' ? 'Fall Trip' : `${title} · Fall Trip`);
  }, [title, docTitle, frame.present]);

  // Scroll restoration: back and tab switches return to where you were.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const saved = scrollMemory.get(frame.path);
    if (saved && (frame.mode === 'pop' || frame.mode === 'fade' || frame.mode === 'none')) el.scrollTop = saved;
    const onScroll = () => scrollMemory.set(frame.path, el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.path]);

  // Tapping the active tab scrolls to the top.
  useEffect(() => {
    if (!frame.present) return;
    const top = () => scroller.current?.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    addEventListener('falltrip:scrolltop', top);
    return () => removeEventListener('falltrip:scrolltop', top);
  }, [frame.present, calm]);

  return (
    <ScrollContext.Provider value={scroller}>
      <div ref={scroller} className={`page ${className}`} data-width={width} data-dock={dock ? '' : undefined} style={style}>
        {sky !== 'none' && <div className="page-sky" style={{ background: `var(--sky-${sky})` }} aria-hidden="true" />}
        <NavBar {...props} />
        <div className="page-body">{children}</div>
      </div>
      {dock && <div className="page-dock">{dock}</div>}
    </ScrollContext.Provider>
  );
}

/** The navigation bar + large title. Rendered by Page; exported for custom layouts. */
export function NavBar({ title, back, leading, actions, eyebrow, subtitle, hideTitle, compact, barCenter }: PageProps) {
  const scroller = useContext(ScrollContext);
  const { scrollY } = useScroll({ container: scroller });
  const large = !compact && !hideTitle;
  // The glass fades in as content slides under; the compact title cross-fades
  // in over the 40 px in which the large title leaves.
  const glass = useTransform(scrollY, large ? [6, 30] : [0, 12], [0, 1]);
  const titleOpacity = useTransform(scrollY, [28, 56], [0, 1]);
  const titleY = useTransform(scrollY, [28, 56], [6, 0]);
  // Pulling down stretches the large title a little, like iOS.
  const stretch = useTransform(scrollY, [-160, 0], [1.07, 1], { clamp: true });

  const lead = leading ?? (back ? <BackButton href={back.href} label={back.label} /> : null);
  const center = barCenter ?? (
    <motion.span className="navbar-title" aria-hidden="true" style={large ? { opacity: titleOpacity, y: titleY } : hideTitle ? { opacity: titleOpacity } : undefined}>
      {title}
    </motion.span>
  );

  return (
    <>
      <div className="navbar">
        <motion.div className="navbar-glass" style={{ opacity: glass }} aria-hidden="true" />
        <div className="navbar-row">
          <div className="navbar-lead">{lead}</div>
          <div className="navbar-center">{center}</div>
          <div className="navbar-trail">{actions}</div>
        </div>
      </div>
      {hideTitle || compact ? (
        <h1 className="sr-only">{title}</h1>
      ) : (
        <header className="page-head">
          {eyebrow && <div className="page-eyebrow t-eyebrow">{eyebrow}</div>}
          <motion.h1 className="t-large-title page-title" style={{ scale: stretch }}>
            {title}
          </motion.h1>
          {subtitle && <div className="page-subtitle t-body">{subtitle}</div>}
        </header>
      )}
    </>
  );
}

/** "‹ Kids": goes back in history, or to `href` when opened cold. */
export function BackButton({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <a
      className="nav-back"
      href={'#' + href}
      onClick={(e) => {
        e.preventDefault();
        goBack(href);
      }}
    >
      <CaretLeft size={18} weight="bold" aria-hidden="true" />
      <span className="sr-only">Back to </span>
      <span>{label}</span>
    </a>
  );
}
