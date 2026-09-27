import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';
import { bonus, daily, moments } from '@/content/devotions.js';

export default function Devotion({ params }: ScreenProps) {
  const d = ([...daily, ...moments, ...bonus] as { id: string; title: string }[]).find((x) => x.id === params.id);
  return (
    <Page title={d?.title ?? 'Devotion'} back={{ href: '/faith', label: 'Devotions' }} sky="candle">
      <Placeholder />
    </Page>
  );
}
