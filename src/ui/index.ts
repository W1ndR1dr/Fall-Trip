// The Fall Trip design system. Screens import from '@/ui' only.
// Rules and examples: docs/UI.md. Every primitive in every state: #/_kit.
export { Page, NavBar, BackButton, type PageProps, type Sky } from './Page';
export { Pressable, isExternal, type PressableProps } from './Pressable';
export { Button, IconButton, MapsButton, ExternalLink, type ButtonProps, type IconButtonProps, type MapsButtonProps } from './Button';
export { Section, SectionHeader, Card, LiveCard, IconWell, Eyebrow, Divider, type SectionProps } from './Surface';
export { ListGroup, ListRow, NavRow, type ListRowProps } from './List';
export { Segmented, Switch, Checkbox, CheckRow, TextField, useSettledOrder, type SegmentOption } from './Controls';
export { Tag, Chip, LivePill, LeaveBy, OfflineChip, useOnline, ProgressBar, ProgressRing, Pips, NumberRoller, type TagTone } from './Indicators';
export { KidAvatar, KidChip, KID_COLOR, KID_TEXT } from './Kid';
export { Sheet, Toaster, toast, dismissToast, Fold, EmptyState, type SheetProps, type ToastInput } from './Overlay';
export { spring, fade, fadeUp, stagger, usePress, useCalm, useSpringFor, useFirstVisit, pressScale, type SpringName } from './motion';
export { useFrame, usePageScroll } from '@/app/frame';
export { navigate, goBack, canGoBack } from '@/app/nav';
