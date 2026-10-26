# RBD · Retrieval Beyond Documents

The NAACL 2027 workshop on **Capability Retrieval for Language Agents**.

A static conference website using HTML, CSS, vanilla JavaScript, and a dependency-free Node.js generator. The layout uses a white background, navy and blue accents, visible top navigation, a San Francisco conference banner, and speaker portraits.

## Local preview

Requires Node.js 20 or newer. No package installation or account is needed.

```sh
npm start
```

Open <http://127.0.0.1:4173>. The server builds the site at startup and watches `src/` and `content/`; refresh the browser after edits. It binds only to the local computer and serves generated `docs/` files. Stop it with Ctrl+C. Use `PORT=4174 npm start` if port 4173 is occupied.

The development-only [responsive preview](http://127.0.0.1:4173/__preview?width=390) displays the same site at phone and tablet widths. This tool is not included in the published site. Restart the server after editing generator or server scripts.

```sh
npm run build   # Generate docs/ for GitHub Pages
npm run check   # Check links, assets, IDs, headings, and content replacement
```

The scripts also work with `node scripts/serve.mjs`, `node scripts/build.mjs`, and `node scripts/check.mjs`.

## Editing

- `content/workshop.json`: event information, dates, contact address, submission URL, research themes, speakers, organizers, and committee.
- `src/index.html`: page structure and workshop text.
- `src/style.css`: styling and responsive layouts.
- `src/app.js`: current-section navigation highlighting. Navigation and content also work without JavaScript.
- `src/assets/`: original RBD identity and locally hosted photographs.
- `docs/`: generated static website, tracked for GitHub Pages. Its `assets/` directory is regenerated at build time.

Set `submissionUrl` to the confirmed HTTPS portal to show a working submit button. Update the workshop-specific deadlines in `dates` and the workshop day in `date`. `conferenceDates` describes the parent conference and should not be used as a workshop deadline.

## Identity and assets

The RBD mark connects a document with branching capability nodes. The vector wordmark is `src/assets/rbd-logo.svg`; `rbd-logo.png` is a transparent raster export, and `rbd-icon.png` is a square icon. Navy: `#15375b`. Blue: `#1269a7`. Body text: `#293542`. Background: white. The site uses native sans-serif fonts and makes no third-party font requests.

Speaker images and the San Francisco banner are hosted locally as optimized WebP files. Sources and credits are recorded in [ASSET_CREDITS.md](ASSET_CREDITS.md), with visible credits in the site footer and banner.

## Git and publishing later

Feature branch: `codex/workshop-website`. The first design and the conference-style redesign are preserved in Git history. No remote or public deployment is configured.

1. Create the GitHub organization `rbd-workshop` and its public repository **`rbd-workshop.github.io`**. Ownership and availability remain unverified.
2. Run the build and checks, commit source and generated `docs/`, then merge the feature branch into `main`.
3. Add the confirmed repository as `origin` and push `main`.
4. Select **Settings → Pages → Deploy from a branch → main → /docs**.
5. Wait for successful deployment before treating <https://rbd-workshop.github.io/> as live.

[Official GitHub Pages setup reference](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Content sources

The workshop content comes from the user's `Retrieval_beyond_document.pdf`, downloaded October 26, 2026. The user confirmed NAACL as the conference. The PDF lists four confirmed speakers, eight organizers, and fifteen confirmed program committee members. It is not copied into the public website.

The [official NAACL 2027 website](https://2027.naacl.org/) confirms San Francisco and June 1–5, 2027 for the parent conference. The RBD workshop day, deadlines, portal, registration, paper limits, and session times remain forthcoming. Review routes, archival options, full-day format, and remote participation retain the proposal's conditional wording.

The contact link uses Hitesh's correspondence address from the PDF until a workshop mailbox is ready.

## Design references

The [ICLR 2026 conference](https://iclr.cc/Conferences/2026), [ACM SIGIR 2026 conference](https://sigir2026.org/), and [NAACL 2027 conference](https://2027.naacl.org/) were reviewed for visible top navigation, conference identity, readable typography, and conventional dates, program, and people sections. The page implementation and RBD logo are original.
