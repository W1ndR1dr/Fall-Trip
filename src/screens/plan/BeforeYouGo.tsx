import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function BeforeYouGo(_props: ScreenProps) {
  return (
    <Page title="Before you go" back={{ href: '/plan', label: 'Plan' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
