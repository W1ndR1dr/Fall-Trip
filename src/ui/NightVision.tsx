// The one-tap night vision offer (direction: offered after "Dark" on the trip
// evenings, on Today and on Night sky). One component so every screen offers
// it the same way, at the same threshold.
import { AnimatePresence, motion } from 'motion/react';
import { setNightVision, useTheme } from '@/lib/theme';
import { useAfterDark } from '@/lib/time';
import { Eye, MoonStars } from './icons';
import { fade, spring, useCalm } from './motion';
import { Pressable } from './Pressable';

export type NightVisionOfferProps = {
  /** Show regardless of the clock (Settings, the kit). */
  force?: boolean;
  className?: string;
};

/**
 * After that day's Dark time (and not already in night vision): a row that
 * switches to the red night palette in one tap. In night vision it becomes a
 * small "Turn off night vision" pill so the way back is on the same screen.
 */
export function NightVisionOffer({ force = false, className = '' }: NightVisionOfferProps) {
  const afterDark = useAfterDark();
  const { theme } = useTheme();
  const calm = useCalm();
  const night = theme === 'night';
  const show = force || afterDark || night;
  return (
    <AnimatePresence initial={false} mode="wait">
      {show && !night && (
        <motion.div key="offer" className={`nv-offer-wrap ${className}`} initial={{ opacity: 0, y: calm ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={calm ? fade.base : spring.enter}>
          <Pressable className="nv-offer" onClick={() => setNightVision(true)} scale={0.97}>
            <span className="nv-offer-icon" aria-hidden="true">
              <MoonStars size={20} weight="fill" />
            </span>
            <span className="nv-offer-text">
              <span className="nv-offer-title">Switch to night vision</span>
              <span className="nv-offer-sub">Red and dim, so eyes stay used to the dark</span>
            </span>
          </Pressable>
        </motion.div>
      )}
      {show && night && (
        <motion.div key="off" className={`nv-offer-wrap ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade.base}>
          <Pressable className="chip chip-sm chip-tappable nv-off" onClick={() => setNightVision(false)} scale={0.94}>
            <Eye size={14} weight="bold" aria-hidden="true" />
            <span>Turn off night vision</span>
          </Pressable>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
