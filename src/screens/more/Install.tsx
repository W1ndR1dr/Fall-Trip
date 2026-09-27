import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Install(_props: ScreenProps) {
  return (
    <Page title="Add to Home Screen" back={{ href: '/settings', label: 'Settings' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
