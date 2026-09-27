// Bottom sheet (Vaul). Loaded lazily through Overlay.tsx's <Sheet>, so vaul
// and Radix Dialog ship with the screens that open sheets, not the shell.
import { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { X } from './icons';
import type { SheetProps } from './Overlay';

export default function SheetImpl({ open, onOpenChange, title, hideTitle, description, trigger, children, footer, snapPoints }: SheetProps) {
  const [isOpen, setIsOpen] = useState(!!open);
  const shown = open ?? isOpen;
  // html[data-sheet-open]: the scaled-back page sits on black while open.
  useEffect(() => {
    if (!shown) return;
    document.documentElement.toggleAttribute('data-sheet-open', true);
    return () => void document.documentElement.toggleAttribute('data-sheet-open', false);
  }, [shown]);
  return (
    // autoFocus: keyboard focus moves into the sheet when it opens (and back
    // to the trigger when it closes).
    <Drawer.Root open={open} onOpenChange={(o) => { setIsOpen(o); onOpenChange?.(o); }} shouldScaleBackground noBodyStyles snapPoints={snapPoints} autoFocus>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay" />
        <Drawer.Content className="sheet">
          <div className="sheet-grabber" aria-hidden="true" />
          <div className="sheet-head">
            <Drawer.Title className={hideTitle ? 'sr-only' : 't-title-2 sheet-title'}>{title}</Drawer.Title>
            <Drawer.Close asChild>
              <button type="button" className="icon-btn icon-btn-plain icon-btn-sm sheet-close" aria-label="Close">
                <X size={16} weight="bold" aria-hidden="true" />
              </button>
            </Drawer.Close>
          </div>
          {description ? (
            <Drawer.Description className="t-body sheet-desc">{description}</Drawer.Description>
          ) : (
            <Drawer.Description className="sr-only">{typeof title === 'string' ? title : 'Details'}</Drawer.Description>
          )}
          <div className="sheet-body">{children}</div>
          {footer && <div className="sheet-foot">{footer}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
