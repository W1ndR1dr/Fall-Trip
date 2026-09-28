// Small drawings for the Kids tiles that have no specimen of their own. Same
// 96-unit grid, line weight and top-left light as the hunt art; ink and
// theme tokens only, so dark and night vision recolor them.
import { Leaf, Specimen } from '@/art';

const svg = { viewBox: '0 0 96 96', width: '100%', height: '100%', 'aria-hidden': true, overflow: 'visible' } as const;

/** Green, gold and red: the three pigments, fanned like a hand of cards. */
export function LeavesArt() {
  return (
    <span className="kh-fan" aria-hidden="true">
      <span style={{ transform: 'translate(-20%, 6%) rotate(-24deg) scale(.8)' }}>
        <Leaf pigment="green" />
      </span>
      <span style={{ transform: 'translate(20%, 4%) rotate(22deg) scale(.8)' }}>
        <Leaf pigment="red" />
      </span>
      <span style={{ transform: 'translate(0, -4%) scale(.9)' }}>
        <Leaf pigment="gold" />
      </span>
    </span>
  );
}

// The Big Dipper, roughly as it sits low in the north-northwest after dark.
const DIPPER: [number, number, number][] = [
  [12, 58, 3.1], // Alkaid
  [26, 42, 3.2], // Mizar
  [40, 37, 3.3], // Alioth
  [55, 39, 2.2], // Megrez
  [78, 29, 3.3], // Dubhe
  [81, 49, 3], // Merak
  [59, 56, 2.8], // Phecda
];
const DIPPER_LINE = 'M12 58 L26 42 L40 37 L55 39 L78 29 L81 49 L59 56 Z';
const star = (x: number, y: number, r: number) => `M${x} ${y - r * 1.6}Q${x + r * 0.28} ${y - r * 0.28} ${x + r * 1.6} ${y}Q${x + r * 0.28} ${y + r * 0.28} ${x} ${y + r * 1.6}Q${x - r * 0.28} ${y + r * 0.28} ${x - r * 1.6} ${y}Q${x - r * 0.28} ${y - r * 0.28} ${x} ${y - r * 1.6}Z`;
const DUST: [number, number][] = [
  [20, 16], [66, 12], [88, 66], [34, 64], [48, 20], [8, 32], [72, 60], [90, 14],
];

export function SkyArt() {
  return (
    <svg {...svg} className="kh-sky">
      {DUST.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill="var(--night)" opacity={0.45} />
      ))}
      <path d={DIPPER_LINE} fill="none" stroke="var(--night)" strokeWidth={0.9} strokeLinejoin="round" opacity={0.4} />
      {DIPPER.map(([x, y, r], i) => (
        <path key={i} d={star(x, y, r)} fill="var(--night)" />
      ))}
      {/* the ridge line the stars sit over */}
      <path d="M-4 90 L10 80 L20 84 L34 70 L44 78 L52 72 L64 82 L76 74 L90 84 L100 80 L100 96 L-4 96 Z" fill="var(--fill-2)" />
      <path d="M-4 90 L10 80 L20 84 L34 70 L44 78 L52 72 L64 82 L76 74 L90 84 L100 80" fill="none" stroke="var(--text-3)" strokeWidth={1.1} strokeLinejoin="round" opacity={0.7} />
    </svg>
  );
}

/** A little car on the road (drawn, like the drive legs' car glyph). */
export function GamesArt() {
  const ink = 'var(--text-2)';
  return (
    <svg {...svg} className="kh-car">
      <path d="M6 80 H90" stroke="var(--text-3)" strokeWidth={1.4} strokeLinecap="round" strokeDasharray="6 7" opacity={0.75} />
      <path
        d="M10 62 V55 C10 52 12 49.6 15 49 L25 47 L34 36.4 C36 34 38.8 32.6 42 32.6 H60 C63.2 32.6 66 34 68 36.4 L77.2 47 L84 48.6 C87 49.4 89 51.8 89 55 V62 C89 64.2 87.3 66 85 66 H14 C11.8 66 10 64.2 10 62 Z"
        fill="var(--bg-2)"
        stroke={ink}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M31 47 L38.4 38.6 C39.6 37.2 41.2 36.4 43 36.4 H48.5 V47 Z" fill="var(--fill-3)" stroke={ink} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M52.5 36.4 H59 C60.8 36.4 62.5 37.2 63.6 38.6 L70.6 47 H52.5 Z" fill="var(--fill-3)" stroke={ink} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M50.5 50 V60 M84 53.5 H87" stroke={ink} strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />
      {[29, 70].map((x) => (
        <g key={x}>
          <circle cx={x} cy={66} r={8.6} fill={ink} />
          <circle cx={x} cy={66} r={3.4} fill="var(--bg-2)" />
        </g>
      ))}
    </svg>
  );
}

/** An outline to draw over: the heart leaf, with a pencil. */
export function DrawArt() {
  return (
    <span className="kh-draw" aria-hidden="true">
      <Specimen id="heart" />
      <svg {...svg} className="kh-pencil">
        <g transform="rotate(38 70 62)">
          <rect x="64" y="30" width="12" height="44" rx="2" fill="var(--bg-2)" stroke="var(--text-2)" strokeWidth={1.4} />
          <path d="M64 74 L70 88 L76 74 Z" fill="var(--bg-3)" stroke="var(--text-2)" strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M68.2 83.8 L70 88 L71.8 83.8 Z" fill="var(--text-2)" />
          <path d="M64 38 H76" stroke="var(--text-2)" strokeWidth={1.2} />
        </g>
      </svg>
    </span>
  );
}

/** A viewfinder around a gold aspen leaf. */
export function PhotoArt() {
  const c = 'var(--text-2)';
  return (
    <span className="kh-photo" aria-hidden="true">
      <span className="kh-photo-leaf">
        <Specimen id="aspen" found />
      </span>
      <svg {...svg}>
        <g fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 28 V14 Q10 10 14 10 H28" />
          <path d="M68 10 H82 Q86 10 86 14 V28" />
          <path d="M86 68 V82 Q86 86 82 86 H68" />
          <path d="M28 86 H14 Q10 86 10 82 V68" />
        </g>
      </svg>
    </span>
  );
}

/** A mug of cocoa. */
export function CozyArt() {
  return (
    <svg {...svg} className="kh-mug">
      <g fill="none" stroke="var(--text-3)" strokeWidth={1.4} strokeLinecap="round" opacity={0.8}>
        <path d="M38 30 C33 25 43 21 38 14" />
        <path d="M50 32 C45 26 55 22 50 13" />
      </g>
      <path d="M66 50 H72 C80 50 82 56 82 61 C82 67 78 71 70 71 H65" fill="none" stroke="var(--text-2)" strokeWidth={4.5} strokeLinecap="round" />
      <path d="M24 40 H68 V74 C68 81 63 86 56 86 H36 C29 86 24 81 24 74 Z" fill="var(--bg-2)" stroke="var(--text-2)" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M24 40 H68 V46 H24 Z" fill="var(--fill-3)" />
      <path d="M31 52 V74 C31 77 33 79 36 79" fill="none" stroke="var(--text-3)" strokeWidth={1.3} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
}
