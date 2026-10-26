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

## Search visibility and launch priorities

The October 26, 2026 [SEO audit](research/seo-audit.csv) records implemented fixes and the remaining launch work. The site now generates a canonical URL, descriptive search and social metadata, a 1200 × 630 sharing image, `robots.txt`, a one-page XML sitemap, a custom 404 page, and JSON-LD for the website, workshop organization, page, and the twelve speakers and organizers. These describe the same content visitors can read. The Schema.org validator reported **0 errors and 0 warnings** for the generated graph. This validates the vocabulary; it does not establish Google rich-result eligibility or guarantee rankings.

The full page is delivered as static HTML. Its text and navigation do not depend on JavaScript. Existing local WebP portraits are lazy loaded; the bridge banner is preloaded. The generated HTML is about 41 KB, CSS 11 KB, JavaScript 1.8 KB, and the banner 258 KB before transfer compression. These are file sizes, not measured Core Web Vitals. No analytics or third-party JavaScript was added.

The natural search focus is the workshop's full name, **RBD at NAACL 2027**, and **capability retrieval for language agents**. The overview and topics also cover tools, skills, workflows, memory, models, and agents. These are descriptive query themes, not claims about measured search demand. Preserve readable academic prose and avoid repeating keywords or creating thin pages for each phrase.

### Configuration

- Set `siteUrl`, `seoTitle`, and `description` in `content/workshop.json`. The current canonical target is `https://rbd-workshop.github.io/`; its ownership and public deployment must be confirmed before launch. All search URLs derive from this setting.
- Update `lastUpdated` only when the page's content changes materially, using the actual date. The build does not silently advance it. This date is metadata and does not add another year to the visible footer.
- The sharing image is `src/assets/rbd-social.png`, with its editable vector source beside it. Update both when the branding changes. The PNG is approximately 64 KB, including the official NAACL 2027 logo.
- No `Event` markup is emitted while the actual workshop day and venue are unconfirmed. Add it after those details are visible and final; never substitute the parent conference dates.
- `llms.txt` is an optional navigation summary, not a ranking mechanism. Keep its draft-status text current as the CFP is finalized. [Google's guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says normal SEO practices apply to AI search and that Google does not use `llms.txt`.
- The local preview sends an `X-Robots-Tag: noindex, nofollow` header. This protects local previews and is not part of the static GitHub Pages output. The generated production homepage permits indexing. After deployment, check the actual public response for accidental `noindex` directives.
- `npm run check` validates canonical URLs, crawler files, JSON-LD references, social image dimensions, date validity, and safe metadata serialization, as well as the existing page checks.

### Launch sequence

1. **Publish the confirmed site.** Follow the GitHub Pages steps below after ownership and the final public content are confirmed. Check that the homepage, sitemap, robots file, share image, and actual 404 responses work on the public HTTPS address. The current work remains local.
2. **Verify search ownership and submit the sitemap.** Add `https://rbd-workshop.github.io/` as a URL-prefix property in [Google Search Console](https://search.google.com/search-console/). Use its exact HTML verification file or meta tag; URL-prefix verification avoids requiring control over `github.io` DNS. Preserve verification files in the generated `docs/` root or put a supplied meta tag in `src/index.html`. Follow [Google's ownership verification instructions](https://support.google.com/webmasters/answer/9008080). Add and verify the site in [Bing Webmaster Tools](https://www.bing.com/webmasters/), using the [official verification instructions](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b). Submit `https://rbd-workshop.github.io/sitemap.xml` in both tools, then inspect the homepage's index status. No verification codes or credentials are currently configured.
3. **Build legitimate academic discovery.** Seek a link from the official NAACL workshop listing and the organizers' research homepages. Share the finalized CFP through relevant academic mailing lists, lab pages, and professional accounts using the canonical URL and new share image. These are outreach recommendations; no messages have been sent. Avoid bought links and mass directory submissions.
4. **Measure the public site.** Record Search Console impressions, clicks, queries, and indexed status, plus Bing search performance. Compare branded queries with broader capability retrieval and language-agent queries over time. Run PageSpeed Insights on the deployed URL for a performance baseline. Referrals and submission-button conversions require a separately chosen analytics setup; none is installed. Do not invent a reach target before there is a baseline.
5. **Maintain useful content.** Publish confirmed deadlines, the submission link, talk titles, the program, accepted papers, and slides when available. Keep expired calls accurate. Add stable individual pages when there is enough substantive material to justify them, preserving links from the workshop homepage.

Further references: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [site-name markup](https://developers.google.com/search/docs/appearance/site-names), [event requirements](https://developers.google.com/search/docs/appearance/structured-data/event), and [Bing sitemap guidance](https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed). Publishing and submission make the site discoverable; search engines still decide whether and how to index and rank it.

## Editing

- `content/workshop.json`: event information, dates, contact address, submission URL, research themes, speakers, organizers, and committee.
- `src/index.html`: page structure and workshop text.
- `src/style.css`: styling and responsive layouts.
- `src/app.js`: current-section navigation highlighting. Navigation and content also work without JavaScript.
- `src/assets/`: original RBD identity and locally hosted photographs.
- `docs/`: generated static website, tracked for GitHub Pages. Its `assets/` directory is regenerated at build time.

Set `submissionUrl` to the confirmed HTTPS portal to show a working submit button. Update the workshop-specific deadlines in `dates` and the workshop day in `date`. `conferenceDates` describes the parent conference and should not be used as a workshop deadline.

## Identity and assets

The RBD identity is a compact typographic wordmark. It retains the red R (`#c74634`) and uses revised B and D letterforms in charcoal (`#2c3035`), with consistent stroke weights, rounded bowls, and balanced spacing. The site keeps dark neutral text `#312d2a`, accessible link red `#9e392c`, and a white background. Native sans-serif fonts make no third-party font requests.

`src/assets/rbd-mark.svg` is the header wordmark, and `rbd-logo.svg` includes the full workshop name. `rbd-logo.png` is the transparent 1200 × 460 export. The favicon and square icon use the red R; the sharing card uses the complete RBD wordmark. The earlier generated connected-shapes emblem was rejected by the user and removed from the site. Its exploration record remains in [research/branding-prompt.txt](research/branding-prompt.txt) for provenance only.

Speaker and organizer portraits and the San Francisco banner are hosted locally as optimized WebP files. Sources and credits are recorded in [ASSET_CREDITS.md](ASSET_CREDITS.md), without a visible photo-credit line in the footer.

The official NAACL 2027 San Francisco logo is displayed in the parent-conference details and the social sharing card, using the original asset from the conference website. Its proportions and colors are preserved; the workshop's own RBD wordmark remains the primary identity.

## UI review

The October 26, 2026 UI pass applied [Anthropic's Frontend Design skill](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design/skills/frontend-design) and [Vercel's Web Design Guidelines skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines), with the current [interface rules](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). Both skills were installed in the user's local Codex skill library. Findings and resolutions are recorded in [research/ui-review.csv](research/ui-review.csv).

The direction remains a conventional academic workshop site: left-aligned research content, visible section navigation, substantial biographies, and the Golden Gate Bridge as the main visual. The red and charcoal RBD wordmark sits within a white and dark neutral page palette; the official NAACL artwork remains unchanged. Native sans-serif type is intentional for familiar conference-page reading and fast loading. Main copy is 16px; biographies are 15px; supporting information is 13–14px. Longer prose has a 76ch maximum measure where space allows.

```text
Desktop                           Phone
[RBD 2027 | six section links]     [RBD 2027]
[Bridge, title, subtitle]          [six links across two rows]
[Overview       | Dates]          [Bridge, title, subtitle]
[Call for papers| NAACL]          [Overview, dates, NAACL, CFP]
[Speakers and organizers]         [Portrait and name, full bio]
```

The follow-up [responsive review](research/responsive-review.csv) covers 26 viewport configurations from 320 × 568 to 2560 × 1440 CSS pixels, including breakpoint boundaries and phone landscape. No horizontal content overflow was found; navigation and standalone profile links have at least 44 × 44px targets. People use one column through 1100px, avoiding cramped side-by-side biographies on small laptops. Through 650px, the full biography sits below the portrait and name. The header scrolls away on phones and when viewport height is 500px or less, preserving room for content in landscape.

All eight organizer bios are 76–79 words, with verified broad research summaries. At the tested two-column widths, paired organizer bios differ by at most one rendered line; Hitesh and Akari are both eleven lines at 1280px and wider. Paired speaker bios differ by at most two lines. No text is clipped, line-clamped, or padded to a fixed height. Measurements are browser-specific and may vary with fonts and zoom.

All six section links were rechecked at 320, 768, 1101, and 1440px: each heading clears the header and its navigation item becomes active. Keyboard focus remains visible; the skip link moves focus into `main`; Back to top restores the complete mobile header. Body, muted, link, and footer text contrast ratios are 13.64:1, 6.51:1, 6.83:1, and 5.92:1 respectively. The mobile hero overlay provides at least 5.70:1 contrast for its muted text even over a white image pixel. Desktop hero contrast was inspected visually. There are no autoplay or decorative animations.

This is a local design and interaction review, not a complete accessibility certification. Physical-device, screen-reader, and cross-browser testing remain separate release checks. The research scope, conference information, and official NAACL logo were preserved.

The supplementary [quality review](research/quality-review.csv), with [detailed evidence](research/quality-review.json), ran axe-core 4.10.3 on nine desktop, phone, spacing, enlarged-text, and site-script-removed views. It found zero automated violations across the selected WCAG A/AA and best-practice rules. A controlled 200% text-size stress test exposed navigation overlap and oversized phone content; these were fixed with flexible wrapping and grid sizing. Native anchor offsets now follow the actual header height. The 26-size matrix was rerun after these changes, alongside 36 keyboard stops at each of 320px and 1440px and 42 anchor checks.

Axe left the photo-backed hero contrast for manual review. A separate calculation used rendered text bounds, the actual local photo, its cover crop, and the CSS overlay; all sampled normal and enlarged-text regions passed, with a lowest ratio of 4.75:1. Raster rounding may differ slightly from browser interpolation. All fourteen page images loaded successfully, crawler files returned correctly, the missing-page route returned 404, and unsupported methods returned 405. The primary page resources total about 313 KB uncompressed. This is an agent-performed review using published guidance, not independent human certification, real-device testing, or a production Core Web Vitals measurement.

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

The overview and all five topic groups were rechecked against Sections 1 and 1.2 of the proposal on October 26, 2026. The overview explicitly defines capability retrieval using the natural language goal and the agent’s current state, and explains functional relevance, compatibility, and evaluation through downstream use. The topic descriptions preserve representation and indexing; retrieval, routing, and composition; retrieval during execution; evaluation; and deployment. The revised text restores dynamic indexes, ontologies, incorporation, and recovery where the earlier summaries omitted them, and explains completeness, dependency checks, freshness, and observability in plain language. The scope statement follows the proposal’s exclusion of work assuming a fixed, manually selected capability set.

The [official NAACL 2027 website](https://2027.naacl.org/) confirms San Francisco and June 1–5, 2027 for the parent conference. The RBD workshop day, deadlines, portal, registration, paper limits, and session times remain forthcoming. Review routes, archival options, full-day format, and remote participation retain the proposal's conditional wording.

The contact link uses Hitesh's correspondence address from the PDF until a workshop mailbox is ready. Organizer biographies combine the proposal with current personal and institutional profiles, edited to comparable lengths at the user's request. Hitesh retains his Principal Applied Scientist and Tech Lead title. Speaker biographies are original summaries of current profiles and primary research sources. The public biographies describe broad research interests and professional background, with a profile link for further reading where available. Paper references remain in the source documentation. Source details are recorded in ASSET_CREDITS.md. All eight organizer portraits are included; Zifei Wang’s photograph was supplied by the user as `Downloads/pp.jpg`.

## Design references

The [ICLR 2026 conference](https://iclr.cc/Conferences/2026), [ACM SIGIR 2026 conference](https://sigir2026.org/), and [NAACL 2027 conference](https://2027.naacl.org/) were reviewed for visible top navigation, conference identity, readable typography, and conventional dates, program, and people sections. The page implementation and RBD logo are original.

Additional references reviewed for the current design include [DialDoc at ACL 2022](https://doc2dial.github.io/workshop2022/), [ClinicalNLP at ACL 2023](https://clinical-nlp.github.io/2023/), [KnowledgeNLP at ACL 2024](https://knowledge-nlp.github.io/acl2024/), [KnowFM at ACL 2025](https://knowledgeable-lm.github.io/acl25/), [KnowFM at ACL 2026](https://knowledgeable-lm.github.io/), [CustomNLP4U at EMNLP 2024](https://customnlp4u-24.github.io/), [Eval4NLP at AACL 2023](https://eval4nlp.github.io/2023/index.html), and [GRAIL-V’s people section](https://grailworkshops.github.io/speakers/). The reference set informs the overview, conventional navigation, restrained section formatting, and biographies. It is a representative review, not an exhaustive survey of all workshops.

The user requested a palette inspired by [Oracle Redwood](https://static.oracle.com/cdn/apex/22.1.0/themes/theme_42/22.1/docs/Redwood.html). RBD’s artwork is original and uses no Oracle wordmark.

Submission guidelines are a subsection of Call for Papers, with paper preparation, submission and review, and publication options underneath. The six top navigation links cover Overview, Call for Papers, Dates, Speakers, Program, and Organizers. Existing `#guidelines` and `#submission-guidelines` links still work. The footer reads “© Retrieval Beyond Documents (RBD) Workshop @ NAACL 2027”, displaying only the workshop year to avoid confusion with the website's creation year.

A [30-workshop review](research/workshop-guidelines-review.csv), conducted October 26, 2026, records the source URL and placement observed for each site. The sample covers ACL 2026, EMNLP 2026, and NAACL 2025: 22 place author instructions in their CFP, two on the main workshop page, and three expose separate author navigation (BEA and ClimateNLP as pages; WaC-13 as a same-page section). Three are inconclusive because the fetched current page did not expose author instructions or its linked CFP could not be fetched. These are excluded from placement conclusions. This is a convenience sample, not an exhaustive or random survey. It supports keeping RBD's instructions inside the CFP while recognizing that separate author pages are also used.

The guidelines draw on [SURGeLLM at ACL 2026](https://surgellm.github.io/acl2026/cfp/), [REALM at EMNLP 2026](https://realm-workshop.github.io/call_for_papers/), [CustomNLP4U at ACL 2026](https://customnlp4u.github.io/), and [TrustNLP at ACL 2026](https://trustnlpworkshop.github.io/). The proposed 4-page short and 8-page long paper limits are a local draft based on these examples, not requirements stated in the original proposal or confirmed NAACL 2027 policy. The visible draft note makes this explicit. Direct OpenReview submissions, three independent reviews, ARR commitments, and archival/nonarchival plans come from the proposal. No foreign workshop’s portal, dates, fast-track score thresholds, or cross-presentation eligibility are adopted. Confirm the draft before publishing the final call.
