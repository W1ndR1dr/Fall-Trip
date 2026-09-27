import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Tracks(_props: ScreenProps) {
  return (
    <Page title="Animal tracks" back={{ href: '/kids', label: 'Kids' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
