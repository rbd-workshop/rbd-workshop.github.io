# RBD · Retrieval Beyond Documents

The NAACL 2027 workshop on **Capability Retrieval for Language Agents**.

A static conference website using HTML, CSS, vanilla JavaScript, and a dependency-free Node.js generator. The layout uses a white background, Redwood-inspired red and dark neutral accents, visible top navigation, a Golden Gate Bridge banner, and photographs with organizer biographies and substantive speaker profiles covering research areas, leadership, and recognition. On desktop, the overview and call for papers flow in one column alongside important dates, so sidebar height cannot create a blank gap between sections. At tablet and phone widths, the sections stack.

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

The RBD wordmark uses original vector letterforms, with a red R and dark neutral B and D. The B and D have refined bowl curves, larger interior counters, and balanced stroke weights; the approved R is preserved. The vector wordmark is `src/assets/rbd-logo.svg`; `rbd-logo.png` is a transparent raster export, and `rbd-icon.png` is a square icon. Red: `#c74634`. Dark neutral: `#312d2a`. Accessible link red: `#9e392c`. Background: white. The site uses native sans-serif fonts and makes no third-party font requests.

Speaker and organizer portraits and the San Francisco banner are hosted locally as optimized WebP files. Sources and credits are recorded in [ASSET_CREDITS.md](ASSET_CREDITS.md), without a visible photo-credit line in the footer.

## Git and publishing later

Feature branch: `codex/workshop-website`. The first design and the conference-style redesign are preserved in Git history. No remote or public deployment is configured.

1. Create the GitHub organization `rbd-workshop` and its public repository **`rbd-workshop.github.io`**. Ownership and availability remain unverified.
2. Run the build and checks, commit source and generated `docs/`, then merge the feature branch into `main`.
3. Add the confirmed repository as `origin` and push `main`.
4. Select **Settings → Pages → Deploy from a branch → main → /docs**.
5. Wait for successful deployment before treating <https://rbd-workshop.github.io/> as live.

[Official GitHub Pages setup reference](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Content sources

The workshop content comes from the user's `Retrieval_beyond_document.pdf`, downloaded October 26, 2026. The user confirmed NAACL as the conference. The PDF lists four confirmed speakers and eight organizers. The current program committee contains fourteen members: Amit Agarwal is first, and Srikant Panda was removed at the user’s request. Hitesh Laxmichand Patel is the first organizer. It is not copied into the public website.

The [official NAACL 2027 website](https://2027.naacl.org/) confirms San Francisco and June 1–5, 2027 for the parent conference. The RBD workshop day, deadlines, portal, registration, paper limits, and session times remain forthcoming. Review routes, archival options, full-day format, and remote participation retain the proposal's conditional wording.

The contact link uses Hitesh's correspondence address from the PDF until a workshop mailbox is ready. Organizer biographies follow the proposal, with Hitesh’s title updated at his request to Principal Applied Scientist and Tech Lead. Speaker biographies are original summaries of current institutional or personal profiles and selected research papers. The public biographies describe broad research interests and professional background, with a profile link for further reading. Paper references remain in the source documentation. Source details are recorded in ASSET_CREDITS.md. All eight organizer portraits are included; Zifei Wang’s photograph was supplied by the user as `Downloads/pp.jpg`.

## Design references

The [ICLR 2026 conference](https://iclr.cc/Conferences/2026), [ACM SIGIR 2026 conference](https://sigir2026.org/), and [NAACL 2027 conference](https://2027.naacl.org/) were reviewed for visible top navigation, conference identity, readable typography, and conventional dates, program, and people sections. The page implementation and RBD logo are original.

Additional references reviewed for the current design include [DialDoc at ACL 2022](https://doc2dial.github.io/workshop2022/), [ClinicalNLP at ACL 2023](https://clinical-nlp.github.io/2023/), [KnowledgeNLP at ACL 2024](https://knowledge-nlp.github.io/acl2024/), [KnowFM at ACL 2025](https://knowledgeable-lm.github.io/acl25/), [KnowFM at ACL 2026](https://knowledgeable-lm.github.io/), [CustomNLP4U at EMNLP 2024](https://customnlp4u-24.github.io/), [Eval4NLP at AACL 2023](https://eval4nlp.github.io/2023/index.html), and [GRAIL-V’s people section](https://grailworkshops.github.io/speakers/). The reference set informs the overview, conventional navigation, restrained section formatting, and biographies. It is a representative review, not an exhaustive survey of all workshops.

The user requested a palette inspired by [Oracle Redwood](https://static.oracle.com/cdn/apex/22.1.0/themes/theme_42/22.1/docs/Redwood.html). RBD’s artwork is original and uses no Oracle wordmark.

The dedicated Guidelines section is reachable from the top navigation and the call for papers. Its paper preparation, submission routes, and publication sections draw on [SURGeLLM at ACL 2026](https://surgellm.github.io/acl2026/cfp/), [REALM at EMNLP 2026](https://realm-workshop.github.io/2026-emnlp/call_for_papers/), [CustomNLP4U at ACL 2026](https://customnlp4u.github.io/), and [TrustNLP at ACL 2026](https://trustnlpworkshop.github.io/). The proposed 4-page short and 8-page long paper limits are a local draft based on these examples, not requirements stated in the original proposal or confirmed NAACL 2027 policy. The visible draft note makes this explicit. Direct OpenReview submissions, three independent reviews, ARR commitments, and archival/nonarchival plans come from the proposal. No foreign workshop’s portal, dates, fast-track score thresholds, or cross-presentation eligibility are adopted. Confirm the draft before publishing the final call.
