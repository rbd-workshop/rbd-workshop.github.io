import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = value => {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Profile and submission URLs must use HTTPS');
  return escape(url.href);
};
const person = p => `<article class="person${p.image ? '' : ' person-without-photo'}" id="${escape(p.id)}">
  ${p.image ? `<img class="person-photo" src="${escape(p.image)}" alt="${escape(p.name)}" width="300" height="360" loading="lazy">` : '<p class="photo-pending">Photograph forthcoming</p>'}
  <div class="person-copy"><div class="person-heading"><h3>${p.url ? `<a href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">${escape(p.name)}</a>` : escape(p.name)}</h3><p class="affiliation">${escape(p.affiliation)}</p></div><p class="biography">${escape(p.bio)}</p>${p.works?.length ? `<p class="selected-work">Selected work: ${p.works.map(w => `<a href="${safeUrl(w.url)}" target="_blank" rel="noopener noreferrer">${escape(w.title)}</a>`).join(' · ')}</p>` : ''}${p.url ? `<a class="profile-link" href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">Profile</a>` : ''}</div>
</article>`;

export async function build() {
  const data = JSON.parse(await readFile(path.join(root, 'content/workshop.json'), 'utf8'));
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(data.contactEmail)) throw new Error('Invalid contact email');
  const topics = data.topics.map(t => `<li><strong>${escape(t.title)}.</strong> ${escape(t.description)}</li>`).join('\n');
  const speakers = data.speakers.map(person).join('\n');
  const organizers = data.organizers.map(person).join('\n');
  const committee = data.committee.map(([name, affiliation]) => `<li><span>${escape(name)}</span><span>${escape(affiliation)}</span></li>`).join('\n');
  const dates = data.dates.map(d => `<div class="date-row"><dt>${escape(d.label)}</dt><dd>${escape(d.value)}</dd></div>`).join('\n');
  const submission = data.submissionUrl
    ? `<p><a href="${safeUrl(data.submissionUrl)}" target="_blank" rel="noopener noreferrer">Submit your paper</a></p>`
    : '<p>The submission portal and paper deadlines will be announced here.</p>';
  const variables = { ...Object.fromEntries(Object.entries(data).filter(([,v]) => typeof v === 'string').map(([k,v]) => [k,escape(v)])), topics, speakers, organizers, committee, dates, submission };
  let html = await readFile(path.join(root, 'src/index.html'), 'utf8');
  html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => { if (!(key in variables)) throw new Error(`Missing template value: ${key}`); return variables[key]; });
  // assets/ is generated exclusively from src/assets plus the stylesheet and script.
  await rm(path.join(root, 'docs/assets'), { recursive: true, force: true });
  await mkdir(path.join(root, 'docs/assets'), { recursive: true });
  await writeFile(path.join(root, 'docs/index.html'), html);
  await cp(path.join(root, 'src/style.css'), path.join(root, 'docs/assets/style.css'));
  await cp(path.join(root, 'src/app.js'), path.join(root, 'docs/assets/app.js'));
  await cp(path.join(root, 'src/assets'), path.join(root, 'docs/assets'), { recursive: true });
  await writeFile(path.join(root, 'docs/.nojekyll'), '');
  console.log('Built docs/ — ready for local preview or GitHub Pages.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
