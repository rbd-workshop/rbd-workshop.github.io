import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';
import { searchAssets } from './seo.mjs';
import { pages, legacyRoutes } from './pages.mjs';

await build();
const data = JSON.parse(await readFile(path.join(root, 'content/workshop.json'), 'utf8'));
const site = new URL(data.siteUrl);
const records = new Map();
for (const page of pages) {
  const html = await readFile(path.join(root, 'docs', page.path, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  records.set(new URL(page.path, site).pathname, { page, html, ids });
}
let checked = 0;
async function checkLocalLink(rawUrl, base) {
  if (rawUrl.startsWith('mailto:')) return;
  const url = new URL(rawUrl.replace(/&amp;/g, '&'), base);
  if (url.origin !== site.origin) return;
  const record = records.get(url.pathname);
  if (record) {
    if (url.hash) assert(record.ids.includes(url.hash.slice(1)), `Missing fragment: ${url}`);
  } else {
    assert(!url.hash, `Unexpected asset fragment: ${url}`);
    const filename = path.join(root, 'docs', url.pathname.slice(site.pathname.length));
    assert((await stat(filename)).isFile(), `Missing file: ${url}`);
  }
  checked++;
}
const titles = new Set();
const descriptions = new Set();
for (const { page, html, ids } of records.values()) {
  const seo = searchAssets(data, page);
  assert.equal(new Set(ids).size, ids.length, `${page.id}: IDs must be unique`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page.id}: one main heading required`);
  assert(!/\{\{\w+\}\}/.test(html), `${page.id}: unresolved placeholders`);
  assert(html.includes('NAACL 2027'));
  assert(!html.includes('href="#"'));
  assert(!/localhost|127\.0\.0\.1/.test(html), 'Local preview URL in production HTML');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) await checkLocalLink(url, seo.pageUrl);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\balt="[^"]*"/.test(tag), 'Missing image alt text');
    assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), 'Missing image dimensions');
  }
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonical.length, 1);
  assert.equal(canonical[0][1], seo.pageUrl, 'Each page must self-canonicalize');
  assert(html.includes(`property="og:url" content="${seo.pageUrl}"`));
  assert(html.includes(`property="og:image" content="${data.siteUrl}assets/rbd-social.png"`));
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  assert(/name="robots" content="index, follow, max-image-preview:large"/.test(html));
  titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
  descriptions.add(html.match(/name="description" content="([^"]+)"/)[1]);
  const current = [...html.matchAll(/<a href="([^"]+)" aria-current="page">/g)];
  assert.equal(current.length, 1, 'Exactly one active page in navigation');
  assert.equal(current[0][1], site.pathname + page.path);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1);
  const graph = JSON.parse(blocks[0][1]);
  assert.equal(graph['@context'], 'https://schema.org');
  const entities = graph['@graph'];
  const entityIds = new Set(entities.map(entity => entity['@id']));
  assert.equal(entityIds.size, entities.length);
  for (const entity of entities) {
    assert(entity.name);
    for (const ref of JSON.stringify(entity).matchAll(/"@id":"([^"]+)"/g)) assert(entityIds.has(ref[1]), `Unresolved entity: ${ref[1]}`);
  }
  assert(!entities.some(e => e['@type'] === 'Event'), 'Workshop date is unconfirmed');
  assert.equal(entities.find(e => e['@type'] === 'WebSite').url, data.siteUrl);
  assert.equal(entities.find(e => e['@type'] === 'WebPage').url, seo.pageUrl);
  const people = entities.filter(e => e['@type'] === 'Person');
  const expectedPeople = page.id === 'speakers' ? data.speakers : page.id === 'organizers' ? data.organizers : [];
  assert.equal(people.length, expectedPeople.length, 'Only mark up people on this page');
  for (const person of expectedPeople) {
    assert(ids.includes(person.id), `Person missing from page: ${person.name}`);
    assert(html.includes(person.bio.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')), `Biography changed: ${person.name}`);
  }
  if (page.id !== 'home') assert(!html.includes('rel="preload" as="image"'), 'Only home needs the bridge preload');
}
assert.equal(titles.size, pages.length, 'Page titles must be distinct');
assert.equal(descriptions.size, pages.length, 'Descriptions must be distinct');
let legacyCount = 0;
for (const { page, html, ids } of records.values()) {
  const routes = legacyRoutes(data, page);
  legacyCount += Object.keys(routes).length;
  if (!Object.keys(routes).length) continue;
  const embeddedRoutes = JSON.parse(html.match(/id="legacy-routes">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(embeddedRoutes, routes);
  for (const [oldId, target] of Object.entries(routes)) {
    assert(ids.includes(oldId), `Missing no-JavaScript fallback for ${page.path}#${oldId}`);
    await checkLocalLink(target, new URL(page.path, data.siteUrl));
  }
}
const css = await readFile(path.join(root, 'docs/assets/style.css'), 'utf8');
for (const [, url] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) await checkLocalLink(url, data.siteUrl + 'assets/style.css');
const sitemap = await readFile(path.join(root, 'docs/sitemap.xml'), 'utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]), pages.map(p => new URL(p.path, site).href));
assert(sitemap.includes(`<lastmod>${data.lastUpdated}</lastmod>`));
const robots = await readFile(path.join(root, 'docs/robots.txt'), 'utf8');
assert(robots.includes(`Sitemap: ${data.siteUrl}sitemap.xml`));
assert(!/Disallow:\s*\//i.test(robots));
const notFound = await readFile(path.join(root, 'docs/404.html'), 'utf8');
assert(notFound.includes('noindex, follow') && notFound.includes('Return to the workshop homepage'));
for (const [, url] of notFound.matchAll(/(?:href|src)="([^"]+)"/g)) await checkLocalLink(url, data.siteUrl + 'missing/nested/');
const llms = await readFile(path.join(root, 'docs/llms.txt'), 'utf8');
for (const [, url] of llms.matchAll(/\]\(([^)]+)\)/g)) await checkLocalLink(url, data.siteUrl);
assert(llms.includes('Author guidelines are a draft'));
const shareImage = await readFile(path.join(root, 'docs/assets/rbd-social.png'));
assert.equal(shareImage.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(shareImage.readUInt32BE(16), 1200);
assert.equal(shareImage.readUInt32BE(20), 630);
assert(shareImage.length < 300_000);
for (const siteUrl of ['http://rbd-workshop.github.io/', 'https://localhost/', 'https://user:password@example.org/', 'https://example.org/?draft=1', 'https://example.org/#home']) {
  assert.throws(() => searchAssets({ ...data, siteUrl }));
}
assert.throws(() => searchAssets({ ...data, lastUpdated: '2026-02-30' }), /real date/);
const escaped = searchAssets({ ...data, title: '</script><script>alert(1)</script>' }).structuredData;
assert(!escaped.includes('</script>'));
JSON.parse(escaped);
console.log(`Passed: ${pages.length} pages, ${checked} internal links/assets, ${legacyCount} legacy routes, page metadata, visible people, sitemap and safety checks.`);
