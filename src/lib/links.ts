// Outbound links. They open only when tapped; nothing is fetched at runtime.

/** Apple Maps link: opens the Maps app on iPhone/iPad. */
export function mapsUrl({ q, ll, daddr }: { q?: string; ll?: string; daddr?: string }) {
  const p = new URLSearchParams();
  if (q) p.set('q', q);
  if (ll) p.set('ll', ll);
  if (daddr) p.set('daddr', daddr);
  return 'https://maps.apple.com/?' + p.toString();
}
