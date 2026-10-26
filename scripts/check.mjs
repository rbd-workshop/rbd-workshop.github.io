import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';
import { searchAssets } from './seo.mjs';

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

const data = JSON.parse(await readFile(path.join(root, 'content/workshop.json'), 'utf8'));
const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
assert.equal(canonical.length, 1, 'Exactly one canonical URL is required');
assert.equal(canonical[0][1], data.siteUrl, 'Canonical URL must match the configured publication URL');
assert(!html.includes('127.0.0.1') && !html.includes('localhost'), 'Production HTML must not contain local preview URLs');
assert(/name="robots" content="index, follow, max-image-preview:large"/.test(html), 'Production homepage must be indexable');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
assert.equal(blocks.length, 1, 'One generated structured data graph is expected');
const graph = JSON.parse(blocks[0][1]);
assert.equal(graph['@context'], 'https://schema.org');
const entities = graph['@graph'];
const entityIds = new Set(entities.map(entity => entity['@id']));
assert.equal(entityIds.size, entities.length, 'Structured entities need unique IDs');
for (const entity of entities) {
  assert(entity.name, 'Every structured entity needs a name');
  for (const ref of JSON.stringify(entity).matchAll(/"@id":"([^"]+)"/g)) assert(entityIds.has(ref[1]), `Unresolved structured entity: ${ref[1]}`);
}
assert(!entities.some(e => e['@type'] === 'Event'), 'Do not emit event markup before the actual workshop date and venue are confirmed');
assert.equal(entities.find(e => e['@type'] === 'WebSite').url, data.siteUrl);
const people = entities.filter(e => e['@type'] === 'Person');
assert.equal(people.length, data.organizers.length + data.speakers.length, 'Structured people must match the visible participant list');
for (const person of people) assert(html.includes(person.name), `Person not visible on the page: ${person.name}`);
const sitemap = await readFile(path.join(root, 'docs/sitemap.xml'), 'utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]), [data.siteUrl], 'Sitemap should contain only the canonical page, with no fragments or preview routes');
assert(sitemap.includes(`<lastmod>${data.lastUpdated}</lastmod>`));
const robots = await readFile(path.join(root, 'docs/robots.txt'), 'utf8');
assert(robots.includes(`Sitemap: ${data.siteUrl}sitemap.xml`));
assert(!/Disallow:\s*\//i.test(robots), 'Production crawling must not be blocked');
const notFound = await readFile(path.join(root, 'docs/404.html'), 'utf8');
assert(notFound.includes('noindex, follow') && notFound.includes('Return to the workshop homepage'));
const llms = await readFile(path.join(root, 'docs/llms.txt'), 'utf8');
for (const [, anchor] of llms.matchAll(/#([a-z-]+)\)/g)) assert(ids.includes(anchor), `Broken llms.txt section: ${anchor}`);
assert(llms.includes('Author guidelines are a draft'));
const shareImage = await readFile(path.join(root, 'docs/assets/rbd-social.png'));
assert.equal(shareImage.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Social image must be a real PNG');
assert.equal(shareImage.readUInt32BE(16), 1200);
assert.equal(shareImage.readUInt32BE(20), 630);
assert(shareImage.length < 300_000, 'Keep the social image under 300 KB');
assert(html.includes(`property="og:image" content="${data.siteUrl}assets/rbd-social.png"`));
assert(html.includes('name="twitter:card" content="summary_large_image"'));
for (const siteUrl of ['http://rbd-workshop.github.io/', 'https://localhost/', 'https://user:password@example.org/', 'https://example.org/?draft=1', 'https://example.org/#home']) {
  assert.throws(() => searchAssets({ ...data, siteUrl }), undefined, `Reject unsafe publication URL: ${siteUrl}`);
}
assert.throws(() => searchAssets({ ...data, lastUpdated: '2026-02-30' }), /real date/);
const escaped = searchAssets({ ...data, title: '</script><script>alert(1)</script>' }).structuredData;
assert(!escaped.includes('</script>'), 'Structured content must not break out of its script element');
JSON.parse(escaped);
console.log(`Passed: ${checked} local links/assets, HTML structure, canonical URL, crawler files, JSON-LD entities, social image, date and metadata safety checks.`);
