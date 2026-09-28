// The route story's chapters (the old app's list, as plain facts). The first
// entry is the overview; each links to the screen that goes deeper.
export type Chapter = { when: string; title: string; text: string; link: readonly [string, string] };

export const CHAPTERS: readonly Chapter[] = [
  {
    when: 'Friday, Oct 9',
    title: 'Bay Area to Mammoth Lakes',
    text: 'About 8 hours with stops, over Tioga Pass at 9,945 feet. Scroll to follow the drive.',
    link: ['/plan/fri', 'Friday, hour by hour'],
  },
  {
    when: 'Friday, noon',
    title: 'Leave home',
    text: 'Snacks and car-sickness supplies within reach, cocoa in the thermos. About 2 hours to Oakdale.',
    link: ['/pack', 'Packing list'],
  },
  {
    when: 'Friday, 2:10 pm',
    title: 'Oakdale',
    text: 'A 20-minute stretch: feed the goats at Oakdale Cheese, or buy apples at Bloomingcamp Ranch for caramel apples later.',
    link: ['/do/oakdalecheese', 'Oakdale Cheese & Specialties'],
  },
  {
    when: 'Friday, golden hour',
    title: 'Tioga Road',
    text: 'Last gas at Crane Flat, then Olmsted Point and Tenaya Lake as the granite turns pink. Dinner is a picnic by the lake.',
    link: ['/faith/m-granite', 'Devotion at Olmsted Point'],
  },
  {
    when: 'Friday, dusk',
    title: 'Over Tioga Pass',
    text: 'California’s highest highway pass, 9,945 feet, then down to Lee Vining. Mammoth by about 8.',
    link: ['/plan/fri', 'Friday, hour by hour'],
  },
  {
    when: 'Saturday morning',
    title: 'The aspens',
    text: 'Lundy Canyon’s beaver ponds and Conway Summit should be near peak. June Lake’s fall festival is the same weekend.',
    link: ['/kids/leaves', 'Why leaves change'],
  },
  {
    when: 'Saturday afternoon',
    title: 'Mono Lake',
    text: 'Tufa towers built by underwater springs, a lake saltier than the sea, and the youngest volcano in the chain five minutes away.',
    link: ['/kids/rocks', 'Rocks and volcanoes'],
  },
  {
    when: 'Saturday night',
    title: 'New Moon',
    text: 'No moonlight at all. Dark by 7:52 pm: the Milky Way, Saturn, and the Summer Triangle.',
    link: ['/kids/sky', 'Night sky guide'],
  },
  {
    when: 'Sunday',
    title: 'Home',
    text: 'A morning devotion with a view, then back over Tioga (or Sonora Pass). Leave by 9:30, home around 6.',
    link: ['/faith/sun', 'Sunday devotion'],
  },
];
