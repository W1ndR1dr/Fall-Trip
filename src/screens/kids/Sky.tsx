import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Sky(_props: ScreenProps) {
  return (
    <Page title="Night sky" back={{ href: '/kids', label: 'Kids' }} sky="candle">
      <Placeholder />
    </Page>
  );
}
