import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Hunt(_props: ScreenProps) {
  return (
    <Page title="Leaf hunt" back={{ href: '/kids', label: 'Kids' }} sky="dawn">
      <Placeholder />
    </Page>
  );
}
