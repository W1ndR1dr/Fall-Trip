import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';

export default function ColorReport(_props: ScreenProps) {
  return (
    <Page title="Color report" back={{ href: '/explore', label: 'Activities' }} sky="day">
      <Placeholder />
    </Page>
  );
}
