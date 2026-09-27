# Research notes

Everything factual in the Fall Trip app, with the source and the date it was checked. All research was done **2026-09-27** (about two weeks before the trip) unless an entry says otherwise. Each section keeps the researcher's original tagging:
- **[proj]** is a projection, with the reasoning given.
- **[bg]** / "background, not verified" is general knowledge that wasn't checked against a current source.
- **(snippet)** means the fact came only from a search-engine summary, not a fetched page.

> The repository is public. Home location and names are intentionally left out; "Home (Bay Area)" stands in for the starting point in drive-time tables.

## Summary of what the app relies on

| Topic | Key fact used | Source (see sections below) | Source date |
|---|---|---|---|
| Color, Oct 9–11 | Mid band (7,600–8,600 ft) near peak → peak: Conway, Lundy, Monitor, June Lake slopes. High Bishop Creek, Virginia Lakes, Sagehen likely past | Mono County report, CaliforniaFallColor, Visit Mammoth; 2024–25 analogs | Reports Sep 23–25, 2026 |
| Weather | Normals: Mammoth 63/31, Lee Vining 67/38, Bishop 80/40. CPC 8–14 day (Oct 4–10) 70–80% above-normal temps | NOAA NCEI 1991–2020; CPC | Normals; CPC issued Sep 26 |
| Sun/moon | Sunrise ~7:00, sunset ~6:25 PDT; **New Moon Sat Oct 10, 08:50 PDT** | USNO API | Computed for 2026 |
| Tioga | Open; no seasonal closure before Oct 17 in 1980–2025; construction delays Mon–Thu | NPS conditions; NPS/Mono Basin Research tables | NPS updated Sep 25, 2026 |
| Yosemite entry | No reservation in 2026; $35/vehicle, 7 days, card only | NPS reservations and fees pages | 2026 |
| Fuel | No gas Crane Flat → Lee Vining (~59 mi); Crane Flat pumps 24/7 | NPS | 2026 |
| Lodging | Mammoth still bookable at normal prices; June Lake and Lee Vining tight (Leaves in the Loop Oct 9–11, Bridgeport Oktoberfest Oct 10, holiday) | Google Hotels, Hotwire retail, Airbnb live searches | Live, Sep 27 |
| Lodging tax | Mammoth and Mono County 15% TOT (+1% TBID in Mammoth); Bishop 12% | Town of Mammoth Lakes; Mono County | Current |
| Scripture | ESV ≤500 verses, <25% of work, notice required; NIV ≤500 verses, <25%, notice required. App quotes 25 verses each | crossway.org/permissions; Biblica via Bible Gateway/Zondervan | Checked Sep 27 |
| YouVersion | ESV = version 59, NIV = 111; ranges like `GEN.1.11-12` work; text downloads for offline, audio does not | bible.com (all 30 links returned 200); YouVersion help | Checked Sep 27 |

## Things I could not verify (consolidated)

- **Whoa Nellie Deli 2026 closing date.** Sources conflict: "first week in October" (Mono County) vs "last Sunday in October" (Tripadvisor snippet). The app treats it as a bonus. Call 760-647-1088.
- **Hotwire Hot Rate identities.** They are hidden until booking; see the Hotwire section for the triangulation and confidence levels.
- **Visit Bishop and Inyo County color pages** were captcha-blocked. Their data came via mirrors on CaliforniaFallColor and Visit Mammoth.
- **No official color data for McGee, Convict, June Lake, or Monitor after Sep 23.** North Lake has only an independent blog reading.
- **Forecast for Oct 9–11** isn't available yet (beyond NWS range). The update routine fills it in on Oct 7.
- **Temporary Tioga storm closures** have no published history; the closure probabilities are estimates.
- **Hours from search snippets only:** Schat's Bishop, Holy Smoke, Jack's, Black Sheep, Mono Market, Mono Inn, Latte Da season end, Silver Lake Café's exact closing date, Epic Café.
- **Other unknowns:** Mono Basin Visitor Center fall closing date; South Tufa ranger walk times in October; restrooms at South Tufa, Panum, and Lundy.
- **Inyo Craters:** whether the hazard-tree closure blocks the craters trail.
- **Woolly's Adventure Summit:** whether its "summer only" gem mining runs on October weekends.
- **Leaves in the Loop 2026 schedule:** only the dates are confirmed; the posted schedule is 2025's.
- **Biblica's own permissions page** returned 403. NIV terms came from Zondervan and Bible Gateway's copy of Biblica's notice.
- **Golden hour and astronomical twilight** were computed (PyEphem), not taken from a published table.
- **Kid-fact sources:** a few rest on secondary sources (Wikipedia for the Jeffrey pine scent; a search summary for the Panum Crater age via USGS). Those are marked.
- **Drive times** are OSRM free-flow plus estimates for traffic and stops, not Google/Apple live traffic.

---

## Kid facts: geology, aspens, leaf pigments (main thread)

- Long Valley Caldera formed ~760,000 years ago in the Bishop Tuff supereruption; 16 x 32 km (10 x 20 mi); many hot springs/fumaroles; Casa Diablo geothermal ~40,000 homes. https://www.usgs.gov/volcanoes/long-valley-caldera
- Mono Lake islands < ~2,000 yrs old; Paoha lava flows ~250 yrs; most recent activity ~300 yrs ago (Paoha uplift). Black Point ~13,300 yrs. https://www.usgs.gov/volcanoes/mono-lake-volcanic-field
- Panum Crater ~650 yrs old (600–700), youngest in the Mono Craters chain; rhyolite dome with pumice and obsidian. https://www.usgs.gov/volcanoes/long-valley-caldera/science/long-valley-caldera-field-guide-panum-crater (via search summary) ; trail ~1.6 mi / ~324 ft gain (AllTrails/onX, secondary)
- monolake.org tufa page returned 403 to WebFetch.
- Tufa: calcium-rich freshwater springs seep up and meet carbonate-rich lake water, and calcium carbonate (limestone) precipitates around the spring; towers grow over decades to centuries. 1–2 million birds use Mono Lake each year. https://parks.ca.gov/?page_id=514 (via search summary; monolake.org 403)
- Quaking aspen: petiole flattened perpendicular to the blade, so leaves tremble in the slightest breeze; stands are often one clone sharing a root system; Pando (Fishlake NF, UT) >100 acres, >14 million lb. https://www.fs.usda.gov/wildflowers/beauty/aspen/grow.shtml ; https://www.fs.usda.gov/r04/fishlake/recreation/explore-forest/pando ; https://home.nps.gov/brca/learn/nature/quakingaspen.htm
- Jeffrey pine bark/resin smell: vanilla/butterscotch (resin volatile almost pure n-heptane); "gentle Jeffrey" cone prickles turn inward vs ponderosa. https://en.wikipedia.org/wiki/Pinus_jeffreyi ; https://tahoetrailguide.com/jeffrey-pine-pinus-jeffreyi/
- Leaf color: chlorophyll breaks down in fall; carotenoids (yellow/orange) were present all summer, masked by green; anthocyanins (red/purple) are newly made in fall from sugars trapped in the leaf, favored by warm sunny days + cool (not freezing) nights. https://www.esf.edu/eis/eis-leaves-color-change.php ; https://harvardforest.fas.harvard.edu/education-opportunities/classic-outreach-resources/autumn-foliage-color/leaf-science/leaf-process/ ; https://www.kew.org/read-and-watch/why-do-leaves-change-colour (fs.usda.gov science page returned 403)
- Mono Lake ~2.5x saltier than the ocean (Las Vegas Review-Journal/Mono Lake sources via search). Gull nesting share has declined (monolake.org "California Gulls: If not Mono Lake, where?"), so the app says only "thousands of gulls nest on the islands". https://www.monolake.org/today/california-gulls-if-not-mono-lake-where/
- Tioga Pass ~9,943–9,945 ft; highest highway pass in California. https://en.wikipedia.org/wiki/Tioga_Pass ; https://www.monocounty.org/places-to-go/mountain-passes/tioga-pass/

---

## Fall color, weather, sun and moon

Researched 2026-09-27. Every source below was accessed 2026-09-27; the source's own publication or update date is given where one is visible.
Scale used by the sources: 0-10% Just Starting / 10-50% Patchy / 50-75% Near Peak (Go Now) / 75-100% Peak (GO NOW) / Past Peak.
Tags: **[proj]** marks my projection (reasoning is given). **[bg]** marks background knowledge that is not verified.

---

### 0. Bottom line

- **Best all-corridor weekend: Oct 9–11.** The mid-elevation band (7,600–8,600 ft) should be the color zone then: Conway Summit, Lundy, Monitor Pass, the June Lake Loop hillsides, and the start of McGee and Convict. Hope Valley on CA-88 is in its usual peak window. The high Bishop Creek lakes and the upper Rock Creek lake area will mostly be **past peak**. The lower Bishop Creek groves (7,800–8,500 ft) and lower Rock Creek should still have color. Other points for this weekend:
  - New moon is Oct 10 (08:50 PDT), so the skies will be the darkest of the month.
  - The "Leaves in the Loop" event runs in June Lake Oct 9–11 (Mono County report).
  - Weather climatology is still benign.
- **Oct 2–4 is best only if North Lake, Lake Sabrina, South Lake, Rock Creek, Virginia Lakes or Sagehen are must-sees.** Those are at or near peak now and in 1–2 weeks will be past. Mid-elevation spots will still be only Patchy that weekend. The NWS forecast already covers Fri Oct 2 and Sat Oct 3: sunny, warm and light wind.
- **Oct 16–18 is the June Lake, Convict and McGee peak.** By then all spots above 9,000 ft are done. Storm, snow and wind-stripping risk is modestly higher.
- **2026 is running about on schedule to ~1 week early** at high elevations (Bishop Creek, Rock Creek, Virginia Lakes) compared with 2025. It is **about the same as 2025** at mid elevations (Conway, June Lake, Monitor, Convict, McGee). Likely reasons:
  - A dry summer and fall. Inyo County went from 0.06% to 55.67% D1 drought between the 9/8 and 9/22 maps, and Mono County is 100% D0.
  - Warm days with cold nights.
  - Wind events on Sep 21 and Sep 25 that stripped some groves.
- **Near-term threat to the high groves:** a cold system Sun night into Mon (Sep 27–28), with a 40–60% chance of at least 1" of snow above 9,000 ft in Mono County and near-freezing valley lows Mon and Tue mornings. After that, ridging brings warm, dry, light-wind weather through at least Oct 10. CPC gives a 70–80% chance of above-normal temperature for Oct 4–10. That pattern tends to hold color on the trees rather than strip it.

---

### 1. Fall color status (latest reports)

#### 1a. Sources and their dates
| Source | Date on source | URL |
|---|---|---|
| CaliforniaFallColor (CFC), "Near Peak in Bishop Creek Canyon" (Visit Bishop data, observed 9/23) | published 2026-09-24 | https://californiafallcolor.com/2026/09/24/near-peak-in-bishop-creek-canyon/ |
| CFC, "Make Your Way to Mono County" (Mono County Tourism data, observed 9/20–9/22) | published 2026-09-24 | https://californiafallcolor.com/2026/09/24/make-your-way-to-mono-county/ |
| Mono County official Fall Color Report | "Report Date: September 23, 2026", plus an in-line Sagehen update dated 9/25. The page says it is "Updated every Wednesday by 6pm". | https://www.monocounty.org/things-to-do/fall-colors (curl with a browser UA returned 200) |
| Visit Mammoth, "Where to Find Fall Colors in Mammoth Lakes This Week" | dated September 23, 2026 | https://www.visitmammoth.com/blogs/find-fall-colors/ |
| CFC, "Follow the Yellow-Leaf Road" (Mono, observed 9/14–9/16) | 2026-09-18 | https://californiafallcolor.com/2026/09/18/follow-the-yellow-leaf-road/ |
| CFC, "Bishop Creek Canyon is Midweek Magic" (observed 9/16) | 2026-09-17 | https://californiafallcolor.com/2026/09/17/bishop-creek-canyon-is-midweek-magic/ |
| CFC, "Mother Nature and the Mammoth Lakes Basin" | 2026-09-18 | https://californiafallcolor.com/2026/09/18/mother-nature-and-the-mammoth-lakes-basin/ |
| CFC, "Fall Beauty Slowly Begins in Bishop" (observed 9/9) | 2026-09-11 | https://californiafallcolor.com/2026/09/11/fall-beauty-slowly-begins-in-bishop/ |
| CFC, "2026 Predictions" | 2026-08-31 | https://californiafallcolor.com/2026/08/31/2026-predictions/ |
| Flying Dawn Marie blog, "Eastern Sierra Fall Color Report (9/25/26)" (independent; observed 9/22–9/24; % estimates) | datePublished 2026-09-25 | https://www.flyingdawnmarie.com/new-blog/eastern-sierra-fall-color-report-092526 |
| CFC 2024 and 2025 archives, used for analog timing (pulled via WP REST API) | 2024-09 to 2025-10 posts | https://californiafallcolor.com/wp-json/wp/v2/posts (for example https://californiafallcolor.com/2025/10/03/north-lake-is-now/) |

Notes:
- No new CFC Eastern Sierra post has appeared since 9/24; the RSS feed's newest item is 9/24. The CFC newsletter started 9/25.
- The Visit Bishop pages returned a SiteGround captcha (HTTP 202) to both curl and WebFetch, as did inyocountyvisitor.com. Visit Bishop data was therefore taken from its mirror on CFC and Visit Mammoth.

#### 1b. The 12 spots: current status and projections for three weekends
Elevations are the figures the sources use (CFC / Mono County).

| # | Spot | Elev (ft) | Latest status (source, obs date) | Oct 2–4 [proj] | **Oct 9–11** [proj] | Oct 16–18 [proj] |
|---|---|---|---|---|---|---|
| 1 | **North Lake** | 9,225 | ~35%, "Go Soon". Mostly green; the famous aspen "channel" is still lime; the right side is orange (FDM, 9/22–24). No official 9/23 figure: Visit Bishop's report does not list it. | **Near Peak → Peak (best)** | Peak → **Past Peak risk** | Past Peak |
| 2 | **Lake Sabrina** | 9,150 | **Near Peak 50–75%** (Visit Bishop via CFC, 9/23); FDM ~75%. Dam work: the dam path is closed and the reservoir is low. | **Peak** | Peak → Past at the lake; lower approach / Aspendell (8,550) still good | Past at the lake; Intake II and lower canyon (7,800–8,000) may still show color |
| 3 | **South Lake** | 9,768 | **Near Peak 50–75%** (9/23). Trees above Parchers are already past peak. | Peak → Past | **Past Peak** at the lake; the South Fork road groves (Mist Falls 8,350, Mtn Glen 8,850) may be at peak | Past |
| 4 | **Rock Creek** (road/lake) | 9,600 (lake ~9,700) | **Near Peak 50–75%** in the upper canyon; the lower half is 10–50% (Mono, 9/23). FDM: ~75%, aspen tunnels peaking "within the next few days". | **Peak** (upper) | Upper Peak → Past; the lower road (Aspen/East Fork campgrounds) is Near Peak–Peak | Upper Past; Lower Rock Creek Rd (7,087) nearing peak |
| 5 | **McGee Creek** | 8,600 | **0–10% Just Starting**; most color is ~1 mile up the trail (Mono, 9/23) | Patchy | Patchy → Near Peak | **Near Peak → Peak** |
| 6 | **Convict Lake** | 7,850 | **0–10% Just Starting**; the back grove "may have lost a bit in the last windstorm" (Mono and Visit Mammoth, 9/23) | Patchy | Patchy → Near Peak | **Near Peak → Peak** |
| 7 | **June Lake Loop** | 7,654 | **0–10% Just Starting**; the Parker bench is the color highlight (Mono, 9/23) | Patchy (hillsides) | Patchy → **Near Peak** (upper slopes and Carson Peak shrubs good; loop-road groves partly green) | **Near Peak → Peak (best)** |
| 8 | **Lundy Canyon** | 7,858 | **10–50% Patchy**; the trailhead and above are ~50% (Mono, 9/23) | Near Peak (upper canyon) | **Near Peak → Peak** | Peak at the lake and lower canyon; upper canyon going past |
| 9 | **Virginia Lakes** | 9,819 | **Near Peak 50–75%**. There is "significant leaf loss" along the road below Big Virginia; Big Virginia is just starting (Mono, 9/23). FDM ~65%. | Peak / partly Past | **Past Peak** mostly; groves around Big Virginia may still be peaking | Past |
| 10 | **Conway Summit** | 8,143 | **10–50% Patchy** (Mono, 9/23); FDM ~10% on the classic 395 view | Patchy → Near Peak | **Near Peak → Peak (best)** | Peak → Past (wind-dependent) |
| 11 | **Sagehen Summit** | 8,139 | **75–100% Peak** (Mono update 9/25); FDM 90%, "likely past peak within the next week" | Peak → **Past** | **Past Peak** | Past |
| 12 | **Monitor Pass** | 8,314 | **10–50% Patchy**, "heading to 50–75% very soon… great fall color drive for another week or two" (Mono, 9/22–23) | Near Peak | **Near Peak → Peak** | Peak → Past |

Other reported areas (9/23): Mammoth Lakes Basin (8,996) Near Peak, ~75% around Lake George (Visit Mammoth). Tioga Pass (9,943) Patchy, near 50%. Sonora Pass (9,623) Patchy, ~50%. Green Creek Near Peak. Lee Vining Canyon (6,781) Just Starting.

Valley floor, per the 9/23 Visit Bishop report: Bishop (4,150) is Patchy, Round Valley (4,692) Patchy, Buckley Ponds "still waiting", and Rawson Ponds 0–10%.

#### 1c. Projection basis: analog years from the CFC archive (real past reports)
- **2025, same calendar point (~9/25/25):** Conway 10–50%, June Lake 0–10%, Monitor Patchy, Convict 0–10% (all the same as 2026). Rock Creek, Virginia and Sabrina approach were Patchy (2026 is further along, at Near Peak). Sagehen was at Peak 9/21–29/25 (about the same as 2026).
- **2025 progression:**
  - North Lake: Peak 10/3; "only a few days left" 10/7.
  - Bishop Creek: "Peak to Past Peak" 10/7.
  - Rock Creek: Near Peak 10/2, Peak 10/6–9, Past 10/23. Lower Rock Creek peaked 10/23.
  - Virginia Lakes: Peak 10/9, Peak→Past 10/16.
  - Conway: Near Peak 10/2, Peak 10/9–16. Winds on 10/11 knocked off an estimated 20–25% of leaves. Past 10/23–30.
  - June Lake: Patchy→Near Peak 10/9, Near Peak–Peak 10/16–17, Peak 10/23, Past 10/30.
  - Lundy: Near Peak 10/2–9, Peak 10/16–23.
  - Convict: Near Peak 10/9, Peak 10/23.
  - McGee: Peak 10/23.
  - Monitor: Near Peak 10/4–9.
  - Hope Valley: Peak 10/7; "Go Now to Highway 88" 10/12.
- **2024 progression:**
  - Sagehen: Peak 9/26–10/1, Past 10/10.
  - North Lake: Peak 10/1–10/11.
  - Sabrina: Peak→Past 10/8–15.
  - Rock Creek: Peak 10/7–10.
  - Virginia Lakes: Peak 10/5, Peak→Past 10/14.
  - Conway: Near Peak 10/10, Peak 10/17, Past 10/24.
  - Monitor: Peak 10/10–18.
  - June Lake: Near Peak 10/25; Peak→Past 10/30 after snow on 10/28.
  - McGee: Peak→Past 10/28.
  - Hope Valley: Near Peak 10/2–4, Peak 10/14; Caples Lake to Hope Valley at peak 10/21.
  - Bishop town: still Patchy on 10/24/24; "Valleys shine in Inyo County" 10/31/24.
- **How I applied this:** high-elevation spots are shifted ~1 week earlier than 2025. Mid-elevation spots follow 2025 timing (2025 was called "a long and glorious autumn" in CFC's 2026 predictions post).
- **Drivers:**
  - The US Drought Monitor shows Mono County at 100% D0 and Inyo County at 100% D0 with 55.67% D1 (map of 2026-09-22; D1 was 0.06% on 9/8). Source: https://usdmdataservices.unl.edu/api/CountyStatistics/GetDroughtSeverityStatisticsByAreaPercent?aoi=06027&startdate=9/1/2026&enddate=9/27/2026&statisticsType=1
  - CFC 2026 Predictions (8/31) says "less water, colors show sooner" and that the season "seems … right on track".
  - Visit Mammoth (via CFC 9/18) credits the "recent mix of cold nights and warm days".
  - Mono (9/23) says some West Walker trees "thrown in the towel early, a bit brown or blown off".
  - Visit Bishop (9/11) reported afternoon mountain showers in early September and a hot valley (upper 80s–90s).

#### 1d. Ranking for Oct 9–11 (best to worst)
1. **Conway Summit.** Near Peak→Peak; a roadside 395 view, easy for a family.
2. **Lundy Canyon.** Near Peak→Peak; the best color is above the lake on the trail.
3. **Monitor Pass.** Near Peak→Peak; a long drive (CA-89) that can be looped with Hope Valley.
4. **June Lake Loop.** Near Peak on the slopes, patchy along the road; "Leaves in the Loop" is on.
5. **Lake Sabrina / lower Bishop Creek** (Aspendell, Cardinal Village, Intake II, the South Fork road). The lake itself is peak-to-past; the lower groves are good.
6. **Rock Creek.** Lower and middle road Near Peak–Peak; the lake and Mosquito Flat area are likely past.
7. **McGee Creek.** Patchy→Near Peak, with the best color up-canyon.
8. **Convict Lake.** Patchy→Near Peak.
9. **North Lake.** ⚠ Likely at the tail end of peak or past. Some years it holds into ~10/11 (2024).
10. **Virginia Lakes.** ⚠ Likely past (a bit of color may remain around Big Virginia).
11. **South Lake.** ⚠ Likely past.
12. **Sagehen Summit.** ⚠ Past peak.

**Likely past peak by Oct 9–11:** Sagehen, Virginia Lakes, South Lake, and the upper Rock Creek lake area. North Lake and Lake Sabrina are borderline.

#### 1e. Where the color zone is each weekend [proj]
| Weekend | High band 9,000–9,800 (N/S Lake, Sabrina, upper Rock Cr, Virginia) | Mid band 7,600–8,600 (Conway, Lundy, June, McGee, Convict, Monitor, Sagehen) | Low band 4,000–5,200 (Bishop, Round Valley cottonwoods, Walker) |
|---|---|---|---|
| Oct 2–4 | **Peak** (Sagehen, a mid-elevation spot that runs early, is peak→past) | Patchy → Near Peak | Patchy |
| Oct 9–11 | Peak→**Past** (lower Bishop Creek 7,800–8,500 still good) | **Near Peak → Peak** | Patchy (Round Valley / Pine Creek possibly Near Peak; 2025 was Near Peak on 10/9) |
| Oct 16–18 | Past | **Peak** for June/Convict/McGee/lower Lundy; Conway and Monitor going past | Patchy → Near Peak (2024: still Patchy 10/24, "shine" 10/31) |

#### 1f. Hope Valley / Carson Pass (CA-88), the alternative region
- **There is no 2026 CFC report for Hope Valley, Carson Pass or Woodfords as of 9/27.** A WP API search for posts since 2026-08-01 found none.
- CFC 2026 Predictions puts "the Northern Sierra (Hope Valley/Carson Pass, Lake Tahoe, CA-89)" in **October**.
- Analog years:
  - 2024: Near Peak 10/2–4, Peak 10/14 ("Head for Hope Now"), Caples Lake → Hope Valley at peak 10/21.
  - 2025: "Waking up at Woodfords" 9/26; Patchy–Near Peak 10/5; Peak 10/7; "Go Now to Highway 88" 10/12; "Heavenly Highway 88" 10/16.
  - Sources: https://californiafallcolor.com/2024/10/14/head-for-hope-now/, https://californiafallcolor.com/2025/10/07/hope-is-alive-and-well/, https://californiafallcolor.com/2025/10/12/go-now-to-highway-88/
- **[proj]** Hope Valley (~7,000 ft) should be Near Peak Oct 2–4, **Peak Oct 9–11 (most likely)**, and Peak→Past Oct 16–18.
- It pairs naturally with Monitor Pass (CA-89 connects Hope Valley to US-395 at Topaz).

#### 1g. Recent wind and weather events affecting leaves
- **Fri Sep 25:** a dry cold front. The NWS Reno AFD said "wind-prone locations along US-395 in Mono County… gusts up to 45 mph" with ridgetop gusts over 75 mph, and a Lake Wind Advisory covered CAZ073 (Mono). Sources: AFD 2026-09-24 19:51Z and 2026-09-25 20:16Z via https://api.weather.gov/products/types/AFD/locations/REV
- **Sep 21:** thunderstorm outflow gusts up to ~45 mph were forecast. KMMH (the Mammoth airport) recorded a peak gust of 36 mph on 9/21 and 30 mph on 9/25 (https://api.weather.gov/stations/KMMH/observations).
- The Mono report (9/23) cites leaf loss at Convict and along the Virginia Lakes road from "the last windstorm".
- **Today (Sep 27):** SW gusts of 30–40 mph in Mammoth, June Lake and Lee Vining (NWS point forecasts) and 35–45 mph on ridges (REV AFD 2026-09-27 07:25Z).
- **Sun night Sep 27 – Mon Sep 28:** a 20–50% chance of showers, a 40–60% chance of at least 1" of snow above 9,000 ft in Mono County, and near-freezing valley lows Mon and Tue AM. This could brown or drop leaves on the high groves that are already at peak (Virginia, South Lake, Sagehen). **[proj]**
- **Smoke:** from the Dome Fire (Yosemite, NE of Wawona). REV warns of reduced air quality "down the US-395 corridor from Walker to Bridgeport". Glacier Point Road is closed (NPS conditions page, last updated 2026-09-25: https://www.nps.gov/yose/planyourvisit/conditions.htm).

---

### 2. Weather

#### 2a. NWS 7-day point forecasts
Generated 2026-09-27 ~14:44–15:20 UTC via api.weather.gov/points → forecast. Grids: Mammoth REV/59,18; June Lake REV/56,24; Lee Vining REV/56,32; Tioga HNX/80,148; Bishop VEF/16,169; North Lake area VEF/7,165 ("West Bishop", 10,240 ft grid).

| Location | Sun 9/27 | Mon 9/28 | Tue 9/29 | Wed–Thu 9/30–10/1 | **Fri 10/2** | **Sat 10/3** |
|---|---|---|---|---|---|---|
| Mammoth Lakes | 60/35, gusts 40 | 54/35, 40% rain/snow showers, t-storms | 64/40 | 72–73 / 46 | **71/43 sunny** | **71/43 sunny** |
| June Lake | 64/37, gusts 35 | 58/37, 40% rain/snow showers | 70/43 | 77 / 47–48 | 76/44 | 76/45 |
| Lee Vining | 64/34 | 57/35, 40% | 67/40 | 74–75 / 45–46 | 73/43 | 72/43 |
| Tioga Pass (~10,400 grid) | 52/31, 40% snow <0.5" | 46/32, 40% snow/t-storms, <0.5" | 57/36 | 63 / 39–40 | 61/38 | 61/38 |
| Bishop | 85/45 | 73/43, 40% showers/t-storms | 82/47 | 88–89 / 51–52 | 88/50 | 87/50 |
| North Lake area | 58/32, SSW 16–23 g32 | 48/35, 50% snow showers | 59/41 | 65–67 / 45 | 65/44 | 64/43 |

Winds from Wednesday onward are generally 0–7 mph at all points.

The first trip weekend (Oct 2–3) is within the forecast period: **sunny, well above normal, light wind.** Oct 9–11 and Oct 16–18 are beyond it.

**Forecast discussions (issued 2026-09-27):**
- **Reno** (07:25Z): "A ridge pattern returns Tuesday through the end of next weekend. Temperatures will trend between 4–8 degrees above average by Wednesday. Dry weather with light winds."
- **Las Vegas** (12:27Z): showers and thunderstorms from a trough plus tropical moisture (Hurricanes Odalys and Polo) Mon–Tue, mainly in the east of its area; "Ridging will set up across the Southwestern US with warming temperatures and mild weather expected during the second half of the week."
- There are no watches, warnings or advisories in effect for Mono or Inyo (api.weather.gov/alerts/active?area=CA).

#### 2b. CPC extended outlooks
Discussion issued 2026-09-26: https://www.cpc.ncep.noaa.gov/products/predictions/610day/fxus06.html. Point values come from the CPC GIS shapefiles (https://ftp.cpc.ncep.noaa.gov/GIS/us_tempprcpfcst/), sampled at Mammoth, Bishop and Lee Vining.

| Outlook | Valid | Temperature | Precipitation |
|---|---|---|---|
| 6–10 day (issued 9/26) | Oct 2–6 | **Above normal, 70%** | Near normal (36%) |
| 8–14 day (issued 9/26) | **Oct 4–10** | **Above normal: 70% (Mammoth, Lee Vining), 80% (Bishop)** | Near normal (36%) |
| Week 3–4 (issued 9/25) | **Oct 10–23** | Above normal, 50% | EC (equal chances) |

- The CPC text calls for an amplified ridge over the West ("long duration feature… confidence is high (>70%) … from the Rockies westward, >80% … Southern California to parts of the Great Basin"), with confidence rated "Above Average, 4 out of 5".
- **What this means:** Oct 9–11 most likely brings dry, mild, low-wind weather, which is favorable for holding leaves. The 8–14 day window ends Oct 10. The Sep 27 update (due ~3 pm ET) was not yet out when checked.

#### 2c. Climatology by weekend
Sources:
- NOAA NCEI 1991–2020 daily normals: https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-daily-1991-2020 (stations USW00023157, USC00045280, USC00044881, USC00042756, USC00044705, USC00048406, USC00043369, USC00040819).
- Extremes and frequencies are my calculations from NCEI GHCN-Daily station files (https://www.ncei.noaa.gov/data/global-historical-climatology-network-daily/access/<ID>.csv), 1991–2025 unless noted.
- WRCC (wrcc.dri.edu) now redirects to wrcc-archive, whose summaries were last updated in 2013, so I used NCEI instead.

**Temperatures (°F)**

| Station | Weekend | Normal hi/lo (NCEI 1991–2020) | Coldest low in window (GHCN, 1991–2025) | Chance of ≥0.01" on a given day (NCEI normal) |
|---|---|---|---|---|
| **Bishop AP** (4,108 ft) | Oct 2–4 | 83/42 | 28 (2017-10-04) | 4.3% |
| | Oct 9–11 | 80/40 | **20 (2019-10-11)** | 4.4% |
| | Oct 16–18 | 77/37 | 23 (1998-10-17) | 4.5% |
| **Mammoth Lakes RS** (7,804 ft; record ends Aug 2022) | Oct 2–4 | 65/34 | 2 (2019-10-04, unflagged in GHCN but suspect) | n/a |
| | Oct 9–11 | 63/31 | 12 (2019-10-09) | n/a |
| | Oct 16–18 | 61/30 | 12 (1998-10-17) | n/a |
| **Lee Vining** (6,797 ft) | Oct 2–4 | 70/40 | 26 (2013-10-04) | 8.4–8.6% |
| | Oct 9–11 | 67/38 | 21 (2008-10-11) | 8.7–8.8% |
| | Oct 16–18 | 65/35 | 24 (1994-10-16) | 9.2–9.5% |
| Ellery Lake (9,645 ft, Tioga) | Oct 2 / 10 / 18 | – | – | 11.0% / 14.3% / 18.4% |
| Lake Sabrina (9,065 ft) | Oct 2 / 10 / 18 | – | – | 10.3% / 13.0% / 16.1% |
| South Lake (9,580 ft) | Oct 2 / 10 / 18 | – | – | 11.0% / 12.5% / 14.8% |
| Gem Lake (8,970 ft, near June Lake) | Oct 2 / 10 / 18 | – | – | 11.3% / 12.8% / 15.0% |

June Lake has no NOAA temperature station. The June Lake forecast grid tracks Lee Vining closely, so Lee Vining and Mammoth RS bracket it.

**Storm risk: chance of at least one wet day (≥0.25") in the 3-day window**
GHCN, 1925–2004 for the high stations; 1988–2025 for Lee Vining.

| Station | Oct 2–4 | Oct 9–11 | Oct 16–18 | Any day Oct 1–20 |
|---|---|---|---|---|
| Ellery Lake (Tioga) | 4% | 8% | 8% | 41% |
| Gem Lake | 4% | 13% | 11% | 44% |
| Lake Sabrina | 4% | 9% | 11% | 38% |
| South Lake | 2% | 4% | 10% | 37% |
| Lee Vining | 5% | 5% | 5% | 35% |
| Bishop AP | 2% | 1% | 0% | 17% |

**Snow in town:**
- Lee Vining: chance of any snowfall in the window is 3% / 6% / 3%. A first ≥1" snow day has happened by Oct 4 / 11 / 18 in 3% / 8% / 13% of years (1988–2025).
- Mammoth RS: a first ≥1" day has happened by Oct 11 in 21% of years, and a first ≥4" day by Oct 11 / 18 in 8% / 12% (1994–2018, n=24).

**Snow level:**
- The current system: snow above ~9,000 ft (REV AFD).
- **[bg]** Early-October cold troughs typically bring snow levels of 7,000–9,000 ft. Colder late-October storms can bring snow to 6,000–7,000 ft (Lee Vining and the June Lake area).

**Wind (Bishop AP, GHCN WSF2):**
- Share of days with a peak 2-minute wind ≥35 mph: 1% (Oct 2–4), 3% (Oct 9–11), 2% (Oct 16–18). Mean daily wind is ~7–8 mph.
- Valley-floor data understates canyon and ridge winds. The real stripping risk comes with frontal passages. Example: 10/11/2025 winds removed an estimated 20–25% of Conway leaves (https://californiafallcolor.com/2025/10/13/lovely-lundy/, published 2025-10-13).
- **[proj]** Wind-stripping risk is low for Oct 2–4 (forecast light winds). It is low to moderate for Oct 9–11 (ridge favored through Oct 10). It is moderate for Oct 16–18 (week 3–4 precip is EC, so trough passages are more likely late in October).

**Tioga Road (CA-120) closure risk.** Source: Mono Basin Research, "Tioga Pass Road Opening and Closing Dates since 1933" (data through 2022), https://www.monobasinresearch.org/data/tiogapass.php
- The average seasonal closing date is Nov 3.
- In 1980–2022 the earliest seasonal closures were **Oct 17 (2004)**, Oct 21 (2021), Oct 24 (1996) and Oct 29 (1992).
- So in 43 seasons: **0 closed before Oct 4, 0 before Oct 11, 1 (≈2%) by Oct 18.**
- Temporary storm closures of hours to days are also possible. The NPS says Glacier Point Road is "closed when it is snowing or snow is forecast overnight"; I have no frequency data for Tioga.
- Current status (NPS, 2026-09-25): Tioga is open, with 10–15 minute construction delays between Olmsted Point and Tioga Pass Mon–Thu, 8 am–3:30 pm.
- NPS says Reds Meadow is scheduled to close Oct 5, 2026 for construction (Visit Mammoth page, 9/23).

**Weather risk summary by weekend [proj]**

| Weekend | First significant storm | Seasonal Tioga closure | Wind stripping | Notes |
|---|---|---|---|---|
| Oct 2–4 | Very low (forecast sunny) | ~0% | Low | Warm: Bishop ~88°F |
| Oct 9–11 | Low (CPC dry/warm lean) | ~0% historically | Low–moderate | Nights near or below freezing ≥7,500 ft |
| Oct 16–18 | Moderate (~10% per 3-day window of a ≥0.25" day at 9,000 ft; the daily wet chance at Ellery rises to 18%) | ~2% | Moderate | Snow-on-aspen ("snowliage") is possible, e.g. CFC 10/15/2025, https://californiafallcolor.com/2025/10/15/snowliage-on-steroids/ |

---

### 3. Sun, moon and sky

#### 3a. USNO rise/set times (PDT)
Source: USNO API, https://aa.usno.navy.mil/api/rstt/oneday?date=YYYY-MM-DD&coords=LAT,LON&tz=-8&dst=true

⚠ The prompt's example URL used `tz=-7&dst=true`, which returns times **1 hour too late** (UTC−6). I used `tz=-8&dst=true` (PDT = UTC−7). This was verified against the USNO phase time: New Moon at 15:50 UTC = 08:50 PDT.

"Golden hour" is when the sun is below +6° altitude. I calculated those times with PyEphem; my sunrise and sunset match USNO within ±1 min. Astronomical dawn and dusk are also my calculations.
In the canyons and the Owens Valley the Sierra crest hides the sun well before geometric sunset. In Bishop and Lee Vining, direct sun is lost roughly 30–60 minutes early **[bg]**.

| Date | Place | Civil twilight begins | Sunrise | AM golden hour ends | PM golden hour begins | Sunset | Civil twilight ends | Astro dusk | Moonrise | Moonset | Phase (illum.) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Fri Oct 9 | Lee Vining | 06:33 | 07:00 | ~07:35 | ~17:51 | 18:27 | 18:54 | ~19:53 | 06:01 | 17:49 | Waning crescent 1% |
| | Mammoth | 06:33 | 06:59 | ~07:34 | ~17:51 | 18:27 | 18:53 | ~19:53 | 06:01 | 17:48 | 1% |
| | Bishop | 06:30 | 06:56 | ~07:31 | ~17:49 | 18:25 | 18:51 | ~19:51 | 05:58 | 17:46 | 1% |
| **Sat Oct 10** | Lee Vining | 06:34 | 07:01 | 07:35 | 17:50 | 18:26 | 18:52 | 19:52 | 07:06 | 18:14 | **New Moon 0%** (08:50 PDT) |
| | Mammoth | 06:33 | 07:00 | 07:34 | 17:50 | 18:25 | 18:52 | 19:52 | 07:05 | 18:14 | 0% |
| | Bishop | 06:31 | 06:57 | 07:32 | 17:48 | 18:23 | 18:49 | 19:49 | 07:03 | 18:12 | 0% |
| Sun Oct 11 | Lee Vining | 06:35 | 07:01 | ~07:36 | ~17:49 | 18:24 | 18:51 | ~19:51 | 08:11 | 18:42 | Waxing crescent 2% |
| | Mammoth | 06:34 | 07:01 | ~07:35 | ~17:49 | 18:24 | 18:50 | ~19:51 | 08:10 | 18:42 | 2% |
| | Bishop | 06:32 | 06:58 | ~07:33 | ~17:47 | 18:22 | 18:48 | ~19:48 | 08:07 | 18:40 | 2% |

Values marked "~" on Oct 9 and 11 are interpolated from my Oct 10 golden-hour and astro-dusk calculations; the other columns are USNO.

**Other weekends (Mammoth, USNO):**
- **Sat Oct 3:** civil twilight 06:27; sunrise 06:53; sunset 18:36; civil twilight ends 19:02; astro dusk ~20:02. Moonrise ~00:13 on Oct 4; moonset 14:41. Waning crescent 47%; Last Quarter was Oct 3 at 06:25 PDT. The moon rises around midnight, so evenings are dark.
- **Sat Oct 17:** civil twilight 06:40; sunrise 07:06; sunset 18:16; civil twilight ends 18:42; astro dusk ~19:42. Moonrise 13:49; moonset 23:14. Waxing crescent 42%; First Quarter is Oct 18 at 09:12 PDT. Dark sky comes only after ~23:15.

**Moon phases** (USNO phases API, UTC): https://aa.usno.navy.mil/api/moon/phases/date?date=2026-09-20&nump=6
Full 9/26 16:49; Last Quarter 10/3 13:25; **New 10/10 15:50 (08:50 PDT)**; First Quarter 10/18 16:12; Full 10/26 04:12.
**Oct 9–11 is the darkest weekend of the month for stargazing**, with the Milky Way core low in the SW after dusk **[bg]**.

#### 3b. Meteor showers and planets
Source: Sea and Sky 2026 calendar, https://www.seasky.org/astronomy/astronomy-calendar-2026.html (no date shown).
- **Draconids:** active Oct 6–10 and peak the night of **Oct 7**. The shower is minor (~10/hr) and best in the **early evening**. Waning-crescent moonlight "will not be much of a problem". A few stragglers are possible Oct 9. The Oct 7 date and the "early evening" timing are both from Sea and Sky.
- **Orionids:** active Oct 2–Nov 7, peak the night of Oct 21–22 (after the trip). Some low-rate Orionids are possible pre-dawn on Oct 10–11 **[bg]**.
- **Saturn:** at opposition **Oct 4** (Sea and Sky). It is visible all night.
  - My PyEphem check: Saturn is ~9° up in the east at 19:00 PDT Oct 10 and ~42° up in the SE by 22:00, at magnitude +0.4.
  - Per the search-result summary, the rings are tilted ~9°. This is the best ring view since the 2025 edge-on crossing.
- **Mercury:** greatest eastern elongation Oct 12 (Sea and Sky). It is very low in the WSW in twilight (~3° up at 19:00 PDT from Mammoth), so it will likely be hidden by the mountains.
- **Venus:** heading toward inferior conjunction ~Oct 24 (my calculation). It is essentially lost in the sunset glare by Oct 10: below the horizon by 19:00 PDT and only ~5° up at sunset. It may be glimpsed very low in the west on Oct 2–4.
  - A search-result summary (National Geographic / sterngucker) claimed Venus is "climbing higher" in the evening, which conflicts with the geometry. I rejected that claim in favor of the ephemeris.
- **Jupiter and Mars:** morning planets. On Oct 11 at 05:00 PDT, Jupiter is ~30° up in the east (magnitude −1.8) and Mars ~44° up (magnitude +1.1), per PyEphem. They are not in the evening sky.

---

### 4. Could not verify
- **Visit Bishop** (bishopvisitor.com/fall-colors/ and /bishop-fall-colors-report/) and **inyocountyvisitor.com/fall-colors/** were blocked by a SiteGround captcha (HTTP 202) for both curl and WebFetch. Visit Bishop data was used only through its 9/23 mirror on CFC and Visit Mammoth.
- **North Lake** has no official status this week: it is not listed in Visit Bishop's 9/23 report. The only current data point is the independent FDM blog (~35%, 9/22–24).
- **No official data at all** for McGee, Convict, June Lake or Monitor after 9/22–23. The next Mono County report is due Wed Sep 30; the next CFC Friday post is ~Oct 2. Re-check before committing.
- **Hope Valley / Carson Pass 2026:** there is no report yet. Its timing is based only on 2024 and 2025 analogs.
- **Effect of the Sep 27–28 cold snap and snow** on the high groves has not been observed yet.
- **Visit Mammoth fall-color map PDF** was not downloaded (a link exists on the page).
- **timeanddate.com** returned 403. Golden hour and astronomical twilight are therefore my PyEphem calculations, not a published source.
- **The CPC 8–14 day outlook covering Oct 11** (the Sep 27 issuance) was not yet published when checked. Oct 9–11 is only partly covered (through Oct 10).
- **WRCC station summaries:** wrcc.dri.edu redirects to an archive last updated in 2013. I used NCEI normals and GHCN-D instead. The Mammoth Lakes RS record ends 2022-08. Its 2°F reading on 2019-10-04 is unflagged in GHCN but suspect.
- **June Lake** has no NOAA climate station; it is bracketed by Lee Vining and Mammoth RS.
- **High-elevation snowfall climatology** (Ellery Lake, Sabrina, South Lake) has too few complete snow records. I used a precipitation proxy.
- **Tioga history of temporary (non-seasonal) storm closures** was not found. The seasonal-closure dataset ends in 2022 and lists 2023 as "?".
- **Snow-level climatology** for early-season storms is background knowledge only.
- **Planet and meteor details** come from a single secondary source (Sea and Sky) plus my ephemeris calculations. The NatGeo, EarthSky and sterngucker pages were seen only as search snippets, not fetched.

---

## Roads, passes, Yosemite entry, drive times, fuel

Research done 2026-09-27. All sources accessed **2026-09-27** unless noted. "Src upd" is the source's own update/publish date where one is shown. Anything marked **(background, not verified)** comes from memory. Figures marked **(estimate)** are my own reasoning.

---

### TL;DR

- **Tioga Road (CA-120) is OPEN** (NPS conditions, updated Sep 25 2026). Road-work delays are posted: about 10 min in Tuolumne Meadows, plus 15 min Mon–Thu 8am–3:30pm from Olmsted Pt to Tioga Pass. Big Oak Flat Rd has 15-min weekday delays for fire-safety work. **Glacier Point Rd is CLOSED** because of the Dome Fire, and smoke is possible park-wide.
- **No Yosemite reservation of any kind in 2026.** NPS dropped the system for the whole season. The fee is **$35 per private vehicle, valid 7 days**, card only. The only 2026 fee change is a **$100 per-person surcharge for non-US residents aged 16+**. **No shutdown risk this trip:** a stopgap funding bill (continuing resolution, CR) was signed Sep 2 2026 and funds the government through Dec 11 2026.
- **Historical Tioga closures (NPS table, 46 seasons, 1980–2025):** the road has **never closed for the season before Oct 17**. The earliest were Oct 17 2004, Oct 21 2021, Oct 30 2008, and Oct 31 in 2003 and 2022. The median closing date is about Nov 13. The table does **not** show short storm closures, and those do happen in October (Oct 13 2025, Oct 27 2024, Oct 29 2016).
- **Big services problem on Tioga in fall:** Tuolumne Meadows store, grill and lodge are **closed for the season** and the visitor center closed Sep 27. White Wolf is closed. **There is no gas between Crane Flat and Lee Vining (about 59 mi / 1h45).** The Crane Flat pumps run 24/7 year-round; its store closes Oct 25.
- **Whoa Nellie Deli: the 2026 closing date is UNVERIFIED and at risk.** Its website gives 6:30am–9pm daily with no end date. Mono County's listing says "open seasonally from the end of April through the **first week in October**," which would be before Oct 9. **Phone 760-647-1088 before counting on it.**
- **New construction on US-395 in Lee Vining starts Mon Sep 28 2026.** Outside lanes are closed 24 hrs on weekdays but **reopen on weekends**. Speed limit 25 mph in town. Winter suspension begins "later in October."
- **Sonora (108), Monitor (89), Ebbetts (4) and Carson (88) are all open** with no restrictions at those passes (Caltrans, as of Sep 27 08:19). Sonora Pass has grades up to **26%** plus hairpins, which is bad for car-sick kids.

---

### 1. Tioga Pass / CA-120

#### Current status
| Item | Status | Source (src upd) |
|---|---|---|
| Tioga Road | **Open.** "Expect 10-minute delays in Tuolumne Meadows, and 15-minute delays from 8 am to 3:30 pm, Monday through Thursday from Olmsted Pt to Tioga Pass" | https://www.nps.gov/yose/planyourvisit/conditions.htm (Sep 25 2026) |
| Big Oak Flat Rd (CA-120 west entrance) | Open. "Expect 15-minute delays on weekdays" for vegetation work between Foresta and Crane Flat | same |
| Glacier Point Rd | **Closed** (Dome Fire, smoke) | same; NPS API alert indexed 2026-09-24 (https://developer.nps.gov/api/v1/alerts?parkCode=yose) |
| Fire restrictions | In effect below 8,000 ft | conditions.htm |
| SR-120 (Caltrans, whole route) | "No traffic restrictions are reported" | https://roads.dot.ca.gov/roadscell.php?roadnumber=120 (as of Sun Sep 27 2026, 08:19) |
| Opened for 2026 | Tioga Rd opened Fri May 15 2026. Caltrans opened SR-120 W at Lee Vining up to the park boundary on Mar 23 2026 | https://www.nps.gov/yose/planyourvisit/tioga.htm (May 13 2026); https://dot.ca.gov/caltrans-near-me/district-9/district-9-news/2026_4_15-120-w-reopens (pub Mar 23 2026) |
| Fall rules | "No overnight parking starting Oct 15" on Tioga Rd. "Tioga Road closes after the first significant snowfall." | Yosemite Guide, Sep 23–Nov 24 2026 edition: https://www.nps.gov/yose/planyourvisit/upload/Yosemite-Guide-51-8-508V1.pdf ; https://www.nps.gov/places/000/olmsted-point.htm (Sep 2 2025) |
| Chains | Guide: "Expect chain restrictions on park roads from November to March." Crane Flat page: "tire chains may be required from October through April." When chain controls are on, ALL vehicles must carry chains, including 4WD and rentals | Guide 51-8; https://www.nps.gov/yose/planyourvisit/cf.htm (Jun 11 2026) |
| 24-hr road phone | 209-372-0200 (press 1, then 1) | conditions.htm |
| Park Dept. road work (Tuolumne) | The trail between the wilderness center and Lembert Dome is closed for construction (a detour trail exists). EV chargers in Tuolumne "may be unavailable during construction" | conditions.htm; Guide 51-8 |

#### Historical closing dates (NPS dataset)
Source: NPS "Historical Seasonal Opening and Closing Dates", https://www.nps.gov/yose/planyourvisit/seasonal.htm (src upd Jan 16 2026). The CSV behind the table is https://www.nps.gov/common/uploads/sortable_dataset/yose/3100211F-F070-1219-7FB48285E8D08EFB/yose-Websitesortabledataelementsheetsroadscampgroundstrails-CopyRoads.csv (contains 1980–2025 closing dates).

- Seasons with a closing date: **46 (1980–2025)**.
- **Closed on or before Oct 11: 0 of 46.** On or before Oct 18: **1 of 46 (2004, Oct 17).** On or before Oct 25: 2 (adds 2021, Oct 21). On or before Oct 31: 5 of 46 (11%). On or before Nov 7: 9 of 46 (20%).
- NPS figures: average closing date Nov 17 and median Nov 14 (2004–2023). My median across all 46 years is about Nov 13.
- Last 10 years: 2016 Nov 16 · 2017 Nov 14 · 2018 Nov 20 · 2019 Nov 19 · 2020 Nov 5 · **2021 Oct 21** · **2022 Oct 31** · 2023 Nov 15 · 2024 Nov 11 · 2025 Nov 12.
- **Caveat:** the table lists only the *final* seasonal closure. Short storm closures with a later reopening are not in it. Examples found:
  - **Mon Oct 13 2025:** Tioga Rd and Glacier Point Rd "temporarily close ... at 2:00 P.M. due to a forecast of snow," and "Carry Tire Chains" was advised. https://goldrushcam.com/sierrasuntimes/index.php/news/local-news/71828-... (pub Oct 13 2025). It reopened later; the final 2025 closure was Nov 12.
  - **Sun Oct 27 2024:** Tioga had a temporary storm closure and then reopened, while Sonora, Ebbetts and Monitor were closed Oct 28–30 2024. https://sierrarecmagazine.com/sierra-scenic-passes-winter-closures-10-24/ (pub Oct 30 2024)
  - **Sat Oct 29 2016:** closed "until further notice" ahead of storms; the final 2016 closure was Nov 16. https://www.nps.gov/yose/learn/news/yosemite-national-park-to-close-tioga-and-glacier-point-roads.htm (pub Oct 28 2016)
  - **Nov 3–16 2011:** temporary closure after about 1 ft of snow. https://www.nps.gov/yose/learn/news/tiogareopens11.htm (pub Nov 16 2011)
- **2013 government shutdown:** the Tamarack Flat campground "closed early due to a government shutdown" (seasonal.htm notes). The shutdown also closed the whole park in Oct 2013 (background, not verified).

#### Probability that Tioga is closed or under chain control, by weekend (estimate)
Method: final-closure base rates from the NPS table above, plus a rough allowance for short storm closures and chain controls, which the table leaves out. My fetches found early-to-mid-October storm closures in 1 of the last 10 years (2025) and late-October ones in at least 3 (2016, 2021, 2024).

| Weekend | Final seasonal closure already happened (NPS table) | Est. chance of any closure or chain control during the weekend (estimate) |
|---|---|---|
| Oct 2–4 | 0 / 46 | **~3–5%** |
| Oct 9–11 (holiday) | 0 / 46 | **~5–10%** |
| Oct 16–18 | 1 / 46 (≈2%) | **~10–15%** |

- **Current outlook, which lowers the near-term risk:** the NOAA CPC 6–10 day and 8–14 day outlooks (issued Sep 26 2026, valid Oct 2–10) show a building western ridge. They give **above-normal temperatures across the West (>70–80% in SoCal and the Great Basin)** and **near-to-below-normal precipitation**, with only a slight lean toward below normal for parts of the West Coast. https://www.cpc.ncep.noaa.gov/products/predictions/610day/fxus06.html. That supports Oct 2–4, and likely Oct 9–10, being dry. Oct 16–18 is beyond the outlook window.
- **Storm-risk rule of thumb (background, not verified):** early-season Sierra storms usually come with 2–5 days of forecast warning. Check NWS Reno/Hanford forecasts and the Yosemite road line (209-372-0200, press 1 then 1) Wednesday through Friday before the trip, and carry chains or know where to buy them.

#### Big Oak Flat / CA-120 west of the park
- Caltrans shows no SR-120 restrictions as of Sep 27 (link above).
- D10 Tuolumne County advisory for Sep 28–Oct 2 2026: SR-120 "One-way traffic control between the end of the eastbound turn lane and Memorial Drive for drainage work ... 7:00 a.m. until 5:00 p.m." with 5–10 min delays (weekdays). Memorial Dr is in the Groveland/Big Oak Flat area (location is my inference). https://dot.ca.gov/caltrans-near-me/district-10/district-10-news/traffic-advisory-tuolumne-county-09-25-26 (pub Sep 25 2026). **The Oct 5–9 advisories were not yet published.**
- Grades: New Priest Grade has "over one hundred curves with a sustained 4-percent gradient." Old Priest Grade is 17%. https://en.wikipedia.org/wiki/California_State_Route_120 (rev Sep 7 2026). **Use New Priest Grade with kids.**

---

### 2. Yosemite entry, fees, shutdown

- **Reservations:** "Yosemite National Park today announced it will no longer use a timed reservation system in 2026." https://www.nps.gov/yose/planyourvisit/reservations.htm (src upd Feb 18 2026). No reservation is needed to drive through on Tioga Rd. The only through-traffic reservation on record was in 2020 (seasonal.htm notes: "A reservation was required to enter the park (including passing through on Tioga Road)").
  - Outdated info to ignore: the Manteca Bulletin article saying "Reservations are still needed ... Saturdays and Sundays through Oct. 27 ... Indigenous People's Day" describes the **2024** system. https://www.mantecabulletin.com/news/local-news/now-that-the-crowds-are-thinning-out-enjoy-a-yosemite-day-trip/
- **Fees** (https://www.nps.gov/yose/planyourvisit/fees.htm, src upd Jan 9 2026):
  - Private vehicle **$35**, "valid for seven consecutive days," covers everyone in the car. Yosemite Annual $70. **America the Beautiful Resident Annual $80.** Non-resident ATB Annual $250.
  - **New for 2026:** "Non-US residents (16 and over) must pay an additional $100 per person fee unless admitted with an Annual or America the Beautiful Pass."
  - "This park does not accept cash." All entrances, including Tioga Pass, take credit/debit only.
  - The 4th Grade Pass (free) doesn't apply: the kids are 6 and 7.
  - 2026 fee-free days include **Oct 27** (Theodore Roosevelt's birthday), not the trip weekends.
- **Crowds after the reservation system ended:** ABC7 (May 27 2026) reported "hourslong waits to enter the park" on Memorial Day weekend, and NPCA "note that no entrance consistently offers shorter wait times." https://abc7news.com/post/what-know-before-going-yosemite-long-waits-packed-trails-crowds-surge-reservation-system-ends/19177255/. NPS lists "Current Wait Times" on conditions.htm.
- **Shutdown risk: none for Oct 2026.** "President Trump signed H.R. 6500, the Continuing Appropriations and Extensions Act, 2027, into law last night ... funding the federal government through December 11, 2026." https://www.naggl.org/president-signs-continuing-resolution-through-december-11/ (pub Thu Sep 3 2026). Also https://perspectives.acct.org/stories/congress-passes-extension-through-december-11 (Sep 3 2026) and https://www.astho.org/advocacy/federal-government-affairs/leg-alerts/2026/summary-of-fy27-continuing-resolution/ (Sep 2 2026). One search snippet named the bill H.R. 9770, a numbering discrepancy; the substance is consistent. Earlier 2026 shutdowns (Jan 31–Feb 3, and a DHS-only one Feb 14–Apr 30) are over. https://en.wikipedia.org/wiki/2026_United_States_federal_government_shutdowns

---

### 3. Other passes and construction

#### Caltrans status (roads.dot.ca.gov, "latest reported as of Sunday, September 27th, 2026 at 08:19 AM")
| Route | Status | URL |
|---|---|---|
| SR-108 Sonora Pass | No restrictions reported | https://roads.dot.ca.gov/roadscell.php?roadnumber=108 |
| SR-89 Monitor Pass | No restrictions in Central CA and Sierra. There is 1-way control far north in Sierra Co, which is irrelevant | ...roadnumber=89 |
| SR-4 Ebbetts Pass | No restrictions reported | ...roadnumber=4 |
| SR-88 Carson Pass | 1-way control 6 mi E of Pine Grove (Amador Co) 24/7 "thru 2359 hrs on 9/30/26 – Due to construction" | ...roadnumber=88 |
| US-395 | **"Is closed to southbound traffic from Mazourka Canyon Rd to Manzanar /in Independence/ ... thru 1700 hrs on 10/30/26 – Due to construction – Motorists are advised to use an alternate route."** 1-way control near the SR-190 junction (emergency repairs). High-wind advisory Lone Pine–Pearsonville. North of there: no restrictions | ...roadnumber=395 |
| I-580 / SR-178 / SR-58 / SR-203 / SR-158 / SR-270 / SR-167 | No restrictions | ...roadnumber=580 etc. |
| I-205 | High-wind advisory I-580 to I-5 (campers and trailers) | ...roadnumber=205 |
| I-80 | High-wind advisory at the Bay Bridge. WB trucks must use the brake check at Nyack | ...roadnumber=80 |

Note: the D9 weekly advisory describes the Independence work differently: "All traffic has shifted to the new southbound lanes of U.S. 395 between Fort Independence and the southern end of Independence." This only matters if you drive south of Bishop, e.g. the Walker Pass or Tehachapi fallbacks.

#### Typical October behavior
- District 10 passes (Ebbetts, Sonora, Monitor): Caltrans says it sets closing dates by "public and worker safety ... weather conditions, and existing snow levels." 2026 reopenings: Monitor Mar 5, Sonora Apr 30, Ebbetts May 6. https://dot.ca.gov/caltrans-near-me/district-10/district-10-popular-links/mountain-passes (accessed Sep 27 2026; no update date shown)
- Sonora Pass last closed for winter Dec 26 2025 (https://dot.ca.gov/caltrans-near-me/district-9/district-9-news/2025_12_26-sonora-pass-winter-closure, via search result only). In 2021 it closed Dec 16 (search summary). Seasonal closure usually comes mid-Nov to Dec, but **temporary October storm closures happen**: Sonora closed Oct 28 2024 at Kennedy Meadows, Ebbetts Oct 28 2024, Monitor Oct 30 2024 (sierrarecmagazine, above).
- CA-88 Carson Pass is normally kept open all winter (background, not verified). It is the most reliable trans-Sierra fallback besides I-80 and US-50.
- **Sonora Pass for car-sick kids:** "Numerous, hairpins, steep grades to 26%" and "Large vehicles are discouraged due to the very steep grades of 26% and multiple switchbacks." https://www.pashnit.com/ca-highway-108 (no date shown). The east side, from the summit down to US-395 near the Marine Corps training center, is the steepest part (background, not verified). CA-4 Ebbetts has a narrow one-lane section without a center line (pashnit, background). It is the worst option for motion sickness.

#### Construction
- **US-395 Lee Vining Pavement Rehabilitation**, about $30M, 320 working days, finishing fall 2028. **Starts Mon Sep 28 2026**, from the SR-120 W junction through town to Picnic Grounds Rd. "The outside lanes of U.S. 395 in Lee Vining will be closed 24 hours a day during the week but will reopen during weekends." Work is Mon–Fri 7am–6pm. "The speed limit will be reduced to 55 mph outside of Lee Vining and 25 mph within town." Water and sewer work comes first, "before wrapping up for a winter suspension later in October." https://dot.ca.gov/caltrans-near-me/district-9/district-9-news/2026_9_14-lee-vining-rehab-to-begin (pub Sep 14 2026). **Impact:** a Friday arrival before 6pm could hit lane closures in town. Weekends should be mostly clear.
- **D9 weekly advisory, Sep 28–Oct 2 2026** (https://dot.ca.gov/caltrans-near-me/district-9/district-9-traffic-advisories/current-weekly-traffic-advisory, pub Sep 24 2026). All weekday work, relevant only if repeated the following week:
  - SR-168 W, Bishop Creek Camp Rd to South Lake Rd: pole replacement **Mon and Fri** 8am–4pm, 1-way control, 5 min.
  - SR-158 June Lake Loop: poles Wed, up to 20 min.
  - SR-120 W Lee Vining Canyon: poles Thu, 10 min.
  - US-395 near Mono City and Mono Lake: Wed, 5 min.
  - SR-203 Mammoth crack sealing Mon and Wed, 10 min.
  - SR-182 Bridgeport paving: weekdays, 5 min.
  - US-395 Walker–NV line chip seal: Tue–Fri, up to 20 min (affects the Monitor/Carson fallback on a Friday).
  - Bishop Pavement Project: US-395 at 25 mph from Jay St to Wye Rd, weekdays.
  - SR-58 Tehachapi exits closing on weekdays.
- **D10 San Joaquin advisory, Sep 27–Oct 2** (https://dot.ca.gov/caltrans-near-me/district-10/district-10-news/traffic-advisory-san-joaquin-county-09-25-26, pub Sep 25 2026):
  - Overnight only (8pm–7am): I-205 on-ramps and right lanes at Grant Line, Tracy Blvd and MacArthur (I-205 Smart Corridor Ph 2).
  - Overnight I-580 Patterson Pass ramp closures (EB 9pm–5am, WB 7pm–3:30am).
  - These are Sun–Fri nights. They mainly affect a Friday 6pm departure only if the work extends into the trip week (not yet published).
- D10 Alpine: SR-88 lane closure Woods Lake Rd to Meiss Meadows, Mon–Fri Sep 28–Oct 2, 6am–3pm. D10 Tuolumne: SR-108 1-way control Mill Creek Rd to Eagle Meadow Rd, Sep 28–30, 9am–4pm. (Advisory URLs follow the …/traffic-advisory-{alpine|tuolumne|amador|stanislaus}-county-09-25-26 pattern, pub Sep 25 2026.)
- **Nothing found for I-580/I-205/CA-120 Manteca–Oakdale beyond the above** for the trip weeks. Friday-afternoon slowdowns at the CA-120 Manteca bypass / SR-99 junction and through Oakdale are chronic (background, not verified).
- CA-120 east of Lee Vining (Benton): electrical work Tue and Wed. Not needed for this trip.

---

### 4. Drive times

**Method.** Free-flow times come from the OSRM public router (http://router.project-osrm.org, queried Sep 27 2026), with waypoints forcing each route. The coordinates were geocoded with Nominatim/OpenStreetMap. OSRM has no traffic and no seasonal closures, and it is usually optimistic on curvy mountain roads. Cross-checks:
- Visit Mammoth: SF→Mammoth "Typical drive time: ~6 hours (traffic dependent)" via Tioga and "~6.5 hours" via Sonora Pass. https://www.visitmammoth.com/travel-info/driving/driving-from-sfo/ (no date shown).
- NPS, Tioga closed: Yosemite→Lee Vining/Mammoth via Minden/US-50 "390–410 miles, 8 hours." https://www.nps.gov/yose/planyourvisit/tiogaclosed.htm (src upd Dec 6 2021).
- Bay Area traffic context: MTC ranked NB I-680 over the Sunol Grade "between 1:55–8:20 p.m." as the #4 worst Bay Area commute (2017 data). https://www.pleasantonweekly.com/news/2018/10/29/afternoon-i-680-commute-toward-pleasanton-ranks-as-4th-worst-in-bay-area/ (pub Oct 29 2018; old).

**"Realistic" = free-flow + traffic + posted construction + entrance line + kid stops. All realistic figures are estimates.** Sunset at Tioga Pass is about **6:29 pm on Oct 9** (6:39 pm Oct 2; 6:19 pm Oct 16), from the NOAA solar formula, sea-level horizon. Terrain makes it darker earlier in canyons.

#### Outbound (Friday)
| Route | Free-flow (OSRM) | Realistic (estimate) | Notes |
|---|---|---|---|
| Home (Bay Area) → Lee Vining via Tioga, dep. **12:30 pm** | 224 mi, 5h39 | **7h15–8h15 → arrive ~7:45–8:45 pm** | +20–45 min I-680/I-580 Altamont/I-205 Friday build-up. +10–20 Manteca/Oakdale. +0–15 Big Oak Flat weekday work. +0–20 entrance line. +10 Tuolumne work. +45–75 for 2–3 kid stops. Reaches Crane Flat about 5:15–6 pm, so **roughly the eastern half of Tioga is driven at or after dusk**. Holiday Friday (Oct 9): add 15–30 min more |
| Home (Bay Area) → Mammoth via Tioga, dep. 12:30 pm | 251 mi, 6h11 | **7h45–8h45 → ~8:15–9:15 pm** | as above, +30–40 min |
| Home (Bay Area) → Oakdale, dep. **6 pm** | 90 mi, 2h00 | **2h30–3h00 → ~8:30–9 pm** | Sunol and Altamont are still congested until about 8 pm |
| Home (Bay Area) → Sonora, dep. 6 pm | 125 mi, 2h50 | **3h20–3h50 → ~9:20–9:50 pm** | 1 stop |
| Home (Bay Area) → Groveland, dep. 6 pm | 133 mi, 3h09 | **3h40–4h10 → ~9:40–10:10 pm** | Priest Grade in the dark |
| Groveland → Lee Vining via Tioga (Sat a.m.) | 93 mi, 2h46 | **3h30–4h15** incl. Olmsted and Tenaya stops | 10-min Tuolumne delay applies any day. The Mon–Thu 15-min delay doesn't apply Sat |
| Sonora → Bridgeport via Sonora Pass | 97 mi, 2h26 | **3h00–3h30** | slow, careful driving on 26% grades plus stops |
| Sonora → Lee Vining via Sonora Pass | 122 mi, 2h58 | **3h30–4h00** | |
| **Home (Bay Area) → Hope Valley via CA-88** (coordinator request) | 188 mi, 4h19 | dep. 12:30: **5h15–6h00**. dep. 6 pm: **5h00–5h45 (≈11 pm–midnight)** | route I-680/I-580/I-205/I-5 then CA-88 via Jackson. Amador 1-way control ends 9/30 |
| **Home (Bay Area) → Markleeville via CA-88** | 205 mi, 4h47 | dep. 12:30: **5h45–6h30** | via Picketts Jct / CA-89 |

#### Return (Sunday; must be home at a reasonable hour)
| Route | Free-flow | Realistic Sunday (estimate) | Leave by, for ~6 pm home |
|---|---|---|---|
| Mammoth → Home (Bay Area) via Tioga | 250 mi, 6h08 | **7h15–8h15** | **~9:45–10:45 am** |
| June Lake → Home (Bay Area) via Tioga | 235 mi, 5h54 | **7h00–8h00** | ~10–11 am |
| Lee Vining → Home (Bay Area) via Tioga | 223 mi, 5h36 | 6h45–7h45 | ~10:15–11:15 am |
| Mammoth → Home (Bay Area) via **Sonora Pass** (no Tioga) | 273 mi, 6h15 | **7h15–8h15** | ~9:45 am |
| Mammoth → Home (Bay Area) via Monitor + CA-4 Ebbetts | 311 mi, 6h54 | 8h00–8h45 | not advised (one-lane, curvy) |
| Mammoth → Home (Bay Area) via **Monitor + CA-88 Carson** | 318 mi, 7h07 | **8h00–8h45** | ~9 am |
| Mammoth → Home (Bay Area) via 395 N–Minden–CA-88 (skip Monitor) | 329 mi, 7h27 | 8h15–9h00 | ~9 am |
| Mammoth → Home (Bay Area) via Reno + I-80 Donner | 418 mi, 8h35 (via Tahoe: 390 mi, 8h19) | **9h30–10h30+** (Sunday I-80 westbound jams) | ~7:30 am |
| Mammoth → Home (Bay Area) south via Walker Pass CA-178 | 507 mi, 10h19 | 11h–12h | impractical |
| Mammoth → Home (Bay Area) via Tehachapi CA-58 | 520 mi, 10h11 | 11h–12h | impractical, plus US-395 SB closure at Independence until 10/30 |
| Hope Valley → Home (Bay Area) via CA-88 | 188 mi, 4h17 | 5h00–5h45 | |
| Markleeville → Home (Bay Area) via CA-88 | 204 mi, 4h45 | 5h30–6h15 | |
| Mammoth → Markleeville via Monitor | 121 mi, 2h42 | 3h00–3h20 | |

**Holiday-weekend effects for Oct 9–11 (Mon Oct 12 is Indigenous Peoples'/Columbus Day; Oct 12 2026 is a Monday by calendar check):**
- *Friday out:* expect heavier-than-normal Friday getaway traffic on I-580/I-205/CA-120 and more cars at the Big Oak Flat entrance (estimate).
- *Sunday return:* because most people return Monday, Sunday westbound traffic on CA-120, I-205 and I-580 should be **lighter than on a normal Sunday** (estimate; background, not verified).
- *Entrance lines:* with no reservation system in 2026, peak-weekend waits of an hour or more have been reported (ABC7, May 2026). **Entering Tioga Pass eastbound on a Saturday morning, or leaving westbound (no entrance line when exiting), avoids most of it.** Arriving at Big Oak Flat before about 9 am, or after about 3 pm, usually avoids the worst (background, not verified).
- *Oct 2–4 and Oct 16–18* are normal weekends with lighter park traffic (estimate).

#### Local Eastern Sierra legs (OSRM free-flow; add ~10–20%)
| Leg | Distance / time |
|---|---|
| Mammoth → Bishop | 42 mi, 54 min |
| Mammoth → June Lake (village) | 21 mi, 32 min |
| June Lake → Lee Vining | 14 mi, 24 min |
| Mammoth → Lee Vining | 29 mi, 38 min |
| Bishop → North Lake | 19 mi, 31 min (final dirt/narrow road; background, not verified) |
| Bishop → Lake Sabrina | 19 mi, 31 min |
| Bishop → South Lake | 22 mi, 40 min |
| Lee Vining → Lundy Lake | 11 mi, 21 min |
| Lee Vining → Virginia Lakes (resort) | 18 mi, 31 min |
| Mammoth → Convict Lake | 10 mi, 18 min |
| Mammoth → Rock Creek Lake | 27 mi, 44 min |
| Mammoth → McGee Creek Rd | 12 mi, 16 min |
| Mammoth → Hot Creek Geological Site | 10 mi, 22 min (last ~3 mi gravel; background, not verified) |
| Lee Vining → Tioga Pass entrance | 13 mi, 21 min · Lee Vining → Ellery Lake 10 mi, 16 min |
| Tioga Pass → Tuolumne Meadows VC | 8 mi, 17 min |
| Tuolumne VC → Tenaya Lake | 7 mi, 13 min · Tenaya → Olmsted Pt 2 mi, 5 min |
| Olmsted → Crane Flat | 29 mi, 53 min · Crane Flat → Groveland 33 mi, 60 min |
| Sonora → Strawberry / Dardanelle / Kennedy Meadows | 30 mi 45 min / 51 mi 1h14 / 57 mi 1h28 · Kennedy Mdws → Sonora Pass 10 mi 22 min · Pass → US-395 → Bridgeport 32 mi 46 min |

---

### 5. Fuel

| Station | Status | Source |
|---|---|---|
| **Crane Flat** (Big Oak Flat Rd / Tioga Rd jct) | "Gas & diesel. Gas station open year-round; 24-hour pay-at-the-pump with card." Store 8am–5pm, **store closes Oct 25** | Yosemite Guide Sep 23–Nov 24 2026 (above). cf.htm (Jun 11 2026): "A gas station is open year-round at Crane Flat." Note: travelyosemite.com's shop table already shows "Crane Flat Gas Station & More — Closed for the Season" (https://www.travelyosemite.com/things-to-do/shopping-supplies-groceries). That table looks stale or refers to the store only; the same page says "Gas available 24/7 year-round" |
| **Tuolumne Meadows** | **No gas.** "There is no gas/fuel available in Tuolumne Meadows" | https://www.nps.gov/yose/planyourvisit/tm.htm (Jul 29 2026); cf.htm |
| Groveland / Big Oak Flat | OSM lists Kwik Serv (Big Oak Flat) and Claim Jumper Outpost (Priest) as fuel | Nominatim/OSM query Sep 27 2026 (hours not verified) |
| Buck Meadows | "Buck Meadows Gas Station," Hwy 120 (OSM). Wikipedia: "Buck Meadows, the last community with traveler services before the park entrance" | Nominatim/OSM; en.wikipedia.org/wiki/California_State_Route_120 (rev Sep 7 2026) |
| **Lee Vining** | Mobil / Tioga Gas Mart (Vista Point Dr): "Hours: Everyday from 6:30am to 9:00pm" on its site. OSM also lists Chevron and Shell on Main St | https://www.whoanelliedeli.com/info (no date); Nominatim/OSM |
| June Lake | Shell on the June Lake Loop (OSM) | Nominatim/OSM |
| Sonora Pass, west side | Last reliable gas is **Cold Springs Chevron** (OSM), a few miles below Pinecrest; also Mi-Wuk/Sugarpine (Chevron, Valero). Pashnit: "Cold Springs, Walker, Bridgeport – GAS" | Nominatim/OSM; pashnit.com |
| Strawberry / Dardanelle / Kennedy Meadows | **No fuel found** in OSM or pashnit. Strawberry has "a small general store." Dardanelle Resort burned in the 2018 Donnell Fire (pashnit). Treat as **no gas** | pashnit.com |
| Sonora Pass, east side | Bridgeport (Shell ×2, Gas & Go, per OSM). Walker Country Store Gas (OSM; "no 24 hr card lock" per a search snippet) | Nominatim/OSM |

**Fuel gaps (OSRM):** Crane Flat → Lee Vining Mobil **59 mi / ~1h45**. Groveland → Lee Vining via Tioga **92 mi / ~2h40**. Buck Meadows → Crane Flat 21 mi. Cold Springs Chevron → Bridgeport via Sonora Pass **71 mi / ~1h50**. Walker → Bridgeport 31 mi.
**Advice:** eastbound, fill in Groveland or at Crane Flat. Westbound, fill in Lee Vining (Mobil) or Mammoth/June Lake. Sonora Pass: fill at Cold Springs or Sonora westbound side, or in Bridgeport eastbound side.

---

### 6. Whoa Nellie Deli and Tioga-corridor services

- **Whoa Nellie Deli / Tioga Gas Mart (Mobil), 22 Vista Point Dr, Lee Vining, 760-647-1088:**
  - Website says "Hours: Everyday from 6:30am to 9:00pm." Breakfast 6:30–10:45am, lunch and dinner 11am–9pm. "live music 2026 — Thursdays @ 6:00PM, Sundays @ 3:00PM." "Restrooms Open 24 hours." Free potable water. https://www.whoanelliedeli.com/info , /menu-1 , /amenities , /live-music-1 (no dates shown). **The site states no 2026 closing date.**
  - Mono County tourism listing: "**Open seasonally from the end of April through the first week in October.**" https://www.monocounty.org/listing/tioga-gas-mart-whoa-nellie-deli/668/. The listing record shows "updated" 2026-06-05, but the text may be older. On that basis the deli could be **closed by Oct 9–11**, and it is likely open Oct 2–4.
  - A search snippet (Tripadvisor FAQ, which returned 403 and couldn't be read) says the Gas Mart runs "from the last Saturday in April to the last Sunday in October." That's unverified, and could mean the gas station stays open after the deli closes.
  - Yelp showed "TEMP. CLOSED – Updated November 2025" (search result title only; page returned 403).
  - Facebook and Instagram couldn't be read (blocked or rate-limited).
  - **Action: call 760-647-1088 to confirm the deli's 2026 last day. Unresolved.**
- **Tuolumne Meadows (Yosemite Guide Sep 23–Nov 24 2026):**
  - "Tuolumne Meadows Visitor Center (closes Sep 27)." The NPS API shows a winter closure starting 2026-09-29.
  - "Tuolumne Meadows Wilderness Center (closes Oct 14)."
  - "**Tuolumne Meadows Store, Grill, & Lodge closed for the season**." TravelYosemite lists the Grill season as "June 13 – September 14."
  - "White Wolf Lodge/Store/Dining Room closed."
  - Big Oak Flat Information Station 8am–5pm (9am–5pm from Oct 19). NPS API: seasonal closure from 2026-10-26.
  - Guide: "There are very few or no services along Tioga Road in the fall."
  - Sources: Guide PDF above; https://developer.nps.gov/api/v1/visitorcenters?parkCode=yose (queried Sep 27 2026); https://www.travelyosemite.com/dining/ (tmdine page).
- **Bathrooms along Tioga:**
  - At opening (May 13 2026) NPS said "Vault and portable toilets will be available along Tioga Road (but not drinking water)" (tioga.htm).
  - Tenaya Lake: "Vault toilets are available at some parking areas" (tm.htm).
  - Yosemite Creek Picnic Area: "vault toilets ... but no potable water" (tm.htm).
  - Olmsted Point: the NPS page lists no toilet (olmsted-point.htm). Whether it has a vault toilet is **not verified**.
  - Tuolumne Meadows VC restrooms: the building is closed after Sep 27. Whether any exterior or vault toilets stay open is **not verified**.
  - Crane Flat gas station has restrooms (background, not verified; the store closes Oct 25).
  - Whoa Nellie/Mobil restrooms are "Open 24 hours" (Mobil site).
  - **Plan on no drinking water along Tioga. Bring water and toilet paper.**

---

### 7. Kid logistics on Tioga Road (Lee Vining → Crane Flat order)

| Stop | What | Source |
|---|---|---|
| **Tioga Gas Mart / Mobil (Lee Vining)** | Last full bathroom and water before the climb (24-hr restrooms) | Mobil amenities page |
| **Lee Vining grade (CA-120 E)** | "dropping more than 3,000 feet over approximately 12 miles" through Lee Vining Canyon, a steep drop-off road. **Hardest car-sickness and brakes section.** Use low gear descending | en.wikipedia.org/wiki/California_State_Route_120 (rev Sep 7 2026). Grade is about 6% sustained (background, not verified) |
| Ellery Lake / Tioga Lake | Roadside lakes just below and above the pass (Ellery is 10 mi / 16 min from Lee Vining); quick pull-outs | OSRM; details (background, not verified) |
| Tioga Pass | 9,945 ft, "the highest elevation highway pass in California." Gaylor Lakes trail from the entrance is "Short but steep" (2.6 mi RT, 500 ft), probably too much at altitude for 6-year-olds | en.wikipedia.org/wiki/Tioga_Pass (rev Aug 26 2026); https://www.nps.gov/yose/planyourvisit/tmhikes.htm (src upd Oct 15 2024) |
| **Tuolumne Meadows: Parsons Lodge & Soda Springs** | "1.4 mi round-trip, mostly flat, unpaved ... to cold, bubbling Soda Springs." **Best kid walk.** Trailhead at the Lembert Dome parking or the VC | tmhikes.htm |
| Pothole Dome | "1 mi round-trip, 200 ft ... scramble up the dome for stunning meadow views." Good kid scramble | tmhikes.htm |
| **Tenaya Lake** | Beaches, picnic tables, vault toilets at some lots | tm.htm |
| **Olmsted Point** | Views from the parking area, or "a short, hilly 0.25-mile walk (one-way)" to the point; glacial erratics; paved accessible viewing area; bronze tactile model | olmsted-point.htm (Sep 2 2025) |
| Tuolumne Grove (near Crane Flat) | 2 mi RT with a walk-through tunnel tree. The return climb is uphill (background) | Guide 51-8 |
| Crane Flat | Gas 24/7; store until Oct 25 | Guide 51-8 |

- **Car-sickness notes (background, not verified):**
  - Worst stretches: the Lee Vining grade (steep and exposed), the curvy section from Olmsted Point west to White Wolf and Crane Flat, and New Priest Grade ("over one hundred curves," Wikipedia).
  - The Tuolumne–Tenaya–Olmsted section is relatively gentle.
  - Tioga Rd is 39 mi Crane Flat → Tuolumne (Guide) and 45.5 mi Crane Flat → Tioga Pass (tioga.htm).
  - For motion sickness, Tioga (6,200–10,000 ft, long gentle curves) is generally better than Sonora Pass (26%) or Ebbetts (one-lane).
- **Altitude:** Tioga Pass is 9,945 ft and Tuolumne about 8,600 ft. Keep hikes short and hydrate (background).

---

### Could not verify

1. **Whoa Nellie Deli's 2026 closing date.** Its own site gives no end date. Mono County says "first week in October"; an unreadable third-party snippet says "last Sunday in October." Call 760-647-1088.
2. Exactly which toilets on Tioga Rd (Olmsted Pt, Tuolumne VC exterior, White Wolf, Crane Flat) stay open after the Sep 27 VC closure.
3. Whether Tuolumne's 10-minute road-work delays and the Big Oak Flat weekday delays will still apply Oct 2–18. NPS gives no end date.
4. Caltrans lane-closure advisories for the weeks of Oct 5 and Oct 12, not yet published. The D9 and D10 advisories found cover only Sep 28–Oct 2.
5. Gas at Kennedy Meadows, Dardanelle and Strawberry on Sonora Pass (none found; assume none). Hours for the Groveland and Buck Meadows stations.
6. Real-traffic drive times: Google and Apple Maps weren't queried (no API). All "realistic" times are my estimates on top of OSRM free-flow times.
7. The Tioga closure / chain-control probabilities are estimates. NPS doesn't publish temporary-closure history, so the October storm list may be incomplete.
8. The US-395 southbound closure at Independence: Caltrans road info says "closed to southbound traffic ... use an alternate route," while the D9 advisory says "traffic has shifted to the new southbound lanes." Unresolved. It only matters for the southern fallbacks.
9. Lee Vining grade percentage, Priest Grade and Sonora Pass east-side specifics beyond the cited quotes, gravel on the Hot Creek / North Lake roads, and CA-88 being kept open all winter are all background, not verified.
10. The CR bill number (H.R. 6500 per NAGGL vs H.R. 9770 per a search snippet). congress.gov returned 403.

---

## Lodging, events, and crowds

Researched: 2026-09-27. Every source below was accessed on 2026-09-27 unless noted. Numbers in [brackets] refer to the source list at the bottom.
Party: 2 adults and 3 kids (ages 6–7), so every "5-guest" search below used 2 adults plus 3 children with those ages.
Weekends checked: **A = Fri Oct 2 to Sun Oct 4**, **B = Fri Oct 9 to Sun Oct 11** (the target; a holiday weekend because Mon Oct 12 is Indigenous Peoples' Day/Columbus Day), and **C = Fri Oct 16 to Sun Oct 18**.
Planning only. Nothing was booked, no account was created and no form was submitted.

---

### 0. Bottom line

1. **It is not too late to book 2 weeks out for Mammoth Lakes.** The Oct 9–11 weekend still has plenty of options at normal prices. For 5 guests, Mammoth hotel and condo prices on Oct 9–11 are within about 5% of Oct 2–4 and about 7–10% above Oct 16–18 (Google Hotels, section 5). Airbnb Mammoth medians are about $600 for 2 nights on all three weekends.
2. **June Lake and Lee Vining are tight on Oct 9–11.** That weekend combines the holiday with June Lake's **Leaves in the Loop** festival (Oct 9–11) and Bridgeport's first **Oktoberfest** (Sat Oct 10).
   - Google shows 1 June Lake-area property priced for 5 guests on Oct 9–11, compared with 3 on Oct 2–4 and 4 on Oct 16–18.
   - Airbnb shows 3 June Lake homes for Oct 9–11 (cheapest $906), compared with 10 homes on Oct 2–4 (from $670) and 7 on Oct 16–18.
   - Double Eagle, Lake View Lodge and June Lake Villager are priced for 5 guests on Oct 2 and Oct 16 but not on Oct 9.
3. **Oct 16–18 is the easiest weekend.** Across the region, Hotwire shows about 176 properties available for 5 guests, compared with about 147 for Oct 9–11 and about 150 for Oct 2–4. It is also the only weekend where Tamarack Lodge (cabins) showed a 5-guest price.
4. **Hotwire Hot Rate (the opaque deals) could not be pulled live.** Hotwire's *retail* hotel search (vacation.hotwire.com) **did** return live prices for 5 guests, and those are used throughout. Section 6 explains what was tried.
5. **Recommended picks (details in section 11):**
   - ~$200–300/night: an **Airbnb 2-bedroom Mammoth condo with fireplace and kitchen**, e.g. $468 for 2 nights before tax, live for Oct 9–11. Hotel alternative: **Austria Hof Lodge**, $290/nt.
   - ~$300–450/night: **Juniper Springs Resort**. It is a condo with a kitchen and gas fireplace, with pools and a children's club, and you can cancel free until 2 days before arrival. Live price $339/nt for Oct 9–11.
   - $450+/night: a **Tamarack Lodge cabin** with gas fireplace or wood stove, on Twin Lakes. It showed a 5-guest price only for Oct 16–18 ($594/nt). For Oct 9–11, call **Convict Lake Resort** about a family cabin; the published fall Thu–Sun rate is $419–439 plus 15% tax.

---

### 1. Method and how to read the numbers

- **Google Hotels (live).** I fetched google.com/travel/search result pages with the dates and guests (2 adults plus children aged 6–7) built into the URL's `ts` parameter. Example URL for Mammoth, Oct 9–11, 5 guests: https://www.google.com/travel/search?q=hotels%20in%20Mammoth%20Lakes%20CA&qs=CAE&ts=CAESHAoCCAMKAggDCgQIAhAHCgQIAhAGCgQIAhAGEAAaHBIaEhQKBwjqDxAKGAkSBwjqDxAKGAsYAjICEAAqCQoFOgNVU0QaAA&hl=en-US&gl=us&curr=USD [1]
  - The page headers confirmed "Oct 9 – 11". Changing the kids changed the results a lot. For example, Mammoth Mountain Inn is $124/nt for 2 adults but $382/nt for 2 adults plus 6 kids. So the occupancy filter is working.
  - **"$X/nt"** is Google's nightly price *before* tax. **"$Y total"** is the 2-night total *with taxes and fees*.
  - **"No price shown"** means Google's partners had no single unit sleeping 5 for those dates. That can mean sold out, or it can mean the property has no 5-person room type, which is common for Bishop motels. Only the first page (about 17 properties) is visible without JavaScript.
  - A property called "Ventura Grand Inn" kept appearing in the Mammoth and June Lake results. It looks like a geocoding error, so I left it out of the counts.
- **Hotwire retail (live):** vacation.hotwire.com/Hotel-Search?destination=…&startDate=…&endDate=…&adults=2&children=1_7,1_6,1_6 [2]. It returns the property count and the top 3 results for each sort order.
- **Airbnb (live):** airbnb.com/s/…/homes?checkin=…&checkout=…&adults=2&children=3 [3]. Prices shown are Airbnb's "total before taxes", so fees are included. The page reports this as, e.g., "$585.00 total before taxes".
- **Drive times** are free-flow estimates from the OSRM router, using OpenStreetMap geocodes [4]. Real mountain-road times will be somewhat longer. **Elevations** come from the USGS Elevation Point Query Service at the town geocode [5].

---

### 2. Events and crowds that weekend (verified)

| Event | 2026 date | Where | Source |
|---|---|---|---|
| **Leaves in the Loop** (fall festival: Paint N Sip, chili cookoff, classic car show, pumpkin patch, Mono Arts Council fall art, guided history walk, photo contest) | **Oct 9–11, 2026** | Gull Lake Park, June Lake | [6] [7] [8] |
| **1st Annual Bridgeport Oktoberfest** (live music, craft beer, pretzel toss, yard games "for all ages") | **Sat Oct 10, 2026** | Sportsmen's Bar & Restaurant backyard, Bridgeport | [8] [9] [10] |
| Ghost investigation, Benton Hot Springs | Oct 10 | Benton | [8] |
| **Lone Pine Film Festival** | **Oct 8–11, 2026** | Lone Pine (about 1 hr south of Bishop) | [11] (Lone Pine Chamber page returned empty) |
| Mammoth "OkTUBERfest" | Sep 26 and Oct 3 (not Oct 10) | Mammoth | [8] |
| Morrison's Bonus Derby Weekend | Oct 23–25 | Convict Lake | [8] |
| Indigenous Peoples' Day / Columbus Day | Mon Oct 12 (federal holiday) | — | (calendar) |

- **Bridgeport Oktoberfest date conflict.** A web-search summary claimed Oct 17. Both official pages I fetched (Visit Mono County fall events [8] and the Mono County newsflash dated Sep 2, 2026 [9]) and Eastern Sierra Now [10] say **Oct 10**. Treat Oct 10 as correct.
- **Crowd impact.** Leaves in the Loop is at Gull Lake Park in the middle of June Lake village. Expect a busy June Lake Loop on Sat and Sun, and Gull Lake Lodge and June Lake Motel sit about a block from the festival (walkable). Convict Lake is a 10-minute drive from Mammoth, so expect weekend parking pressure; its big derby is Oct 23–25, which is not our weekend.
- **Yosemite / Tioga.** As of today, NPS lists **Tioga Road: Open**. It notes delays of 10 minutes in Tuolumne Meadows and 15 minutes Mon–Thu from Olmsted Point to Tioga Pass. **Glacier Point Road is "Temporarily closed due to smoky conditions and to allow firefighting operations"** [12], so there is an active fire in Yosemite. Watch the smoke and air quality forecast. Yosemite is **not** using timed-entry reservations in 2026 [13]. Gull Lake Lodge notes Tioga "closes seasonally, roughly from October or November" [14].

---

### 3. Lodging taxes (verified)

| Area | Transient occupancy tax (TOT) | Source |
|---|---|---|
| Town of Mammoth Lakes | **15%** ("Transient Occupancy Tax, or TOT, is a 15% tax"). The old 13% figure is out of date. There is also a **1% TBID** (tourism district) assessment, per a search-result summary of the town and chamber pages. | [15] [16] |
| Unincorporated Mono County (June Lake, Lee Vining, Bridgeport, Convict Lake) | **15%**, up from 12%, effective Dec 13, 2024. Convict Lake's policy page also says "applicable 15% Mono County TOT". | [17] [18] |
| City of Bishop | **12%** | [19] |

---

### 4. Base-town comparison

#### Drive times (OSRM free-flow estimate; add 10–25% for real mountain driving and stops) [4]

| Base | Elev. [5] | Lake Sabrina (Bishop Creek) | Rock Creek Lake | McGee Creek TH | Convict Lake | Silver Lake (June Lake Loop) | Lundy Lake | Conway Summit | Virginia Lakes | Tioga Pass | Tuolumne Mdws |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Mammoth Lakes** | 7,856 ft | 73 min | 44 | 16 | **18** | 36 | 57 | 52 | 67 | 54 | 71 |
| **June Lake** | 7,609 ft | 93 | 64 | 36 | 38 | **19** | 42 | 38 | 53 | 40 | 57 |
| **Lee Vining** | 6,982 ft | 99 | 70 | 42 | 44 | 24 | **21** | **16** | 32 | **21** | 39 |
| **Bishop** | 4,145 ft | **31** | 52 | 39 | 50 | 78 | 98 | 94 | 109 | 96 | 113 |
| **Bridgeport** | 6,459 ft | 128 | 100 | 71 | 74 | 54 | 33 | **16** | 31 | 51 | 69 |

#### Summary

| Base | Pros for this family | Cons | Lodging supply (Google result count [1]) |
|---|---|---|---|
| **Mammoth Lakes** | Most central, about 55 min or less to everything except Bishop Creek. Largest supply of condos with kitchens and gas fireplaces (Village Lodge, Juniper Springs [20][21]). Walkable dining and shops at The Village [20]. Kid amenities: pools, hot tubs, game rooms, Juniper's children's club [2][20][21]. Best availability on the holiday weekend. | Least "small mountain town" feel. Town TOT 15% + 1% TBID. | 105 properties |
| **June Lake** | Most charming. The festival is in town that weekend, and Gull Lake Lodge and June Lake Motel are walkable to restaurants, the brewery, the general store and Gull Lake [14][22]. About 20 min to Silver Lake and about 40 min to Tioga, Lundy and Conway. | **Tightest availability for Oct 9–11** (section 5). Few 5-person units. Farther from Bishop Creek (about 1.5 hr). | 99 (includes Mammoth spillover) |
| **Lee Vining** | Closest to Tioga Pass (21 min), Lundy (21), Conway Summit (16) and Virginia Lakes (32). Lake View Lodge is walkable to restaurants, grocery and the Mono Lake Visitor Center, and has The Basin Cafe on site [23]. | Very small, with few rooms for 5. No 5-guest prices on Oct 9–11. | 37 |
| **Bishop** | Best for Bishop Creek (31 min to Lake Sabrina) and Rock Creek. Most motel and chain supply for 2 adults. Lowest elevation, so warmest. Wayfinder Bishop (the former Creekside Inn) has a pool, hot tub and creekside fire pits [24]. | 1.5–2 hr to Tioga, Lundy, Virginia Lakes and June Lake. Rooms for 5 in one unit are scarce (mostly 2-queen rooms for 4), so you may need 2 rooms. | 39 |
| **Bridgeport** (brief) | Oktoberfest on Sat Oct 10 [9]. 16 min to Conway Summit and 31 min to Virginia Lakes. Bridgeport Inn is priced for 5 on all weekends ($169–189/nt) [1]. | Far from everything south of Mammoth (about 2 hr to Bishop Creek). Small town. | 24 |

**Base recommendation.** For a 2-night trip that includes Tioga, Lundy/Conway/Virginia Lakes *and* June Lake, stay in Mammoth (best availability and kitchens) or, if you can get a unit, June Lake. Only choose Bishop if Bishop Creek or Rock Creek is the main focus.

---

### 5. How booked up is it? Evidence by weekend

#### 5a. Google Hotels: properties priced for **5 guests** (first page, "Ventura Grand Inn" anomaly removed) [1]

| Town search | Oct 2–4 | **Oct 9–11** | Oct 16–18 |
|---|---|---|---|
| Mammoth Lakes (17 cards) | 6 priced | **5 priced** | 8 priced |
| June Lake (17 cards) | 3 | **1** | 4 |
| Lee Vining (18) | 2 | **0** | 1 |
| Bishop (18) | 0 | 1 | 2 |
| Bridgeport (13) | 2 | 1 | 2 |

Baseline for **2 adults** (a general "is anything open" check), priced out of the first page: Mammoth 17/17 on all three weekends. June Lake 10/18, 9/18, 11/18. Bishop 11/18, 16/18, 16/18. Lee Vining 7/18, 6/18, 8/18. So for couples plenty is open. **The real constraint is units that sleep 5.**

#### 5b. Hotwire retail: region-wide available properties (Eastern Sierra, "only show available") [2]

| | Oct 2–4 | **Oct 9–11** | Oct 16–18 |
|---|---|---|---|
| 5 guests (2 adults + 3 kids) | ~150 | **~147** | **~176** |
| 2 adults | ~203 | ~218 | ~250 |

The Mammoth, June Lake and Bishop searches all returned about the same region-wide count, so these are regional numbers.

#### 5c. Airbnb: 2-night totals before taxes for 5 guests (first page) [3]

| | Oct 2–4 | **Oct 9–11** | Oct 16–18 |
|---|---|---|---|
| Mammoth: exact-date listings priced / median / min | 20 / $598 / $457 | 21 / **$616** / $425 | 20 / $594 / $429 |
| June Lake search: homes actually *in June Lake* on page 1 | 10 (from $670) | **3 (from $906)** | 7 (from $906) |

#### 5d. Price comparison for identical properties (5 guests; Google nightly before tax, then 2-night total with tax and fees) [1]

| Property | Oct 2–4 | **Oct 9–11** | Oct 16–18 |
|---|---|---|---|
| The Village Lodge (Mammoth) | $419 / $990 | **$402 / $944** | $374 / $879 |
| Juniper Springs Resort | $357 / $828 | **$339 / $786** | $314 / $728 |
| Mammoth Mountain Inn | $387 / $898 | **$362 / $841** | $360 / $836 |
| Austria Hof Lodge | $273 / $641 | **$290 / $680** | $255 / $510 |
| Westin Monache | $465 / $1,080 | **no 5-guest price** | $438 / $1,017 |
| Tamarack Lodge & Resort | no price | **no price** | $594 / $1,380 |
| Mammoth Creek Inn | $288 / $677 | no price | $274 / $636 |
| The Mammoth Inn | no price | **$327 / $760** | no price |
| Holiday Haus | no price | no price | $234 / $543 |
| Double Eagle Resort & Spa (June Lake) | $399 / $894 | **no price** | $399 / $894 |
| June Lake Villager | $250 / $561 | **no price** | $250 / $561 |
| Whispering Pines Motel (June Lake) | $395 / $905 | $395 / $905 | $395 / $905 |
| Lake View Lodge (Lee Vining) | $319 / $756 | **no price** | $319 / $756 |
| Yosemite Gateway Motel (Lee Vining) | $234 / $535 | no price | no price |
| Holiday Inn Express Bishop | no price | no price | $313 / $714 |
| El Rancho Motel (Bishop) | no price | $192 / $443 | $309 / $705 |
| Bridgeport Inn | $169 / $389 | $189 / $435 | $169 / $389 |

**Answer to "is it too late 2 weeks out?"**
- **Mammoth: no.** Several good 5-person condos and hotels are still bookable for Oct 9–11 at prices at or below Oct 2–4. Juniper Springs, Village Lodge and Mammoth Mountain Inn all have free cancellation up to 2 days before arrival in the "summer" season, which runs through Nov 19 [20]. So booking now and watching prices carries little risk.
- **June Lake and Lee Vining: yes, largely, for Oct 9–11.** Expect sold-out or premium pricing. Small independents that don't appear on booking sites (Gull Lake Lodge, Lake Front Cabins, Big Rock, June Lake Pines) never show prices on Google for any weekend, so the only way to check them is to call.
- **Oct 16–18 is the easiest and cheapest weekend.** It has about 20% more region-wide options and prices about 5–10% lower. The trade-off is that some high-elevation creek resorts close for the season in mid-to-late October (section 7).

---

### 6. Hotwire

**What worked (live):** Hotwire's retail search at `vacation.hotwire.com/Hotel-Search` is Expedia-powered and returns real prices. It returned about 147 properties for Oct 9–11 with 2 adults and 3 kids [2]. Live 2-night totals as displayed:

| Weekend | Hotwire retail results for 5 guests (2-night total as displayed) |
|---|---|
| Oct 2–4 | Juniper Springs $712 · Village Lodge $844 · Outbound Mammoth $1,055 · Double Eagle $780 · June Lake Villager $710 · Austria Hof $590 · Discovery 4 condo $643 · Yosemite Gateway Motel $535 · Super 8 Bishop $440 · Trees Motel Bishop $499 · Motel 6 Bishop $502 |
| **Oct 9–11** | **Juniper Springs $676** (page text: "Member Price available… previous price $785", which matches Google's $786, so the $676 probably requires a free Hotwire sign-in; I did not sign in) · **Village Lodge $810** (previous $943) · Outbound Mammoth $1,020 · Austria Hof $626 · "Steps to Slopes" 1BR condo (sleeps 5) $519 · "Mammoth Lakes Townhome" 2BR (sleeps 6) $615 · RedAwning Lakeview Lodge #2 2BR $973 · Mammoth Green 102 2BR $989 · Super 8 Bishop $373 · Trees Motel $454 · Motel 6 Bishop $485 |
| Oct 16–18 | Juniper Springs $627 · Village Lodge $754 · Outbound $939 · Holiday Haus Motel $520 · Eagle Summit Collection $572 · June Lake Villager $596 · Wayfinder Bishop $968 · Holiday Inn Express Bishop $695 · Super 8 Bishop $339 |

**What did not work: live Hot Rate (opaque) prices.**
- `www.hotwire.com/hotels/search?...` returns only a 7 KB JavaScript shell.
- That page calls a Hotwire API with a request signature generated by an obfuscated function in the page's JavaScript. An unsigned request to `api.hotwire.com/search/hotel/all` returned HTTP 403 "Developer Inactive".
- I did **not** try to reverse-engineer the request signing. **No live Hot Rate prices were obtained.**
- To see Hot Rates, the family has to run the search themselves in a browser at hotwire.com/hotels.

**Hotwire star classes for known properties, as shown live on Hotwire's own pages.** These let you guess which property a Hot Rate probably is (inferred mapping, not a decode):

| Hotwire class | Properties Hotwire lists at that class (source) | Kitchen / fireplace? | What a matching Hot Rate probably is |
|---|---|---|---|
| **4★** | Westin Monache, Limelight Mammoth, The Sierra House (aparthotel), Village 2230 White Mountain Lodge, "Juniper Springs Lodge by Mammoth Five Star" (Hotwire 4-star page [25]); Limelight showed class 4 in retail results [2] | Westin: condo-style suites with kitchens (not verified today). Limelight: hotel. | A 4★ Mammoth Hot Rate is likely Westin or Limelight. Limelight retail was $1,840/nt for 5 guests on Oct 9, so a 4★ Hot Rate for 5 people may not exist. |
| **3.5★** | Juniper Springs Resort, The Village Lodge, Outbound Mammoth; Double Eagle (June Lake); Wayfinder Bishop (retail class labels [2]). BetterBidding: a 2018 win reported **Sierra Nevada Resort & Spa as 3.5★** [26]. | Juniper and Village Lodge: full kitchen + gas fireplace [20][21] | A 3.5★ "Mammoth Lakes" Hot Rate with kitchen is most likely **Juniper Springs or Village Lodge** (Grand Sierra Lodge is part of the same Village complex). Otherwise Outbound or Sierra Nevada Resort. |
| **3★** | Austria Hof Lodge, Discovery 4, Eagle Summit Collection, Yosemite Westgate Lodge (Groveland) [2]. Mammoth Mountain Inn is 3★ on Expedia/Google [1]. | Austria Hof: "kitchen in some rooms" [1] | Likely Austria Hof or Mammoth Mountain Inn |
| **2.5★** | Holiday Haus, June Lake Villager, Holiday Inn Express Bishop, Best Western Plus Rama (Oakdale) [2] | — | — |
| **2★** | Motel 6 Mammoth, Super 8 Bishop, Trees Motel, Motel 6 Bishop, Jamestown Railtown Motel [2] | — | — |

- BetterBidding's Hotwire hotel list for Mammoth Lakes exists [27], but the list itself is hidden behind a Hotwire-link step and did not render. So there is **no public decode verified today**.
- Hotwire's area names for Mammoth are Expedia-style landmark areas ("Mammoth Village", "Downtown Mammoth Lakes", Canyon/Eagle/Village Gondola lifts, Convict Lake, Twin Lakes, McGee Creek, Lake Mary) [2][28]. The old Hot Rate neighborhood polygons were not visible.
- Hotwire's guide-page prices are the "Lowest nightly price found within the past 24 hours based on a 1 night stay for 2 adults" [25]. They are not valid for 5 guests.
- **Practical Hotwire tip:** Juniper and Village Lodge book directly through Mammoth Lodging Collection with free cancellation up to 2 days out [20]. A Hot Rate is prepaid and generally non-refundable (not verified today). So a 3.5★ Hot Rate is only worth it if it beats about $339/nt by a real margin **and** Hotwire shows kitchen and fireplace in the amenities.

---

### 7. Named properties: details

Prices are Google nightly before tax, then 2-night total with tax, for 5 guests, unless noted [1]. "Cozy" is my rating out of 5, based on the sourced features (fireplace, views, lodge feel, walkable coffee).

| Property | Oct 2–4 | **Oct 9–11** | Oct 16–18 | Sleeping for 5 | Kitchen | Fireplace | Elev. | Cancellation | Season | Cozy |
|---|---|---|---|---|---|---|---|---|---|---|
| **Juniper Springs Resort** (Mammoth, slopeside at Eagle Lodge) [21] | $357 | **$339 / $786** (Hotwire $676 member) | $314 | Condos and townhouses. Photos show a "King bedroom" and "Double queen bedroom" [21]. Assume 1BR+sofa or 2BR for 5 (not verified). | Full kitchen | **Gas fireplace in all units** ("turned off in summer months but may be lit upon request") | ~7,900–8,000 ft | Free cancel or change up to **2 full days** before arrival in summer season (Apr 20–Nov 19, 2026) [20] | Year-round | 4 (fireplace, balcony, coffee shop on site) |
| **The Village Lodge** (Mammoth Village) [20] | $419 | **$402 / $944** (Hotwire $810) | $374 | Studios to 3BR condos | Kitchen | **Gas fireplace** | ~8,000 ft | Same as Juniper [20] | Year-round | 3.5–4 (fireplace, **walk to Village restaurants and coffee**) |
| **Mammoth Mountain Inn** (Main Lodge) [29] | $387 | **$362 / $841** | $360 | Hotel rooms and suites (Pinnacle Suite sleeps 8) | No (restaurant and bar on site) | Lobby fireplace | ~8,900 ft (Main Lodge; not verified today) | Same (2 days) [29] | Year-round | 3 |
| **Westin Monache** [1] | $465 | **no 5-guest price** | $438 | Suites (not verified) | (not verified) | (not verified) | ~8,000 ft | Marriott policy (not verified) | Year-round | 3.5 |
| **Tamarack Lodge & Resort** (Twin Lakes, Lakes Basin) [30] | no price | **no price** | **$594 / $1,380** | Cabins, e.g. "Two-Bedroom Deluxe Cabin 30" | Kitchen (oven, stove, fridge; dishwasher in some) | **Gas fireplace; wood-burning stove in some units**; 1924 stone fireplace in the lodge | ~8,600 ft (not verified) | Mammoth Lodging Collection 2-day rule (probably; not verified for Tamarack) | Year-round | **5** (lakeside, historic lodge, restaurant, continental breakfast in lodge) |
| **Sierra Nevada Resort** (Mammoth) | not on page 1 | — | — | (not verified) | — | — | — | — | — | — |
| **Double Eagle Resort & Spa** (June Lake Loop, base of Carson Peak) [31] | $399 / $894 | **no price** | $399 / $894 | **2BR cabins sleep 6**: queen or king, 2 twins or queen, and a queen sofa bed (per search snippets of doubleeagle.com; the site blocked direct fetch) | Full kitchen | **Wood-burning fireplace** | ~7,600 ft | (not verified) | Year-round | **5** (indoor pool, spa, restaurant) |
| **Gull Lake Lodge** (June Lake village) [14][32] | Airbnb suite #2 $213 / 1 night (Oct 2 search) | not seen on Oct 9 Airbnb search | ? | **Double suites #2, #5, #6, #9: 2 full beds + sofabed, "4–6 guests"**; 2BR cabin #16 sleeps 4–7 | **Full kitchen** in every unit | None listed | 7,609 ft | (not verified; see FAQ [14]) | Year-round | 3.5 (walk to festival, coffee and brewery) |
| **June Lake Motel** (village) [22] | 5-guest: no price | no price | no price | Rooms for 1–4 people; one-bedroom suite (capacity not stated) | Kitchenette | No | 7,609 ft | (not verified) | Year-round | 3 |
| **Lake Front Cabins** (June Lake) | never priced on Google | — | — | — | — | — | — | — | Site had an SSL certificate error | — |
| **Big Rock Resort** (June Lake, lakefront cabins) [33] | never priced | — | — | — | — | — | — | — | Open until the **last weekend in October** | — |
| **Lake View Lodge** (Lee Vining; rooms, cabins, cottages) [23] | $319 / $756 | **no price** | $319 / $756 | (not verified) | Some units (not verified) | — | 6,982 ft | See lodge policies (not verified) | **Open year-round** | 3 (Basin Cafe on site, walk to town) |
| **Murphey's Motel** (Lee Vining) | no 5-guest price on any weekend (2 adults $185/nt Oct 9–11) | — | — | Probably max 4 per room | — | — | — | — | — | 2 |
| **Wayfinder Bishop** (formerly Creekside Inn) [24] | no 5-guest price | no | no (Hotwire $968 / 2 nights Oct 16) | 87 rooms. A room for 5 is not offered on Google. | No | Creekside fire pits | 4,145 ft | — | Year-round | 3 |
| **Holiday Inn Express Bishop** | no | no | $313 / $714 (Hotwire $695) | Suite (not verified) | — | — | 4,145 ft | — | — | 2 |
| Hampton Inn Bishop | Not in Google's Bishop results. Probably doesn't exist; check before relying on it. | | | | | | | | | |
| **Cardinal Village Resort** (Aspendell, Bishop Creek) [34] | booking engine is JS-only; not fetched | — | — | 14 cabins (sizes not fetched) | Rustic cabins | Firepit outside | ~8,400 ft (Aspendell; not verified) | Half deposit; **$50 fee; full forfeit within 30 days** unless re-rented [34] | Regular season "end of April–October"; "OPEN for the 2026 season" | 4 (café, coffee shop, creek views) |
| **Parchers Resort** (South Fork Bishop Creek) [35] | — | — | — | Family cabin "Sleeps 4–6", **$364/nt, 3-night minimum** | Kitchen (most cabins) | Outdoor fire pit | **9,260 ft** | **30 days' notice** for refund, 4% charge | Summer and fall. **3-night minimum on all weekends after June 15**, so a 2-night weekend doesn't work. Closing date not published. | 4 |
| **Bishop Creek Lodge** [36] | — | — | — | Cabins #5/#8 sleep 5 (queen, bunk, twin), **$265–275**; Rainbow and Golden sleep 8, $340–350 | (not verified) | Outdoor fire pit | ~8,300 ft (not verified) | — | Open **last Sat of April to last Sat of October**. **3-night minimum on ALL holiday weekends**, which affects Oct 9–11. | 4 |
| **Rock Creek Lodge** [37] | site bot-protected | — | — | Summer cabins | — | — | **9,373 ft** | — | "During the summer" (exact close date not found) | — |
| **Rock Creek Lakes Resort** [38] | call only | — | — | 11 cabins, 1–3BR | Kitchens in all | — | ~9,700 ft | — | **Memorial Day to "the middle of October"**, so it may be closed or closing by Oct 9–18 | 4 |
| **Convict Lake Resort** (10 min from Mammoth) [18][39] | Mews booking engine; availability not fetchable | — | — | **Family cabins "sleeps up to 6"** (Native, Cottonwood); **Bishop #21**: queen, twin bunk and queen sofa sleeper, max 6 | **Full kitchens in all cabins** | **Bishop #21 lists a fireplace upgrade**; some cabins have jetted tubs, steam showers or outdoor hot tubs | 7,588 ft | **Cabins: 50% charge if cancelled 15–45 days out; 100% within 15 days** (minus re-rental). **Pay 100% at booking** if within 14 days. | Year-round. Columbus Day is **not** in their holiday minimum-stay list. | **4.5** (aspens, lake, fine-dining restaurant on site) |

**Convict Lake published fall rates** (per night, before 15% TOT) [39]:
- Family cabins sleeping 6: Mon–Wed $339, **Thu–Sun $419**.
- Bishop #21: $359 / **$439**.
- Studio / 1BR sleeping 4: $339 / $379.
- The home page advertises "Mid-Week Stay and Dine Packages Starting at $269 Per Night, Plus Tax, Two Night Minimum" [40].
- So a weekend family cabin is about **$482–505/nt with tax**.

---

### 8. Airbnb / VRBO

- **Airbnb was fetchable (live).**
- **VRBO was not.** VRBO search returned **HTTP 429** (blocked). Hotwire retail includes some VRBO/Expedia vacation rentals (e.g., RedAwning condos), shown in section 6.

**Representative Mammoth listings, live for Oct 9–11, 5 guests.** Totals are before 15% TOT and 1% TBID [3][41][42][43]:

| Listing | 2-night total before tax | About $/nt with tax | Beds | Fireplace | Kitchen | Extras | Rating | Cancellation |
|---|---|---|---|---|---|---|---|---|
| "Fully Upgraded Getaway 2bdrm/2 full bath" (condo) — airbnb.com/rooms/35736244 | **$468** | ~$270 | Bedroom 1: queen + bunk. Bedroom 2: king. Living room: sofa bed. | **Yes (gas/electric)** | Full kitchen | Hot tub and sauna | 4.88 (105) | Host's text: full refund only if cancelled within 48 hr of booking *and* ≥14 days before check-in; **50% refund if cancelled ≥7 days before**; none within 7 days |
| "First floor condo walking distance to downtown!" — airbnb.com/rooms/998507073427024743 | **$585** (was $685) | ~$340 | Bedroom 1: king + single. Bedroom 2: queen + bunk. | **Yes (pellet stove)** | Full kitchen, high chair, kids' dinnerware | Pool, hot tub, pack-n-play, board games, kids' toys, step-free | 4.83 (141) | Not captured (JS picker) |
| "Extra Large 2BR ☆Village Grand Sierra Lodge" — airbnb.com/rooms/19102894 | **$670** | ~$390 | King, queen, living room with 2 singles + sofa bed | **Yes (gas)** | Kitchen | Pool, hot tub, washer/dryer, walk to the Village | **4.97 (314)** | "Strict". No refunds for weather or early departure. |

- Other exact-date Mammoth 2BR listings on Oct 9–11 ranged from **$425 to $976** for 2 nights (median $616).
- **June Lake on Oct 9–11 had only 3 in-town listings:** Interlaken 15 at $906, Interlaken #20 3BR at $1,628, and Yosemite Gateway Chalet at $1,829 [3].
- Property-manager sites (Mammoth Reservation Bureau, 101 Great Escapes, etc.) were **not checked**. The live Airbnb data above was used for the typical-price question instead.

---

### 9. Scenario B: foothill night, Fri Oct 9 (1 night, 5 guests)

Google nightly before tax / 1-night total with tax [1]; Hotwire 1-night total [2].

| Property | Town | Oct 2 | **Oct 9** | Oct 16 | Notes |
|---|---|---|---|---|---|
| Best Western Plus Sonora Oaks | Sonora | $290 / $326 | **$263 / $296** | $246 / $277 | Google 4.2 (1.1K reviews) |
| The Sonora Inn (Hotwire: "Historic Sonora Inn", 3.5★) | Sonora | no price | **$244 / $268** (Hotwire $268) | $235 / $264 | Historic downtown Sonora |
| Jamestown Railtown Motel | Jamestown | — | Hotwire **$157** | — | 2★ |
| Best Western Plus Rama Inn & Suites | Oakdale | $202 / $223 | **$173 / $191** (Hotwire $181) | $168 / $185 | Cheapest decent option. Farthest from the pass. |
| Holiday Inn Express Oakdale | Oakdale | no 5-guest price | no | no | Probably max 4 per room |
| Yosemite Westgate Lodge | Buck Meadows (Groveland area) | $314 / $361 | **$314 / $361** (Hotwire $326) | — | Closest non-luxury option to the Big Oak Flat entrance |
| **Evergreen Lodge** | near Hetch Hetchy | $736 / $825 | **$736 / $825** (Hotwire $959) | $781 / $877 | Cabins |
| **Rush Creek Lodge & Spa** | Hwy 120, near the Big Oak Flat entrance | $921 / $1,034 | **no 5-guest price (probably sold out for 5)** | $1,020 / $1,146 | |
| Groveland Hotel, Hotel Charlotte | Groveland | no price | **no price** | no price | Probably no 5-person rooms. Call to ask about 2 rooms. |

- Hotwire counts only **14 available properties** for 5 guests in the Sonora and Groveland areas on Oct 9 [2].
- **Pick for scenario B:** The Sonora Inn or BW Plus Sonora Oaks, about $270–300 all-in. If cost matters most, BW Plus Rama in Oakdale at $191.

---

### 10. Sanity check: a closer region, Hope Valley / Markleeville (CA-88)

- **Drive time:** about 4 hr / 193 mi from San Francisco, compared with about 6 hr 15 min to Mammoth over Tioga (OSRM free-flow [4]).
- **Sorensen's Resort is now "Desolation Hotel Hope Valley"** (rebranded in 2023). It has 27 restored cabins with **gas fireplaces and kitchens**, plus yurts and Airstreams [44].

| Property | Oct 2–4 | **Oct 9–11** | Oct 16–18 |
|---|---|---|---|
| Desolation Hotel Hope Valley | **$489 / $1,117** | no 5-guest price | no 5-guest price |
| Creekside Lodge (in Google's Hope Valley/Markleeville results) | no price | no price | $269 / $613 |
| The Mountain Club by Kirkwood Resort | $350 / $833 | $354 / $842 | $326 / $775 |
| Cedar Pines Resort | — | — | $311 / $710 |

(Google; nightly before tax / 2-night total with tax [1].)

**Verdict:** Hope Valley is also tight on the holiday weekend. Desolation only had a 5-guest price on Oct 2–4. It is a fine fallback for Oct 2–4 if the drive time matters most.

---

### 11. Best-value picks spanning the tiers

About $/nt with tax = Google/Airbnb/official price plus 15–16% tax. "Live" means verified available today for those dates.

| Tier | Pick | Base | Oct 9–11 status | ~$/nt with tax | Sleeps 5? | Kitchen | Fireplace | Cozy | Cancellation |
|---|---|---|---|---|---|---|---|---|---|
| **$200–300** ★ | **Airbnb "Fully Upgraded Getaway" 2BR/2BA** | Mammoth | **Live: $468 / 2 nights before tax** | ~$270 | Yes (king, queen+bunk, sofa bed) | Yes | **Yes** | 3.5 | 50% refund if cancelled ≥7 days out (host terms) |
| $200–300 | Austria Hof Lodge | Mammoth | **Live: $290 / $680 total** | ~$340 | Yes (Google occupancy filter) | Some rooms | Lodge | 3 | (not verified) |
| $200–300 (other weekends) | Gull Lake Lodge double suite, or June Lake Villager | June Lake | Villager: no 5-guest price Oct 9. Gull Lake Lodge: unknown (call 760-867-0115). | ~$250–290 | Gull: 2 fulls + sofa bed | Gull: full kitchen | — | 3.5 | — |
| **$300–450** ★ | **Juniper Springs Resort** | Mammoth | **Live: $339/nt, $786 total** (Hotwire $676 with member price) | ~$393 | Yes | **Full kitchen** | **Gas fireplace** | 4 | **Free until 2 days before arrival** |
| $300–450 | The Village Lodge | Mammoth | **Live: $402/nt, $944 total** | ~$472 | Yes | Full kitchen | Gas fireplace | 4 (walkable) | Free until 2 days before |
| $300–450 | Mammoth Mountain Inn | Mammoth | **Live: $362/nt, $841 total** | ~$420 | Yes | No | Lobby only | 3 | Free until 2 days before |
| **$450+** ★ | **Tamarack Lodge cabin** | Mammoth Lakes Basin | **Only priced Oct 16–18: $594/nt, $1,380 total** | ~$690 | Yes | Kitchen | **Gas fireplace / wood stove** | **5** | (probably 2-day rule) |
| $450+ (for Oct 9–11) | **Convict Lake Resort family cabin / Bishop #21** | Convict Lake | Rack rate $419–439 Thu–Sun. **Availability unknown; call 760-934-3800.** | ~$482–505 | Yes (max 6) | Full kitchen | #21 has a fireplace | 4.5 | Strict: 100% charge within 15 days |
| $450+ | Double Eagle 2BR cabin | June Lake | **No 5-guest price Oct 9**; $399/nt ($894 total) on Oct 2 and Oct 16 | ~$450 | Sleeps 6 | Full kitchen | **Wood-burning fireplace** | 5 | (not verified) |

**Why these picks:**
- **$200–300 → the Airbnb 2BR condo.** It is the only verified-live option on the holiday weekend that gets a fireplace, a full kitchen and real bedrooms for under $300/nt all-in. The catch is a stricter cancellation policy.
- **$300–450 → Juniper Springs.** It is the best overall value for this family. It is verified live for Oct 9–11 with a kitchen, gas fireplace, pools, hot tubs and a children's club [2][21]. It is about 16 min from Convict and McGee and about 54 min from Tioga Pass, and cancellation is free until 2 days out, so it is a zero-risk hold while other options are explored.
- **$450+ → Tamarack cabin (Oct 16–18) or Convict Lake cabin (Oct 9–11, call).** These are the coziest: fireplace, aspens and lake, and an on-site restaurant. Tamarack only had 5-guest inventory on Oct 16–18, and Convict's availability needs a phone call.
- **If the family can move to Oct 16–18:** it is cheaper everywhere, there are more cabins (Tamarack, Double Eagle, Lake View Lodge all priced), and there are fewer crowds. The risks are that the Bishop Creek and Rock Creek resorts may be closing, and that Tioga may close earlier after the first storms.

---

### 12. Sources (all accessed 2026-09-27)

1. Google Hotels search result pages (dates and guests in the `ts` param), e.g. Mammoth Oct 9–11 with 5 guests: https://www.google.com/travel/search?q=hotels%20in%20Mammoth%20Lakes%20CA&qs=CAE&ts=CAESHAoCCAMKAggDCgQIAhAHCgQIAhAGCgQIAhAGEAAaHBIaEhQKBwjqDxAKGAkSBwjqDxAKGAsYAjICEAAqCQoFOgNVU0QaAA&hl=en-US&gl=us&curr=USD. The same pattern was used for June Lake, Bishop, Lee Vining, Bridgeport, Groveland, Sonora, Oakdale, Hope Valley/Markleeville and Rush Creek/Evergreen, for each weekend.
2. Hotwire retail search, e.g. https://vacation.hotwire.com/Hotel-Search?destination=Mammoth+Lakes%2C+California&startDate=2026-10-09&endDate=2026-10-11&adults=2&rooms=1&children=1_7%2C1_6%2C1_6 (also with &sort=PRICE_LOW_TO_HIGH, &star=40, &sort=REVIEW, June Lake, Bishop, Sonora, Groveland, Oakdale). Hot Rate shell: https://www.hotwire.com/hotels/search?destination=Mammoth%20Lakes...
3. Airbnb searches: https://www.airbnb.com/s/Mammoth-Lakes--CA/homes?checkin=2026-10-09&checkout=2026-10-11&adults=2&children=3&currency=USD (and June-Lake--CA; Oct 2–4 and Oct 16–18 variants). VRBO https://www.vrbo.com/search?... returned HTTP 429.
4. OSRM routing table https://router.project-osrm.org/table/v1/driving/... with geocodes from https://nominatim.openstreetmap.org/
5. USGS EPQS https://epqs.nationalmap.gov/v1/json?x=…&y=…&units=Feet
6. https://junelakeloop.org/all-events/leaves-in-the-loop.html
7. https://www.monocounty.org/event/june-lake-leaves-in-the-loop/8447/
8. https://www.monocounty.org/things-to-do/fall-colors/fall-events/
9. https://monocounty.ca.gov/m/newsflash/home/detail/20 (published Sep 2, 2026)
10. https://www.easternsierranow.com/mono-county-welcomes-fall-with-color-map-and-seasonal-events/
11. http://laurasmiscmusings.blogspot.com/2026/08/new-western-roundup-column-2026-lone.html ("October 8th through 11th, 2026")
12. https://www.nps.gov/yose/planyourvisit/conditions.htm
13. https://www.nps.gov/yose/planyourvisit/reservations.htm
14. https://www.gulllakelodge.com/faqs
15. https://www.townofmammothlakes.ca.gov/201/Transient-Occupancy-Tax-Information
16. TBID 1%: web-search summary of https://www.mammothlakeschamber.org/getting-a-tax-certificate/ (page not fetched directly)
17. https://sierrawave.net/mono-county-transient-occupancy-tax-rate-increase-effective-dec-13-2024/
18. https://convictlake.com/policies/
19. https://cityofbishop.ca.gov/departments/finance/transient_occupancy___business_tourism_tax_information.php
20. https://www.mammothmountain.com/plan-your-trip/mammoth-hotels/the-village-lodge (amenities; cancellation policy; 2026 summer season Apr 20–Nov 19)
21. https://www.mammothmountain.com/plan-your-trip/mammoth-hotels/juniper-springs-resort
22. https://junelakemotel.com/
23. https://lakeviewlodgeyosemite.com/
24. Web search summary citing https://www.dovetailandco.com/the-wayfinder-bishop-hotel and https://www.wayfinderbishop.com/
25. https://www.hotwire.com/4Star-Mammoth-Lakes-Hotels.s40-0-d2363.Travel-Guide-Filter-Hotels
26. https://www.betterbidding.com/index.php?showtopic=225053 (July 2018 Hotwire win: 3.5★ Sierra Nevada Resort)
27. https://www.betterbidding.com/index.php?app=hotel_lists&tid=971&location=Mammoth+Lakes-CA
28. https://www.hotwire.com/Mammoth-Lakes-Hotels.d2363.Travel-Guide-Hotels
29. https://www.mammothmountain.com/plan-your-trip/mammoth-hotels/mammoth-mountain-inn
30. https://www.mammothmountain.com/plan-your-trip/mammoth-hotels/tamarack-lodge
31. Web search snippets of https://doubleeagle.com/lodging/two-bedroom-cabins/ (direct fetch blocked, HTTP 202)
32. https://www.gulllakelodge.com/rooms
33. https://www.bigrockresort.net/
34. https://www.cardinalvillageresort.com/ and https://www.cardinalvillageresort.com/policies/
35. https://www.parchersresort.net/cabins and https://www.parchersresort.net/policies
36. https://www.bishopcreekresort.com/ and https://www.bishopcreekresort.com/cabins/
37. https://www.monocounty.org/listing/rock-creek-lodge/1052/
38. https://www.rockcreeklakesresort.com/
39. https://convictlake.com/lodging/rates/ and https://convictlake.com/cabins/bishop-21/
40. https://convictlake.com/
41. https://www.airbnb.com/rooms/35736244?check_in=2026-10-09&check_out=2026-10-11&adults=2&children=3
42. https://www.airbnb.com/rooms/998507073427024743?check_in=2026-10-09&check_out=2026-10-11&adults=2&children=3
43. https://www.airbnb.com/rooms/19102894?check_in=2026-10-09&check_out=2026-10-11&adults=2&children=3
44. https://www.carsonnow.org/06/23/2023/hope-valley-s-sorensen-s-resort-becomes-desolation-hotel and web-search summary of https://www.desolationhotel.com/hope-valley

---

### Could not verify

- **Live Hotwire Hot Rate (opaque) prices and neighborhoods.**
  - The Hotwire API requires a request signature generated by obfuscated page JavaScript. I did not try to get around this.
  - BetterBidding's Mammoth decode list did not render.
  - The Hot Rate mapping in section 6 is **inferred** from Hotwire's retail star classes.
- **Hotwire member prices.** The $676 (Juniper) and $810 (Village Lodge) Oct 9–11 prices appear with "Member Price available" and a higher "previous price". The non-member price is probably about $785 and $943.
- **Why "no price shown" for 5 guests.** On Google this could mean sold out *or* no room type that sleeps 5; the two cannot be told apart without JavaScript. This affects Westin, Tamarack, Double Eagle, Lake View Lodge, Rush Creek (Oct 9), and all Bishop chains.
- **Availability and rates at small independents** (their booking engines are JS/API-only or call-only):
  - Gull Lake Lodge (Cloudbeds)
  - June Lake Motel (WebRezPro)
  - Lake Front Cabins (site SSL error)
  - Big Rock Resort
  - June Lake Pines
  - Convict Lake Resort (Mews)
  - Cardinal Village (rezStream)
  - Parchers (RezExpert)
  - Bishop Creek Lodge
  - Rock Creek Lodge and Rock Creek Lakes Resort
  - Sierra Nevada Resort
- **Exact fall 2026 closing dates:**
  - Parchers: not published.
  - Rock Creek Lodge: not found.
  - Rock Creek Lakes Resort: "middle of October".
  - Cardinal Village: "end of April–October".
  - Bishop Creek Lodge: last Sat of October.
  - Big Rock: last weekend of October.
- **Other gaps:**
  - Westin Monache's unit types, fireplace, kitchen and cancellation policy.
  - Double Eagle's cancellation policy (site blocked).
  - Lake View Lodge cottage configurations.
  - Exact elevations of Tamarack, Mammoth Mountain Inn, Cardinal Village and Bishop Creek Lodge (only town-level USGS values were pulled).
- **Airbnb cancellation terms** for listings 998507073427024743 and 19102894 (policy picker is JS). Airbnb totals exclude the 15% TOT and 1% TBID.
- **VRBO results** (HTTP 429), and property-manager sites (Mammoth Reservation Bureau, 101 Great Escapes, Mammoth Premier, Sierra Star, June Lake Accommodations).
- **Groveland Hotel and Hotel Charlotte** rates for 5 or for 2 rooms. Holiday Inn Express Oakdale for 5.
- **Drive times** are OSRM free-flow estimates. Tioga Road could close after a storm at any time.
- **Mammoth 1% TBID** comes from a web-search summary, not a directly fetched page.
- **Lone Pine Film Festival dates** come from a blog preview, not the festival's own page (that page returned empty).
- **The Bridgeport Oktoberfest date.** Official Mono County pages say Oct 10. One search summary claimed Oct 17 and was not corroborated.

---

## Food, fall stops, kid wins, and short walks

**Research date:** 2026-09-27. Everything below was fetched on this date unless the entry says otherwise. "Src upd" gives the source's own last-updated or last-modified date when the page shows one. If a claim says **"background, not verified"**, it comes from memory and not from a source I fetched.

**Trip:** Fri Oct 9 to Sun Oct 11, 2026 (the alternates Oct 2–4 and Oct 16–18 are flagged). The family is 2 adults and three young kids. They like coffee and cocoa, caramel apples, cozy reading corners, animals and tracks, rocks and volcanoes, stars, and drawing and crafts.

**How reliable the sources are.** Best: government pages (USFS, NPS, CDFW, State Parks) and a business's own website. Next: the Visit Mammoth business directory, whose hours are "provided directly by the business" with no date shown. Weakest: search-engine snippets from Yelp or Tripadvisor. Yelp and Tripadvisor block direct fetches, so any hours that come only from a snippet are labeled "snippet".

---

### TOP-LINE ALERTS (read first)

| Item | Status | Source |
|---|---|---|
| **Whoa Nellie Deli / Tioga Gas Mart** (Lee Vining) | **Closing date for 2026 is not verified.** The official site gives hours as "Everyday 6:30am–9:00pm" with no season dates. The Mono County tourism listing says "Open seasonally from the end of April through the **first week in October**." A Tripadvisor FAQ snippet says "last Saturday in April to the last Sunday in October." **Call 760-647-1088 before counting on it for Oct 9–11.** The Oct 2–4 alternate is the safer bet for this stop. | whoanelliedeli.com/info; monocounty.org/listing/tioga-gas-mart-whoa-nellie-deli/668/; tripadvisor FAQ (snippet) |
| **Ohanas 395** (June Lake) | **Permanently closed.** Its own site says "Ohanas 395 has closed our doors!" June Lake Brewing's "eats" page still lists it (Thu–Sun noon–5), but that page is stale. | ohanas395.com; junelakebrewing.com/eats.html |
| **Carson Peak Inn** (June Lake) | **"Temporarily Closed"** per its own site | carsonpeakinn.com |
| **Base Camp Cafe** (Mammoth) | The Yelp title reads "BASE CAMP CAFÉ – CLOSED – Updated December 2025" (snippet). Treat it as closed. | yelp (snippet) |
| **Mono Lake County Park boardwalk** | **Closed "until further notice due to the Inn Fire."** State Parks page "Last Checked: 9/27/2026 8:09 AM". | parks.ca.gov/?page_id=514 |
| **Hot Creek Trout Hatchery** | **"CLOSED TO THE PUBLIC, due to winter weather damage"** (CDFW) | wildlife.ca.gov/Fishing/Hatcheries/Hot-Creek |
| **Mammoth Scenic Gondola** | **Not running in October.** Maintenance closures run Sep 28 to Nov 12, 2026. | mammothmountain.com/things-to-do/activities/scenic-gondola |
| **Devils Postpile / Reds Meadow** | **Open weekends only** from Sep 21 to Nov 1 ("Open Saturdays at 7 am through Sunday at 11 pm"). Closed on Friday Oct 9. The shuttle runs Sat–Sun through **Oct 11**. | nps.gov/depo/planyourvisit/hours.htm; mammothmountain.com reds-meadow-shuttle |
| **Lake Sabrina** (Bishop Creek) | SCE is repairing the dam spillway until as late as Oct 30, 2026, and the lake is drawn down about 18 ft. The access trail, day-use parking and dam embankment "closed intermittently" **Mon–Sat**, sunrise to sunset. **Sunday is the best day.** | fs.usda.gov/r05/inyo/recreation/trails/sabrina-lake-trail (src upd Jun 29, 2026) |
| **Inyo Craters area** | A hazard-tree closure order is in effect Aug 14 to Nov 30, 2026 on roads 3S23P, 3S23R, 3S108, 3S108A and 3S108E, plus 100 ft on either side. It is unclear whether this blocks the craters' parking and trail. The trail page says the parking area is "3 miles north of the Mammoth Scenic Loop on a graded dirt road". **Call the Mammoth Welcome Center (760) 924-5500.** | fs.usda.gov/r05/inyo/alerts/inyo-craters-closure-part-d-and-e |
| **Stage 1 fire restrictions** | In effect on Inyo NF "through December 31, 2026", which limits campfires (and so s'mores). Campfires are allowed only in designated rings in rec sites. | fs.usda.gov/r05/inyo/alerts |
| **"Tri-County Fair Oct 9–11" (Bishop)** | **This is not a fair.** The fairgrounds calendar shows a *Ventura County Motorcycle Club Dual Sport Rally* for Oct 9–11. | tricountyfair.com/event-calendar (src upd Sep 22, 2026) |
| **Hurst Ranch Harvest Festival** | **This one is in West Covina (SoCal), not Jamestown.** Search engines mix the two up. Hurst Ranch in Jamestown is a feed store. | hurstranch.com/harvest-festival; hurstranchjamestown.com |

---

### 1. FOOD with October hours (verified list of about 22)

Every entry below was fetched 2026-09-27. "Kid" means reasonably kid-friendly based on the type of place (casual, not bar-only).

#### En route west side: CA-120 (Oakdale, Groveland) and CA-108 (Sonora area)
| Place | Hours / closed days | Notes | Source |
|---|---|---|---|
| **Priest Station Café**, 16756 Old Priest Grade, Big Oak Flat (just below Groveland) | **Daily 8am–8pm** | Good for Friday dinner or breakfast on Hwy 120 | prieststation.com/contact-info/ |
| **Around the Horn Brewing**, 17820 Hwy 120, Groveland | Mon, Thu–Sun 11:30am–9pm with **food 12–8pm**. **Tue 4–9pm, no food. Wed CLOSED.** | Fri Oct 9: food until 8pm | aroundthehornbeer.com |
| **Iron Door Saloon & Grill**, Groveland | Grill: Sun–Wed lunch 11–5 and dinner 5–8. Thu–Fri dinner until 9pm. Saturday hours were cut off in the fetch. | It is a saloon. Whether minors are allowed in the grill room was **not verified**. | irondoorsaloon.com |
| **Oakdale Cheese & Specialties**, 10040 Hwy 120, Oakdale | **Open daily 9am–6pm** (closed Thanksgiving, Christmas, Easter) | **Animals: goat feeding.** The goats-and-alpacas detail is from a search snippet; the hours are from the official site. | oakdalecheese.com/visit-us/ |
| **Bloomingcamp Ranch bake shop**, 10528 State Hwy 120, Oakdale | **Wed–Sun 9am–4pm. Closed Mon–Tue.** | An apple and pie stop on 120. Whether they sell caramel apples was **not verified** (background: known for apples, pies and fruit). | bloomingcampranch.com (src last-mod Sep 27, 2026) |

#### Lee Vining
| Place | Hours / closed days | Notes | Source |
|---|---|---|---|
| **Whoa Nellie Deli** (Tioga Gas Mart) | Daily 6:30am–9pm. Breakfast 6:30–10:45am, lunch/dinner 11am–9pm. Restrooms open 24 hrs. **The season end date conflicts across sources (see alerts).** | The last 2026 live music listed was Sep 17 | whoanelliedeli.com/info, /menu-1, /amenities, /live-music-1 |
| **Basin Cafe** (at Lakeview Lodge) | **Thu–Sat 7:00am–8:45pm. Sun–Mon 7:00am–1:45pm. CLOSED Tue–Wed.** | Breakfast, lunch, dinner | leevining.com/basin-cafe (Lee Vining Chamber, no date) |
| **Latte Da Coffee Cafe** (El Mono Motel) | Season: "Open April through late Fall" (no date given). A snippet says 7am–6pm daily (unverified). | **Coffee/cocoa.** Call before counting on it. | monocounty.org/listing/el-mono-motel-&-latte-da-coffee-cafe/600/; leevining.com/el-mono-motel |
| **Mono Market** | 7am–9pm daily per aggregator snippets only. The official site shows no hours. | Groceries, picnic supplies | monomarketca.com; search snippets |
| **Mono Inn** (5 mi N) | Mon and Fri–Sun 5–9pm per snippet; **not verified**. It survived the Inn Fire. | A dinner option | snippet only |
| **Bodie Mike's BBQ** | "Memorial Day Weekend through last Sunday of September", so **closed** on the trip dates | — | leevining.com/bodie-mikes-bbq |
| Epic Cafe | **Not verified.** Snippets conflict on whether it is in Lee Vining or June Lake and on its current status. | — | — |

#### June Lake
| Place | Hours / closed days | Notes | Source |
|---|---|---|---|
| **June Lake Brewing**, 131 S Crawford Ave | "Everyday Noon–8pm". Closes for a stretch in November. | Beer garden. **No pets.** Its food truck (Ohanas) is closed. | junelakebrewing.com/where.html; visitjunelakeloop.com/june-lake-brewing/ |
| **Tiger Bar & Cafe** | "Open Year Round – call or check social media to confirm hours". A snippet says 8am–9/10pm daily (unverified). | A breakfast-through-dinner classic (background) | visitjunelakeloop.com/tiger-bar/ |
| **Silver Lake Resort Café** | "Fishing opener to **mid October** – 7 days a week – 7am to 2pm". Resort open "through mid October". | **Likely open Oct 2–4 and Oct 9–11. Risky for Oct 16–18.** One aggregator snippet said "temporarily closed", so call 760-648-7525. | visitjunelakeloop.com/silver-lake-cafe/; monocounty.org/listing/silver-lake-resort-&-rv-park/626/ |

#### Mammoth Lakes
Hours from the Visit Mammoth directory are "provided directly by the business" and carry no date. All were fetched 2026-09-27.

| Place | Hours | Notes |
|---|---|---|
| **Stellar Brew & Natural Cafe**, 3280 Main St | **Daily 5:30am–6pm** | **Coffee/cocoa**, early breakfast |
| **Black Velvet Coffee**, 3343 Main St | **Daily 6am–8pm** | **Coffee/cocoa**, cozy |
| **Looney Bean**, 26 Old Mammoth Rd | **Daily 6am–5pm** | Coffee |
| **Mammoth Coffee Roasting Co.**, 436 Old Mammoth Rd | 6am–1pm. Fri–Sat also 5–9pm. **Closed Wed.** | Coffee |
| **Good Life Cafe**, 126 Old Mammoth Rd | Thu–Mon 7am–8pm. **Tue–Wed 7am–3pm.** | Breakfast, kid-friendly |
| **Breakfast Club**, 2987 Main St | Daily 6:30am–1:30pm | Breakfast |
| **The Stove**, 644 Old Mammoth Rd | Daily 7am–2pm | Breakfast |
| **Shea Schat's Bakery**, 3305 Main St | **Daily 6am–6pm** | Bakery |
| **Toomey's**, 6085 Minaret Rd (Village) | Daily 11am–9pm. The official site says "Now Serving Breakfast Friday, Saturday, Sunday" but gives no times. | Kid-friendly (background) |
| **The EATery at Mammoth Brewing**, 18 Lake Mary Rd | Sun–Thu 11:30am–9pm, Fri–Sat until 9:30pm. The official site says "Daily 11:30am – close… subject to early closures during shoulder seasons." | Family-friendly per snippet |
| **Burgers Restaurant**, 6118 Minaret Rd | Mon–Fri 11am–8pm, Sat–Sun 11am–9pm | Kid-friendly |
| **John's Pizza Works**, 3499 Main St | Daily 11:30am–10:30pm | Kid-friendly |
| **Roberto's Cafe**, 271 Old Mammoth Rd | 11am–9pm. **Monday is not listed, so presumably closed.** | Mexican |

*Sources: visitmammoth.com/directory/{stellar-brew-natural-cafe, black-velvet-coffee, looney-bean, mammoth-coffee-roasting-company, good-life-cafe, breakfast-club, the-stove, shea-schats-bakery, toomeys, the-eatery-at-mammoth-brewing-company, burgers-restaurant, johns-pizza-works, robertos-cafe}; toomeysmammoth.com; mammothbrewingco.com.*

Not found or not verified: Old New York Deli & Bagel, Giovanni's Pizza (no directory listing found).

#### Bishop
| Place | Hours / closed days | Source |
|---|---|---|
| **Erick Schat's Bakkery**, 763 N Main | **Mon–Thu 6am–6pm, Fri 6am–7pm, Sat–Sun 6am–6pm** (snippet of the Yelp listing, "Updated September 2026"). The official site and Chamber listing show no hours. | yelp (snippet) |
| **Great Basin Bakery**, 275 S Main | **Sources conflict.** The official site's code shows "Mon–Fri 7am–4pm, Sat 7am–2pm, Sun 8am–1pm" but its banner also says "Open daily 7am–4pm". The Chamber listing says "6:30 am to 3:00 pm". **Go before 1pm on Sunday.** | greatbasinbakerybishop.com (last-mod Apr 29, 2026); members.bishopchamberofcommerce.com/list/member/great-basin-bakery-137 |
| **Mountain Rambler Brewery**, 186 S Main | Pub **7 days, 11:30am–10pm**. Kitchen 11:30am–9pm (the kitchen hours are from a snippet). | mountainramblerbrewery.com/locations-1 |
| **Holy Smoke Texas BBQ**, 772 N Main | 11am–9pm, **closed Tuesdays** (snippet only; the official site blocked the fetch) | snippet |
| **Jack's Restaurant**, 437 N Main | 7am–2pm daily (snippet only) | snippet |
| **Pupfish Cafe** (inside **Spellbinder Books**), 124 S Main | **Thu–Tue 8am–2pm. Closed Wed.** Tagline: "Eat. Read. Relax." Enter from the back, off E. Line St. | pupfishcafe.com (via WebFetch) |
| **Black Sheep Coffee Roasters**, 232 N Main | 7am–2pm daily (snippet only) | snippet |
| Burger Barn | **Not verified** | — |

#### Bridgeport / Walker (if returning via Sonora Pass)
- **Rhino's Bar & Grille**, Bridgeport: 11am–8:30pm daily (snippet only). **Bridgeport Oktoberfest** is on Sat **Oct 10, 2026** at Sportsmen's Bar (source: monocounty.org fall events).
- **Walker Burger** (Coleville, about 10 mi north of the CA-108 junction, so a detour): "Open 11AM–7PM seven days a week during the summer. Closed Tuesdays in the Spring and Fall. Closed during the winter." There is no 2026 closing date. Source: walker-burger.com (© 2023 on page).

---

### 2. COFFEE, COCOA, CARAMEL APPLES AND COZY READING CORNERS (priority list from the family update)

#### Coffee and cocoa with seating
- **Mammoth:** Stellar Brew (5:30am–6pm daily), Black Velvet (6am–8pm daily), Looney Bean (6am–5pm daily), Mammoth Coffee Roasting (closed Wed), Shea Schat's (6am–6pm). Sources are in the Mammoth table above. Black Velvet serves hot chocolate made to order (Yelp review snippet).
- **Lee Vining:** Latte Da (seasonal, "April through late Fall") and espresso at Whoa Nellie (season end date conflicts).
- **June Lake:** "The Lift" and "June Lake Junction" coffee show up only in snippets and were **not verified**. The June Lake General Store has coffee to go (snippet).
- **Bishop:** Pupfish Cafe inside Spellbinder Books (Thu–Tue 8–2) is the best cozy combination. Also Black Sheep (7–2, snippet), Schat's (6am–6/7pm, snippet), and Great Basin Bakery.

#### Caramel apples
- **Rocky Mountain Chocolate Factory, Mammoth.** Two stores:
  - 437 Old Mammoth Rd, Suite N (760-934-6269)
  - The Village, 6201 Minaret Rd #213 (760-934-6962)
  - The official page says they are "known for handmade chocolates, **caramel apples**, marble slab fudge… watch us prepare a variety of our specialties in store." rmcf.com lists **10am–8pm daily** at both. Visit Mammoth lists Fri–Sat until 9pm.
  - Sources: rmcf.com/pages/rocky-mountain-chocolate-factory-of-mammoth-lakes-ca and …-at-the-village-at-mammoth; visitmammoth.com/directory/rocky-mountain-chocolate-factory/
- **Booky Joint and RMCF are at the same address (437 Old Mammoth Rd).** You can do books and caramel apples in one stop.
- **Snap N Crackle Candy**, 124 N Main, Bishop: a candy shop per a Yelp snippet. Caramel apples and hours were **not verified**.
- **Schat's (Bishop and Mammoth):** caramel apples **not verified**.
- **Make your own:** buy apples at Bloomingcamp Ranch (Oakdale, Wed–Sun 9–4) or Indigeny Reserve U-pick (Sonora, "September 2026 Apple Harvest and U-PICK Orchards Open"; whether U-pick is still open in October was not verified), then use caramel from a grocery store.
- **Cover's Apple Ranch** (Tuolumne, off CA-108 east of Sonora): cider, pie, deli. "Breakfast and lunch served Tuesday through Saturday. **Closed Sundays**" (farmsoftuolumnecounty.org). Caramel apples were not verified. The "pumpkin patch & hay maze all October" claim comes from a snippet only.

#### Cozy bookstores and library corners
- **Booky Joint**, 437 Old Mammoth Rd, Mammoth. **10AM–6PM daily** (official site, last-mod Sep 9, 2026). A snippet claiming 9:30am–8pm is outdated. Stocks new and used books, toys, games, **art supplies** and Lego (snippet). "As of May 2026 they are phasing out their phone number"; email bookyjoint@gmail.com (snippet). Source: booky-joint.com
- **Mammoth Lakes Library**, 400 Sierra Park Rd: Mon–Fri 10am–7pm, Sat 10am–5:30pm, **Sunday not listed** (Visit Mammoth directory).
- **Spellbinder Books + Pupfish Cafe**, Bishop: bookstore hours per a snippet are Mon 9–5, Tue–Wed 9–4, Thu–Sat 9–5, Sun 10–2. The cafe (official site) is closed Wednesdays.
- **Mono Lake Committee Information Center & Bookstore**, Lee Vining: 9am–5pm daily per a snippet. monolake.org was blocked (Cloudflare), so its fall 2026 hours are **not verified**.
- **Mono Basin Scenic Area Visitor Center** bookstore and art galleries (see section 3).

---

### 3. KID WINS AND SHORT WALKS

Legend for interest tags: 🦫 animals/tracks, 🌋 rocks/volcanoes, ✨ stars, 🎨 crafts.

#### Detail table
| Walk / site | Distance RT / gain / surface | Restrooms | Fee / parking | Oct 2026 status | Why it's a payoff | Sources |
|---|---|---|---|---|---|---|
| **South Tufa**, Mono Lake 🌋🦫 | About 1-mile self-guided nature trail (State Parks); flat, sandy (background). | FS: "No services onsite." Vault toilets at the lot are **background, not verified**. | **$3/person aged 16+, kids 15 and under free**. Card, cash or check on site. America the Beautiful pass accepted. | Open 24 hrs. FS lists ranger walking tours "daily at 10 AM and 6 PM" (page last updated Dec 9, 2025, reads like summer). Snippets of monolake.org say 1pm Sat/Sun "May through October" (not directly verified). | Alien tufa towers, brine flies, migrating birds | fs.usda.gov/r05/inyo/recreation/south-tufa; parks.ca.gov/?page_id=514 (state page lists "Vehicle Day Use: $3.00") |
| **Mono Basin Scenic Area Visitor Center** + **Old Marina** 🎨🦫 | VC to Old Marina trail is 1.5 mi each way. Old Marina has a short path and the accessible David Gaines Memorial Boardwalk. | Restrooms at the VC (background) | Old Marina fee: a snippet says $3 with under-18 free; **unverified** | FS lists VC hours 9am–5pm (FS page upd Jun 8, 2026). Visit Mammoth lists 8am–5pm daily and says "Open". **The fall closing date was not found.** | Film, exhibits, art galleries, bookstore; tufa and island views | fs.usda.gov/r05/inyo/offices/mono-basin-scenic-area-visitor-center; visitmammoth activity-updates; monocounty.org/listing/mono-lake-old-marina/1324/ |
| Mono Lake County Park boardwalk | — | — | — | **CLOSED (Inn Fire)** | — | parks.ca.gov |
| **Panum Crater** 🌋 | **Plug trail about 1 mi RT**; rim trail 1.5-mi loop. About 200 ft gain on **deep pumice sand**. The rim is exposed and windy, and the plug interior is "technical". | None (background) | No fee known (background) | Not checked | A real volcano crater with obsidian and pumice | yosemitehikes.com/outdoorproject (snippet) |
| **Earthquake Fault**, Mammoth 🌋 | **0.2–0.3 mi loop**, mixed surface, forest | **Vault toilet** | Free | Day use 6am–10pm; "Seasonally open depending on road and weather" | A 10-ft-wide, 60-ft-deep fissure right in town, next to Minaret Rd | fs.usda.gov/r05/inyo/recreation/earthquake-fault (upd Jul 22, 2025); mammothtrails.org/trail/38 |
| **Hot Creek Geologic Site** 🌋 | **0.2 mi each way**, paved but steep, about 100 ft down to the creek | **Vault toilets**; no water | Free | FS shows "**Site Open**", day use 6am–10pm (page upd Apr 30, 2025; fetched today). Entering the water is prohibited. | Boiling pools and steam vents | fs.usda.gov/r05/inyo/recreation/hot-creek-geologic-site; mammothtrails.org/trail/66 |
| **Obsidian Dome** 🌋 | About 0.8 mi, about 141 ft gain (snippet). Loose, sharp glass, so wear closed-toe shoes. | None ("Potable water is not available") | Free | "Vehicle travel limited depending on snow". Glass Flow Rd is dirt. **Collecting rocks is prohibited** (snippet). | Boulders of shiny black volcanic glass | fs.usda.gov/r05/inyo/recreation/obsidian-dome-observation-site (upd Apr 23, 2025) |
| **Inyo Craters** 🌋 | Two short trails from parking to the rims (distance not captured) | Restroom at parking (mammothtrails) | Free | **Possible closure, see alerts. Call first.** | Steam-blast craters with small lakes | fs.usda.gov/r05/inyo/recreation/inyo-craters; mammothtrails.org/trail/68 |
| **Convict Lake** 🦫 | Full loop about 2 mi (mammothtrails) or 2.5 mi (other sites). There is a short hill on the NE shore. Families can walk the **paved ADA section between the marina and pavement's end**, or out and back to the aspen boardwalk. | Restrooms near trailheads (secondary) | Free (background) | Fall color "0–10% Just Starting" on 9/16 | Lake under huge cliffs, aspens, fishing | mammothtrails.org/trail/57; californiafallcolor.com 2026/09/18 |
| **Lundy Canyon to the beaver ponds** 🦫 | The first pond with a waterfall view is at about 0.25 mi; the trail "passes by a beaver pond" before a creek crossing at about 0.9 mi. **About 1–2 mi RT.** | None at the trailhead (background) | Free (background) | Color "0–10% Just Starting" (9/18 report); "parking is minimal at the trailhead" | Beaver dams and chewed stumps, aspens, waterfalls | modernhiker/summitpost (snippet); californiafallcolor.com 2026/09/18 |
| **Horseshoe Lake loop**, Lakes Basin | About 1.5 mi (mammothtrails figure); native dirt and gravel; "perfect for kids" | Background: toilets at the lot | Free | Lake Mary Rd status in Oct **not verified** | Beach, bridges, stream crossings | mammothtrails.org/trail/14 |
| Twin Lakes Lakefront Path | 0.3–0.4 mi | Picnic area | Free | — | Easy lakeside stroll | mammothtrails.org/trail/16 |
| **Devils Postpile** 🌋 | Short walk to the columns (about 0.4 mi each way, background) | Background | **Shuttle: $15 adult / $7 child (3–17) / under 2 free** | **Weekends only**: road open Sat 7am to Sun 11pm. Shuttle Sat–Sun through Oct 11. Ranger station Sat–Sun 9–3. **Closed Fri Oct 9.** Oct 16–18: road open on the weekend but the shuttle has ended; whether private cars are allowed was not stated. | Basalt columns | nps.gov/depo/planyourvisit/hours.htm; mammothmountain.com reds-meadow-shuttle; fs.usda.gov reds-meadow-road-reconstruction-project (upd Sep 21, 2026) |
| **Parsons Lodge & Soda Springs**, Tuolumne Meadows 🦫 | **1.4 mi RT, mostly flat, unpaved** | Background | Yosemite entry (see other file) | Tioga Road "Open" (NPS conditions upd Sep 25, 2026). **The trail between the wilderness center and Lembert Dome is closed for construction; an alternate trail is available.** | Bubbling soda spring, meadow, marmots and deer (background) | nps.gov/yose/planyourvisit/tmhikes.htm; nps.gov/yose/planyourvisit/conditions.htm |
| **Lake Sabrina** | FS: Blue Lake is 2.5 mi one way (too far). A short shoreline or dam stroll only. | Vault toilets (snippet) | Free | **Intermittent closures Mon–Sat until Oct 30**; lake drawn down 18 ft | Bishop Creek aspens were "Near Peak" in parts per the 9/17 report | fs.usda.gov sabrina-lake-trail |
| Rock Creek Lake / McGee Creek | Not measured | — | — | Rock Creek color "10–50% Patchy", McGee "Just Starting" (9/16) | Aspens; paved road to Rock Creek | californiafallcolor.com |
| **Woolly's Adventure Summit** (Mammoth Mtn, 9000 Minaret Rd) 🌋🎨 | Activity park | Yes | Adventure pass; price is dynamic (not captured). Mini Grom pass for kids 6 and under, max 42", at 25% off. | **Fri–Sun through Oct 11, 12–5pm**, so it is **closed Oct 16–18**. Coaster, tubing and zip line are "Year-Round". Gem mining ("Woolly's Mining Co."), Fossil Hunt, climbing wall and bungee are labeled "**Summer Only**", so they may not run in October. **OkTUBERfest with a pumpkin patch runs Sep 26 and Oct 3.** | Mountain coaster; gem sluice if it is running | mammothmountain.com/on-the-mountain/hours-of-operation; /things-to-do/woollys-adventure-summit; /activities/adventure-pass; monocounty.org fall events |
| **Laws Railroad Museum**, Bishop | 11 acres of historic buildings and trains | Background | **$10 adult donation, children under 12 free** | "**10:00 – 4:00 most days.**" Closed Thanksgiving, Christmas, New Year's. | Trains, the "Slim Princess", old town buildings | lawsmuseum.org; Bishop Chamber listing ("Daily 10am–4pm") |
| Owens Valley Paiute Shoshone Cultural Center, Bishop 🎨 | Museum and gift shop | — | — | October–March: "T–S, CLOSED Sun & Mon" (times not given) | Beadwork and local culture | Bishop Chamber listing |

#### Top 8 for kids aged 6–7 (ranked)
1. **South Tufa**, with the 1pm weekend ranger walk if it runs. Flat, about 1 mile, free for kids, and totally unlike anything at home. Tufa is a chemistry-made rock, which fits the rocks interest.
2. **Panum Crater plug trail**: a real volcano in under a mile. Stop at the dome edge, since the inside is rough.
3. **Hot Creek Geologic Site**: 0.2 mi to boiling, steaming pools. Toilets on site, free. The steep climb back up is short.
4. **Earthquake Fault**: a 0.3-mi loop inside a giant crack, with a toilet. Good as a 20-minute stop.
5. **Lundy Canyon to the beaver ponds**: beaver sign and aspens within about 1 mi, for the animal fans. Parking is tight, so go early. Color was just starting as of 9/18.
6. **Convict Lake (partial loop)**: paved ADA section plus the aspen boardwalk. Restrooms, flat, and dramatic cliffs.
7. **Parsons Lodge & Soda Springs** on the drive in: 1.4 mi, flat, fizzy spring water. Use the alternate trail because of construction.
8. **Obsidian Dome** (look but do not collect), or on Sat/Sun **Devils Postpile** via the shuttle (last shuttle weekend is Oct 10–11).

Honorable mentions: Horseshoe Lake loop, Laws Railroad Museum (kids under 12 free), and Woolly's (Fri–Sun through Oct 11).

**Flagged as long or steep for this age group:** Parker Lake (distance not verified; background figure about 3.8 mi RT), Lake Sabrina to Blue Lake (5 mi RT), Panum rim (deep sand), Dog Lake and Lembert (3.8 mi, 850 ft).

#### Stars and moon ✨ (computed with the PyEphem library on 2026-09-27, not fetched)
- **New moon is Sat Oct 10, 2026 at about 8:50am PDT.** Oct 9–11 are the darkest nights of the month, which is excellent for the Milky Way and stars.
- Oct 2–4: last quarter is Oct 3. The moon rises around midnight, so evenings are dark.
- Oct 16–18: first quarter is Oct 18. The moon sets around 11pm, so evenings are moonlit.
- **Walker Star Party, Oct 2** (telescopes with Western Nevada College volunteers). Source: monocounty.org fall events.
- **No verified 2026 star party in Mammoth or Lee Vining.** The Eastern Sierra Observatory page (near Bishop) contains 2020-era content only.
- Minaret Vista is a local stargazing favorite (visitmammoth snippet).

---

### 4. FALL-FLAVORED STOPS EN ROUTE AND EVENTS: date matrix

✅ = open or happening, ❌ = not, ? = unverified

| Stop | Oct 2–4 | Oct 9–11 | Oct 16–18 | Hours / cost / kid activities | Source (fetched 9/27) |
|---|---|---|---|---|---|
| **Dell'Osso Family Farm**, Lathrop (I-5/120) | ✅ (opens Fri Oct 2) | ✅ | ✅ | Mon–Fri from noon, Sat–Sun from 10am, last entry 7pm; attractions close 8pm (8:30 Fri–Sat). **$29.95 Fri, $34.95 Sat–Sun, $24.95 Mon–Thu**; 2 and under free. No Apple Pay. | pumpkinmaze.com/attraction-hours-pricing |
| **SONS Farm Fresh**, 1936 E. F St, Oakdale (Hwy 120) | ✅ | ✅ | ✅ | Sep 10–Oct 31. **Free entry**. Petting zoo and reptile house $8, gem mining $8, haunted maze $5. "Light the Night": **Sun–Thu 8am–8pm, Fri–Sat 8am–9pm**, so **Friday evening works**. | livinginthecentralvalley.com 2026 guide (secondary, "verified September 11, 2026") |
| **Chester's Pumpkin Pasture**, Oakdale Rodeo Grounds | ? | ✅ | ✅ | **The start date conflicts within the guide** (table says Sep 26–Nov 1, text says Oct 10–31). Daily 10am–8pm. Pony rides, barnyard animals, kids' rodeo corral. 2025 prices were $15 weekday and $20 weekend. | same guide |
| **Bloomingcamp Ranch**, Oakdale (Hwy 120) | ✅ Fri–Sun | ✅ Fri–Sun | ✅ Fri–Sun | Wed–Sun 9am–4pm (so no Friday evening). Apples, pies. | bloomingcampranch.com |
| **Oakdale Cheese & Specialties** (Hwy 120) | ✅ | ✅ | ✅ | Daily 9am–6pm; goats | oakdalecheese.com |
| **Indigeny Reserve**, Sonora (off 108) | ✅ (Oct 4: Bach Music Fest 2–5pm) | ⚠ **Sat Oct 10 closes at 4pm** (on-site wedding) | ✅ **Fall Festival Oct 17 & 18**: live music 12–3, **free kids activities**, cider release, vendors, food trucks | Hours: Mon–Thu and Sun 11am–5:30pm, Fri–Sat 11am–6pm. The home page separately says the "tasting room 10am–5pm" and "preserve open 8am–6pm" (conflict). U-pick "September 2026". The cider is alcoholic. | indigenyreserve.com; /indigeny-events/ |
| **Railtown 1897 SHP**, Jamestown (108) | park ✅ | **Harvest Haunt trains Oct 10–11** ✅ | Harvest Haunt Oct 17–18 ✅; **Skeleton Starlight Sat Oct 17** at 6 and 7:30pm | Harvest Haunt departs 10:30, 12, 1:30, 3. **$23 adult, $18 youth 6–17, 5 and under free.** Skeleton Starlight $35 / $23 (3–17), 45 minutes. Park open daily 9:30–4:30 (Apr–Oct); park-only admission $5/$3. | railtown1897.org/events/harvest-haunt; /events/skeleton; /visit/general-information |
| **Columbia SHP Harvest Festifall** (near Sonora) 🎨 | ❌ | ✅ **Oct 10–11, 10am–5pm** | ❌ | Crafts, live music, face painting, **gold panning, stagecoach rides, candle making** | visittuolumne.com/eventdetail/193 |
| **Cover's Apple Ranch**, Tuolumne | ? | ? | ? | Closed Sundays. Pumpkin patch and hay maze "all October" (snippet). Fall Festival is on one Saturday (date not found). | farmsoftuolumnecounty.org; snippet |
| **Leaves in the Loop**, Gull Lake Park, June Lake 🎨 | ❌ | ✅ **Oct 9–11** | ❌ | 2026 dates confirmed. The detailed schedule on the page is **2025's** (the pumpkin patch ran 12–3). Includes pumpkin patch, pumpkin carving, Fall Art with Mono Arts Council, historical walk. | junelakeloop.org/all-events/leaves-in-the-loop.html; monocounty.org fall events |
| **Woolly's OkTUBERfest + pumpkin patch**, Mammoth | ✅ **Sat Oct 3** | Woolly's open, but OkTUBERfest is not listed | ❌ | Pumpkin decorating, face painting | monocounty.org fall events; mammothmountain.com |
| **Bridgeport Oktoberfest** | ❌ | ✅ Sat Oct 10 | ❌ | Afternoon and evening; "games… for all ages" (snippet) | monocounty.org fall events |
| **Walker Star Party** ✨ | ✅ Fri Oct 2 | ❌ | ❌ | Telescopes | monocounty.org fall events |
| Benton Music & Arts Festival | ✅ Oct 3 | ❌ | ❌ | Family-friendly | monocounty.org |
| Chalfant Big Trees pumpkin patch (near Bishop) | ? | ? | ? | "opens its annual pumpkin patch in October" (no dates) | monocounty.org |
| **Devils Postpile shuttle** | ✅ Sat–Sun | ✅ Sat–Sun (last weekend) | Road open Sat–Sun, shuttle ended | see section 3 | NPS; Mammoth Mtn |
| **Woolly's Adventure Summit** | ✅ Fri–Sun | ✅ Fri–Sun (last weekend) | ❌ | 12–5pm | mammothmountain.com |
| **G&M Farms**, Livermore (Sunday return) | ✅ | ✅ | ✅ | Oct 2–31. **Closed Mon–Tue.** Patch: Sun 10am–6pm, Sat 10am–7pm, Wed–Fri 3–7pm. Hayride, pedal carts and cow train weekends only. Haunted maze Oct 17 & 24. | gmfarms.com |
| **Joan's Farm**, 4351 Mines Rd, Livermore | ✅ | ✅ | ✅ | Oct 2–31, **Tue–Sun 10am–6pm** (activities end 5:30); closed Mondays except Columbus Day. **$5 parking.** Animals, pumpkins. | joansfarm.com (last-mod Sep 19, 2026) |
| Yosemite fee-free day | — | — | — | Oct 27 (outside all windows) | monocounty.org fall events |

**Fall color context:** as of 9/18–9/25 reports, Bishop Creek was near peak in places, Rock Creek and Virginia Lakes patchy, and June Lake, Lundy and Convict "just starting". For the Mono and June Lake areas, Oct 9–11 or later is likely better than Oct 2–4; this timing call is an inference. Sources: californiafallcolor.com/2026/09/18/follow-the-yellow-leaf-road/ and the Sep 25 Flying Dawn Marie report (snippet).

---

### 5. BISHOP CREEK / ROCK CREEK resorts serving food in October

| Resort | October food service | Season end | Source |
|---|---|---|---|
| **Parchers Resort** (South Lake Rd) | "South Fork Restaurant" serves breakfast **Fri–Sun 7–11am**; sandwich menu **8am–6pm seven days**. Muffins and cinnamon rolls; store sells art supplies and toys. | "summer and fall seasons"; **end date not stated** | parchersresort.net/cafestore (© 2025) |
| **Bishop Creek Lodge** (2100 S Lake Rd) | **Cafe Thu–Sun 11am–8pm, closed Mon–Wed.** Store and bar Mon–Wed 8am–4pm, Thu–Sun 8am–8pm. | "last Saturday of April through the **last Saturday of October**" (Oct 31, 2026 by calendar) | bishopcreekresort.com (page timestamp 2025-06-13; © 2016–2026) |
| **Rock Creek Lakes Resort** | Grill: "breakfast served daily until 10:30 AM", "lunch seven days a week until 3 pm". BBQ and burgers. **The official site no longer mentions pie.** The Mono County listing still describes "famous pies". | Cabins run "through the middle of October". Mono County listing: "mid-May through mid-October". **Oct 16–18 is risky; call 760-935-4311 (number from snippet).** | rockcreeklakesresort.com; monocounty.org/listing/rock-creek-lakes-resort/656/ |

---

### Could not verify
- **Whoa Nellie Deli's 2026 closing date.** Sources say "first week in October" vs "last Sunday in October". Call 760-647-1088.
- Latte Da closing date; Epic Cafe location and status; Mono Market and Mono Inn hours (snippets only).
- Schat's Bishop, Holy Smoke, Jack's, Black Sheep and Spellbinder hours: snippets only (Yelp/Tripadvisor block fetches; the official sites give no hours or are behind Cloudflare). Burger Barn not researched.
- Old New York Deli, Giovanni's Pizza, Tiger Bar exact hours, and June Lake coffee shops (The Lift, June Lake Junction).
- Mono Basin Scenic Area Visitor Center fall 2026 closing date (FS says 9–5 with no end date; Visit Mammoth says 8–5).
- Mono Lake Committee Information Center fall hours, and South Tufa ranger or naturalist walk times in October (monolake.org blocked).
- Whether the Inyo Craters closure blocks the craters trail; Lake Mary Rd (Lakes Basin) status in October.
- Whether Devils Postpile allows private vehicles on Oct 17–18 after the shuttle ends.
- Whether Woolly's "Summer Only" gem mining and fossil hunt run on October weekends; Woolly's pass prices.
- Rock Creek Lakes Resort's exact 2026 closing date, and whether pie is still sold; Parchers' closing date.
- Silver Lake Resort Café's exact mid-October closing date (plus one "temporarily closed" aggregator note).
- Chester's Pumpkin Pasture opening date (conflicting); Cover's Apple Ranch Fall Festival date and caramel apples; Chalfant pumpkin patch dates.
- Caramel apples at Schat's, Bloomingcamp and Snap N Crackle Candy.
- Old Marina fee; restrooms at South Tufa, Panum and Lundy; Parker Lake trail distance; McGee Creek and North Lake walk distances.
- Any 2026 star party or dark-sky program in Mammoth or Lee Vining.
- Iron Door Saloon's Saturday hours and minors policy.
- Mountain Rambler kitchen hours (only the pub hours are on the official page).

---

## Scripture texts, permissions, and Bible app links

Accessed 2026-09-27. Everything below was fetched with curl or WebFetch. No accounts were created and no forms were submitted.

### Bottom line

- The app quotes **25 verses** from 15 short passages. That is far below both publishers' **500-verse** gratis limits, and no passage comes close to half a book or a complete book.
- The **25%-of-the-work** rule is the one to watch. Scripture must make up less than 25% of the app's total text, so the devotions, trip guide and other content need to be most of the words. Both publishers use the same test.
- Put the full notices for both versions on an "About / Credits" screen, and put "(ESV)" or "(NIV)" after each quotation. If both versions appear, open each notice with "Scripture quotations marked (ESV)…" and "Scripture quotations marked NIV…". The exact wording is given below.
- **Don't publish the app (or its text) under a Creative Commons license.** The ESV notice forbids quoting the ESV in any work "made available to the public by a Creative Commons license". If the repo or site carries a CC license, leave the Scripture text out of it.

---

### 1. Permissions

#### ESV (Crossway)

**Primary source:** https://www.crossway.org/permissions/ (HTTP 200, accessed 2026-09-27). The page has Print, Digital, Audio, Artwork and Music tabs, and the core limit text is the same in each.

**Verse limits (Digital tab, verbatim):**
> "The ESV text may be quoted in print, digital, and audio formats up to and inclusive of five hundred (500) verses without a formal license or express written permission of Crossway, provided that the verses quoted do not amount to more than one-half of any one book of the Bible or its equivalent measured in bytes, nor do the verses quoted account for twenty-five percent (25%) or more of the total text of the work in which they are quoted, and the verses are not being quoted in a commentary or other biblical reference work."

- Verse cap: **500** (not 1,000).
- Book rule: **not more than one-half of any one book**. There is no separate "complete book" clause, because half a book is the stricter test.
- Share of the work: **less than 25%** of the total text of the work.
- Not allowed in a commentary or other biblical reference work.
- Crossway's page lists "Website", "Blog" and "Social Media" as common uses under **Digital**.

**Required notice (Digital tab, verbatim; the current text edition is 2025):**
> "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved."

Where it goes: "on the title page or copyright page of printed works quoting from the ESV, or in a corresponding location when the ESV is quoted in other media". The Digital tab says the notice "must appear as follows on digital works quoting from the ESV".

**When more than one translation is quoted (verbatim):**
> "When more than one translation is quoted in printed works or other media, the foregoing notice of copyright should begin as follows: 'Unless otherwise indicated, all Scripture quotations are from… [etc.]'; or, 'Scripture quotations marked (ESV) are from… [etc.].'"

**Abbreviated notice.** Crossway's Print tab says:
> "When quotations from the ESV text are used in non-saleable media, such as church bulletins, orders of service, posters, transparencies, or similar media, a complete copyright notice is not required, but the initials (ESV) must appear at the end of the quotation."

Bible Gateway's ESV copyright block, which carries the 2025 notice, has the same rule reworded as "non-saleable print and digital media". Source: https://www.biblegateway.com/versions/English-Standard-Version-ESV-Bible/.

**Trademark:** "The 'ESV' and 'English Standard Version' are registered trademarks of Crossway. Use of either trademark requires the permission of Crossway." Using "(ESV)" as a citation label is ordinary attribution. Don't use the ESV logo or branding.

**Non-commercial and app rules.** These come from the ESV API terms at https://api.esv.org/ (accessed 2026-09-27). They bind API users. For a static app with 25 hard-coded verses, the standard 500-verse guideline above is what applies. The API terms are still useful as Crossway's view of websites and apps:
- The API is "free of charge for non-commercial use". A **non-commercial** site is defined as follows: it "does not charge for access to any part of the site. Further, no charge is made for access to the ESV text. In contrast, a commercial website is primarily designed to motivate visitors to buy something, to pay for a service, or to give a donation, or it accepts advertising or sponsorships."
- Mobile apps: "its use in mobile apps or other digital media is permitted without formal permission, provided all general conditions stated above are met."
- Web display rule: "With each quotation, include the letters 'ESV.'" A notice must also be on a copyright page. API users must also "include a link to www.esv.org" on each page that uses the text, and must not display or cache more than 500 verses or half a book.
- Text changes: "You may not change any of the words in the text. You may choose to omit certain features, such as headings, footnotes, cross-references, and verse numbers." Omissions inside a quotation need an ellipsis (…).
- API notice variant, verbatim: "Scripture quotations marked “ESV” are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language."

**Older wording for comparison.** The ESV Global Study Bible copyright page (https://www.esv.org/resources/esv-global-study-bible/copyright-page/, Text Edition 2016) says "five hundred (500) **consecutive** verses", with the same one-half-of-a-book and 25% tests. The current crossway.org wording drops "consecutive".

#### NIV (Biblica / Zondervan)

**Access note:** biblica.com (including /permissions/ and the FAQ pages) and thenivbible.com returned **HTTP 403 (Cloudflare challenge)** to both curl and WebFetch, and the Wayback Machine was unreachable through the proxy. The NIV terms below therefore come from two authorized mirrors, both fetched verbatim on 2026-09-27:
1. **HarperCollins Christian Publishing (Zondervan)**: https://www.harpercollinschristian.com/permissions/ (HTTP 200). Zondervan holds NIV commercial rights in North America.
2. **Bible Gateway's NIV copyright block**, which is Biblica's standard notice: https://www.biblegateway.com/versions/New-International-Version-NIV-Bible/ (HTTP 200).

**Verse limits (Bible Gateway / Biblica wording, verbatim):**
> "The NIV text may be quoted in any form (written, visual, electronic or audio), up to and inclusive of five hundred (500) verses without express written permission of the publisher, providing the verses do not amount to a complete book of the Bible nor do the verses quoted account for twenty-five percent (25%) or more of the total text of the work in which they are quoted."

**Verse limits (HarperCollins / Zondervan "Gratis Use Guidelines", verbatim):**
> "Text from the NIV or NIrV Bible may be quoted in any form (written, visual, electronic, or audio), up to and inclusive of 500 verses or less without written permission, providing the verses quoted do not amount to more than 50% of a complete book of the Bible, nor do verses quoted account for 25% or more of the total text of the work in which they are quoted, and the verses are not being quoted in a commentary or other biblical reference work. This permission is contingent upon an appropriate copyright acknowledgment."

- Verse cap: **500**. Electronic use is explicitly covered.
- Book rule: Biblica says the quotes may **not amount to a complete book**. Zondervan's stricter wording says **not more than 50% of a book**.
- Share of the work: **less than 25%**.
- Zondervan: "Zondervan is granting permission for the latest edition of the NIV text only (currently 2011)…". Our texts are NIV 2011.

**Required notice, Biblica form (Bible Gateway, verbatim):**
> "When the NIV is quoted in works that exercise the above fair use clause, notice of copyright must appear on the title or copyright page **or opening screen** of the work (whichever is appropriate) as follows:
> THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide."

**Required notice, Zondervan form (HarperCollins, verbatim):**
> "Scripture quotations taken from The Holy Bible, New International Version®, NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc. Used with permission of Zondervan. All rights reserved worldwide. www.zondervan.com"

(An unverified search-engine summary of biblica.com/permissions gave a third form: "Scripture quotations taken from The Holy Bible, New International Version® NIV® Copyright © 1973 1978 1984 2011 by Biblica, Inc. TM Used by permission. All rights reserved worldwide." I could not fetch it directly.)

**Abbreviated notice (Bible Gateway, verbatim):**
> "When quotations from the NIV text are used in non-salable media such as church bulletins, orders of service, posters, transparencies or similar media, a complete copyright notice is not required, but the initial NIV must appear at the end of each quotation."

**Other NIV points:**
- "Any commentary or other Biblical reference work produced for commercial sale that uses the New International Version must obtain written permission for the use of the NIV text."
- Zondervan's list of uses that are not gratis includes "Scripture on a product in which the verse stands alone, such as artwork, note cards, crafts, novelty products, and jewelry". Avoid a single-verse printable card or poster made from the NIV. Verses inside devotions are fine.
- Zondervan sends requests for "electronic rights" outside the US and Canada to Biblica. Use inside the US under the gratis guidelines needs no request.
- Trademark: "'New International Version' and 'NIV' are registered trademarks of Biblica, Inc.®"
- Neither Biblica nor Zondervan (as fetched) has an app-specific rule. The gratis rule covers "any form (… electronic …)", and Biblica's notice explicitly allows the "opening screen" as the location.

#### Recommended credits block for the app

Put this on an About/Credits screen. It combines the verbatim notices.

> Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved.
>
> Scripture quotations marked (NIV) are taken from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.

After each verse, show the reference and then "ESV" or "NIV", for example "Psalm 104:24 (ESV)". Optionally add a link to esv.org or bible.com.

---

### 2. YouVersion (bible.com) deep links

Verified with curl on 2026-09-27. Every URL below returned **HTTP 200**, and the page `<h1>`/`<h2>` and text matched the requested translation. bible.com serves a JavaScript "Client Challenge" page to browser-like User-Agents but real content to a plain curl UA, which is why the 200s were checked against the content.

| Version | ID | bible.com metadata (nodejs.bible.com/api/bible/version/3.1?id=…) |
|---|---|---|
| ESV | **59** | title "English Standard Version 2025", abbr "ESV", publisher Crossway; audio: true; offline download available |
| NIV | **111** | title "New International Version 2011", abbr "NIV11" (displays as "NIV"), publisher Biblica; audio: true; offline download available |

**URL format:**
- Single verse: `https://www.bible.com/bible/{id}/{USFM}.{ch}.{v}.{ABBR}`. Example: https://www.bible.com/bible/59/PSA.104.24.ESV has title "Psalm 104:24 (ESV) - O LORD, how manifold are your works - Bible App".
- **Range: `{USFM}.{ch}.{v1}-{v2}.{ABBR}` works.** Example: https://www.bible.com/bible/111/GEN.1.11-12.NIV returns 200 with h1 "Genesis 1:11-12" and h2 "Genesis 1:11-12 NIV", and shows the text of both verses. On range pages the `<title>`/meta is the generic "Bible - Bible App" and only the body shows the range. That is cosmetic.
- `GEN.1.11-GEN.1.12.NIV` returns **404**, so don't use that form. `GEN.1.11,12.NIV` also renders. Chapter links are `/bible/111/GEN.1.NIV`.
- NIV pages label the book "Psalms 104:24". The ESV pages say "Psalm".
- **USFM codes:** GEN (Genesis), JOB (Job), PSA (Psalms), ECC (Ecclesiastes), ISA (Isaiah), MAT (Matthew).

All 30 URLs in `05-passages.json` (`esvUrl`/`nivUrl`) were fetched and returned 200 with matching text.

---

### 3. Texts

All 15 passages were fetched in both versions. **Total: 25 verses** per version, or 50 verse-quotations counting both. That is about 5% of the 500-verse cap.

**Method.** The primary text comes from bible.com's chapter JSON (`https://nodejs.bible.com/api/bible/chapter/3.1?id={59|111}&reference={BOOK}.{ch}`), parsed by the `data-usfm` verse spans. Footnotes, cross-references, verse numbers and headings were dropped, and `nd` spans (small-caps LORD) were kept as "LORD". It was cross-checked against:
- the rendered bible.com passage page, for every passage and both versions;
- Bible Gateway (`/passage/?search=…&version=ESV|NIV`), for every passage and both versions;
- esv.org, one page per verse (`https://www.esv.org/Book+ch:v/`), ESV only.

**Differences between sources.** There are no wording differences at all. The only discrepancies:
1. **Ecclesiastes 3:1 (ESV and NIV):** the rendered bible.com verse-page summary drops the trailing colon. The chapter JSON, Bible Gateway and esv.org all end in ":". The JSON keeps the colon.
2. **Ecclesiastes 3:11 ESV:** Bible Gateway uses a straight apostrophe ("man's"), while bible.com and esv.org use a curly one ("man’s"). This is typographic only.
3. **Edition labels:** bible.com's ESV (id 59) is now titled "English Standard Version 2025", though its long copyright blurb still reads "ESV Text Edition: 2016". Bible Gateway shows the 2025 notice. For these 15 passages the ESV text is identical on bible.com, Bible Gateway and esv.org, so the edition makes no difference here. Use the 2025 notice.

**Display cautions.** These come from the verbatim punctuation and are also in each JSON `note`:
- Genesis 8:22 ESV ends with a closing ” that has no opening quote in the excerpt.
- Isaiah 40:8 NIV ends with a closing ” that has no opening quote in the excerpt.
- Matthew 6:28 NIV and Job 12:7 (both versions) open a “ that does not close in the excerpt.
- Psalm 96:12 ESV starts with lowercase "let" and has no final punctuation.
- Ecclesiastes 3:1 ends with ":" in both versions.

Quoting a partial verse is allowed, but the API terms say omissions need an ellipsis (…) and must not change the meaning.

#### Genesis 1:11–12 (2 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/GEN.1.11-12.ESV)): And God said, “Let the earth sprout vegetation, plants yielding seed, and fruit trees bearing fruit in which is their seed, each according to its kind, on the earth.” And it was so. The earth brought forth vegetation, plants yielding seed according to their own kinds, and trees bearing fruit in which is their seed, each according to its kind. And God saw that it was good.
- **NIV** ([bible.com](https://www.bible.com/bible/111/GEN.1.11-12.NIV)): Then God said, “Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds.” And it was so. The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good.

#### Genesis 8:22 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/GEN.8.22.ESV)): While the earth remains, seedtime and harvest, cold and heat, summer and winter, day and night, shall not cease.”
- **NIV** ([bible.com](https://www.bible.com/bible/111/GEN.8.22.NIV)): “As long as the earth endures, seedtime and harvest, cold and heat, summer and winter, day and night will never cease.”
- _Note:_ ESV ends with a closing ” (God's speech begins in 8:21) and has no opening quote; NIV is a self-contained quote “…”. For display, either drop the unmatched ESV ” with care or keep verbatim.

#### Psalm 19:1–2 (2 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.19.1-2.ESV)): The heavens declare the glory of God, and the sky above proclaims his handiwork. Day to day pours out speech, and night to night reveals knowledge.
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.19.1-2.NIV)): The heavens declare the glory of God; the skies proclaim the work of his hands. Day after day they pour forth speech; night after night they reveal knowledge.

#### Psalm 104:24 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.104.24.ESV)): O LORD, how manifold are your works! In wisdom have you made them all; the earth is full of your creatures.
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.104.24.NIV)): How many are your works, LORD! In wisdom you made them all; the earth is full of your creatures.
- _Note:_ NIV 'LORD' is in small caps in print (rendered here as LORD).

#### Psalm 104:19 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.104.19.ESV)): He made the moon to mark the seasons; the sun knows its time for setting.
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.104.19.NIV)): He made the moon to mark the seasons, and the sun knows when to go down.

#### Psalm 104:10–12 (3 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.104.10-12.ESV)): You make springs gush forth in the valleys; they flow between the hills; they give drink to every beast of the field; the wild donkeys quench their thirst. Beside them the birds of the heavens dwell; they sing among the branches.
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.104.10-12.NIV)): He makes springs pour water into the ravines; it flows between the mountains. They give water to all the beasts of the field; the wild donkeys quench their thirst. The birds of the sky nest by the waters; they sing among the branches.

#### Ecclesiastes 3:1 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/ECC.3.1.ESV)): For everything there is a season, and a time for every matter under heaven:
- **NIV** ([bible.com](https://www.bible.com/bible/111/ECC.3.1.NIV)): There is a time for everything, and a season for every activity under the heavens:
- _Note:_ Both end with a colon (lead-in to 3:2–8). bible.com's verse-page summary drops the colon; chapter data, Bible Gateway and esv.org keep it.

#### Ecclesiastes 3:11 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/ECC.3.11.ESV)): He has made everything beautiful in its time. Also, he has put eternity into man’s heart, yet so that he cannot find out what God has done from the beginning to the end.
- **NIV** ([bible.com](https://www.bible.com/bible/111/ECC.3.11.NIV)): He has made everything beautiful in its time. He has also set eternity in the human heart; yet no one can fathom what God has done from beginning to end.
- _Note:_ Bible Gateway ESV uses a straight apostrophe (man's); bible.com and esv.org use a curly one (man’s). Same words.

#### Isaiah 40:8 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/ISA.40.8.ESV)): The grass withers, the flower fades, but the word of our God will stand forever.
- **NIV** ([bible.com](https://www.bible.com/bible/111/ISA.40.8.NIV)): The grass withers and the flowers fall, but the word of our God endures forever.”
- _Note:_ NIV ends with a closing ” (quote opens in 40:6); ESV has none.

#### Matthew 6:28–30 (3 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/MAT.6.28-30.ESV)): And why are you anxious about clothing? Consider the lilies of the field, how they grow: they neither toil nor spin, yet I tell you, even Solomon in all his glory was not arrayed like one of these. But if God so clothes the grass of the field, which today is alive and tomorrow is thrown into the oven, will he not much more clothe you, O you of little faith?
- **NIV** ([bible.com](https://www.bible.com/bible/111/MAT.6.28-30.NIV)): “And why do you worry about clothes? See how the flowers of the field grow. They do not labor or spin. Yet I tell you that not even Solomon in all his splendor was dressed like one of these. If that is how God clothes the grass of the field, which is here today and tomorrow is thrown into the fire, will he not much more clothe you—you of little faith?
- _Note:_ NIV opens with “ that does not close within these verses (Jesus' speech continues). ESV has no quotation marks here.

#### Job 12:7–10 (4 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/JOB.12.7-10.ESV)): “But ask the beasts, and they will teach you; the birds of the heavens, and they will tell you; or the bushes of the earth, and they will teach you; and the fish of the sea will declare to you. Who among all these does not know that the hand of the LORD has done this? In his hand is the life of every living thing and the breath of all mankind.
- **NIV** ([bible.com](https://www.bible.com/bible/111/JOB.12.7-10.NIV)): “But ask the animals, and they will teach you, or the birds in the sky, and they will tell you; or speak to the earth, and it will teach you, or let the fish in the sea inform you. Which of all these does not know that the hand of the LORD has done this? In his hand is the life of every creature and the breath of all mankind.
- _Note:_ Both open with “ that does not close within these verses (Job's speech continues).

#### Psalm 96:12 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.96.12.ESV)): let the field exult, and everything in it! Then shall all the trees of the forest sing for joy
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.96.12.NIV)): Let the fields be jubilant, and everything in them; let all the trees of the forest sing for joy.
- _Note:_ ESV starts lowercase ('let') and ends with no punctuation (sentence continues into v.13 'before the LORD, for he comes…'). NIV is a complete sentence.

#### Psalm 118:24 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.118.24.ESV)): This is the day that the LORD has made; let us rejoice and be glad in it.
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.118.24.NIV)): The LORD has done it this very day; let us rejoice today and be glad.

#### Psalm 147:4 (1 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.147.4.ESV)): He determines the number of the stars; he gives to all of them their names.
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.147.4.NIV)): He determines the number of the stars and calls them each by name.

#### Psalm 8:3–4 (2 v.)
- **ESV** ([bible.com](https://www.bible.com/bible/59/PSA.8.3-4.ESV)): When I look at your heavens, the work of your fingers, the moon and the stars, which you have set in place, what is man that you are mindful of him, and the son of man that you care for him?
- **NIV** ([bible.com](https://www.bible.com/bible/111/PSA.8.3-4.NIV)): When I consider your heavens, the work of your fingers, the moon and the stars, which you have set in place, what is mankind that you are mindful of them, human beings that you care for them?

---

### 4. YouVersion Bible App: offline and audio

- **Offline reading: yes, for both ESV and NIV.** bible.com's version metadata lists an `offline` download package for id 59 (ESV) and id 111 (NIV) on iOS and Android. It also sets `require_email_agreement: true`, which fits the **"Agree and Download"** step in the help article. Help pages:
  - iOS: https://help.youversion.com/l/en/article/e3fjtnsoil-download-offline-bible-ios. On the version: "select ⋯ > Download > Agree and Download". The article also notes "Not all Bible versions are available for download."
  - Android: https://help.youversion.com/l/en/article/nt30evl62u-offline-bible. "Change the Bible version and any Bible version that’s selected will be automatically downloaded and will be ready to be used offline."
  - Tip for families: open the app and download ESV and NIV **before** the trip, while on Wi-Fi.
- **Audio: yes, for both, but streaming only.** The version metadata has `audio: true` for both.
  - The ESV narration is "ESV Hear the Word Audio Bible".
  - NIV has several narrations, including "The Listener’s Bible®: NIV Edition" and an American synthetic voice.
  - bible.com's audio-versions list (https://www.bible.com/audio-bible-app-versions) includes both.
  - **Audio cannot be downloaded for offline use.** The iOS and Android help FAQ says: "Regrettably, the current version of the App doesn’t support downloading audio for offline use. This limitation arises from the substantial storage space that audio files occupy on mobile devices…"
  - Web audio: https://help.youversion.com/l/en/article/49q7m4o9v6-bible-com-audio. "An audio icon next to a version name indicates it includes audio. Audio versions on the Web feature a single narrator."
  - Android audio: https://help.youversion.com/l/en/article/q0f56wuz5c-android-audio-bible.
  - In short, the audio needs a data connection. Don't count on it in dead zones.

### Files
- JSON: `05-passages.json`. Per passage it has `esv`, `niv`, `esvLines`, `nivLines`, the URLs, the sources, `verseCount` and `note`, plus a top-level `verseCount` (25) and `meta`.
- Raw fetches and parsers: `research/raw/`.

---

## Hotwire Hot Rates: live triangulation (Mammoth Lakes, Oct 9–11)

> **Re-verified live on 2026-09-27, 23:23–23:38 UTC (evening), with two independent agents: one confirming, one trying to refute.** Nothing was booked; no sign-in; no forms.
> - **Identity unchanged: The Village Lodge, about 99–99.5%.** All 27 search results were identical to the morning capture, field by field. Five signals now agree:
>   1. Image ID 2242771.
>   2. 4.5/1,009 reviews, 0.5 mi from search, $28.75 resort fee.
>   3. Trilateration 0.000–0.001 mi from the property.
>   4. Reviews naming "The Village Lodge".
>   5. New: the detail page now says "guaranteed to be 1 of these 3", listing The Village Lodge plus two vacation-rental decoys. Both decoys have 0–3 reviews and no resort fee, so neither can produce this card.
> - **Hot Rate unchanged:** "Condo, 2 Bedrooms (Two Bedroom Condominium)", $346.55/nt, **$693.10 all-in** ($635.60 charged by Hotwire, plus $57.50 resort fee at the hotel). Non-refundable, 4 guests maximum.
> - **Correction to the value math below:** the same room type is on **vacation.hotwire.com (retail), refundable, for all 5 travelers (2 adults + kids 7, 6, 6): $405/nt, $810 total with taxes and fees (resort fee included).**
>   - Reserve now and pay a deposit.
>   - Fully refundable before **Wed Oct 7, 7:00 pm**. After that and before arrival, cancelling costs the first night.
>   - **So the Hot Rate saves about $117 (14%), not $251.** The $944 benchmark below was Google's rate from the morning.
> - Caveats:
>   - Expedia's room tile shows "1 King + 1 Queen, sleeps 6". The third child presumably uses the sitting-room queen sofa bed; not verified for this unit type.
>   - The building (Lincoln House, Grand Sierra Lodge or White Mountain) is not guaranteed.
> - Raw captures: `scratchpad/hotwire-recheck/`.

**Status: LIVE.** Hot Rates were loaded in a real Chromium browser (Playwright) on hotwire.com on **2026-09-27, 16:03–16:19 UTC**. No sign-in, no account, no booking. Only searches and "view details" pages were loaded (about 10 page loads).

Setup note: the first Chromium launch failed with `ERR_CERT_AUTHORITY_INVALID` because the browser's NSS trust store was empty. I installed `libnss3-tools` and added the session proxy CA (`/root/.ccr/agent-proxy-ca.crt`) to `~/.pki/nssdb`. TLS verification stayed on. After that, hotwire.com loaded normally, with no CAPTCHA and no bot wall.

Raw captures are in `scratchpad/hotwire/`: screenshots `07-…png` to `16-…png`, page text `*.txt`, API JSON `*-all.json` and `*-net.json`, POI JSON `*-poi.json`, and walking routes `walk.json`.

---

### 0. Bottom line

- **Best Hot Rate for this family:** the **"3.5-star All-suites Hotel in Mammoth Lakes area"** (4.5/5, 1,009 reviews, 0.5 mi from the search center).
  - **It is The Village Lodge (≈99% confidence).**
  - Choose the **"Condo, 2 Bedrooms (Two Bedroom Condominium)"** room option: **$347/nt, $693 total for 2 nights, all-in.** That is **about $251 (27%) less than the $944 refundable Village Lodge benchmark.**
  - Location: about 4 minutes' walk to The Village, and every unit has a kitchen and gas fireplace.
  - **Catch 1: non-refundable.** "All bookings are final (no refunds, no changes)."
  - **Catch 2: Hotwire allows at most 4 guests per room.** A 5-guest search returns *"Maximum occupants per room exceeded"*. You would book 2 adults + 2 children and then ask the property to add the 5th guest. The property itself allows **6** in a 2-bedroom.
- **Cheapest good Hot Rate:** "3.5-star Condo". **It is Juniper Springs Resort (≈99%).** The 2-bedroom (with 2 twins) option is **$290/nt, $580 total**, about $206 below the $786 refundable Juniper benchmark. But Juniper is **not walkable** to cafés: 1.4 mi / 29 min to The Village and 1.7 mi to Main St.
- **Default "hotel chooses room" Hot Rates** ($232–284/nt) are **not safe for 5 people.** At Juniper and Village Lodge, studios and 1-bedrooms have a **maximum occupancy of 4**, and the property enforces maximum occupancy. Only choose a Hot Rate with an explicit 2-bedroom room type.

---

### 1. How the search was run (and occupancy findings)

- **URL format** (found through the site's own search form): `https://www.hotwire.com/hotels/search?destination=Mammoth%20Lakes&startDate=2026-10-09&endDate=2026-10-11&rooms=1&adults=2&children=2`
- **Children limit in the UI:** the guest picker would not go past 2 children with 2 adults in one room; the "+" button disables.
- **5 guests in one room is rejected.** Forcing `children=3` in the URL made the search API return **HTTP 400, `"Maximum occupants per room exceeded"`**, and the page showed "Maximum occupants per room exceeded" (screenshot `08-search-2a3c.png`, 16:07 UTC).
- **Searches that worked:**

| Search | Hot Rates / retail count | Notes |
|---|---|---|
| 1 room, 2 adults + 2 children (main dataset) | 11 Hot Rates / 16 retail | 16:06 UTC |
| 1 room, 2 adults | 11 Hot Rates / 17 retail | 16:18 UTC. Same Hot Rate prices, except Mammoth Mountain Inn a bit lower. Adds a 2.5★ (Mammoth Creek Inn); drops the 2.5★ Quality Inn. |
| 2 rooms, 2 adults + 3 children | 11 Hot Rates / 15 retail | 16:08 UTC. **Every price exactly doubles** (e.g. Juniper $927, Village Lodge $1,386). Two rooms is never the smart way to fit 5 here. |

- **Hotwire booking terms** on every Hot Rate detail page:
  - "**Rooms sleep the number of guests.** Bed types and sizes aren't guaranteed."
  - When you pick a named room type: "Your selected bed type is guaranteed."
  - "All bookings are final (no refunds, no changes)."
  - "Your account will be charged for the full amount when you book."
  - The resort fee is collected by the hotel at check-in. Hotwire's displayed "per night / total" figures **include taxes and the resort fee** (the API's `totalWithResortFee`), under California price-display rules.
  - Source: `details/hotel/opaque` API responses behind the detail pages listed in §3, accessed 16:10–16:17 UTC.

### 2. How the identities were decoded (method)

Four independent signals were used. They agreed for every Hot Rate that had a detail page.

1. **Image ID leak.** Each Hot Rate card's JSON `imageURL` uses Expedia's lodging path (`images.trvl-media.com/lodging/…/<ExpediaID>/…`). That number equals the `partnerHotelId` and image path of a **named** result in the same search. It also matches Hotwire's public hotel pages: Juniper Springs = h984058 and Village Lodge = h2242771 ([Hotwire Juniper page](https://www.hotwire.com/Mammoth-Lakes-Hotels-Juniper-Springs-Resort.h984058.Hotel-Information), [Hotwire Village Lodge page](https://www.hotwire.com/Mammoth-Lakes-Hotels-The-Village-Lodge.h2242771.Hotel-Information), via web search 2026-09-27 ~16:20 UTC).
2. **Review fingerprint.** Hot Rate and named result show the identical Expedia rating and review count (e.g. 4.5/1,009, 4.4/1,326), the identical "miles from search", and the identical resort fee to the cent.
3. **Trilateration.** Each Hot Rate detail page lists exact distances to about 10 points of interest, with coordinates, through the `v1/poi` API. A least-squares fit of those distances puts the hidden hotel **0.001–0.07 mi from the named hotel's published coordinates**. The next-closest property is at least 0.13 mi away (table in §3).
4. **Review text.** The Hot Rate "content" API returns guest reviews that name the property. For example, the all-suites Hot Rate returned a review saying "…our stay at **The Village Lodge**".

BetterBidding's Hotwire list for Mammoth Lakes ([link](https://www.betterbidding.com/index.php?app=hotel_lists&location=Mammoth+Lakes-CA&tid=971), fetched 2026-09-27 ~16:21 UTC) still shows no hotel entries without JavaScript. It was not needed.

### 3. Hot Rates found (1 room, 2 adults + 2 children, Oct 9–11)

All prices are Hotwire's all-in display (tax + resort fee). "Strike" is Hotwire's "retail" comparison per night. **Every Hot Rate is non-refundable, and the booking is for 4 guests maximum.**

| # | Hot Rate card (as shown) | Rating / reviews | Dist. from search | Amenity icons (API codes) | Default room $/nt · 2-nt total (strike) | Named room options on detail page ($/nt · total) | **Identity** · confidence | Runner-up | Key evidence |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **3.5★ All-suites Hotel** ("Unique") | 4.5 / 1,009 | 0.5 mi | Suite, Resort, Slopeside, Smoke-free, Fitness, Pool, Restaurant, Business ctr, Laundry | $279 · $558 (strike $365) | **Condo, 2 Bedrooms (Two Bedroom Condominium): $347 · $693** | **The Village Lodge** · **99%** | Westin Monache (fit is 0.17 mi off) | Image ID 2242771 = Village Lodge. Retail Village Lodge also shows 4.5/1,009, 0.5 mi, $28.75 resort fee. Trilateration lands **0.004 mi** from it (Village Gondola Station 0.12 mi). Review text names "The Village Lodge". |
| 2 | **3.5★ Condo** | 4.4 / 1,326 | 1.1 mi | Slopeside, **Full kitchen**, Smoke-free, Daily housekeeping, Fitness, Pool, Business ctr, Front desk, 24-h desk | $232 · $463 (strike $302) | **Condo, 2 Bedrooms (Two Bedroom Condominium with 2 Twins): $290 · $580** | **Juniper Springs Resort** · **99%** | Discovery 4 (0.53 mi off) | Image ID 984058 = Juniper. 4.4/1,326 and $28.50 resort fee identical to retail. Trilateration **0.005 mi** (Eagle Express lift 0.07 mi). Reviews mention "steps to the Eagle Lodge". |
| 3 | **3.5★ Hotel** | 4.3 / 401 | 0.7 mi | Free parking, Free internet, Pet friendly, Smoke-free, Fitness, Pool, Restaurant, Laundry | $284 · $567 (strike $349) | Deluxe Suite, Fireplace: $343 · $687. Two Bedroom Condo: $443 · $887 | **Outbound Mammoth** (the former Sierra Nevada Resort, 164 Old Mammoth Rd) · **98%** | Shilo Inn (0.22 mi off) | Image ID 60937 = Outbound. 4.3/401 and $29.05 resort fee identical. Trilateration 0.07 mi (Mammoth Hospital 0.19 mi). A review mentions the "fireplace suite". Former name per [Outbound Instagram / search result](https://www.instagram.com/outboundmammoth/p/Cwnjgalx6ht/). |
| 4 | **3★ "New To Hotwire" Hotel** | 4.0 / 1,024 | 3.4 mi | Pet friendly, Slopeside, Smoke-free, Fitness, Pool, Restaurant, Business ctr, Laundry, Internet | $184 · $368 (strike $238) | Loft Room Sleeps 4: $218 · $435. Studio Condo: $243 · $485. 1-BR Condo: $268 · $535 | **Mammoth Mountain Inn** · **99%** | none (next is 2.3 mi off) | Image ID 983564. 4.0/1,024, 3.4 mi, $28.50 resort fee identical. Trilateration 0.001 mi (Panorama Gondola 0.04 mi). |
| 5 | **3★ Hotel** | 4.1 / 54 | 1.0 mi | Free internet, Smoke-free, Pool, Restaurant, Laundry, Golf nearby, Spa services, Accessible | $276 · $552 (strike $288) | 1-BR Condo Loft: $297 · $595. **2-BR Condo: $349 · $697.** 2-BR Condo Loft: $440 · $880 | **Discovery 4** (condos) · **93%** | Mountainback at Mammoth (0.13 mi) | 4.1/54 and 1.0 mi identical to retail Discovery 4. No resort fee, but a $250 breakage deposit. Trilateration 0.006 mi from Discovery 4 vs 0.134 mi from Mountainback. No image on the card. |
| 6 | **4★ Condo** ("Classic") | 4.5 / "0" (89% recommend) | not shown | Free parking, Free internet, Pet friendly, Smoke-free, Fitness, Pool, Restaurant, Business ctr, Laundry | $399 · $797 (**no discount shown**) | Detail page **failed to load twice** (16:15 and 16:18 UTC) | **The Westin Monache Resort** · **~75%** | A 4★ condo collection such as The Sierra House or "Village 2230 White Mountain Lodge" (~20%) | Resort fee $29.00/nt is identical to retail Westin ($29.00). 4.5 rating is identical. Amenities are a subset of Westin's retail list. Westin's retail price for 4 guests is $414/nt ($828), only 4% more. Limelight, the other 4★ hotel, appears as its own Hot Rate (#7). |
| 7 | 4★ Hotel | no reviews | 0.4 mi | Continental breakfast, Free internet, Smoke-free, Fitness, Pool, Restaurant | $460 · $920 (strike $511) | not opened | **Limelight Mammoth** · 97% | Westin | Image ID 119028980 = Limelight. 0.4 mi and no reviews identical. |
| 8 | 2.5★ Hotel | 3.4 / 1,013 | 0.7 mi | Free parking, Continental breakfast, Free internet, Pet friendly, Laundry | $162 · $323 (strike $219) | not opened | **Shilo Inns Mammoth Lakes** · 97% | — | Image ID 17355. 3.4/1,013 identical. |
| 9 | 2.5★ Hotel ("Family-friendly") | 3.8 / 1,010 | ≤0.25 mi | Free parking, Continental breakfast, Free internet, Business ctr, Laundry | $184 · $369 (strike $205) | not opened | **Quality Inn Near Mammoth Mtn** · 97% | — | Image ID 17405. 3.8/1,010 identical. |
| 10 | 2★ Hotel | 3.9 / 1,004 | ≤0.25 mi | Free parking, Free internet, Pet friendly, Laundry | $158 · $316 (strike $198) | not opened | **Motel 6 Mammoth Lakes** · 97% | — | Image ID 996309. 3.9/1,004 identical. |
| 11 | 2★ "New To Hotwire" Hotel | 3.7 / 427 | ≤0.25 mi | Free parking, Free internet, Pet friendly, Restaurant, Laundry | $197 · $395 (no discount) | not opened | **SureStay Plus by Best Western** · 97% | — | Image ID 874993. 3.7/427 identical. |
| (2-adult search only) | 2.5★ Hotel | 4.2 / 982 | 1.0 mi | Free parking, Free internet, Fitness | $176 · $352 | — | **The Mammoth Creek Inn** · 97% | — | Image ID 1166462. 4.2/982 identical. |

**Sources for the table**

- Search: `https://www.hotwire.com/hotels/search?destination=Mammoth%20Lakes&startDate=2026-10-09&endDate=2026-10-11&rooms=1&adults=2&children=2`, accessed 2026-09-27 16:06 UTC. Also the same search with `children=0` (16:18 UTC) and with `rooms=2&children=3` (16:08 UTC).
- Detail pages (all accessed 2026-09-27):

| Hot Rate | Detail page URL | Time (UTC) |
|---|---|---|
| All-suites (Village Lodge) | `https://www.hotwire.com/hotels/details/MjExMTE2NTQ2MjM2OjMxMTI0NjQ3Mzc0OTI` (ref 311-246-473-7492) | 16:10 |
| Condo (Juniper) | `…/details/MjExMTE2NTQyMDk3OjMxMTI0NjQ3NTUwODc` | 16:11 |
| 3.5★ Hotel (Outbound) | `…/details/MjExMTE2NTQyMDk3OjMxMTI0NjQ3NTUwODM` | 16:13 |
| Mammoth Mountain Inn | `…/details/MjExMTE2NTQyMDk3OjMxMTI0NjQ3NTUwODY` | 16:14 |
| 3★ Hotel (Discovery 4) | `…/details/MjExMTE2NTQ3MjQ3OjMxMTI0NjQ4MTA2NzE` | 16:16 |

Result IDs are session-bound and will not reopen later.

#### Trilateration results (from Hotwire's `v1/poi` distances)

| Hot Rate | Fitted location | Error of fit | Nearest named hotel (distance) | 2nd nearest |
|---|---|---|---|---|
| All-suites | 37.6516, −118.9864 | 0.003 mi | Village Lodge (0.004 mi) | Westin Monache (0.166) |
| Condo | 37.6360, −118.9891 | 0.003 | Juniper Springs (0.005) | Discovery 4 (0.528) |
| 3★ Hotel | 37.6424, −118.9945 | 0.005 | Discovery 4 (0.006) | Mountainback (0.134) |
| 3.5★ Hotel | 37.6436, −118.9675 | 0.006 | Outbound Mammoth (0.072) | Shilo Inn (0.219) |
| 3★ New-to-Hotwire | 37.6514, −119.0386 | 0.001 | Mammoth Mountain Inn (0.001) | Mammoth Ski & Racquet (2.26) |

Named-hotel coordinates are the `hotelLatLong` values in the same Hotwire search JSON.

#### Retail (named) results on the same search (1 room, 4 guests, all-in 2-night totals)

These are the cheapest room types, probably not 5-person units.

| Property | 2-night total |
|---|---|
| Mammoth Mountain Inn | $426 |
| Juniper Springs | $538 |
| Westin Monache | $828 |
| Village Lodge | $651 |
| Mammoth Mountain Reservations Condo Collection | $653 |
| Limelight | $1,131 |
| Shilo Inn | $392 |
| Discovery 4 | $595 |
| Mammoth Ski & Racquet Club | $653 |
| Outbound | $718 |
| Motel 6 | $339 |
| Ventura Grand Inn | $380 |
| The Mammoth Inn | $776 |
| Quality Inn | $412 |
| Mountainback | $849 |
| SureStay Plus | $402 |

Source: same search URL, 16:06 UTC.

### 4. Top candidates: walkability, beds for 5, kitchen and fireplace

Walking routes come from the OSM foot router (`routing.openstreetmap.de/routed-foot`). Café coordinates come from Nominatim: Black Velvet 3343 Main St → 37.64766, −118.97212; Stellar Brew 3280 Main St → 37.64822, −118.97011; 437 Old Mammoth Rd → 37.63968, −118.96633; The Village 6201 Minaret Rd → 37.65052, −118.98518. Both were accessed 2026-09-27 ~16:22 UTC.

| Property (Hot Rate) | To The Village (6201 Minaret; RMCF Village store) | To Black Velvet / Stellar Brew (Main St) | To 437 Old Mammoth Rd (Booky Joint, RMCF) | Sleeps 5? | Kitchen / fireplace |
|---|---|---|---|---|---|
| **Village Lodge** (1111 Forest Trail) | **0.17 mi / 4 min** (shops and restaurants are downstairs) | 1.0 mi / 22 min · 1.1 mi / 24 min | 2.0 mi / 43 min | Default room: studio or 1-BR, **max 4, so no**. **2-BR condo: max 6, yes.** Hotwire reservation is for 4, so the 5th guest has to be added with the property. | Every unit has a full kitchen and a **gas fireplace**, per [mammothmountain.com Village Lodge page](https://www.mammothmountain.com/plan-your-trip/mammoth-hotels/the-village-lodge) (accessed 16:19 UTC). The page lists maximum occupancy as Studio 4, 1 BR 4, 1 BR + Den 6, 2 BR 6, 3 BR 8, and says it enforces maximum occupancy. |
| **Juniper Springs** (4000 Meridian Blvd) | 1.4 mi / 29 min | 1.7 mi / 37 min · 1.8 mi / 39 min | 1.5 mi / 33 min | 2-BR condo "with 2 Twins": max 6, yes. | Full kitchen and gas fireplace in all units. Fireplaces are off in summer but "may be lit upon request". Occupancy: Studio 4, 1 BR 4, 2 BR 6. Source: [Juniper page](https://www.mammothmountain.com/plan-your-trip/mammoth-hotels/juniper-springs-resort) (16:19 UTC). There is a coffee shop on site. |
| **Outbound Mammoth** | 1.5 mi / 32 min | **0.6 mi / 12 min · 0.5 mi / 11 min** | **0.3 mi / 7 min** | "Deluxe Suite, Fireplace": occupancy not stated, assume 4. "Two Bedroom Condo" ($887) probably sleeps 5 but was not verified. | Fireplace suite. Kitchen only in condos (not verified). |
| Westin Monache (4★ condo guess) | 0.2 mi / 5 min | 1.1 mi / 23 min | 2.0 mi / 44 min | Room type unknown (the detail page did not load) | Not verified |
| Discovery 4 | 1.0 mi / 21 min | 1.5–1.6 mi / 33 min | 2.3 mi | 2-BR condo $697. Occupancy not verified. | Condo kitchens likely. $250 breakage deposit. |
| Mammoth Mountain Inn | 4.2 mi (not walkable) | 5 mi | 6 mi | Largest option shown is a 1-BR condo. Loft room "sleeps 4". | — |

The Village is the walkable café, shops and restaurants cluster. Outbound is the only Hot Rate within a short walk of the Main St and Old Mammoth Rd cafés, and its 2-bedroom option ($887) costs about as much as the refundable Village Lodge benchmark.

### 5. Value vs. refundable benchmarks (5 guests, Oct 9–11)

| Option | 2-night total | Per night | Refundable? | Fits 5 legitimately? | Walkable? | Hot Rate saving |
|---|---|---|---|---|---|---|
| **Village Lodge Hot Rate, 2-BR condo** | **$693** ($636 charged by Hotwire + $57.50 resort fee paid at hotel) | $347 | **No** | Unit max is 6. **Booking is for 4**, so call to add the 5th child. | **Yes** (at The Village) | vs Village Lodge $944: **−$251 (−27%)** |
| Village Lodge, refundable (benchmark) | $944 | $402 | Free cancel until 2 full days out (≈ Oct 6, 11:59 pm) | Yes | Yes | — |
| **Juniper Hot Rate, 2-BR "with 2 Twins"** | **$580** ($523 + $57 resort fee) | $290 | No | Unit max is 6. Booking is for 4. | No (1.4–1.8 mi) | vs Juniper $786: **−$206 (−26%)** |
| Juniper Springs, refundable (benchmark) | $786 | $339 | Free cancel until 2 days out | Yes | No | — |
| Mammoth Mountain Inn, refundable (benchmark) | $841 | $362 | Yes | Yes | No | Hot Rate 1-BR is $535, but it is not walkable. |
| Austria Hof (benchmark) | $680 | $290 | — | — | Close to The Village | No Hot Rate matches it. |
| Airbnb 2-BR condo with fireplace (benchmark) | $468 + tax (roughly $540–560 with 15–16% tax; fees not verified) | ~$270 | Per listing policy | Yes | Depends on the listing | Cheaper than any 2-BR Hot Rate |
| Two Hotwire rooms to fit 5 (e.g. 2 × Juniper) | $927 | — | No | Yes | — | Worse than one 2-BR |

Caveat: I could not confirm whether the $786, $944 and $841 benchmarks include the property's approximately $57 resort fee. If they do not, the Hot Rate savings are about $57 larger.

**Does a Hot Rate genuinely beat them?**

- **Against the Village Lodge refundable rate: yes, clearly,** once the family is certain about Oct 9–11. It is the same property, a guaranteed 2-bedroom condo type, and **$251 less**. What you give up:
  1. **Refundability.** The refundable rate can be cancelled free until about Oct 6–7. That is worth something if weather (early snow on 395/203) or illness is a risk.
  2. **A 4-guest reservation for a unit that allows 6.** Adding the 5th child is very likely fine because the unit is under its occupancy cap. Still, confirm with Mammoth Lodging Collection (800-MAMMOTH) before paying. The request is simply "a third-party-booked 2BR for 4; can we register a 5th guest, a child?"
  3. **Unit and floor assignment** is up to the hotel. The fireplace and kitchen are in every unit, so this matters little.
- **Against Juniper refundable ($786):** the Juniper Hot Rate saves $206, but Juniper does not meet the "walkable to cafés" priority. **The Village Lodge Hot Rate costs only $113 more than the Juniper Hot Rate and puts you at The Village,** so it is the better Hot Rate for this family.
- **Against the Airbnb 2-BR ($468 + tax):** the Airbnb is still about **$130–150 cheaper** than the Village Lodge Hot Rate and sleeps 5 on the booking. The Hot Rate is worth the difference only if the Airbnb is not near The Village or Main St, or if you value the lodge's pool and hot tubs, front desk, and Village location. If the Airbnb is walkable and has a moderate cancellation policy, it remains the best value.

### 6. Recommendation

1. **If you want The Village (the walkable priority) and your dates are firm: book the Hotwire "3.5-star All-suites Hotel in Mammoth Lakes area", room option "Condo, 2 Bedrooms (Two Bedroom Condominium)", about $347/nt / $693 total.**
   - Before paying, check that the card still shows **4.5/5 with 1,009 reviews**, **0.5 mi from search**, a **$28.75/night resort fee**, and **Village Gondola Station 0.1 mi** under "Location". That combination is The Village Lodge.
   - Book it as 2 adults + 2 children, then call the property to add the 5th guest. Better still, call first.
   - Keep any refundable booking until the Hot Rate is confirmed, then cancel the refundable one (free until about Oct 6–7).
2. **If flexibility matters more** (weather, sick kids): keep the refundable Village Lodge ($944) or Juniper ($786) booking. The Hot Rate saves about $200–250, but that money is lost if you cannot go.
3. **Do not** book a default "Hotel chooses bed type" Hot Rate for 5 people. At these properties it will be a studio or 1-bedroom with a maximum of 4.
4. **Skip:**
   - The 4★ Condo (probably Westin): only about 4% off retail, and its room type could not be seen.
   - Two-room Hot Rates: double the price.
   - Mammoth Mountain Inn: 4 mi from town.
   - Outbound's 2-bedroom ($887): walkable to Main St but barely cheaper than the refundable Village Lodge.
5. **Prices are live as of 2026-09-27 16:06–16:18 UTC.** Hot Rates change often and may drop or disappear closer to Oct 9. A quick re-check on Oct 5–6, before the refundable cancel deadline, is worthwhile.
