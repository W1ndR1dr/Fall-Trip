import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function VerseGame(_props: ScreenProps) {
  return (
    <Page title="Memory verse" back={{ href: '/faith', label: 'Devotions' }} sky="candle">
      <Placeholder />
    </Page>
  );
}
