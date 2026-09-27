// Floating glass tab bar with a neutral lens (layoutId) and labels always on.
// Each page renders its own scrim under the bar (see Page), so the scrim
// moves with its page and sits under a page's dock, never over it.
// Tapping the active tab goes to that tab's root, or scrolls it to the top.
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { BookOpenText, CalendarDots, Compass, Leaf, SunHorizon, type Icon } from '@/ui/icons';
import { spring, useCalm } from '@/ui/motion';
import { isTabRoot, navigate, tabOf, type TabId } from './nav';

const TABS: { id: TabId; href: string; label: string; icon: Icon }[] = [
  { id: 'today', href: '/', label: 'Today', icon: SunHorizon },
  { id: 'plan', href: '/plan', label: 'Plan', icon: CalendarDots },
  { id: 'activities', href: '/explore', label: 'Activities', icon: Compass },
  { id: 'kids', href: '/kids', label: 'Kids', icon: Leaf },
  { id: 'faith', href: '/faith', label: 'Devotions', icon: BookOpenText },
];

export function TabBar() {
  const [location] = useLocation();
  const active = tabOf(location);
  const calm = useCalm();
  return (
    <>
      <nav className="tabbar" aria-label="Sections">
        {TABS.map((t) => {
          const on = t.id === active;
          const atRoot = on && isTabRoot(location);
          return (
            <a
              key={t.id}
              href={'#' + t.href}
              className="tab"
              aria-current={on ? 'page' : undefined}
              data-on={on || undefined}
              onClick={(e) => {
                e.preventDefault();
                if (on && atRoot) dispatchEvent(new Event('falltrip:scrolltop'));
                else navigate(t.href, on ? { mode: 'pop' } : {});
              }}
            >
              {on && <motion.span layoutId="tab-lens" className="tab-lens" transition={calm ? { duration: 0 } : spring.indicator} />}
              <motion.span className="tab-icon" key={on ? 'on' : 'off'} initial={on && !calm ? { scale: 0.88 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 30 }}>
                <t.icon size={24} weight={on ? 'fill' : 'regular'} aria-hidden="true" />
              </motion.span>
              <span className="tab-label">{t.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
