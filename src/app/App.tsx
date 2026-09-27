// The app shell: routing, the page stack, the tab bar, toasts, and the
// service-worker update prompt. Wrapped in MotionConfig so every animation
// honors the device's Reduce Motion setting.
import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { Router } from 'wouter';
import { usePwa } from '@/lib/pwa';
import { ArrowsClockwise } from '@/ui/icons';
import { Toaster, toast } from '@/ui/Overlay';
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

/** SVG filters referenced from CSS (night vision turns art into one dim red). */
function ArtFilters() {
  // Luminance → the night text hue (#D8563A proportions), dimmed to ~0.85.
  const r = [0.2126, 0.7152, 0.0722].map((v) => +(v * 0.85).toFixed(4));
  const row = (k: number) => [...r.map((v) => +(v * k).toFixed(4)), 0, 0].join(' ');
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="night-red" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={`${row(1)} ${row(0.4)} ${row(0.27)} 0 0 0 1 0`} />
      </filter>
    </svg>
  );
}

export function App() {
  useEffect(() => preloadScreens(), []);
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
        <ArtFilters />
        <UpdatePrompt />
      </Router>
    </MotionConfig>
  );
}
