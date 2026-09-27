// Temporary body for screens that are still being built. Screen builders
// delete this import when they fill in their screen.
import { Card, IconWell } from '@/ui';
import { Hourglass } from '@/ui/icons';

export function Placeholder({ children = 'This screen is being rebuilt.' }: { children?: string }) {
  return (
    <div className="section">
      <Card className="flex items-center gap-3" pad="sm">
        <IconWell icon={Hourglass} />
        <p className="t-callout">{children}</p>
      </Card>
    </div>
  );
}
