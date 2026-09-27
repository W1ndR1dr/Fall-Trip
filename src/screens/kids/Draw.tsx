import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Draw(_props: ScreenProps) {
  return (
    <Page title="Drawing" back={{ href: '/kids', label: 'Kids' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
