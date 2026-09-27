import { createContext, useContext, type RefObject } from 'react';
import type { NavMode } from './nav';

/** Provided by the shell to each page in the stack. */
export type FrameInfo = {
  /** The location this page renders (frozen while it animates out). */
  path: string;
  /** How this page arrived (push, pop, fade, none). */
  mode: NavMode;
  /** False while the page is animating out. */
  present: boolean;
};

export const FrameContext = createContext<FrameInfo>({ path: '/', mode: 'none', present: true });
export const useFrame = () => useContext(FrameContext);

/** The current page's scroll container (for useScroll, scroll-spy, etc.). */
export const ScrollContext = createContext<RefObject<HTMLDivElement | null>>({ current: null });
export const usePageScroll = () => useContext(ScrollContext);
