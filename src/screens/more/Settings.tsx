import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Settings(_props: ScreenProps) {
  return (
    <Page title="Settings" back={{ href: '/', label: 'Today' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
