import { Router, Route, Switch, Link } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { ROUTE_PATHS } from './routes';
import { usePwa } from './lib/pwa';

// Placeholder shell: proves routing, offline, and the build. Replaced by the UI build.
function Placeholder({ path }: { path: string }) {
  return (
    <main id="main" tabIndex={-1} style={{ padding: 24 }}>
      <h1>{path}</h1>
      <nav>
        {['/', '/plan', '/explore', '/kids', '/faith'].map((p) => (
          <Link key={p} href={p} style={{ marginRight: 12 }}>
            {p}
          </Link>
        ))}
      </nav>
    </main>
  );
}

export function App() {
  const pwa = usePwa();
  return (
    <Router hook={useHashLocation}>
      <Switch>
        {ROUTE_PATHS.map((p) => (
          <Route key={p} path={p}>
            <Placeholder path={p} />
          </Route>
        ))}
        <Route>
          <Placeholder path="/" />
        </Route>
      </Switch>
      {pwa.needRefresh && <button onClick={pwa.update}>Update available. Reload.</button>}
    </Router>
  );
}
