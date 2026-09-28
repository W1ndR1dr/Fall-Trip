import type { ScreenProps } from '@/app/routes';
import { RETRIEVED } from '@/content/trip.js';
import { Card, Page, Section } from '@/ui';
import './more.css';

const built = new Date(__BUILD_TIME__);

export default function About(_props: ScreenProps) {
  return (
    <Page title="About" back={{ href: '/settings', label: 'Settings' }} subtitle="A guide for one family's fall weekend in the Eastern Sierra. It works offline." sky="plain">
      <Card className="mo-prose">
        <p className="t-body">
          Hours, closures, fall color, roads and weather were checked on {RETRIEVED} and refreshed before the trip. Always recheck live conditions on the Before you go page.
        </p>
        <p className="t-footnote mo-dim num">
          Version {__BUILD_ID__} · built {built.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </Card>

      <Section title="Scripture">
        <Card className="mo-prose t-footnote">
          <p>
            Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers.
            ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in
            whole or in part into any other language. Used by permission. All rights reserved.
          </p>
          <p>
            Scripture quotations marked (NIV) are taken from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by
            permission. All rights reserved worldwide.
          </p>
          <p className="mo-dim">
            25 verses are quoted from each translation, well within both publishers' limits. "For the Beauty of the Earth" (Folliott S. Pierpoint, 1864) is in the public domain.
            Bible links open YouVersion (bible.com).
          </p>
        </Card>
      </Section>

      <Section title="Maps, art and type">
        <Card className="mo-prose t-footnote">
          <p>
            Terrain is drawn from real elevation data: Terrain Tiles on the AWS Registry of Open Data (Mapzen), built from USGS 3DEP (formerly NED), SRTM, GMTED2010 and ETOPO1.
            Routes and stops are approximate.
          </p>
          <p>The leaf, rock and track drawings were made for this app. There are no photos or third-party artwork.</p>
          <p>Fonts, all under the SIL Open Font License: Newsreader (Production Type), Inter (Rasmus Andersson) and Andika (SIL International).</p>
        </Card>
      </Section>

      <Section title="Sources">
        <Card className="mo-prose t-footnote">
          <p>
            Fall color: CaliforniaFallColor.com, Mono County Tourism, Visit Bishop, Visit Mammoth. Roads and parks: NPS Yosemite, Caltrans, Inyo National Forest, California State
            Parks. Weather and sky: NOAA/NWS, NCEI, U.S. Naval Observatory. Geology: USGS. A full list with dates is in research-notes.md in the project repository.
          </p>
        </Card>
      </Section>

      <Section title="Privacy">
        <Card className="mo-prose t-footnote">
          <p>No analytics, trackers or ads. What you type stays on this device. This site is public but hidden from search engines, and it contains no names, addresses or confirmation numbers.</p>
        </Card>
      </Section>
    </Page>
  );
}
