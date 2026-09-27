import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Journal(_props: ScreenProps) {
  return (
    <Page title="Gratitude journal" back={{ href: '/faith', label: 'Devotions' }} sky="candle">
      <Placeholder />
    </Page>
  );
}
