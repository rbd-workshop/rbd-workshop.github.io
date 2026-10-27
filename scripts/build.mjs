import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { searchAssets } from './seo.mjs';
import { pages, legacyRoutes } from './pages.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = value => {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Profile and submission URLs must use HTTPS');
  return escape(url.href);
};
const person = (p, siteRoot) => `<article class="person${p.image ? '' : ' person-without-photo'}" id="${escape(p.id)}">
  ${p.image ? `<img class="person-photo" src="${escape(siteRoot + p.image)}" alt="${escape(p.name)}" width="300" height="360" loading="lazy">` : '<p class="photo-pending">Photograph forthcoming</p>'}
  <div class="person-copy"><div class="person-heading"><h2>${p.url ? `<a href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">${escape(p.name)}</a>` : escape(p.name)}</h2><p class="affiliation">${escape(p.affiliation)}</p></div><p class="biography">${escape(p.bio)}</p>${p.url ? `<a class="profile-link" href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(p.name)}’s profile (opens in a new tab)">Profile</a>` : ''}</div>
</article>`;
const interpolate = (source, variables) => source.replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!(key in variables)) throw new Error(`Missing template value: ${key}`);
  return variables[key];
});

export async function build() {
  const data = JSON.parse(await readFile(path.join(root, 'content/workshop.json'), 'utf8'));
  const seo = searchAssets(data);
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(data.contactEmail)) throw new Error('Invalid contact email');
  const siteRoot = seo.siteRoot;
  const assetVersion = async filename => createHash('sha256').update(await readFile(path.join(root, 'src', filename))).digest('hex').slice(0, 12);
  const variables = {
    ...Object.fromEntries(Object.entries(data).filter(([,v]) => typeof v === 'string').map(([k,v]) => [k,escape(v)])),
    siteRoot: escape(siteRoot), siteUrl: escape(seo.siteUrl), socialImageUrl: escape(seo.socialImageUrl),
    styleVersion: await assetVersion('style.css'), scriptVersion: await assetVersion('app.js'),
    topics: data.topics.map(t => `<li><strong>${escape(t.title)}.</strong> ${escape(t.description)}</li>`).join('\n'),
    speakers: data.speakers.map(p => person(p, siteRoot)).join('\n'),
    organizers: data.organizers.map(p => person(p, siteRoot)).join('\n'),
    committee: data.committee.map(([name, affiliation]) => `<li><span>${escape(name)}</span><span>${escape(affiliation)}</span></li>`).join('\n'),
    dates: data.dates.map(d => `<div class="date-row"><dt>${escape(d.label)}</dt><dd>${escape(d.value)}</dd></div>`).join('\n'),
    submission: data.submissionUrl
      ? `<p><a href="${safeUrl(data.submissionUrl)}" target="_blank" rel="noopener noreferrer">Submit your paper</a></p>`
      : '<p>The submission portal and paper deadlines will be announced here.</p>'
  };
  const dateTemplate = await readFile(path.join(root, 'src/partials/dates.html'), 'utf8');
  const layout = await readFile(path.join(root, 'src/layout.html'), 'utf8');
  for (const page of pages) {
    const pageSeo = searchAssets(data, page);
    const routes = legacyRoutes(data, page);
    const hasLegacyRoutes = Object.keys(routes).length > 0;
    const localTarget = target => { const url = new URL(target, pageSeo.pageUrl); return url.pathname + url.hash; };
    const nav = pages;
    const pageVariables = {
      ...variables, datesId: 'dates', datesTitleId: 'dates-title', pageId: page.id, pageUrl: escape(pageSeo.pageUrl), seoTitle: escape(pageSeo.seoTitle),
      description: escape(pageSeo.description), structuredData: pageSeo.structuredData,
      footerContact: page.id === 'home' ? '' : `<a href="${escape(siteRoot)}#contact">Contact</a>`,
      navigation: nav.map(item => `<a href="${escape(siteRoot + item.path)}"${item.id === page.id ? ' aria-current="page"' : ''}>${item.label}</a>`).join(''),
      heroPreload: page.id === 'home' ? `<link rel="preload" as="image" href="${escape(siteRoot)}assets/san-francisco.webp" fetchpriority="high">` : '',
      legacyLinks: hasLegacyRoutes ? `<div class="legacy-links container">${Object.entries(routes).map(([id, target]) => `<p id="${escape(id)}">This section has its own page. <a href="${escape(localTarget(target))}">Continue to ${target.endsWith('#dates') ? 'the important dates on Home' : target.startsWith('cfp') ? 'the call for papers' : target.startsWith('organizers') ? 'the organizers and program committee' : target.startsWith('speakers') ? 'the invited speakers' : 'the program'}</a>.</p>`).join('')}</div>` : '',
      legacyRoutes: hasLegacyRoutes ? `<script type="application/json" id="legacy-routes">${JSON.stringify(routes).replace(/</g, '\\u003c')}</script>` : ''
    };
    pageVariables.dateSidebar = interpolate(dateTemplate, pageVariables);
    pageVariables.content = interpolate(await readFile(path.join(root, 'src/pages', page.template), 'utf8'), pageVariables);
    const output = path.join(root, 'docs', page.path);
    await mkdir(output, { recursive: true });
    await writeFile(path.join(output, 'index.html'), interpolate(layout, pageVariables));
  }
  // assets/ is generated exclusively from src/assets plus the stylesheet and script.
  await rm(path.join(root, 'docs/assets'), { recursive: true, force: true });
  await mkdir(path.join(root, 'docs/assets'), { recursive: true });
  await writeFile(path.join(root, 'docs/404.html'), interpolate(await readFile(path.join(root, 'src/404.html'), 'utf8'), variables));
  await writeFile(path.join(root, 'docs/robots.txt'), seo.robots);
  await writeFile(path.join(root, 'docs/sitemap.xml'), seo.sitemap);
  await writeFile(path.join(root, 'docs/llms.txt'), seo.llms);
  await writeFile(path.join(root, 'docs/llms-full.txt'), seo.llmsFull);
  await writeFile(path.join(root, 'docs/workshop.json'), seo.workshopData);
  await cp(path.join(root, 'src/style.css'), path.join(root, 'docs/assets/style.css'));
  await cp(path.join(root, 'src/app.js'), path.join(root, 'docs/assets/app.js'));
  await cp(path.join(root, 'src/assets'), path.join(root, 'docs/assets'), { recursive: true });
  await writeFile(path.join(root, 'docs/.nojekyll'), '');
  console.log(`Built ${pages.length} pages in docs/ — ready for local preview or GitHub Pages.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
