import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Rocks(_props: ScreenProps) {
  return (
    <Page title="Rocks and volcanoes" back={{ href: '/kids', label: 'Kids' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
