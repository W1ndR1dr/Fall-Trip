// Family devotions: Look · Read · Wonder · Pray · Do.
// About 5 minutes each, kid-led, parents facilitating. Passage keys match
// scripture.js. `stop` pins a moment to an itinerary/menu stop id.

export const memoryVerse = 'Ecclesiastes 3:1';

export const daily = [
  {
    id: 'fri',
    day: 'fri',
    title: 'Seedtime and harvest',
    when: 'Friday, on the drive or at bedtime',
    look: 'Look out the window at whatever is there right now: orchards, hay fields, mountains, or the first stars. This morning we were home. Tonight we are somewhere new, and the season is changing around us.',
    read: ['Genesis 8:22'],
    readNote: 'God said this to Noah after the flood, like a promise with a rainbow on it.',
    wonder: 'God promised the seasons would keep coming, every single year. What is your favorite season, and what do you think God likes about it?',
    pray: 'God, thank you for keeping your promises, every season, every year.',
    do: 'Name one "harvest" thing you saw today: apples, pumpkins, hay bales, a fruit stand. Everybody gets one.',
  },
  {
    id: 'sat',
    day: 'sat',
    title: 'Each according to its kind',
    when: 'Saturday, in the first aspen grove',
    look: 'Everybody pick up one fallen leaf (a fallen one, not one from the tree). Hold it up to the sun. Compare: are any two exactly the same?',
    read: ['Genesis 1:11–12'],
    readNote: 'This is from the very beginning, the third day of creation.',
    wonder: 'Why do you think God made leaves turn gold before they fall, instead of just dropping off green?',
    pray: 'God, you made every leaf, and you said it was good. Thank you for making it beautiful too.',
    do: 'Keep your leaf. Tonight, press it inside a heavy book, between two napkins.',
  },
  {
    id: 'sun',
    day: 'sun',
    title: 'This is the day',
    when: 'Sunday morning, the Lord\'s Day, somewhere with a view',
    look: 'Find the morning light: sun on a mountaintop, frost on the grass, mist on the lake. Right now, all over the world, people are gathering to worship God. We get to worship in his mountains.',
    read: ['Psalm 118:24', 'Ecclesiastes 3:11'],
    readNote: 'Two short ones. Take turns: one reader for each.',
    wonder: 'What was the most beautiful thing God made that you saw this weekend? Why did it make you happy?',
    pray: 'Thank you, God, for this day. We will rejoice and be glad in it.',
    do: 'Whisper one thing you are grateful for into someone\'s ear. Then sing the first verse of "For the Beauty of the Earth" together.',
    hymn: {
      title: 'For the Beauty of the Earth',
      credit: 'Folliott S. Pierpoint, 1864 (public domain)',
      lines: [
        'For the beauty of the earth,',
        'for the glory of the skies,',
        'for the love which from our birth',
        'over and around us lies,',
        'Lord of all, to thee we raise',
        'this our hymn of grateful praise.',
      ],
    },
  },
];

// Short moments pinned to places. Each is 1–2 minutes.
export const moments = [
  {
    id: 'm-granite',
    stop: 'olmsted',
    title: 'The sky is talking',
    place: 'Tioga Road: Olmsted Point or Tenaya Lake',
    look: 'Giant granite domes, a huge sky, and Half Dome far away.',
    read: ['Psalm 19:1–2'],
    wonder: 'If the sky could talk, what do you think it would say about God?',
    pray: 'God, the sky tells us you are great. We say it too!',
    do: 'Everybody be silent for 10 seconds and just look. Then say one word for what you saw.',
    why: 'Psalm 19 says creation "pours out speech" without words. Tioga\'s wide-open granite and sky is the loudest quiet place we\'ll see.',
  },
  {
    id: 'm-springs',
    stop: 'southtufa',
    title: 'Springs in the valley',
    place: 'South Tufa, Mono Lake',
    look: 'Find a tufa tower. Each one grew where a spring bubbled up under the lake. Now look for birds.',
    read: ['Psalm 104:10–12'],
    wonder: 'Springs made these towers, a tiny bit at a time, for hundreds of years. What do you think God is growing in you slowly?',
    pray: 'God, you give water to thirsty places. Thank you for taking care of the birds and of us.',
    do: 'Count the birds you can see. Is anyone singing?',
    why: 'Psalm 104:10–12 is about springs gushing up in the valleys with birds singing nearby. Tufa towers are literally spring-built, and Mono Lake is a bird haven.',
  },
  {
    id: 'm-beasts',
    stop: 'lundy',
    title: 'Ask the animals',
    place: 'Lundy Canyon beaver ponds (or any creek)',
    look: 'Find signs of a beaver: a dam, a lodge, or a stump chewed to a point.',
    read: ['Job 12:7–10'],
    wonder: 'If you could ask the beaver one question about God, what would you ask?',
    pray: 'God, every animal is in your hand. Thank you for the beavers and the birds and the fish.',
    do: 'Stay very still for one minute. What animals do you hear or see?',
    why: 'Job 12 invites us to "ask the beasts, and they will teach you." Lundy\'s beaver ponds are the best living classroom on the trip.',
  },
  {
    id: 'm-trees',
    stop: 'aspens',
    title: 'The trees clap',
    place: 'Any aspen grove on a breezy moment',
    look: 'Close your eyes and listen to the aspen leaves. They quake and rustle, a little like clapping.',
    read: ['Psalm 96:12'],
    wonder: 'The Bible says the trees sing for joy. What do you think they\'re happy about?',
    pray: 'God, the trees are singing to you. We want to sing too!',
    do: 'Clap along with the leaves. Then find a leaf with a flat stem and make it quake.',
    why: 'Psalm 96:12 pictures trees singing for joy. Quaking aspens, with their flat stems, really do shimmer and applaud in the wind.',
  },
  {
    id: 'm-stars',
    stop: 'stars',
    title: 'He names the stars',
    place: 'Outside at night, lights off, eyes adjusted',
    look: 'Lie back and look up. Give your eyes 5 minutes. More and more stars appear.',
    read: ['Psalm 147:4', 'Psalm 8:3–4'],
    wonder: 'God knows every star by name. He knows your name too. How does that make you feel?',
    pray: 'God, you made the stars and you know my name. Thank you for remembering me.',
    do: 'Pick one star and give it a secret name. Tell only one person.',
    why: 'Psalm 147:4 and Psalm 8:3–4 are the Bible\'s night-sky verses. The mountains near the new moon give us the darkest sky the kids have ever seen.',
  },
];

// Bonus moments for whenever they fit (not scheduled).
export const bonus = [
  {
    id: 'b-sunset',
    title: 'The sun knows when to set',
    when: 'At sunset or golden hour',
    read: ['Psalm 104:19'],
    wonder: 'How does the sun "know" when to go down?',
    do: 'Watch until the very last bit of sun disappears. Then say, "Good night, sun!"',
  },
  {
    id: 'b-manifold',
    title: 'So many works',
    when: 'Starting the Leaf Hunt',
    read: ['Psalm 104:24'],
    wonder: 'How many different things did God make that we could find today? Let\'s guess a number.',
    do: 'Start the hunt! Keep a tally of different kinds of leaves.',
  },
  {
    id: 'b-word',
    title: 'Leaves fall, God\'s word stays',
    when: 'Watching leaves blow off the trees',
    read: ['Isaiah 40:8'],
    wonder: 'Leaves fall and flowers fade. What stays forever?',
    do: 'Catch a falling leaf before it hits the ground (harder than it looks!).',
  },
  {
    id: 'b-lilies',
    title: 'Don\'t worry, look at the flowers',
    when: 'When someone is worried, tired, or grumpy (in the car?)',
    read: ['Matthew 6:28–30'],
    wonder: 'God dresses the flowers and the grass. What are you worried about that you can give to him?',
    do: 'Take three slow breaths together. Then each person names one way God takes care of us.',
  },
];

export const journalPrompts = [
  'What did you notice today?',
  'What made you laugh?',
  'What was the most beautiful thing?',
  'What are you thankful for?',
];
