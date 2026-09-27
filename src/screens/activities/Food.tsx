import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function Food(_props: ScreenProps) {
  return (
    <Page title="Food and cafés" back={{ href: '/explore', label: 'Activities' }} sky="plain">
      <Placeholder />
    </Page>
  );
}
