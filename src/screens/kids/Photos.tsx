import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Photos(_props: ScreenProps) {
  return (
    <Page title="Photo challenges" back={{ href: '/kids', label: 'Kids' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
