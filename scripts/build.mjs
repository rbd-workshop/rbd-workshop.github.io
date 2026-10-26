import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
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
const arrow = '<span aria-hidden="true">↗</span>';

export async function build() {
  const data = JSON.parse(await readFile(path.join(root, 'content/workshop.json'), 'utf8'));
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(data.contactEmail)) throw new Error('Invalid contact email');
  const topics = data.topics.map((t, i) => `<details class="topic"${i === 0 ? ' open' : ''}>
    <summary><span class="topic-number">0${i + 1}</span><h3>${escape(t.title)}</h3><span class="expand-icon" aria-hidden="true"></span></summary>
    <div class="topic-body"><p class="topic-question">${escape(t.question)}</p><p>${escape(t.description)}</p><div class="tags">${t.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div></div>
  </details>`).join('\n');
  const speakers = data.speakers.map((s, i) => `<article class="speaker">
    <a class="speaker-art art-${i + 1}" href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(s.name)} — research profile (opens in new tab)"><span class="speaker-initials" aria-hidden="true">${escape(s.initials)}</span><span class="art-lines" aria-hidden="true"></span><span class="profile-arrow" aria-hidden="true">↗</span></a>
    <h3><a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.name)}</a></h3><p class="affiliation">${escape(s.affiliation)}</p><p class="research-area">${escape(s.area)}</p>
  </article>`).join('\n');
  const organizers = data.organizers.map(s => `<article class="organizer"><span class="avatar" aria-hidden="true">${escape(s.initials)}</span><div><h3>${s.url ? `<a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.name)} ${arrow}</a>` : escape(s.name)}</h3><p>${escape(s.affiliation)}</p></div></article>`).join('\n');
  const committee = data.committee.map(([name, affiliation]) => `<li><span>${escape(name)}</span><span>${escape(affiliation)}</span></li>`).join('\n');
  const dates = data.dates.map((d, i) => `<div class="date-row"><span class="date-index">0${i + 1}</span><dt>${escape(d.label)}</dt><dd>${escape(d.value)}</dd></div>`).join('\n');
  const submission = data.submissionUrl
    ? `<a class="button button-dark" href="${safeUrl(data.submissionUrl)}" target="_blank" rel="noopener noreferrer">Submit your paper ${arrow}</a>`
    : '<p class="submission-status"><span class="status-dot" aria-hidden="true"></span> Submission link coming soon</p>';
  const variables = { ...Object.fromEntries(Object.entries(data).filter(([,v]) => typeof v === 'string').map(([k,v]) => [k,escape(v)])), topics, speakers, organizers, committee, dates, submission };
  let html = await readFile(path.join(root, 'src/index.html'), 'utf8');
  html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => { if (!(key in variables)) throw new Error(`Missing template value: ${key}`); return variables[key]; });
  await mkdir(path.join(root, 'docs/assets'), { recursive: true });
  await writeFile(path.join(root, 'docs/index.html'), html);
  await cp(path.join(root, 'src/style.css'), path.join(root, 'docs/assets/style.css'));
  await cp(path.join(root, 'src/app.js'), path.join(root, 'docs/assets/app.js'));
  await cp(path.join(root, 'src/assets'), path.join(root, 'docs/assets'), { recursive: true });
  await writeFile(path.join(root, 'docs/.nojekyll'), '');
  console.log('Built docs/ — ready for local preview or GitHub Pages.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
