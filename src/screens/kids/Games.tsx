import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Games(_props: ScreenProps) {
  return (
    <Page title="Car games" back={{ href: '/kids', label: 'Kids' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
