import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Packing(_props: ScreenProps) {
  return (
    <Page title="Packing" back={{ href: '/plan', label: 'Plan' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
