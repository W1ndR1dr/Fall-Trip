import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { IconButton, Page } from '@/ui';
import { GearSix, LeafMark } from '@/ui/icons';

export default function Today(_props: ScreenProps) {
  return (
    <Page
      title="Today"
      sky="dawn"
      leading={
        <span className="flex items-center gap-2 pl-2 font-serif text-[calc(19rem/17)] font-medium tracking-[-0.01em]">
          <LeafMark size={20} />
          Fall Trip
        </span>
      }
      actions={<IconButton href="/settings" icon={GearSix} label="Settings" />}
    >
      <Placeholder />
    </Page>
  );
}
