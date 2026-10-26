# RBD · Retrieval Beyond Documents

The NAACL 2027 workshop on **Capability Retrieval for Language Agents**.

A responsive static website with an original RBD identity. Built with HTML, CSS, vanilla JavaScript, and a small dependency-free Node.js generator. No database, API keys, accounts, or package installation are required to run it.

## Local preview

Requires Node.js 20 or newer. In this folder:

```sh
npm start
```

Open <http://127.0.0.1:4173>. The server builds the site at startup and watches the source and content folders; refresh the browser after edits. It binds only to the local computer and serves only `docs/`. Stop it with Ctrl+C. Use `PORT=4174 npm start` if the default port is already occupied.

The development-only [responsive preview](http://127.0.0.1:4173/__preview?width=390) shows the same website at phone and tablet widths. This preview tool is not part of the published `docs/` output.

```sh
npm run build   # Generate the deployable docs/ folder
npm run check   # Check internal links, assets, IDs, headings, and content replacement
```

The scripts also work directly with `node scripts/serve.mjs`, `node scripts/build.mjs`, and `node scripts/check.mjs`.

## Editing the website

- `content/workshop.json`: conference, event dates, contact address, submission URL, research themes, speakers, organizers, and committee.
- `src/index.html`: page structure and editorial copy.
- `src/style.css`: layout, responsive styles, colors, and typography.
- `src/app.js`: mobile navigation, capability explorer, and section highlighting.
- `src/assets/`: original vector mark, light mark, wordmark, and favicon.
- `docs/`: generated static files, tracked for GitHub Pages. Edit the source and run the build rather than editing generated files.

Set `submissionUrl` to the confirmed HTTPS submission portal to replace the forthcoming notice with a working submit button. Do not invent dates or submission requirements. Add confirmed dates to `dates` and update `date` for the hero metadata.

## Brand

The mark combines three retrieval paths into a forward arrow: heterogeneous resources converging into an action. The standalone mark is designed to remain legible at favicon size. The full wordmark is `src/assets/rbd-logo.svg`, with a transparent PNG export at `src/assets/rbd-logo.png` and a square icon at `src/assets/rbd-icon.png`.

Colors: burnt orange `#bc4425`, ink `#242820`, warm ivory `#f7f6f0`, and soft sage `#e9ecdf`. Typography uses local system fonts, so the website works without external font requests. Speaker cards currently use intentional typographic monograms rather than third-party photographs.

## Git and publishing later

Local feature branch: `codex/workshop-website`. `main` contains the initial repository baseline. No remote or deployment has been configured.

When the local version is approved:

1. Create the GitHub organization `rbd-workshop` and a public repository named **`rbd-workshop.github.io`** in that organization. The account and repository names determine the requested URL. Availability and ownership have not been checked.
2. Run the build and checks, then commit the generated `docs/` files with the source. Merge `codex/workshop-website` into `main`.
3. Add the confirmed repository as `origin` and push `main`.
4. In the repository, choose **Settings → Pages → Deploy from a branch → main → /docs**.
5. GitHub Pages will publish to <https://rbd-workshop.github.io/> once deployment succeeds.

Official setup reference: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Content provenance and pending details

The content was adapted from the user's `Retrieval_beyond_document.pdf` downloaded October 26, 2026. The source PDF is not copied into the public site. The user's later confirmation of **NAACL** takes precedence over the proposal's venue preferences. The year 2027 comes from the proposal.

The PDF lists four confirmed invited speakers, eight organizers, and fifteen confirmed committee members. Their names, affiliations, and available research/profile links are reproduced here. This is not an independent check of participation. Dates, city, submission portal, page limits, registration, and final session times remain unannounced. Direct/ARR submission routes, archival status, full-day format, and remote participation retain their proposed or conditional wording.

The contact link uses Hitesh's correspondence address from the PDF until the workshop mailbox is created. Replace it in `content/workshop.json` when ready.

## Reference sites reviewed

- [Agent Skills 2026](https://www.agentskills-workshop.org/): concise overview, author information, program and people sections.
- [MemAgents 2026](https://sites.google.com/view/memagent-iclr26/): workshop scope and program organization.
- [AgentSearch 2026](https://agent-search.github.io/agentsearch-sigir26/): information architecture only. The user rejected its visual style; this site uses an original editorial design and capability diagram.

No third-party site code, imagery, or branding was copied.
