import type { ScreenProps } from '@/app/routes';
import { Placeholder } from '@/app/Placeholder';
import { Page } from '@/ui';
import { days } from '@/content/trip.js';

export default function PlanDay({ params }: ScreenProps) {
  const day = days.find((d: { id: string }) => d.id === params.day) ?? days[0];
  return (
    <Page title="Plan" eyebrow={`${day.label}, ${day.date}`} sky="plain">
      <Placeholder />
    </Page>
  );
}
