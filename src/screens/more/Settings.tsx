import { useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useStored, storageWorks, wipe } from '@/lib/store';
import { setNightVision, setThemePref, useTheme, type ThemePref } from '@/lib/theme';
import { DEFAULT_KIDS, DEFAULT_PARENTS } from '@/lib/family';
import { Button, Card, ListGroup, ListRow, Page, Section, Segmented, Sheet, Switch, TextField, navigate, toast } from '@/ui';
import { Clock, Info, DeviceMobile, MoonStars, SpeakerHigh, Trash, Warning } from '@/ui/icons';
import './more.css';

const PRESETS: [string, string][] = [
  ['Fri 5:30 pm', '2026-10-09T17:30:00-07:00'],
  ['Sat 9:30 am', '2026-10-10T09:30:00-07:00'],
  ['Sat 9:15 pm', '2026-10-10T21:15:00-07:00'],
  ['Sun 8:15 am', '2026-10-11T08:15:00-07:00'],
];

function useNames(key: string, defaults: string[]) {
  const [raw, setRaw] = useStored<string[]>(key, defaults.map(() => ''));
  const list = Array.isArray(raw) && raw.length === defaults.length ? raw : defaults.map(() => '');
  const setAt = (i: number, v: string) => setRaw(list.map((x, k) => (k === i ? v : x)));
  return [list, setAt] as const;
}

export default function Settings(_props: ScreenProps) {
  const [kids, setKid] = useNames('kids', DEFAULT_KIDS);
  const [parents, setParent] = useNames('parents', DEFAULT_PARENTS);
  const [lodging, setLodging] = useStored<string>('lodging', '');
  const [sound, setSound] = useStored<boolean>('sound', true);
  const [debugNow, setDebugNow] = useStored<string | null>('debugNow', null);
  const { pref, nightVision } = useTheme();
  const [confirm, setConfirm] = useState(false);
  const works = storageWorks();

  return (
    <Page title="Settings" back={{ href: '/', label: 'Today' }} subtitle="Everything here stays on this device." sky="plain">
      {!works && (
        <Card className="mo-warn">
          <Warning size={18} weight="fill" aria-hidden="true" />
          <p className="t-callout">This browser is blocking storage (Private Browsing?). The app works, but names and checkmarks won't be saved.</p>
        </Card>
      )}

      <Section title="Kids">
        <Card className="mo-fields">
          {DEFAULT_KIDS.map((d, i) => (
            <TextField key={d} label={`Child ${i + 1}`} value={kids[i]} onChange={(v) => setKid(i, v)} placeholder={d} maxLength={24} />
          ))}
          <p className="t-footnote mo-dim">Used for the leaf hunt, reading turns and the journal. Saves as you type.</p>
        </Card>
      </Section>

      <Section title="Parents" note="Labels in the journal">
        <Card className="mo-fields">
          {DEFAULT_PARENTS.map((d, i) => (
            <TextField key={d} label={`Parent ${i + 1}`} value={parents[i]} onChange={(v) => setParent(i, v)} placeholder={d} maxLength={24} />
          ))}
        </Card>
      </Section>

      <Section title="Lodging">
        <Card className="mo-fields">
          <TextField label="Name or address" value={lodging} onChange={setLodging} placeholder="For the Maps button" maxLength={120} hint="Only used to open Apple Maps. Never shown anywhere else." />
        </Card>
      </Section>

      <Section title="Appearance">
        <Card className="mo-fields">
          <Segmented
            label="Appearance"
            value={pref}
            onChange={(v) => setThemePref(v as ThemePref)}
            options={[
              { value: 'auto', label: 'Automatic' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
          <p className="t-footnote mo-dim">Automatic follows your iPhone or iPad.</p>
        </Card>
        <ListGroup>
          <ListRow icon={MoonStars} title="Night vision" subtitle="Red and dim, so eyes stay used to the dark" trailing={<Switch checked={nightVision} onChange={setNightVision} label="Night vision" />} />
          <ListRow icon={SpeakerHigh} title="Sounds" subtitle="A soft chime when something is found" trailing={<Switch checked={sound} onChange={setSound} label="Sounds" />} />
        </ListGroup>
      </Section>

      <Section title="Preview trip time" note="See what Today shows during the trip">
        <Card className="mo-fields">
          <div className="mo-presets">
            {PRESETS.map(([label, iso]) => (
              <Button
                key={iso}
                size="sm"
                variant={debugNow === iso ? 'tonal' : 'secondary'}
                icon={Clock}
                aria-pressed={debugNow === iso}
                onClick={() => {
                  setDebugNow(iso);
                  navigate('/');
                }}
              >
                {label}
              </Button>
            ))}
            <Button size="sm" variant={debugNow ? 'secondary' : 'tonal'} aria-pressed={!debugNow} onClick={() => setDebugNow(null)}>
              Real time
            </Button>
          </div>
          {debugNow && <p className="t-footnote mo-dim">Previewing. Tap Real time when you're done.</p>}
        </Card>
      </Section>

      <Section title="More">
        <ListGroup>
          <ListRow icon={DeviceMobile} title="Add to Home Screen" href="/install" />
          <ListRow icon={Info} title="About, sources and credits" href="/about" />
          <ListRow icon={Trash} title="Erase data on this device" onClick={() => setConfirm(true)} destructive />
        </ListGroup>
      </Section>

      <Sheet
        open={confirm}
        onOpenChange={setConfirm}
        title="Erase everything on this device?"
        description="Names, checkmarks, the leaf hunt and journal entries are removed. This can't be undone."
        footer={
          <Button
            size="lg"
            block
            className="mo-danger"
            icon={Trash}
            onClick={() => {
              wipe();
              setConfirm(false);
              toast({ title: 'Erased', body: 'This device is back to a fresh start.' });
              navigate('/');
            }}
          >
            Erase data
          </Button>
        }
      />
    </Page>
  );
}
