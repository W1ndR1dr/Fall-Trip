// The app shell: routing, the page stack, the tab bar, toasts, the quiet
// screen-reader announcer, and the service-worker update prompt. Wrapped in
// MotionConfig so every animation honors the device's Reduce Motion setting.
import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { Router } from 'wouter';
import { usePwa } from '@/lib/pwa';
import { useAfterDark } from '@/lib/time';
import { Announcer } from '@/ui/Announce';
import { ArrowsClockwise } from '@/ui/icons';
import { Toaster, preloadSheet, toast } from '@/ui/Overlay';
import { useStackLocation } from './nav';
import { preloadScreens } from './routes';
import { Stack } from './Stack';
import { TabBar } from './TabBar';

function UpdatePrompt() {
  const pwa = usePwa();
  useEffect(() => {
    if (!pwa.needRefresh) return;
    return toast({ title: 'Update ready', body: 'Reload to use the new version.', icon: ArrowsClockwise, action: { label: 'Reload', onClick: pwa.update } });
  }, [pwa.needRefresh]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** html[data-after-dark] on trip nights after "Dark": glows go out (tokens.css). */
function AfterDark() {
  const afterDark = useAfterDark();
  useEffect(() => {
    document.documentElement.toggleAttribute('data-after-dark', afterDark);
  }, [afterDark]);
  return null;
}

export function App() {
  useEffect(() => {
    preloadScreens();
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(preloadSheet, { timeout: 4000 });
    else setTimeout(preloadSheet, 2000);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <Router hook={useStackLocation}>
        <div className="app" data-vaul-drawer-wrapper="">
          <main id="main" className="stack" tabIndex={-1}>
            <Stack />
          </main>
          <TabBar />
        </div>
        <Toaster />
        <Announcer />
        <AfterDark />
        <UpdatePrompt />
      </Router>
    </MotionConfig>
  );
}
