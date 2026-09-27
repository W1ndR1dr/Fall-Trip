import { Button, EmptyState, Page } from '@/ui';
import { Compass } from '@/ui/icons';

export function NotFound() {
  return (
    <Page title="Not found" back={{ href: '/', label: 'Today' }}>
      <EmptyState icon={Compass} title="This page isn't here" action={<Button href="/" variant="secondary">Go to Today</Button>}>
        The link may be from an older version of the app.
      </EmptyState>
    </Page>
  );
}
