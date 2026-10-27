import { pages } from './pages.mjs';

// Search metadata is generated from the same content as the visible page.
export function searchAssets(data, page = pages[0]) {
  const site = new URL(data.siteUrl);
  if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash || site.port || /^(localhost|127\.|\[::1\])/.test(site.hostname)) {
    throw new Error('siteUrl must be a public HTTPS URL without credentials, query, fragment, or port');
  }
  if (!site.pathname.endsWith('/')) throw new Error('siteUrl must end with a slash');
  const canonical = site.href;
  const absolute = value => new URL(value, canonical).href;
  const pageUrl = absolute(page.path);
  const seoTitle = page.id === 'home' ? data.seoTitle : `${page.label} | RBD Workshop | ${data.conference}`;
  const description = page.description || data.description;
  const updated = data.lastUpdated;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updated) || !Number.isFinite(Date.parse(updated)) || new Date(updated).toISOString().slice(0, 10) !== updated) {
    throw new Error('lastUpdated must be a real date in YYYY-MM-DD format');
  }
  const orgId = absolute('#organization');
  const websiteId = absolute('#website');
  const people = page.id === 'organizers' ? data.organizers : page.id === 'speakers' ? data.speakers : [];
  const personRef = person => ({ '@id': absolute(`${page.path}#${person.id}`) });
  const socialImageUrl = absolute('assets/rbd-social.png');
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': websiteId, url: canonical,
        name: `${data.title} (RBD)`, alternateName: ['RBD Workshop', `RBD ${data.conference}`],
        description: data.description, inLanguage: 'en', publisher: { '@id': orgId }
      },
      {
        '@type': 'Organization', '@id': orgId, name: `${data.title} (RBD) Workshop`,
        url: canonical, email: data.contactEmail,
        logo: { '@type': 'ImageObject', url: absolute('assets/rbd-logo.png'), width: 1200, height: 460 },
        ...(page.id === 'organizers' ? { member: data.organizers.map(personRef) } : {})
      },
      {
        '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl,
        name: seoTitle, description, inLanguage: 'en', dateModified: updated,
        isPartOf: { '@id': websiteId }, publisher: { '@id': orgId },
        about: { '@type': 'Thing', name: data.subtitle },
        ...(people.length ? { mentions: people.map(personRef) } : {})
      },
      ...people.map(person => ({
        '@type': 'Person', ...personRef(person), name: person.name,
        url: person.url || absolute(`${page.path}#${person.id}`),
        description: person.bio,
        affiliation: { '@type': 'Organization', name: person.affiliation },
        ...(person.image ? { image: absolute(person.image) } : {})
      }))
    ]
  };
  // The workshop day and venue are unconfirmed. Do not emit Event markup
  // or substitute the parent conference dates for an actual workshop date.
  const structuredData = JSON.stringify(graph).replace(/</g, '\\u003c');
  const xml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${xml(absolute(p.path))}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n`;
  const links = [
    ['Overview', ''], ['Call for papers and topics', 'cfp/'],
    ['Draft submission guidelines', 'cfp/#guidelines'], ['Important dates', 'cfp/#dates'],
    ['Invited speakers', 'speakers/'], ['Planned program', 'program/'],
    ['Organizers and program committee', 'organizers/']
  ];
  const llms = `# ${data.title} (RBD) Workshop\n\n> ${data.subtitle}. Workshop at ${data.conference} in ${data.location}.\n\n${data.description}\n\nThe workshop day, submission deadlines, and submission portal are to be announced. Author guidelines are a draft; proposed limits and submission arrangements await the final call. Parent conference dates are not workshop dates.\n\n## Website pages\n\n${links.map(([label, anchor]) => `- [${label}](${absolute(anchor)})`).join('\n')}\n\n## Contact\n\n${data.contactEmail}\n`;
  return { siteUrl: canonical, pageUrl, seoTitle, description, siteRoot: site.pathname, socialImageUrl, structuredData, sitemap, robots, llms };
}
