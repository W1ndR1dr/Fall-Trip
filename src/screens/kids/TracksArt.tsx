// Animal track glyphs, drawn to match the specimen art: flat ink shapes on a
// 64-unit grid, pad-and-toe construction, printed as if pressed into mud.
type Id = 'deer' | 'coyote' | 'bear' | 'beaver' | 'squirrel' | 'raccoon' | 'bird' | 'gull';

const toe = (cx: number, cy: number, rx: number, ry: number, rot = 0) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined} />
);

const GLYPHS: Record<Id, React.ReactNode> = {
  deer: (
    <>
      <path d="M29 14c-5 7-9 18-9 27 0 7 3 11 7 11 3 0 4-3 4-8V20c0-3-1-5-2-6z" />
      <path d="M35 14c5 7 9 18 9 27 0 7-3 11-7 11-3 0-4-3-4-8V20c0-3 1-5 2-6z" />
    </>
  ),
  coyote: (
    <>
      <path d="M32 36c-7 0-12 5-12 10 0 4 3 6 6 6 2 0 4-1 6-1s4 1 6 1c3 0 6-2 6-6 0-5-5-10-12-10z" />
      {toe(22, 27, 3.6, 5, -18)}
      {toe(42, 27, 3.6, 5, 18)}
      {toe(28, 17, 3.6, 5.4, -4)}
      {toe(36, 17, 3.6, 5.4, 4)}
      <path d="M27 10.5l1-3M37 10.5l-1-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  ),
  bear: (
    <>
      <path d="M14 34c3-4 11-6 18-6s15 2 18 6c2 4 0 9-3 13-3 4-9 7-15 7s-12-3-15-7c-3-4-5-9-3-13z" />
      {toe(13, 22, 3.6, 4.4, -25)}
      {toe(21, 16.5, 3.8, 4.6, -12)}
      {toe(30, 14, 4, 4.8)}
      {toe(39.5, 15, 4, 4.8, 10)}
      {toe(48.5, 19.5, 3.8, 4.6, 22)}
    </>
  ),
  beaver: (
    <>
      <path d="M26 44c-4-6-10-14-12-22-1-3 2-4 4-2l6 9 1-17c0-3 4-3 4 0l2 16 3-18c1-3 4-3 4 0l0 18 4-16c1-3 4-2 4 1l-2 17 4-8c2-3 5-1 4 2-2 8-7 16-11 22-2 3-4 8-7 8s-5-5-7-8z" />
    </>
  ),
  squirrel: (
    <>
      {/* two small front prints behind (below), two bigger back prints ahead (above) */}
      <path d="M22 44c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z" />
      <path d="M42 44c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z" />
      <path d="M18 18c-4 0-6 4-6 8s3 7 6 7 6-3 6-7-2-8-6-8z" />
      <path d="M46 18c-4 0-6 4-6 8s3 7 6 7 6-3 6-7-2-8-6-8z" />
      {toe(13, 13, 1.6, 2.6, -20)}
      {toe(17, 11.5, 1.6, 2.6)}
      {toe(21, 12.5, 1.6, 2.6, 18)}
      {toe(43, 12.5, 1.6, 2.6, -18)}
      {toe(47, 11.5, 1.6, 2.6)}
      {toe(51, 13, 1.6, 2.6, 20)}
    </>
  ),
  raccoon: (
    <>
      <path d="M22 38c0-5 5-9 10-9s10 4 10 9c0 6-4 14-10 14s-10-8-10-14z" />
      <path d="M17 32c-3-4-6-9-6-13 0-2 3-2 4 0l5 9z" />
      <path d="M22 27l-3-14c0-2 3-3 4-1l4 13z" />
      <path d="M30 25l-1-15c0-2 4-2 4 0l1 15z" />
      <path d="M38 26l3-14c1-2 4-1 4 1l-3 14z" />
      <path d="M44 31l6-9c1-2 4-1 3 1l-5 11z" />
    </>
  ),
  bird: (
    <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 40V14M32 40l-11-19M32 40l11-19M32 40v13" />
    </g>
  ),
  gull: (
    <>
      <path d="M32 50c-2 0-3-2-3-4V33L15 17c-1-2 1-4 3-3l14 9 14-9c2-1 4 1 3 3L35 33v13c0 2-1 4-3 4z" opacity=".32" />
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 47V20M32 34 16 17M32 34l16-17" />
      </g>
    </>
  ),
};

export function TrackGlyph({ id, className = '' }: { id: string; className?: string }) {
  const g = GLYPHS[id as Id];
  if (!g) return null;
  return (
    <svg viewBox="0 0 64 64" className={`kb-track ${className}`} aria-hidden="true" fill="currentColor">
      {g}
    </svg>
  );
}
