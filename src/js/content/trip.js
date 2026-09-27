// Trip data: the itinerary spine, the optional activity menu, color report,
// food, and links. Every hour, status, and fee was checked on RETRIEVED; the
// source for each is in research-notes.md. Times are Pacific (PDT, UTC−7).

export const RETRIEVED = '2026-09-27';
export const DEPART = '2026-10-09T12:00:00-07:00';
export const HOME_BY = '2026-10-11T18:30:00-07:00';

export const sun = {
  // USNO (Mammoth/Lee Vining), golden hour computed. PDT.
  fri: { date: 'Fri Oct 9', sunrise: '6:59', sunset: '6:27', goldenAM: '6:59–7:34', goldenPM: '5:51–6:27', dark: '7:53', moon: 'Waning crescent, 1% (sets 5:48 pm)' },
  sat: { date: 'Sat Oct 10', sunrise: '7:00', sunset: '6:25', goldenAM: '7:00–7:34', goldenPM: '5:50–6:25', dark: '7:52', moon: 'NEW MOON (8:50 am). Darkest night of the month!' },
  sun: { date: 'Sun Oct 11', sunrise: '7:01', sunset: '6:24', goldenAM: '7:01–7:35', goldenPM: '5:49–6:24', dark: '7:51', moon: 'Waxing crescent, 2% (sets 6:42 pm)' },
};

// Friday Oct 9 normals (NCEI 1991–2020). Forecast refreshed by the update routine.
export const weather = {
  note: 'Normals for Oct 9–11 (NOAA 1991–2020). The Oct 7 update adds the real forecast.',
  places: [
    { name: 'Mammoth Lakes', elev: '7,856 ft', hi: 63, lo: 31 },
    { name: 'Lee Vining', elev: '6,982 ft', hi: 67, lo: 38 },
    { name: 'Bishop', elev: '4,145 ft', hi: 80, lo: 40 },
  ],
  outlook: 'Outlook as of Sep 27: NOAA\'s 8–14 day outlook (Oct 4–10) gives a 70–80% chance of above-normal temperatures, with a warm, dry, light-wind ridge. That is good for keeping leaves on the trees.',
};

// ---------------------------------------------------------------------------
// Itinerary spine. `anchor: true` items are the few fixed points; everything
// else is flexible. `menu` links to optional activities (ids in `menu`).
export const days = [
  {
    id: 'fri',
    label: 'Friday',
    date: 'Oct 9',
    title: 'Over the mountains',
    blurb: 'Leave at noon, orchards and goats in the valley, Tioga\'s granite in golden hour, and Mammoth by bedtime.',
    items: [
      { t: '2026-10-09T11:30:00-07:00', title: 'Pack the car', text: 'Snacks, water, and sick bags within reach of every seat. Cocoa in the thermos. Packing list is on the Plan tab.', kind: 'prep' },
      { t: '2026-10-09T12:00:00-07:00', title: 'Leave home', text: 'Lunch in the car. Friday traffic on I-680, I-580, and I-205: expect it to build. Start an audiobook.', kind: 'drive', anchor: true, drive: '~2 hr to Oakdale', maps: { daddr: 'Oakdale Cheese & Specialties, 10040 CA-120, Oakdale, CA' } },
      { t: '2026-10-09T14:10:00-07:00', title: 'Oakdale: goats and apples', text: 'Stretch your legs, use the bathroom, and feed the goats at Oakdale Cheese (daily 9–6). Or pick apples and pie at Bloomingcamp Ranch (Fri 9–4) for caramel apples later.', kind: 'stop', menu: ['oakdalecheese', 'bloomingcamp'], stay: '20 min', devotion: null },
      { t: '2026-10-09T14:50:00-07:00', title: 'Car-sickness check', text: 'Curvy roads start after Groveland. If anyone is prone, give meds now (30–60 min ahead).', kind: 'prep' },
      { t: '2026-10-09T15:40:00-07:00', title: 'Groveland: bathrooms and takeout dinner', text: 'Grab dinner to eat as a picnic at Tenaya Lake: Around the Horn Brewing (food until 8 on Friday) or Priest Station Café (8–8 daily).', kind: 'food', drive: '~1 hr 10 from Oakdale', menu: ['aroundthehorn', 'prieststation'], stay: '15 min', maps: { q: 'Groveland, CA' } },
      { t: '2026-10-09T16:15:00-07:00', title: 'Yosemite: Big Oak Flat entrance', text: '$35 per car, good for 7 days, card only. No reservation needed in 2026. Keep the receipt for Sunday.', kind: 'drive', anchor: true },
      { t: '2026-10-09T16:35:00-07:00', title: 'Crane Flat: LAST GAS for 59 miles', text: 'Fill the tank. The pumps run 24/7. There are no services on Tioga Road this late in the season (Tuolumne store and grill are closed). Bathrooms here.', kind: 'fuel', anchor: true, maps: { q: 'Crane Flat Gas Station, Yosemite' } },
      { t: '2026-10-09T17:40:00-07:00', title: 'Olmsted Point in golden hour', text: 'Giant granite and Half Dome from the back. Golden hour starts about 5:51. Walk out onto the granite (a short, uneven path). Moment: "The sky is talking."', kind: 'wonder', anchor: true, devotion: 'm-granite', drive: '~1 hr from Crane Flat', stay: '15 min', maps: { q: 'Olmsted Point, Yosemite' } },
      { t: '2026-10-09T18:00:00-07:00', title: 'Tenaya Lake picnic and alpenglow', text: 'Eat dinner by the lake (or in the warm car) and watch the granite turn pink. Sunset 6:27. It gets cold fast at 8,150 ft, so put on jackets and hats. Running late? Eat in the car and keep rolling.', kind: 'food', stay: '20–30 min', maps: { q: 'Tenaya Lake, Yosemite' } },
      { t: '2026-10-09T18:50:00-07:00', title: 'Tioga Pass (9,945 ft) at dusk', text: 'The highest highway pass in California (expect a ~10-minute construction delay in Tuolumne Meadows). Then the long grade down to Lee Vining in twilight. Watch for deer.', kind: 'drive' },
      { t: '2026-10-09T19:15:00-07:00', title: 'Lee Vining', text: 'Bonus if open: Whoa Nellie Deli / Tioga Gas Mart (bathrooms 24 hr). Its season may end the first week of October; call 760-647-1088.', kind: 'stop', menu: ['whoanellie'] },
      { t: '2026-10-09T20:00:00-07:00', title: 'Mammoth: home base', text: 'Check in and get cozy (realistically 8:00–8:15; later with traffic). Friday devotion at bedtime, short and sleepy. Lights out by ~9.', kind: 'lodging', anchor: true, devotion: 'fri', drive: '~40 min from Lee Vining' },
    ],
  },
  {
    id: 'sat',
    label: 'Saturday',
    date: 'Oct 10',
    title: 'Into the gold',
    blurb: 'Peak color up north, beaver ponds, tufa towers, a fall festival, a cozy hour, and the darkest sky of the month.',
    items: [
      { t: '2026-10-10T07:00:00-07:00', title: 'Sunrise and a slow start', text: 'Golden hour until about 7:34. Breakfast in, or Stellar Brew (from 5:30), Good Life Café (7–8), or Black Velvet (6–8).', kind: 'food', menu: ['stellar', 'goodlife', 'blackvelvet'] },
      { t: '2026-10-10T08:15:00-07:00', title: 'Drive north to Lundy Canyon', text: 'About an hour. Bathroom stop in Lee Vining on the way (there are no restrooms at the Lundy trailhead). Parking at the trailhead is tight, so earlier is better.', kind: 'drive', drive: '~57 min', maps: { q: 'Lundy Canyon Trailhead, Lundy, CA' } },
      { t: '2026-10-10T09:15:00-07:00', title: 'Lundy beaver ponds', text: 'The first pond is about 0.25 mi in; beaver dams and chewed aspen stumps within about 1 mile. Saturday devotion here in the first aspen grove, then the moment "Ask the animals." Leave time to throw rocks in the creek.', kind: 'walk', anchor: true, devotion: 'sat', menu: ['lundy'], stay: '1.5 hr' },
      { t: '2026-10-10T11:00:00-07:00', title: 'Conway Summit overlook: cocoa stop', text: 'The classic view of aspens sweeping down toward Mono Lake. Pour the cocoa. Projected at or near peak this weekend.', kind: 'wonder', menu: ['conway'], drive: '~10 min', stay: '20 min', maps: { q: 'Conway Summit Vista Point, CA' } },
      { t: '2026-10-10T11:45:00-07:00', title: 'Lunch in Lee Vining', text: 'Basin Café (Sat 7–8:45) or a picnic from Mono Market.', kind: 'food', menu: ['basincafe', 'monomarket'], drive: '~16 min' },
      { t: '2026-10-10T12:45:00-07:00', title: 'South Tufa, Mono Lake', text: 'A flat, 1-mile walk among tufa towers. $3 per adult; kids free. Moment: "Springs in the valley." Optional: the Panum Crater volcano, 5 minutes away.', kind: 'walk', anchor: true, devotion: 'm-springs', menu: ['southtufa', 'panum'], stay: '1–1.5 hr', maps: { q: 'South Tufa, Lee Vining, CA' } },
      { t: '2026-10-10T14:15:00-07:00', title: 'Choose: festival or quiet time', text: 'Read the room. Energy left? Stop at June Lake\'s Leaves in the Loop festival at Gull Lake Park (pumpkin patch, fall art) and drive the Loop past Silver Lake: moment "The trees clap." Running on fumes? Go straight home for quiet time, a nap, or reading in the cozy corner.', kind: 'choice', devotion: 'm-trees', menu: ['leavesloop', 'juneloop'], drive: '~20–35 min' },
      { t: '2026-10-10T16:15:00-07:00', title: 'Cozy hour in Mammoth', text: 'Booky Joint (books and art supplies, open until 6) and Rocky Mountain Chocolate Factory (caramel apples!) share one building on Old Mammoth Rd. Cocoa at Black Velvet (until 8).', kind: 'cozy', menu: ['bookyjoint', 'rmcf', 'blackvelvet'], drive: '~36 min', maps: { q: '437 Old Mammoth Rd, Mammoth Lakes, CA' } },
      { t: '2026-10-10T17:45:00-07:00', title: 'Dinner', text: 'John\'s Pizza Works, The EATery at Mammoth Brewing, or Burgers. Or cook in.', kind: 'food', menu: ['johnspizza', 'eatery', 'burgers'] },
      { t: '2026-10-10T19:30:00-07:00', title: 'New Moon stargazing', text: 'The darkest sky of the month. Blankets, cocoa, red lights. Walk 100 steps from the lights and give your eyes 15 minutes. Moment: "He names the stars."', kind: 'wonder', anchor: true, devotion: 'm-stars', menu: ['stars'] },
      { t: '2026-10-10T20:30:00-07:00', title: 'Journal and bed', text: '"What did you notice today?" One line each in the journal.', kind: 'lodging' },
    ],
  },
  {
    id: 'sun',
    label: 'Sunday',
    date: 'Oct 11',
    title: 'The Lord\'s Day, and home',
    blurb: 'A morning devotion with a view, then home by dinner. Pick the route over breakfast.',
    items: [
      { t: '2026-10-11T07:00:00-07:00', title: 'Morning light', text: 'Sunrise 7:01. Pack up slowly. Frosty mornings are likely at this elevation.', kind: 'prep' },
      { t: '2026-10-11T08:00:00-07:00', title: 'Sunday devotion: "This is the day"', text: 'At the window, on the balcony, or at Twin Lakes (10 min). Then sing "For the Beauty of the Earth."', kind: 'wonder', anchor: true, devotion: 'sun' },
      { t: '2026-10-11T09:00:00-07:00', title: 'Choose the route home', text: 'Tioga (gentler on tummies, Tenaya picnic, Oakdale farm stop), or Sonora Pass (Columbia\'s Harvest Festifall, but 26% grades). Both details are below. Either way, leave by 9:30.', kind: 'choice', anchor: true, choices: ['route-tioga', 'route-sonora'] },
      { t: '2026-10-11T09:30:00-07:00', title: 'Leave Mammoth', text: 'Gas up in Lee Vining if you\'re going over Tioga (next gas: Crane Flat, 59 mi).', kind: 'drive', anchor: true },
      { t: '2026-10-11T18:15:00-07:00', title: 'Home', text: 'Unpack the leaves, press the best ones, and look back at the journal together.', kind: 'lodging', anchor: true },
    ],
  },
];

export const routes = {
  'route-tioga': {
    title: 'Home over Tioga (recommended)',
    summary: 'Same road as Friday, now in morning light. Gentler curves than Sonora Pass.',
    legs: [
      ['9:30', 'Leave Mammoth (optional June Lake Loop detour, +10 min)'],
      ['10:20', 'Lee Vining: GAS UP (last gas for 59 mi). Whoa Nellie if open'],
      ['11:00', 'Tioga Pass. Ellery and Tioga lakes in morning light'],
      ['11:20', 'Optional: Soda Springs and Parsons Lodge walk (1.4 mi RT, flat; use the posted detour)'],
      ['12:00', 'Tenaya Lake picnic lunch'],
      ['1:15', 'Crane Flat (bathrooms)'],
      ['2:15', 'Groveland'],
      ['3:15', 'Oakdale: SONS Farm Fresh (free entry, petting zoo and gem mining $8, open Sun 8–8) or Oakdale Cheese goats (until 6)'],
      ['4:15', 'Back on the road'],
      ['~6:15', 'Home'],
    ],
    note: 'Realistic total: 7¼–8¼ hours with stops. Holiday Sunday traffic should be lighter than usual because most people return Monday.',
  },
  'route-sonora': {
    title: 'Home over Sonora Pass + Columbia',
    summary: 'A different road and a harvest festival, but steep. Sonora Pass has grades up to 26% and hairpins.',
    legs: [
      ['9:00', 'Leave Mammoth north on US-395 (gas in Lee Vining or Bridgeport)'],
      ['10:15', 'Turn onto CA-108 at Sonora Junction. Car-sickness meds 30 min before'],
      ['11:15', 'Sonora Pass summit (9,623 ft). No gas on the pass'],
      ['1:00', 'Columbia State Historic Park: Harvest Festifall (10–5): gold panning, candle making, stagecoach, face painting'],
      ['alt', 'Or Railtown 1897 (Jamestown): Harvest Haunt train at 1:30 or 3 ($23 adult / $18 youth 6–17)'],
      ['3:30', 'Leave Columbia'],
      ['~6:30', 'Home'],
    ],
    note: 'Realistic total: 7¼–8¼ hours with stops. Only pick this if tummies are strong and everyone is rested.',
  },
};

// ---------------------------------------------------------------------------
// The optional menu. area: north | june | mammoth | south | enroute
// energy: 1 = sit/stroll, 2 = easy walk, 3 = some effort
// tags: animals, rocks, stars, crafts, cozy, color, food
export const menu = [
  // North: Lee Vining / Mono Basin / Lundy
  { id: 'lundy', area: 'north', name: 'Lundy Canyon beaver ponds', time: '1–2 hr', energy: 2, tags: ['animals', 'color'], walk: '~1–2 mi RT, gentle', wc: 'None at trailhead; use Lee Vining', fee: 'Free', status: 'Color projected Near Peak → Peak for Oct 9–11', text: 'Beaver dams, a lodge, chewed stumps, aspens, and waterfalls. The first pond is ~0.25 mi in. Best animal-sign spot of the trip.', maps: { q: 'Lundy Canyon Trailhead, Lundy, CA' }, hunt: ['dam', 'aspen', 'eyes', 'track'] },
  { id: 'conway', area: 'north', name: 'Conway Summit overlook', time: '20 min', energy: 1, tags: ['color', 'cozy'], walk: 'Roadside', wc: 'None', fee: 'Free', status: 'Projected Near Peak → Peak. #1 ranked spot for the weekend.', text: 'The famous sweep of aspens on US-395 above Mono Lake. Perfect for a thermos cocoa stop.', maps: { q: 'Conway Summit Vista Point, CA' } },
  { id: 'southtufa', area: 'north', name: 'South Tufa, Mono Lake', time: '1–1.5 hr', energy: 2, tags: ['rocks', 'animals'], walk: '~1 mi loop, flat, sandy', wc: 'Vault toilets at lot (not verified)', fee: '$3 per adult 16+; kids free (card, cash, or check)', status: 'Open 24 hrs', text: 'Alien towers built by springs, a lake 2½ times saltier than the ocean, brine flies, and birds.', maps: { q: 'South Tufa, Lee Vining, CA' }, hunt: ['tufa'] },
  { id: 'panum', area: 'north', name: 'Panum Crater (a baby volcano)', time: '45 min', energy: 3, tags: ['rocks'], walk: 'Plug trail ~1 mi RT, ~200 ft on deep pumice sand', wc: 'None', fee: 'Free', status: '650 years old, the youngest of the Mono Craters', text: 'Walk up into a real volcano crater. Obsidian and floating pumice everywhere. Stop at the dome edge; the rough interior isn\'t for little legs.', maps: { q: 'Panum Crater, Lee Vining, CA' }, hunt: ['obsidian'] },
  { id: 'monovc', area: 'north', name: 'Mono Basin Visitor Center', time: '45 min', energy: 1, tags: ['crafts', 'animals'], walk: 'Indoors plus a short path', wc: 'Yes', fee: 'Free', status: 'Hours listed as 9–5 (fall closing date not posted)', text: 'Exhibits, a film, a bookstore, and a huge window over the lake. A great rainy-day stop.', maps: { q: 'Mono Basin Scenic Area Visitor Center, Lee Vining, CA' } },
  { id: 'basincafe', area: 'north', kind: 'food', name: 'Basin Café, Lee Vining', time: 'Meal', energy: 1, tags: ['food'], hours: 'Thu–Sat 7–8:45 pm; Sun–Mon 7–1:45; closed Tue–Wed', text: 'Breakfast, lunch, and dinner at Lakeview Lodge.', maps: { q: 'Basin Cafe, Lee Vining, CA' } },
  { id: 'monomarket', area: 'north', kind: 'food', name: 'Mono Market', time: '15 min', energy: 1, tags: ['food'], hours: '~7–9 daily (aggregator; not verified)', text: 'Picnic supplies and snacks.', maps: { q: 'Mono Market, Lee Vining, CA' } },
  { id: 'whoanellie', area: 'north', kind: 'food', name: 'Whoa Nellie Deli (bonus if open)', time: 'Meal', energy: 1, tags: ['food'], hours: '6:30 am–9 pm daily while in season. The 2026 season end is unconfirmed; call 760-647-1088.', text: 'The famous gas-station deli at Tioga Gas Mart. Restrooms open 24 hr.', maps: { q: 'Whoa Nellie Deli, Lee Vining, CA' } },
  { id: 'lattede', area: 'north', kind: 'food', name: 'Latte Da Coffee Café', time: '15 min', energy: 1, tags: ['cozy', 'food'], hours: 'Seasonal ("April through late fall"). Call ahead.', text: 'Coffee and cocoa in Lee Vining at the El Mono Motel.', maps: { q: 'Latte Da Coffee Cafe, Lee Vining, CA' } },
  { id: 'virginia', area: 'north', name: 'Virginia Lakes', time: '1.5 hr', energy: 2, tags: ['color'], walk: 'Lakeshore', wc: 'Vault toilets (background)', fee: 'Free', status: '⚠ Likely past peak by Oct 9–11', text: 'High lakes at 9,800 ft. Probably mostly bare by our weekend. Skip unless the report says otherwise.', maps: { q: 'Virginia Lakes, CA' } },

  // June Lake
  { id: 'leavesloop', area: 'june', name: 'Leaves in the Loop festival', time: '1 hr', energy: 1, tags: ['crafts', 'color', 'cozy'], walk: 'Park', wc: 'Yes (park)', fee: 'Varies', status: 'Oct 9–11, 2026 at Gull Lake Park. The detailed schedule posted is 2025\'s (pumpkin patch ran 12–3).', text: 'June Lake\'s fall festival: pumpkin patch, fall art with Mono Arts Council, chili cook-off, and a history walk.', maps: { q: 'Gull Lake Park, June Lake, CA' } },
  { id: 'juneloop', area: 'june', name: 'June Lake Loop drive (CA-158)', time: '30 min', energy: 1, tags: ['color'], walk: 'Drive; pull-outs', wc: 'June Lake village', fee: 'Free', status: 'Projected Patchy → Near Peak (upper slopes best)', text: 'A 15-mile horseshoe past June, Gull, Silver, and Grant lakes under Carson Peak.', maps: { q: 'Silver Lake, June Lake, CA' } },
  { id: 'junebrew', area: 'june', kind: 'food', name: 'June Lake Brewing', time: '45 min', energy: 1, tags: ['food'], hours: 'Noon–8 daily', text: 'Beer garden in the village. Its food truck (Ohanas) has closed, so bring snacks.', maps: { q: 'June Lake Brewing, June Lake, CA' } },
  { id: 'silverlakecafe', area: 'june', kind: 'food', name: 'Silver Lake Resort Café', time: 'Breakfast', energy: 1, tags: ['food', 'cozy'], hours: '7–2 daily "through mid-October." Call 760-648-7525.', text: 'Old-school lakeside breakfast.', maps: { q: 'Silver Lake Resort, June Lake, CA' } },

  // Mammoth
  { id: 'convict', area: 'mammoth', name: 'Convict Lake (partial loop)', time: '1 hr', energy: 2, tags: ['color', 'animals'], walk: 'Paved section + aspen boardwalk, ~1 mi; full loop ~2–2.5 mi', wc: 'Yes, near the trailhead', fee: 'Free', status: 'Projected Patchy → Near Peak', text: 'A turquoise lake under enormous cliffs. Sunday morning light on Mt. Morrison is special.', maps: { q: 'Convict Lake, CA' } },
  { id: 'hotcreek', area: 'mammoth', name: 'Hot Creek Geologic Site', time: '45 min', energy: 2, tags: ['rocks'], walk: '0.2 mi each way, paved but steep (~100 ft)', wc: 'Vault toilets', fee: 'Free', status: 'Site open. Stay on the path; no entering the water.', text: 'Boiling pools and steam vents from the old supervolcano. The walk back up is short but steep.', maps: { q: 'Hot Creek Geological Site, Mammoth Lakes, CA' } },
  { id: 'quake', area: 'mammoth', name: 'Earthquake Fault', time: '20 min', energy: 1, tags: ['rocks'], walk: '0.2–0.3 mi loop', wc: 'Vault toilet', fee: 'Free', status: 'Open 6 am–10 pm (seasonal)', text: 'Walk along a crack in the earth 10 feet wide and 60 feet deep, right next to the road into town.', maps: { q: 'Earthquake Fault, Mammoth Lakes, CA' } },
  { id: 'obsidiandome', area: 'mammoth', name: 'Obsidian Dome', time: '1 hr', energy: 3, tags: ['rocks'], walk: '~0.8 mi, loose sharp glass; closed-toe shoes', wc: 'None', fee: 'Free', status: 'Dirt road. Look but don\'t collect.', text: 'Boulders of shiny black volcanic glass.', maps: { q: 'Obsidian Dome, CA' }, hunt: ['obsidian'] },
  { id: 'lakesbasin', area: 'mammoth', name: 'Twin Lakes and Horseshoe Lake', time: '1 hr', energy: 2, tags: ['color', 'cozy'], walk: 'Twin Lakes path 0.3 mi; Horseshoe loop ~1.5 mi', wc: 'Yes (background)', fee: 'Free', status: 'Lakes Basin was Near Peak on 9/23. Lake Mary Rd status in October not verified.', text: 'The closest lakes to town. A good spot for a Sunday-morning devotion.', maps: { q: 'Twin Lakes, Mammoth Lakes, CA' } },
  { id: 'postpile', area: 'mammoth', name: 'Devils Postpile (weekend shuttle)', time: '2.5 hr', energy: 2, tags: ['rocks'], walk: '~0.4 mi each way to the columns', wc: 'Yes', fee: 'Shuttle $15 adult / $7 child (3–17)', status: 'Sat–Sun only; Oct 10–11 is the LAST shuttle weekend. Closed Friday.', text: 'Giant six-sided basalt columns. A big outing, and a good backup if Saturday plans change.', maps: { q: 'Mammoth Mountain Adventure Center, Mammoth Lakes, CA' } },
  { id: 'woollys', area: 'mammoth', name: 'Woolly\'s Adventure Summit', time: '1.5 hr', energy: 1, tags: [], walk: 'Activity park', wc: 'Yes', fee: 'Adventure pass (dynamic price)', status: 'Fri–Sun 12–5 through Oct 11. Gem mining is "summer only," so it may not run.', text: 'Mountain coaster and tubing for a burst of fun.', maps: { q: 'Woolly\'s Adventure Summit, Mammoth Lakes, CA' } },
  { id: 'bookyjoint', area: 'mammoth', name: 'Booky Joint', time: '45 min', energy: 1, tags: ['cozy', 'crafts'], walk: 'Indoors', wc: '—', fee: '—', hours: '10–6 daily', text: 'New and used books, toys, games, and art supplies. Let each kid pick a book for the cozy corner tonight.', maps: { q: 'Booky Joint, 437 Old Mammoth Rd, Mammoth Lakes, CA' } },
  { id: 'rmcf', area: 'mammoth', kind: 'food', name: 'Rocky Mountain Chocolate Factory', time: '20 min', energy: 1, tags: ['cozy', 'food'], hours: '10–8 daily (Fri–Sat to 9 per Visit Mammoth)', text: 'CARAMEL APPLES, made in the store. Two shops: 437 Old Mammoth Rd (same building as Booky Joint) and The Village.', maps: { q: 'Rocky Mountain Chocolate Factory, 437 Old Mammoth Rd, Mammoth Lakes, CA' } },
  { id: 'blackvelvet', area: 'mammoth', kind: 'food', name: 'Black Velvet Coffee', time: '30 min', energy: 1, tags: ['cozy', 'food'], hours: '6 am–8 pm daily', text: 'Cozy coffee bar; hot chocolate made to order.', maps: { q: 'Black Velvet Coffee, 3343 Main St, Mammoth Lakes, CA' } },
  { id: 'stellar', area: 'mammoth', kind: 'food', name: 'Stellar Brew & Natural Café', time: '30 min', energy: 1, tags: ['cozy', 'food'], hours: '5:30 am–6 pm daily', text: 'Early coffee and breakfast.', maps: { q: 'Stellar Brew, 3280 Main St, Mammoth Lakes, CA' } },
  { id: 'goodlife', area: 'mammoth', kind: 'food', name: 'Good Life Café', time: 'Breakfast', energy: 1, tags: ['food'], hours: 'Thu–Mon 7 am–8 pm; Tue–Wed 7–3', text: 'Kid-friendly breakfast and lunch.', maps: { q: 'Good Life Cafe, Mammoth Lakes, CA' } },
  { id: 'schatsmammoth', area: 'mammoth', kind: 'food', name: 'Shea Schat\'s Bakery (Mammoth)', time: '15 min', energy: 1, tags: ['food', 'cozy'], hours: '6 am–6 pm daily', text: 'The Mammoth sibling of the famous Bishop bakery.', maps: { q: 'Shea Schat\'s Bakery, 3305 Main St, Mammoth Lakes, CA' } },
  { id: 'johnspizza', area: 'mammoth', kind: 'food', name: 'John\'s Pizza Works', time: 'Dinner', energy: 1, tags: ['food'], hours: '11:30–10:30 daily', text: 'Easy, kid-proof pizza.', maps: { q: 'John\'s Pizza Works, Mammoth Lakes, CA' } },
  { id: 'eatery', area: 'mammoth', kind: 'food', name: 'The EATery at Mammoth Brewing', time: 'Dinner', energy: 1, tags: ['food'], hours: 'Fri–Sat 11:30–9:30; Sun–Thu to 9 (early closures possible in shoulder season)', text: 'Family-friendly brewpub food.', maps: { q: 'Mammoth Brewing Company, 18 Lake Mary Rd, Mammoth Lakes, CA' } },
  { id: 'burgers', area: 'mammoth', kind: 'food', name: 'Burgers Restaurant', time: 'Dinner', energy: 1, tags: ['food'], hours: 'Sat–Sun 11–9; Mon–Fri 11–8', text: 'Big burgers, kid-friendly, near The Village.', maps: { q: 'Burgers Restaurant, 6118 Minaret Rd, Mammoth Lakes, CA' } },
  { id: 'library', area: 'mammoth', name: 'Mammoth Lakes Library', time: '45 min', energy: 1, tags: ['cozy'], walk: 'Indoors', wc: 'Yes', fee: 'Free', hours: 'Sat 10–5:30; closed Sun', text: 'A free, warm, cozy reading corner.', maps: { q: 'Mammoth Lakes Library, 400 Sierra Park Rd, Mammoth Lakes, CA' } },
  { id: 'stars', area: 'mammoth', name: 'New Moon stargazing', time: '45 min', energy: 1, tags: ['stars', 'cozy'], walk: 'A few steps from the lights', wc: 'Lodging', fee: 'Free', status: 'Sat Oct 10 is the New Moon. Dark by ~7:50 pm.', text: 'Milky Way, Saturn, the Summer Triangle. See the Kids tab → Night Sky.', maps: null },

  // South: longer drives
  { id: 'mcgee', area: 'south', name: 'McGee Creek aspens', time: '1.5 hr', energy: 2, tags: ['color'], walk: 'The first mile of the trail is the color', wc: 'Vault toilet (background)', fee: 'Free', status: 'Projected Patchy → Near Peak', text: '16 minutes from Mammoth. Color builds about a mile up-canyon.', maps: { q: 'McGee Creek Trailhead, CA' } },
  { id: 'rockcreek', area: 'south', name: 'Rock Creek (lower road)', time: '2 hr', energy: 1, tags: ['color'], walk: 'Drive + short strolls', wc: 'Campgrounds', fee: 'Free', status: 'Lower and middle road Near Peak–Peak; the lake itself is likely past', text: '44 minutes from Mammoth. Aspen tunnels along the road.', maps: { q: 'Rock Creek Road, Tom\'s Place, CA' } },
  { id: 'bishopcreek', area: 'south', name: 'Bishop Creek (long drive)', time: 'Half day', energy: 2, tags: ['color'], walk: 'Lakeshore strolls', wc: 'Vault toilets', fee: 'Free', status: '⚠ High lakes likely past peak; Lake Sabrina has dam work Mon–Sat (Sunday is best)', text: 'Lower groves (Aspendell, Intake II) may still glow. 73+ minutes each way from Mammoth.', maps: { q: 'Lake Sabrina, Bishop, CA' } },

  // En route
  { id: 'oakdalecheese', area: 'enroute', name: 'Oakdale Cheese & Specialties', time: '30 min', energy: 1, tags: ['animals', 'food'], walk: 'Farm yard', wc: 'Yes', fee: 'Free', hours: '9–6 daily', text: 'Goats to feed, cheese samples, and a big lawn to run on. Right on CA-120.', maps: { q: 'Oakdale Cheese & Specialties, 10040 CA-120, Oakdale, CA' } },
  { id: 'bloomingcamp', area: 'enroute', name: 'Bloomingcamp Ranch', time: '20 min', energy: 1, tags: ['food', 'cozy'], walk: '—', wc: '—', fee: '—', hours: 'Wed–Sun 9–4 (closed Mon–Tue)', text: 'Apples, pies, and fruit stand on CA-120. Buy apples for DIY caramel apples.', maps: { q: 'Bloomingcamp Ranch, 10528 CA-120, Oakdale, CA' } },
  { id: 'sonsfarm', area: 'enroute', name: 'SONS Farm Fresh (Oakdale)', time: '1 hr', energy: 1, tags: ['animals', 'rocks'], walk: 'Farm', wc: 'Yes', fee: 'Free entry; petting zoo $8, gem mining $8', hours: 'Sep 10–Oct 31. Sun–Thu 8–8, Fri–Sat 8–9', text: 'Pumpkins, petting zoo, reptile house, and gem mining. A good Sunday stop on the way home.', maps: { q: 'SONS Farm Fresh, 1936 E F St, Oakdale, CA' } },
  { id: 'aroundthehorn', area: 'enroute', kind: 'food', name: 'Around the Horn Brewing (Groveland)', time: 'Takeout', energy: 1, tags: ['food'], hours: 'Food 12–8 (Mon, Thu–Sun). Tue no food. Closed Wed.', text: 'Friday takeout for the Tenaya Lake picnic.', maps: { q: 'Around the Horn Brewing, Groveland, CA' } },
  { id: 'prieststation', area: 'enroute', kind: 'food', name: 'Priest Station Café', time: 'Takeout', energy: 1, tags: ['food'], hours: '8–8 daily', text: 'Hillside café on Old Priest Grade, just off CA-120 near Big Oak Flat.', maps: { q: 'Priest Station Cafe, Big Oak Flat, CA' } },
  { id: 'olmsted', area: 'enroute', name: 'Olmsted Point', time: '15 min', energy: 1, tags: ['rocks'], walk: 'Short, uneven granite', wc: 'Vault toilet (background)', fee: 'Park entry', text: 'Glacier-polished granite, erratic boulders, and Half Dome from the back.', maps: { q: 'Olmsted Point, Yosemite' }, hunt: ['granite'] },
  { id: 'tenaya', area: 'enroute', name: 'Tenaya Lake', time: '30 min', energy: 1, tags: ['cozy', 'rocks'], walk: 'Beach', wc: 'Vault toilets (background)', fee: 'Park entry', text: 'A granite-ringed lake for picnics and skipping stones.', maps: { q: 'Tenaya Lake, Yosemite' } },
  { id: 'sodasprings', area: 'enroute', name: 'Soda Springs and Parsons Lodge', time: '1 hr', energy: 2, tags: ['animals', 'rocks'], walk: '1.4 mi RT, mostly flat (use the posted construction detour)', wc: 'Tuolumne (background)', fee: 'Park entry', text: 'Fizzy natural spring water bubbling out of the meadow. Look for deer and marmots.', maps: { q: 'Soda Springs, Tuolumne Meadows, Yosemite' } },
  { id: 'columbia', area: 'enroute', name: 'Columbia Harvest Festifall', time: '2 hr', energy: 1, tags: ['crafts'], walk: 'Historic town', wc: 'Yes', fee: 'Free entry (activities vary)', hours: 'Oct 10–11, 10–5', text: 'Gold panning, candle making, stagecoach rides, and face painting. Sonora Pass route only.', maps: { q: 'Columbia State Historic Park, Columbia, CA' } },
  { id: 'railtown', area: 'enroute', name: 'Railtown 1897 Harvest Haunt train', time: '1.5 hr', energy: 1, tags: [], walk: '—', wc: 'Yes', fee: '$23 adult / $18 youth 6–17 / 5 and under free', hours: 'Oct 10–11 departures 10:30, 12, 1:30, 3', text: 'A steam-era train ride in Jamestown. Sonora Pass route only.', maps: { q: 'Railtown 1897 State Historic Park, Jamestown, CA' } },
  { id: 'joansfarm', area: 'enroute', name: 'Joan\'s Farm (Livermore)', time: '45 min', energy: 1, tags: ['animals'], walk: 'Farm', wc: 'Yes', fee: '$5 parking', hours: 'Tue–Sun 10–6 (activities end 5:30)', text: 'Animals and pumpkins, 40 minutes from home. Only if you\'re running early.', maps: { q: 'Joan\'s Farm, 4351 Mines Rd, Livermore, CA' } },
];

export const areas = {
  north: { name: 'North: Mono Lake, Lundy, Conway', drive: '40–60 min from Mammoth' },
  june: { name: 'June Lake Loop', drive: '25–35 min from Mammoth' },
  mammoth: { name: 'Around Mammoth', drive: '0–20 min' },
  south: { name: 'South: longer color drives', drive: '15–75 min from Mammoth' },
  enroute: { name: 'On the way (CA-120 / CA-108)', drive: 'Friday and Sunday' },
};

// ---------------------------------------------------------------------------
// Color report: latest official status (Mono County 9/23, Visit Bishop 9/23
// via CFC) + projection for Oct 9–11. Rank 1 = best for our weekend.
export const colorReport = {
  retrieved: RETRIEVED,
  asOf: 'Reports dated Sep 23–25, 2026',
  summary: 'This weekend the color is in the middle band (7,600–8,600 ft): Conway Summit, Lundy, the June Lake hillsides, and Monitor Pass. The high Bishop Creek lakes and Virginia Lakes will mostly be past. 2026 is running about a week early up high because of a dry September and two wind events.',
  scale: ['Just Starting', 'Patchy', 'Near Peak', 'Peak', 'Past Peak'],
  spots: [
    { rank: 1, name: 'Conway Summit', elev: 8143, now: 'Patchy (10–50%)', proj: 'Near Peak → Peak', level: 3.5 },
    { rank: 2, name: 'Lundy Canyon', elev: 7858, now: 'Patchy (10–50%); ~50% above the trailhead', proj: 'Near Peak → Peak', level: 3.5 },
    { rank: 3, name: 'Monitor Pass', elev: 8314, now: 'Patchy, "heading to 50–75% very soon"', proj: 'Near Peak → Peak', level: 3.5, far: true },
    { rank: 4, name: 'June Lake Loop', elev: 7654, now: 'Just Starting (0–10%)', proj: 'Patchy → Near Peak (upper slopes best)', level: 2.5 },
    { rank: 5, name: 'Lake Sabrina (Bishop Creek)', elev: 9150, now: 'Near Peak (50–75%)', proj: 'Peak → Past at the lake; lower canyon still good', level: 3.5, warn: 'Dam work Mon–Sat' },
    { rank: 6, name: 'Rock Creek', elev: 9600, now: 'Near Peak upper; Patchy lower', proj: 'Upper past; lower road Near Peak–Peak', level: 3 },
    { rank: 7, name: 'McGee Creek', elev: 8600, now: 'Just Starting (0–10%)', proj: 'Patchy → Near Peak', level: 2.5 },
    { rank: 8, name: 'Convict Lake', elev: 7850, now: 'Just Starting; some wind loss', proj: 'Patchy → Near Peak', level: 2.5 },
    { rank: 9, name: 'North Lake', elev: 9225, now: '~35% (independent blog, 9/22–24)', proj: 'Peak → Past Peak risk', level: 4, warn: 'Borderline' },
    { rank: 10, name: 'Virginia Lakes', elev: 9819, now: 'Near Peak; leaf loss below Big Virginia', proj: 'Mostly Past Peak', level: 4.5, warn: 'Likely past' },
    { rank: 11, name: 'South Lake', elev: 9768, now: 'Near Peak (50–75%)', proj: 'Past Peak at the lake', level: 4.5, warn: 'Likely past' },
    { rank: 12, name: 'Sagehen Summit', elev: 8139, now: 'Peak (75–100%) on 9/25', proj: 'Past Peak', level: 5, warn: 'Past' },
  ],
  links: [
    { name: 'CaliforniaFallColor.com (updated Fridays)', url: 'https://californiafallcolor.com/' },
    { name: 'Mono County Fall Color Report (updated Wednesdays)', url: 'https://www.monocounty.org/things-to-do/fall-colors' },
    { name: 'Visit Bishop fall color report', url: 'https://bishopvisitor.com/fall-colors/' },
    { name: 'Visit Mammoth: where to find fall colors', url: 'https://www.visitmammoth.com/blogs/find-fall-colors/' },
  ],
};

export const beforeWeGo = {
  links: [
    { name: 'Yosemite road status (Tioga)', url: 'https://www.nps.gov/yose/planyourvisit/conditions.htm', why: 'Tioga open? Any storm closures?' },
    { name: 'Caltrans QuickMap', url: 'https://quickmap.dot.ca.gov/', why: 'Chain controls, closures, and construction on 120, 395, and 108' },
    { name: 'Caltrans road conditions: CA-120', url: 'https://roads.dot.ca.gov/roadscell.php?roadnumber=120', why: 'Text status that loads on a weak signal' },
    { name: 'NWS forecast: Mammoth Lakes', url: 'https://forecast.weather.gov/MapClick.php?lat=37.6485&lon=-118.9721', why: 'Temps, wind (wind strips aspens!), and snow level' },
    { name: 'NWS forecast: Tioga Pass', url: 'https://forecast.weather.gov/MapClick.php?lat=37.9107&lon=-119.2577', why: 'Conditions at 9,945 ft' },
    { name: 'AirNow smoke map', url: 'https://www.airnow.gov/?city=Mammoth%20Lakes&state=CA&country=USA', why: 'Wildfire smoke (the Dome Fire is burning in Yosemite)' },
    { name: 'Mono County fall color report', url: 'https://www.monocounty.org/things-to-do/fall-colors', why: 'The Wednesday update' },
    { name: 'CaliforniaFallColor.com', url: 'https://californiafallcolor.com/', why: 'The Friday update' },
  ],
  checklist: [
    'Check Tioga status (NPS) and QuickMap for CA-120',
    'Check the Mammoth and Tioga forecasts: wind, snow level, low temps',
    'Check AirNow for smoke',
    'Call Whoa Nellie Deli (760-647-1088) if you want it Friday night',
    'Fill the tank before leaving the valley; top off at Crane Flat',
    'Cash or card for the Yosemite fee ($35, card only at the gate)',
    'Car-sickness meds, sick bags, and wipes within reach',
    'Open this app on every device once while online, then test it in airplane mode',
    'Download ESV/NIV in the Bible app (reading works offline; audio needs signal)',
    'Download Apple Maps offline maps for Mono and Inyo counties',
    'Enter kids\' names and the lodging address in Settings (stays on this device only)',
  ],
};

export const recipes = [
  {
    id: 'cocoa',
    title: 'Mountain hot cocoa (serves 5)',
    ingredients: ['5 cups milk', '⅓ cup cocoa powder', '⅓ cup sugar', 'Pinch of salt', '½ tsp vanilla', 'Marshmallows or whipped cream'],
    steps: ['Whisk cocoa, sugar, salt, and ½ cup of the milk into a smooth paste in a pot.', 'Add the rest of the milk. Heat on medium, stirring, until steaming (don\'t boil).', 'Stir in vanilla. Top with marshmallows. Cinnamon on top for grown-ups.'],
    note: 'Water boils cooler up here (about 197°F at 7,900 ft), so milk scorches easily. Keep the heat medium and keep stirring.',
  },
  {
    id: 'cider',
    title: 'Warm spiced apple cider',
    ingredients: ['½ gallon apple cider or juice', '2 cinnamon sticks', '4 whole cloves (or a pinch of ground)', '1 orange, sliced', 'Optional: a few apple slices'],
    steps: ['Put everything in a pot.', 'Simmer gently 15–20 minutes. The whole place will smell like fall.', 'Strain into mugs. Cinnamon stick straws for the kids.'],
  },
  {
    id: 'caramel',
    title: 'Easy caramel apples',
    ingredients: ['5 apples (from the Oakdale stand!)', '1 bag (11 oz) soft caramels, unwrapped', '2 Tbsp milk or cream', '5 sturdy sticks or forks', 'Toppings: crushed graham crackers, mini chips, sprinkles'],
    steps: ['Wash and DRY the apples well (caramel slides off wet or waxy apples). Push in the sticks.', 'Microwave caramels + milk in 30-second bursts, stirring, until smooth (or melt on low in a pot).', 'Dip and twirl each apple. Roll in toppings. Set on buttered foil or parchment.', 'Chill 15 minutes. Slice to share. Grown-ups handle the hot caramel.'],
    note: 'Or skip the mess: Rocky Mountain Chocolate Factory in Mammoth makes them in the store (10–8 daily).',
  },
  {
    id: 'smores',
    title: 'S\'mores, the fire-safe way',
    ingredients: ['Graham crackers', 'Chocolate squares', 'Marshmallows'],
    steps: ['Stage 1 fire restrictions are in effect on Inyo National Forest (through Dec 31, 2026): fires only in designated rings in developed sites.', 'Oven s\'mores: build on a sheet pan, marshmallow on top, broil 1–2 minutes and watch closely.', 'Or use a gas fireplace\'s glow for cozy vibes and do the toasting in the oven.'],
  },
];

export const activities = {
  rubbing: {
    title: 'Leaf rubbings',
    steps: ['Put a leaf bumpy-side UP on a table.', 'Lay thin paper on top.', 'Peel a crayon and rub its long side gently over the leaf.', 'Watch the veins appear like magic! Try gold, orange, and red on one page.'],
  },
  pressing: {
    title: 'Pressing leaves',
    steps: ['Pick fallen leaves that are flat and dry (not wet or crunchy).', 'Lay them between paper towels or napkins inside a heavy book.', 'Stack more books on top. Leave them 1–2 weeks at home.', 'Glue them into a "Fall Trip" page, or laminate with clear packing tape as bookmarks.'],
  },
  photos: [
    { id: 'p-all5', text: 'All five of us in the aspens' },
    { id: 'p-bigleaf', text: 'A kid holding the biggest leaf' },
    { id: 'p-tufa', text: 'Everyone making a tufa-tower pose' },
    { id: 'p-cocoa', text: 'Cocoa mugs clinking at an overlook' },
    { id: 'p-granite', text: 'Tiny us on giant granite (Olmsted Point)' },
    { id: 'p-beaver', text: 'Pointing at a beaver-chewed stump' },
    { id: 'p-jump', text: 'A jump shot in front of golden trees' },
    { id: 'p-caramel', text: 'Caramel-apple faces' },
    { id: 'p-stars', text: 'The night sky (phone on a rock, night mode)' },
    { id: 'p-reading', text: 'Reading in the cozy corner' },
    { id: 'p-sign', text: 'The Tioga Pass sign (9,945 ft)' },
    { id: 'p-sunday', text: 'Sunday-morning family photo' },
  ],
};
