# Factual / Evidence Pending Register — Concordia Soccer · European Pathway

**INTERNAL PROJECT DOCUMENT. NEVER PUBLISH.**
This file lives in `/docs`, outside `/public`, so Next.js does not serve it. It must never be
imported into a page, linked from the site, or copied into any public route, sitemap or CMS field.

Purpose: nothing reaches public copy on the European Pathway website (or the Concordia Sports
Agency website) until the relevant item here is **cleared for public use**.

---

## How to use this register

### Evidence levels — never merge them

| Level | Meaning | May appear publicly? |
|---|---|---|
| **FS — Founder-supplied** | Stated by Marks Amosejevs (chat, filename, brief). Trusted as the founder's account, **not** independently checked. | Only where the item says so, with the approved wording |
| **PD — Primary document seen** | We have seen the original document or an image of it (certificate, licence card, contract). | Usually yes, after wording is approved |
| **IV — Independently verified** | Confirmed against an independent/public source (FIFA agent register, bar register, federation site, official announcement). | Yes, once wording is approved |
| **UNVERIFIED** | Nobody has supplied or checked it. | No |

A founder-supplied fact does **not** become independently verified because it is repeated.
Upgrade the level only when new evidence arrives, and log it.

### When an item is resolved, record

- **What was verified**
- **Final approved wording** (exact public text)
- **Source / evidence** (document, URL, file path; where it is stored)
- **Evidence level** (FS / PD / IV)
- **Date verified** (YYYY-MM-DD) and **by whom**
- **Cleared for public use?** (Yes / No / Yes with conditions)

Then move the row from *Pending* to the *Verification log*.

### Standing rules

- Filenames of uploaded assets are working metadata only. Spelling errors in them
  ("Sowndowns", "Soath", "headquater", etc.) must never reach public copy.
- A photograph proves presence at a context, nothing more. No partnership, endorsement,
  client relationship or business relationship is inferred from a photo.
- The word "partner" may only be used where a formal partnership is evidenced.
- FIFA licence belongs to Marks Amosejevs personally. Concordia Sports Agency is never
  described as a "FIFA-licensed agency".
- Minors: guardian publication permission is required before any commercial use.
- No reference/"regular" price is displayed as a former price without evidence (see E16).

---

## Founder-supplied facts (FS) — accepted for architecture, pending verification for publication

| ID | Fact (as supplied) | Level | Public-use status |
|---|---|---|---|
| F1 | Marks Amosejevs is a **Co-Founder** (not sole founder) of Concordia Sports Agency. | FS | Usable as "Co-Founder". Other co-founder is not required in the Pathway narrative; no role invented for anyone. |
| F2 | Marks is **Co-Founder and Chairman** of the Latvian Professional Footballers Association (LPFA), a player-support / player-rights initiative. | FS | Usable once E8 gives legal name + verify link. Do not call it a charity. |
| F3 | Through LPFA, Marks has supported footballers with employment rights, contractual issues, club–player disputes, problematic agent/intermediary relationships and cases needing independent support. | FS | Usable as general framing (player rights, dispute support). No named or implied accusations against any club or agent. |
| F4 | Marks is a lawyer. | FS | "Lawyer" held pending E6 (jurisdiction / register link). |
| F5 | Marks holds an LL.M. / Master's degree in International and European Law. | FS | Held pending E7 (institution, exact degree wording). |
| F6 | Marks takes part in continuing professional education for football agents / football professionals organised by FIFA. | FS | General statement usable; programme names held pending E3. |
| F7 | Concordia has professional relationships/contacts across Spain, France, Italy, Belgium, Poland, Sweden, Switzerland, Czech Republic, Latvia, Lithuania, Ukraine, Uzbekistan, Kazakhstan, South Africa, United States. | FS | Usable only as "professional relationships across…". **Not** formal partnerships; never "partner clubs in 15 countries". |
| F8 | Concordia works with professional footballers, including players with national-team experience, and with young players beginning/developing careers. | FS | Usable as general statement. Individual players only per E11. Never "Concordia created X's career" without a supporting case. |
| F9 | Marks is the senior professional authority behind the Pathway assessment methodology. | FS | Usable. Do **not** promise Marks personally performs every part of every assessment until E13 is resolved. |
| F10 | Approximately three further player video testimonials will follow Victor's. | FS | Planning only. |
| F11 | Concordia Soccer · European Pathway is operated by a real team, not presented as a one-person founder business. | FS | Usable as "a professional team, led by FIFA Licensed Football Agent Marks Amosejevs". Do not overstate team size. |
| F12 | **Marks Amosejevs — Co-Founder & CEO**, Concordia Soccer · European Pathway; FIFA Licensed Football Agent. Role: built, leads and provides senior professional oversight of the service. | FS (licence: PD, see D1) | Usable. Never "FIFA Licensed Team/Agency". |
| F13 | **Filipp Sviridenko — Co-Founder**, Concordia Soccer · European Pathway. Additional functional title pending (E30). | FS | "Co-Founder" usable. No other title, bio or credential rendered until E30/E31. |
| F14 | **Valerija Sevcenko — team member**, Concordia Soccer · European Pathway. Title and responsibilities pending (E32). | FS | Name usable as team member only once E32 supplies a public title; until then render name without title or hold the card (founder choice). No invented role. |

---

## Primary documents seen (PD)

| ID | Item | Evidence | Level | Public-use status |
|---|---|---|---|---|
| D1 | FIFA Football Agent licence: Marks AMOSEJEVS · status VALID · licence no. **202406-7079** · "Authorized to represent minors: as of 26/08/2024". | Licence card image, `public/team/marks-fifa-license.png` | PD (card seen); **IV pending** (E19) | Licence no. and "FIFA Licensed Football Agent" usable. Minors line held for E19. Connect ID display undecided (E5). |
| D2 | Existing roster (8 players, clubs, positions, DOBs). | `data/players.ts`, supplied by the Agency | FS/PD (per file header) | Usable as "Players represented by Concordia Sports Agency", subject to consent (E11/E12). |

---

## Pending items

| ID | Item | Blocks | Needed | Level now | Status |
|---|---|---|---|---|---|
| E1 | Full-resolution originals for photos 03, 04, 07, 13, 16 (current files are 1280px exports). | Full-bleed desktop use of those images | Original files | — | **Full-res original recommended before production.** Not blocking design. |
| E2 | Photographer / usage rights: photo 16, photo 02, `public/football/hero-celebration.jpg`. | Publication of those images | Rights confirmation | UNVERIFIED | Open |
| E3 | Exact FIFA programme name, edition, year, city and certificate wording (photo 16; confirm whether 01/03/04/05 are the same visit). | Credential Wall entry, captions | Certificate scan | UNVERIFIED | **Credential scan recommended before production.** |
| E4 | Luís Villas-Boas Pires — confirm "former Head of Agents of FIFA" title and permission to name. | Photo 16 caption | Founder confirmation + public source | FS (filename) | Open — must be verified before publication |
| E5 | Whether the FIFA Connect ID on the licence card is shown publicly. | Credential component | Founder decision | — | Component must support redaction |
| E6 | Legal qualification: jurisdiction, admission, public register link. | "Lawyer" credential + verify link | Register entry | FS | Open |
| E7 | LL.M.: institution, exact degree title, year. | Education credential | Diploma / institution | FS | Open |
| E8 | LPFA: exact legal name, legal status, founding date, website, public source for Marks's titles. | LPFA credential + verify/visit link | Registry entry / website | FS | Open. No "charity" wording until status supports it. |
| E9 | Sviridenko & Partners: whether/how it is the law practice for Football Law and legal credits. (Name visible in photo 13; role **not** inferred from the photo.) | Football Law section, legal-credit wording, footer | Founder confirmation | UNVERIFIED | Open |
| E10 | Date / event / context / verified titles for industry photos: 02 (LFF event; filename references Gianni Infantino), 05 & 11 (filename: Tlhopane Motsepe, Mamelodi Sundowns), 06 (filename: Avazjon Karimov — which person?), 08 (England v Latvia at Wembley — date, reason attended), 09 (filename: Massimo Paganin, Paolo Nicolato; "TARGET" event), 12 (filename: Bakhodir Mirzayev, FC OKMK — reason for shirt presentation). | Captions (template until resolved: "Marks Amosejevs with [NAME], [VERIFIED TITLE], at [EVENT], [YEAR].") | Per-photo facts | FS (filenames) | Open. "2x CAF Champions League winners" claim **dropped**. Photo 02 is never captioned as a personal meeting. |
| E11 | Player relationships + written publication consent: photo 07 (filename: Viktors Ohvovoriole — spelling, from-club, year, transfer type, Agency role), photos 13 (filename: Kristers Tobers), 14 (filename: Daniels Balodis), 15 (filename: captain of Latvia NT — name not assumed), `hero-celebration.jpg` (player identity). | Players layer, captions, cases | Founder confirmation + consent | FS (filenames) | **Hold for consent / factual confirmation.** Players in 13–15 **not** classified as Agency clients. |
| E12 | Guardian publication permission for minors: photo 10 (filename: Nazar Mahina), roster player Emilija Ambaine (DOB 2010-01-15). | Any commercial use | Guardian permission | — | **Emīlija Ambaine: CLEARED 2026-10-06** — founder confirms parental/guardian permission obtained; consent document held internally (never published). Publish only roster facts (name, position, club, national youth team); never DOB or other personal data. **Photo 10: still Hold**, not planned for use. |
| E13 | **Revised 2026-10-01.** Scalable professional-review workflow: (1) application/triage — system + team; (2) player data/footage preparation — team; (3) full-match analysis — qualified team member/analyst; (4) career & market assessment — senior professional review; (5) report preparation — team; (6) final professional review — defined senior sign-off process; (7) client review call — appropriate team member by programme/case; (8) escalation — Marks where senior football-agent judgement is required. Allocation is **internal, not published**; roles assigned later via configuration. | Any public statement of who analyses, who signs off, who takes calls | Founder approval of allocation + sign-off wording | FS (concept) | Open. Approved public territory meanwhile: "Led by FIFA Licensed Football Agent Marks Amosejevs" · "Professional football career guidance from a team working inside European football" · "Every assessment follows Concordia's professional assessment framework and receives senior review." Never: Marks personally analyses every match / conducts every call. |
| E14 | Final 4–8 case studies: facts, acting entity (Agency / Pathway / Law practice), evidence, player (and guardian) approval. | Real Careers section and pages | Case fact sheets | — | Open. None public until confirmed. |
| E15 | Victor Testimonial.mp4: transcript, speaker, relationship, date, language, permission. Plus ~3 further videos. **Is Victor the same person as in photo 07? — unconfirmed.** | Testimonials | Dedicated testimonial audit | — | Testimonial video — pending full metadata / transcript |
| E16 | Reference ("regular") price effective date or evidence of prior genuine offering. | Any display of $349 / $2,000 / $2,900 / $4,900 / $10,000 / $250 | Genuine future date or evidence | — | Open. No "was $X", no strikethrough, no percentages until resolved. Locked current prices unaffected. |
| E17 | Production vector logo (CONCORDIA + globe/route "O", "SOCCER · EUROPEAN PATHWAY" with European Pathway prioritised). | Implementation | SVG rebuild after approval | — | Open |
| E18 | Live Agency-site wording "FIFA-licensed football representation agency" (`components/Agency.tsx`) is inaccurate — licence is personal. | Agency site correction | Change during implementation phase | — | Open — **do not edit yet** |
| E19 | Re-check licence status and exact minors terminology on FIFA's public agent register before publication. | Minors credential line | Register check | PD | Open |
| E20 | Elite seat cap (Phase 1 / business plan: max 10 seats year one) — real counter source. | "Limited capacity" label | Founder confirmation | — | Open |
| E21 | Instalment plans (3 × $850, 6 × $750, 4 × $2,000) — still valid alongside locked prices? | Pricing cards | Founder confirmation | FS (business plan) | Open |
| E22 | Basis of the public SAMPLE assessment: (A) an anonymised real football evaluation adapted with permission, or (B) a clearly disclosed demonstration player. Never presented as a past customer report. | Report preview (Home §06, Assessment page) | Founder decision + source material | — | Open |
| E23 | Any third-party cost figure (e.g. trial-programme prices cited in the business plan) — source re-verified at publication. Currently none used in Phase 2B copy. | Any cost comparison | Source check | — | Open (dormant) |
| E24 | Approved refund policy text (plan basis: assessment refundable until review begins; programmes 14-day refund minus assessment value, then pro-rata only for non-performance; injury pause up to 60 days). | Assessment, Programmes, Pricing, checkout | Founder / counsel approval | FS (business plan) | Open |
| E25 | Legal contracting entity. **Supplied 2026-10-01 (FS):** Concordia Sports Agency SIA · Reg. No. 40203574668 · VAT LV40203574668 · Krišjāņa Valdemāra iela 33A–4A, Rīga, LV-1010, Latvia. Concordia Soccer / European Pathway is a brand of this entity — no separate “Concordia Soccer” entity. | Footer, receipts, checkout, legal pages | Independent registry check (Lursoft / Latvian Register of Enterprises) before launch | FS | Implemented in build; IV pending |
| E26 | Policy approval: no commissions from academies, trial operators or residencies. | Parents page "What we will never do" | Founder approval | FS (business plan recommendation) | Open |
| E27 | "Talk to us first" contact channel (WhatsApp Business / form / call). | Parents page, final CTA | Founder decision | — | Open |
| E28 | Creator / affiliate partner policy: eligible products, compensation basis, disclosure wording, exclusions. Compensation may apply only to eligible European Pathway advisory products — never to representation, transfers, agent fees or club placement. | Any /partners pages, referral codes, partner payouts | Legal + commercial approval | — | Open |
| E29 | Ongoing Pathway commercial architecture (fixed / monthly / hybrid) and any resulting prices. No new prices invented. | Programmes, Pricing, checkout | Founder decision | — | **Resolved (Round 2):** European Pathway $399/month, designed as a 6-month pathway, paid monthly, no six-month upfront payment, "Cancellation options available — subscription terms apply." Final cancellation mechanics still open (legal). |
| E30 | Filipp Sviridenko — additional functional title (placeholder: "Co-Founder · [ADDITIONAL ROLE — TO BE CONFIRMED]"). | Team card secondary role | Founder confirmation | — | Open |
| E31 | Filipp Sviridenko — bio, credentials, languages, responsibilities, LinkedIn/verification links. | Team card bio, About page | Founder-supplied content (+ verification for any credential) | — | Open. Note: shares a surname with "Sviridenko & Partners" (E9); **no connection is inferred** — any relationship to the law practice must be stated by the founder and kept consistent with brand-separation rules. |
| E32 | Valerija Sevcenko — public title, bio, responsibilities, credentials (if relevant), languages, LinkedIn/verification links. | Team card | Founder-supplied content | — | Open |
| E33 | Team photoshoot (Marks, Filipp, Valerija) in one consistent visual system: desktop portrait, mobile portrait, team-grid crop, About crop, avatar crop. | Team section, About, avatars | Final photographs + usage rights | — | Open. Production placeholders used until supplied; existing inconsistent photos are not used for the Team section. |
| E34 | Elite named-team involvement (if any). | Elite deliverables copy | Operational decision (follows E13) | — | Open. Until then Elite promises no specific team member beyond approved deliverables. |
| E35 | Final legal / consent wording: application consents, guardian consent, checkout acknowledgements (incl. “does not constitute football-agent representation and does not create a FIFA Representation Agreement”), college-eligibility notice (US counsel). | Application, checkout, FAQ | Legal review | — | Open. Draft wording shown with “legal wording pending” tags in the review build. |
| E36 | Round 2 event photographs (FIFA Club World Cup 2025 Final, MetLife Stadium ×3; hotel lobby ×1): who is pictured, context, publication permission of other people shown. | Homepage hero + photo marquee | Founder confirmation | — | Open. Used in review build without naming anyone; captions use visible signage only. |
| E37 | FIFA football agent licence card (PDF supplied Round 2): name, licence 202406-7079, status VALID, minors authorisation as of 26/08/2024. | Homepage trust section, Verify | PD | — | **Document seen.** Rendered with Connect ID blurred (per E5). Shown as Marks Amosejevs's personal credential; no FIFA endorsement of Concordia implied. |
| LEGAL | Minors wording (Parents page §3; worked example “Europe or college at 17”) referencing FIFA RSTP Art. 19. | Those passages | Football-lawyer review | — | Open |
| MKT | Country market data for the Explorer (league pyramid, calendar/windows, registration, style, entry routes, who it suits) — each fact with source + last-verified date. | Market guides / country pages | Sourced research | — | Open. All 32 countries “in preparation”; none publicly enabled. |

---

## Verification log

Record each resolved item here (newest first).

| Date verified | ID | What was verified | Final approved wording | Source / evidence | Level | Verified by | Cleared for public use? |
|---|---|---|---|---|---|---|---|
| 2026-10-06 | E12 | Guardian publication permission — Emīlija Ambaine | Roster facts only | Founder confirmation; document held internally | FS | Founder | Yes (roster facts) |
| 2026-10-06 | E37 | FIFA licence card | "FIFA Licensed Football Agent · Licence 202406-7079" | Licence PDF supplied by founder | PD | Founder | Yes (Connect ID redacted) |

---

## Change history

| Date | Change |
|---|---|
| 2026-09-29 | Register created after Phase 2A pre-audit. Founder clarifications recorded as FS; licence card recorded as PD. |
| 2026-09-29 | Phase 2B: added E22–E27. Standing decisions recorded below. |
| 2026-10-06 | Round 3 final correction: 7-day assessment period starts only on payment received + Concordia confirmation that materials are sufficient (start = sufficiency confirmation date). No automatic deadline from onboarding submission or video. Canonical journey, Terms (14 clauses), emails (10 states) aligned. Product positioned for women's and men's football; campaign registry (us-mens-college, us-womens-college, youth-mens, youth-womens). |
| 2026-10-06 | Round 3: korona photo (E11) approved by founder as primary hero — "Marks Amosejevs with Viktors Ohvovoriole · transfer to Korona Kielce" (names from founder file name; year still E14). Marks team description supplied by founder (FS-R3, incl. LPFA co-founder + sports lawyer). Valerija label "Concordia Team" approved; title/bio still E32. Filipp bio still E31. Founder named "the photo of Filipp at the stadium": MetLife stand photo (cwcStand) used on Filipp's card — file choice to be confirmed (E36). Emīlija Sassuolo photo: founder-confirmed identity; file not yet received. Separate Marks profile page removed (301 → /about/#team). |
| 2026-10-06 | Round 2: E12 cleared for Emīlija Ambaine; E29 resolved (monthly); added E36 (event photos) and E37 (licence card). |

## Standing content decisions (founder-approved)

| Date | Decision |
|---|---|
| 2026-09-29 | **No numerical representation rate or percentage** is published at launch ("fewer than 1 in 20" etc. removed). Permitted: separate · selective · cannot be purchased · a more expensive programme does not increase any right, entitlement or chance of representation. |
| 2026-09-29 | Agency cases must carry the badge **CONCORDIA SPORTS AGENCY CASE — not a European Pathway result**. Pathway reasoning is shown only as **WORKED EXAMPLE — FICTIONAL PLAYER** until real Pathway outcomes exist. |
| 2026-09-29 | The public term "Career Manager" is not used until E13 confirms the role. Copy never states that Marks personally performs every step of every assessment. |
| 2026-09-29 | "Ambition without delusion" is internal only; public manifesto line is "Big ambition. Honest advice." (pending Phase 2B approval). |
| 2026-09-29 | Pricing displays current prices only until E16 clears. |
| 2026-10-01 | Hero CTA micro-line: "Apply free · Assessment $249 if accepted". |
| 2026-10-01 | Sample report ships as SAMPLE ASSESSMENT — ILLUSTRATIVE EXAMPLE (E22 resolved to option B for launch; data model must allow later replacement with a permitted anonymised real assessment). |
| 2026-10-01 | Elite copy: "More time. More depth. More frequent professional review." — no multi-person-team language until E13 confirms a team. |
| 2026-10-01 | Team structure: site presents a professional team led by Marks (Co-Founder & CEO, FIFA Licensed Football Agent); Filipp Sviridenko Co-Founder; Valerija Sevcenko team member. Unconfirmed titles/bios never render. Trust hierarchy: Agency → European Pathway → team → Marks (senior authority) → specialists. |
| 2026-10-01 | First visual build (pathway/ app): review mode renders pending items with PENDING tags; production mode hides them; `npm run check:content` guards prices, forbidden phrases, HOLD photos and minor photos. |
| 2026-10-01 | Contracts, checkout, receipts, privacy and refunds use the actual legal contracting entity (E25). No "Concordia Soccer" legal entity is invented. |
