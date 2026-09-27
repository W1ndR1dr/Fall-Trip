// Inset grouped lists (Settings, Kids home, Activities). Rows are 52 pt tall,
// separators start where the text starts, chevrons mark drill-downs.
import type { ReactNode } from 'react';
import { ArrowUpRight, CaretRight, type Icon } from './icons';
import { Pressable, isExternal } from './Pressable';
import { IconWell } from './Surface';

export function ListGroup({ children, className = '', label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <ul className={`list-group ${className}`} aria-label={label}>
      {children}
    </ul>
  );
}

export type ListRowProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned value ("3 of 11", "On"). */
  detail?: ReactNode;
  /** Leading icon (rendered in a neutral well) or any node (e.g. KidAvatar). */
  icon?: Icon | ReactNode;
  iconTone?: 'neutral' | 'accent' | 'ember' | 'night' | 'ok';
  /** Custom trailing control (Switch, Checkbox). Replaces the chevron. */
  trailing?: ReactNode;
  /** In-app path or outbound URL. In-app rows get a chevron, outbound an arrow. */
  href?: string;
  onClick?: () => void;
  /** Destructive action row (Erase data). */
  destructive?: boolean;
  className?: string;
};

function Lead({ icon, tone }: { icon: ListRowProps['icon']; tone: ListRowProps['iconTone'] }) {
  if (!icon) return null;
  const isComp = typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in (icon as object));
  return <span className="row-lead">{isComp ? <IconWell icon={icon as Icon} tone={tone} size={30} /> : (icon as ReactNode)}</span>;
}

export function ListRow({ title, subtitle, detail, icon, iconTone = 'neutral', trailing, href, onClick, destructive, className = '' }: ListRowProps) {
  const body = (
    <>
      <Lead icon={icon} tone={iconTone} />
      <span className="row-text">
        <span className="row-title">{title}</span>
        {subtitle && <span className="row-sub">{subtitle}</span>}
      </span>
      {detail != null && <span className="row-detail num">{detail}</span>}
      {trailing}
      {!trailing && href && (isExternal(href) ? <ArrowUpRight className="row-chev" size={15} weight="bold" aria-hidden="true" /> : <CaretRight className="row-chev" size={15} weight="bold" aria-hidden="true" />)}
    </>
  );
  const cls = `row ${icon ? 'row-has-lead' : ''} ${destructive ? 'row-destructive' : ''} ${className}`;
  if (href || onClick) {
    return (
      <li className="row-li">
        {href ? (
          <Pressable href={href} className={`${cls} row-tappable`} scale={1}>
            {body}
          </Pressable>
        ) : (
          <Pressable onClick={onClick} className={`${cls} row-tappable`} scale={1}>
            {body}
          </Pressable>
        )}
      </li>
    );
  }
  return (
    <li className="row-li">
      <div className={cls}>{body}</div>
    </li>
  );
}

/** A drill-down row: ListRow with a required href and chevron. */
export function NavRow(props: ListRowProps & { href: string }) {
  return <ListRow {...props} />;
}
