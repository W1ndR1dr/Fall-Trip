// Build: copy src/ -> dist/, then stamp the service worker with a precache
// list of every file and a content hash so any change triggers an update.
import { createHash } from 'node:crypto';
import { cp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'src');
const dist = join(root, 'dist');

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

await rm(dist, { recursive: true, force: true });
await cp(src, dist, { recursive: true });

// GitHub Pages: skip Jekyll processing.
await writeFile(join(dist, '.nojekyll'), '');

const files = (await walk(dist))
  .map((p) => relative(dist, p).split(sep).join('/'))
  .filter((f) => !['sw.js', '.nojekyll', 'robots.txt'].includes(f) && !f.endsWith('.map'))
  .sort();

const hash = createHash('sha256');
for (const f of files) hash.update(f).update(await readFile(join(dist, f)));
const version = hash.digest('hex').slice(0, 12);

// './' is the navigation entry point; index.html is also listed explicitly.
const precache = ['./', ...files.map((f) => './' + f), './version.json'];
const swPath = join(dist, 'sw.js');
const sw = (await readFile(swPath, 'utf8'))
  .replace('__VERSION__', version)
  .replace('__PRECACHE__', JSON.stringify(precache, null, 2));
await writeFile(swPath, sw);

// Expose the build version to the page (shown on the About screen).
const vPath = join(dist, 'version.json');
await writeFile(vPath, JSON.stringify({ version, built: new Date().toISOString() }));

let bytes = 0;
for (const f of files) bytes += (await stat(join(dist, f))).size;
console.log(`Built ${files.length} files, ${(bytes / 1024).toFixed(0)} KB, version ${version}`);
