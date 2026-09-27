import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';
import { routes } from '@/content/trip.js';

export default function RouteOption({ params }: ScreenProps) {
  const r = (routes as Record<string, { title: string }>)[params.id ?? ''];
  return (
    <Page title={r?.title ?? 'Route'} back={{ href: '/plan/sun', label: 'Plan' }} sky="day">
      <Placeholder />
    </Page>
  );
}
