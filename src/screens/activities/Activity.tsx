import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';
import { menu } from '@/content/trip.js';

export default function Activity({ params }: ScreenProps) {
  const a = (menu as { id: string; name: string }[]).find((m) => m.id === params.id);
  return (
    <Page title={a?.name ?? 'Activity'} back={{ href: '/explore', label: 'Activities' }} sky="day">
      <Placeholder />
    </Page>
  );
}
