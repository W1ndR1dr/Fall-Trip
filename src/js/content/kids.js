// Kid-facing content: leaf hunt, why leaves change, tracks, rocks, games.
// Sources for every fact are listed in research-notes.md.

export const hunt = [
  { id: 'aspen', art: 'leaves.aspen', name: 'Quaking aspen leaf', hint: 'Roundish with a little point. Roll the stem between your fingers: it is FLAT like a ribbon. That is why aspen leaves shiver and "quake" in the tiniest breeze.' },
  { id: 'cottonwood', art: 'leaves.cottonwood', name: 'Black cottonwood leaf', hint: 'Longer than an aspen leaf, shaped like a spear, and often down by creeks. Its buds are sticky and smell sweet.' },
  { id: 'willow', art: 'leaves.willow', name: 'Willow leaf', hint: 'Long and skinny, like a green or yellow feather. Willows love wet feet, so look along creeks and ponds.' },
  { id: 'birch', art: 'leaves.birch', name: 'Water birch leaf', hint: 'Small, with teeth on its teeth (look close!). Water birch grows in shrubby clumps beside streams, with shiny reddish bark.' },
  { id: 'red', art: 'leaves.red', name: 'A red leaf', hint: 'Red is the rarest color up here. Try wild rose bushes, currants, or a mountain maple. Red leaves make their color fresh in fall.' },
  { id: 'big', art: 'leaves.big', name: 'The biggest leaf', hint: 'Find the biggest leaf you can. Measure it against your hand. Take a photo with it!' },
  { id: 'heart', art: 'leaves.heart', name: 'A heart-shaped leaf', hint: 'Some aspen and cottonwood leaves are shaped like a heart. Keep looking; one is waiting for you.' },
  { id: 'cone', art: 'things.pinecone', name: 'A pinecone', hint: 'Jeffrey pine cones are "gentle": the prickles point in, so they don\'t poke. Then sniff Jeffrey pine bark. Does it smell like vanilla or butterscotch?' },
  { id: 'granite', art: 'things.granite', name: 'A granite sparkle', hint: 'Granite is speckled salt-and-pepper rock. Tilt a piece in the sun: the sparkles are tiny crystals (mica and feldspar).' },
  { id: 'dam', art: 'things.beaverDam', name: 'A beaver dam (Lundy!)', hint: 'Beavers stack sticks and mud to make ponds. Look for aspen stumps chewed into a point, like a pencil.' },
  { id: 'tufa', art: 'things.tufa', name: 'A tufa tower', hint: 'At Mono Lake, bubbly spring water met salty lake water and made rock towers, like a sandcastle that grew by itself.' },
  { id: 'eyes', art: 'leaves.aspen', name: 'Aspen "eyes"', hint: 'Aspen bark has dark marks shaped like eyes where old branches fell off. How many eyes can you count on one tree?', bonus: true },
  { id: 'track', art: 'tracks.deer', name: 'An animal track', hint: 'Look in mud or sand near water. Check the Tracks page to guess who made it.', bonus: true },
  { id: 'obsidian', art: 'things.granite', name: 'A piece of obsidian (look only)', hint: 'Black, shiny volcanic glass. Look and take a photo, but leave it where it is.', bonus: true },
];

export const badgeLines = [
  'Leaf Hunter, First Class!',
  'Eagle-eyed Explorer!',
  'Keeper of the Golden Leaves!',
];

// "Why leaves change" steps for the interactive slider (0..1 progress).
export const leafScience = {
  intro:
    'All summer, leaves are little kitchens. They use sunlight to make food (sugar) for the tree. The green stuff that catches sunlight is called chlorophyll.',
  pigments: [
    { key: 'chl', name: 'Chlorophyll', color: 'var(--pig-green)', kid: 'Green. Catches sunlight. Fades away in fall when days get short and nights get cold.' },
    { key: 'car', name: 'Carotenoids', color: 'var(--pig-gold)', kid: 'Yellow and orange. They were hiding in the leaf ALL summer, covered up by green. Aspen gold is this!' },
    { key: 'ant', name: 'Anthocyanins', color: 'var(--pig-red)', kid: 'Red and purple. Made fresh in fall from sugar trapped in the leaf, best after sunny days and cold (not freezing) nights.' },
  ],
  steps: [
    { at: 0, title: 'Summer', text: 'Lots of green chlorophyll. The yellow is already there, just hidden.' },
    { at: 0.35, title: 'Short days, chilly nights', text: 'The tree stops making new chlorophyll. The green starts to fade.' },
    { at: 0.65, title: 'Gold shows through', text: 'With the green gone, hidden yellow and orange shine out. Surprise!' },
    { at: 0.9, title: 'Some leaves blush red', text: 'Sunny days plus cold nights help some leaves make brand-new red color.' },
  ],
  wonder:
    'The gold was inside the leaf all along, waiting for its season. God made a world with seasons: a time to grow green, a time to shine gold, and a time to rest. What do you think is inside you, waiting for its season?',
  bonus: [
    'An aspen grove is often ONE living thing. All the trees share the same roots underground, like a family holding hands.',
    'The biggest aspen family (called Pando, in Utah) covers more than 100 acres, bigger than 75 football fields!',
    'Aspen bark is a little green under its white coat. It can make food from sunlight even in winter.',
  ],
};

export const tracks = [
  { id: 'deer', name: 'Mule deer', where: 'Meadows and aspen groves at dawn and dusk.', clue: 'Two pointy teardrops, like an upside-down heart.' },
  { id: 'coyote', name: 'Coyote', where: 'Trails, dirt roads, sagebrush.', clue: 'Four toes and claws, an oval shape, and walks in a straight line.' },
  { id: 'bear', name: 'Black bear', where: 'Forests and campgrounds (never feed bears!).', clue: 'Five toes and a wide pad, like a big bare foot.' },
  { id: 'beaver', name: 'Beaver', where: 'Lundy Canyon ponds, muddy banks.', clue: 'Huge webbed back foot. Often the tail drags over the tracks.' },
  { id: 'squirrel', name: 'Chipmunk and squirrel', where: 'Everywhere! Rocks, logs, picnic tables.', clue: 'Tiny hops: two little front prints behind two bigger back prints.' },
  { id: 'raccoon', name: 'Raccoon', where: 'Creek edges and mud.', clue: 'Looks like a tiny human hand.' },
  { id: 'bird', name: 'Songbird', where: 'Snow, mud, and sand.', clue: 'Three toes forward, one back. Hops in pairs.' },
  { id: 'gull', name: 'California gull', where: 'Mono Lake shoreline.', clue: 'Webbed feet for paddling. Thousands of gulls raise their chicks on Mono Lake\'s islands every spring.' },
];

export const rocks = [
  { id: 'granite', title: 'Granite', where: 'Tioga Pass, Olmsted Point, Bishop Creek', text: 'Granite cooled slowly, deep underground, from melted rock. Then the mountains rose and ice ground them smooth. Look for sparkly crystals and "glacier polish" that shines like a mirror.' },
  { id: 'tufa', title: 'Tufa towers', where: 'South Tufa, Mono Lake', text: 'Springs bubble up under the lake. Their water has calcium; the lake water has carbonate. When they meet they make limestone, and the tower grows a tiny bit at a time, over decades to centuries. The towers were underwater until the lake got lower.' },
  { id: 'obsidian', title: 'Obsidian', where: 'Panum Crater, Obsidian Dome, Mono Craters', text: 'Volcanic glass! Lava cooled so fast that crystals had no time to grow. Native people used it to make sharp tools. It\'s black and shiny.' },
  { id: 'pumice', title: 'Pumice', where: 'Around Panum Crater and Mono Craters', text: 'A rock full of bubbles, so light it can float! It came out of the volcano foamy, like soda shaken up.' },
  { id: 'panum', title: 'A baby volcano', where: 'Panum Crater, near South Tufa', text: 'Panum Crater erupted only about 650 years ago, while castles were being built in Europe. It is the youngest of the Mono Craters.' },
  { id: 'caldera', title: 'A super-volcano\'s bowl', where: 'Long Valley, Hot Creek, Mammoth', text: 'About 760,000 years ago, a gigantic eruption left a bowl in the land 10 miles wide and 20 miles long. The ground is still warm underneath, which is why Hot Creek steams and bubbles.' },
  { id: 'islands', title: 'Young islands', where: 'Mono Lake (look out from South Tufa)', text: 'The two islands in Mono Lake are less than about 2,000 years old. The dark one (Negit) and the white one (Paoha) came from volcanoes under the lake.' },
];

export const carGames = [
  { title: 'Fall Color I-Spy', text: 'I spy something gold... orange... red... Each person picks a color the others have to find out the window.' },
  { title: 'Alphabet of Fall', text: 'Take turns naming fall things A to Z: Apples, Bears, Cocoa, Deer... Stuck on Q? "Quaking aspen!"' },
  { title: 'Count the Cows (Sierra edition)', text: 'Each side of the car counts cows, horses, and deer. Pass a lake? Your side\'s count doubles!' },
  { title: 'Would You Rather', text: 'Would you rather be a beaver or a bear for a day? Swim in Mono Lake or climb a tufa tower? Eat only caramel apples or only cocoa?' },
  { title: 'Story Chain', text: 'One person starts a story about a chipmunk who wanted to see the ocean. Each person adds one sentence.' },
  { title: 'Quiet Game: Leaf Listening', text: 'At a stop, roll down the windows. Who can hear the aspens whisper first?' },
];

export const trivia = [
  { q: 'Why do aspen leaves shake in the wind?', a: 'Their stems are flat like ribbons, so they flutter easily.' },
  { q: 'Where does the yellow in a fall leaf come from?', a: 'It was there all summer, hidden under the green!' },
  { q: 'What does a beaver use to build a dam?', a: 'Sticks, mud, and rocks. Its teeth never stop growing, so chewing keeps them just right.' },
  { q: 'How old is Panum Crater?', a: 'About 650 years. That is young for a volcano!' },
  { q: 'Mono Lake is saltier than the ocean. True or false?', a: 'True! It is about two and a half times saltier. Only tiny brine shrimp and alkali flies can live in it.' },
  { q: 'Which pine smells like vanilla or butterscotch?', a: 'Jeffrey pine. Sniff the bark!' },
  { q: 'Is a whole aspen grove one tree or many?', a: 'Often ONE living thing, connected by its roots.' },
  { q: 'What makes red leaves red?', a: 'A pigment made fresh in fall, after sunny days and cold nights.' },
  { q: 'What is obsidian?', a: 'Volcanic glass that cooled super fast.' },
  { q: 'How high is Tioga Pass?', a: 'Almost 10,000 feet (about 9,945). It is the highest highway pass in California!' },
];

export const drawPrompts = [
  'Draw the tallest aspen you saw, and give it a face made of its bark "eyes."',
  'Draw a beaver\'s house. What does it look like inside?',
  'Leaf rubbing: put a leaf under paper, bumpy side up, and rub the side of a crayon over it.',
  'Draw the view from the car window as fast as you can: 60 seconds, go!',
  'Draw a tufa tower city. Who lives there?',
  'Draw the night sky tonight. How many stars did you count?',
  'Draw your favorite animal track, then invent an animal to match it.',
  'Draw your cozy spot: where you\'d curl up with cocoa and a book.',
];

// Night sky for Oct 9–11, 2026: New Moon on Sat Oct 10 (08:50 PDT), the
// darkest weekend of the month. Saturn reached opposition Oct 4.
export const sky = {
  headline: 'New Moon weekend: the darkest skies of the month!',
  timing: 'The sky is fully dark by about 7:50 pm (astronomical dusk). Kids can see plenty by 7:15. You don\'t need to stay up late.',
  moon: { phase: 'New Moon', illum: 0.0, note: 'Friday the moon is a 1% sliver that sets right after the sun. Saturday is New Moon. Sunday is a 2% sliver. No moonlight either night means a sky FULL of stars.' },
  finds: [
    { id: 'milkyway', name: 'The Milky Way', how: 'A pale cloudy river across the sky, from the southwest up overhead. It\'s our own galaxy, seen from inside!', when: 'After ~7:45 pm, away from lights' },
    { id: 'saturn', name: 'Saturn', how: 'A bright, steady, golden "star" that doesn\'t twinkle, low in the east after dark and higher in the southeast by 10 pm. Binoculars on a steady elbow may show it looks oval.', when: 'All evening' },
    { id: 'triangle', name: 'The Summer Triangle', how: 'Three bright stars making a giant triangle high in the west: Vega (brightest), Deneb, and Altair.', when: 'Right after dark' },
    { id: 'dipper', name: 'The Big Dipper', how: 'Seven stars shaped like a ladle, low in the north-northwest. Mountains may hide part of it!', when: 'Early evening' },
    { id: 'cassiopeia', name: 'Cassiopeia, the big W', how: 'Five stars making a W (or M) in the northeast, across from the Big Dipper.', when: 'All evening' },
    { id: 'satellite', name: 'A satellite', how: 'A "star" that moves slowly and steadily across the sky with no blinking. Count how many you see!', when: 'First 2 hours after dark' },
    { id: 'meteor', name: 'A shooting star', how: 'A quick streak of light. It\'s a speck of space dust burning up. Make a thank-you, not a wish!', when: 'Anytime, keep watching' },
  ],
  tips: [
    'Give your eyes 15–20 minutes of darkness. More stars appear the longer you wait.',
    'Use red light only. Put red tape or a red sock over a flashlight, or use a red headlamp mode.',
    'Lie on a blanket in warm layers, hats, and gloves. It gets cold fast after sunset.',
    'Bring cocoa in a thermos. Stargazing is a cocoa activity.',
    'Get away from lodge and parking-lot lights, even just 100 steps.',
  ],
};
