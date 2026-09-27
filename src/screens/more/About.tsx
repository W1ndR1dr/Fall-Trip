import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function About(_props: ScreenProps) {
  return (
    <Page title="About" back={{ href: '/settings', label: 'Settings' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
