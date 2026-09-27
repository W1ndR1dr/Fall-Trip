import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Lookback(_props: ScreenProps) {
  return (
    <Page title="Looking back" back={{ href: '/faith', label: 'Devotions' }} sky="candle">
      <Placeholder />
    </Page>
  );
}
