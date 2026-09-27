// Route contract (hash routes). Screens are filled in by the UI build.
// Keep these paths stable: the offline test and deep links depend on them.
export const ROUTE_PATHS = [
  '/', '/plan', '/plan/:day', '/route/:id', '/pack', '/before',
  '/explore', '/explore/:filter', '/do/:id', '/color', '/food',
  '/kids', '/kids/hunt', '/kids/leaves', '/kids/tracks', '/kids/rocks', '/kids/sky', '/kids/games', '/kids/draw', '/kids/photos', '/kids/cozy',
  '/faith', '/faith/verse', '/faith/journal', '/faith/lookback', '/faith/:id',
  '/settings', '/about', '/install',
] as const;
