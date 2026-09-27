import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Cozy(_props: ScreenProps) {
  return (
    <Page title="Cozy corner" back={{ href: '/kids', label: 'Kids' }} sky="candle">
      <Placeholder />
    </Page>
  );
}
