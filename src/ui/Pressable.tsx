// The base of every tappable surface: a button, an in-app link, or an outbound
// link, with the delayed spring press (see usePress) and `data-pressed` for
// fill changes in CSS.
import { motion, type HTMLMotionProps } from 'motion/react';
import type { MouseEvent, ReactNode, Ref } from 'react';
import { navigate } from '@/app/nav';
import { usePress } from './motion';

type Common = {
  children?: ReactNode;
  className?: string;
  /** Scale while pressed (cards .97, buttons .96, small .94, kid tiles .92). 1 = no scale. */
  scale?: number;
  disabled?: boolean;
  ref?: Ref<HTMLElement>;
};

export type PressableProps = Common &
  (
    | ({ href: string; external?: boolean; replace?: boolean } & Omit<HTMLMotionProps<'a'>, 'href' | 'ref' | 'children'>)
    | ({ href?: undefined; external?: undefined; replace?: undefined } & Omit<HTMLMotionProps<'button'>, 'ref' | 'children'>)
  );

/** True for links that leave the app (they open only when tapped). */
export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function Pressable(props: PressableProps) {
  const { children, className = '', scale = 0.97, disabled, ref, ...rest } = props;
  const press = usePress({ disabled });
  const motionProps = {
    animate: { scale: press.pressed ? scale : 1 },
    transition: press.transition,
    'data-pressed': press.pressed || undefined,
    ...press.bind,
  };

  if ('href' in rest && rest.href !== undefined) {
    const { href, external, replace, onClick, ...a } = rest as { href: string; external?: boolean; replace?: boolean; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void } & HTMLMotionProps<'a'>;
    const out = external ?? isExternal(href);
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        className={className}
        href={out ? href : '#' + href}
        target={out ? '_blank' : undefined}
        rel={out ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled || undefined}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || out || disabled) return;
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          navigate(href, { replace });
        }}
        {...motionProps}
        {...a}
      >
        {children}
      </motion.a>
    );
  }
  const b = rest as HTMLMotionProps<'button'>;
  return (
    <motion.button ref={ref as Ref<HTMLButtonElement>} type="button" className={className} disabled={disabled} {...motionProps} {...b}>
      {children}
    </motion.button>
  );
}
