import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Leaves(_props: ScreenProps) {
  return (
    <Page title="Why leaves change" back={{ href: '/kids', label: 'Kids' }} sky="day">
      <Placeholder />
    </Page>
  );
}
