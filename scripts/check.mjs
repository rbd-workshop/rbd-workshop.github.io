import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';

await build();
const html = await readFile(path.join(root, 'docs/index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'The page must have one main heading');
assert(!/\{\{\w+\}\}/.test(html), 'Unresolved content placeholders');
assert(html.includes('NAACL 2027'), 'Conference branding is missing');
let checked = 0;
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (url.startsWith('#')) assert(ids.includes(url.slice(1)), `Broken section link: ${url}`);
  else if (/^(https:|mailto:)/.test(url)) continue;
  else assert((await stat(path.join(root, 'docs', url))).isFile(), `Missing local asset: ${url}`);
  checked++;
}
for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]*"/.test(tag), `Image missing alt attribute: ${tag}`);
const css = await readFile(path.join(root, 'docs/assets/style.css'), 'utf8');
for (const [, url] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  assert((await stat(path.join(root, 'docs/assets', url))).isFile(), `Missing stylesheet asset: ${url}`);
  checked++;
}
assert(!html.includes('href="#"'), 'Empty placeholder links are not allowed');
console.log(`Passed: ${checked} local links/assets, unique IDs, main heading, image alternatives, and complete template content.`);
