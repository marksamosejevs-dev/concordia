# Phase 3 — Commercial, CRO, Visual, Interaction & SEO Audit

**Concordia Soccer · European Pathway** · Audit date: 2026-10-06 · Build audited: `0747247` (branch `claude/dreamy-meitner-xavjbk`)
Status: AUDIT ONLY — nothing implemented. Internal document.

### Method and an honest limitation

- The live review URL (`claude-dreamy-meitner-xavjbk--concordia-soccer.netlify.app`) and `ecommfactory.ee` are **blocked by this environment's egress proxy** (both curl and web-fetch return a policy block). I could not open either live.
- Netlify builds this branch from commit `0747247`; the only change after the audited UI build (`2c7f759`) is one README line. So I audited **the identical static export** (`npm run build:export` → `out/`) served locally, at 1440, 1280, 768 and 390 px, plus a full-page "rhythm map", plus the repository source.
- Ecomm Factory was assessed from its source repository (`ECOMMFACTORY/` — the code behind ecommfactory.ee) and the renders captured earlier in this project.
- Market research used live web search (results cited inline). The search tool returns results, **not search volumes** — keyword priorities below are intent-led; volumes must be confirmed in Search Console / Ahrefs / Semrush before content is commissioned.

---

## 1. Executive diagnosis

**The site is honest, structurally sound and compliant — and commercially under-powered.** It reads as a well-argued position paper about career advice, not as a product a 21-year-old on Instagram wants to buy tonight.

The five things holding it back:

1. **It sells the wrong product as the hero.** Everything is optimised around the $249 assessment and a menu of four fixed-term programmes ($1,500–$7,500). The real business — a monthly career-management relationship — barely exists on the page. There is no "career team" product, no picture of what month 3 looks like, no reason to keep paying.
2. **Trust arrives too late and too abstractly.** The FIFA licence is a 12-px mono line under the hero. The first real photograph appears at section 4 (~5,000 px down on desktop). Real players appear at section 12. There are **zero** testimonials, numbers, faces of players, or signing moments in the first 3 screens. Copy *claims* "inside European football"; the page doesn't *show* it early.
3. **It is visually monotonous.** ~80% of the page is the same navy (rhythm map: 13 of 18 sections dark). One accent colour. Very little photography. The single biggest block on the page — the desktop Decision Set — is **3,273 px of mostly empty dark space**. Compared with Ecomm Factory's black/white/electric-blue blocking and ambient motion, Concordia feels static and serious-to-the-point-of-sombre.
4. **Too much friction before money.** A 10-step application (≈30 fields) stands between a mobile social visitor and a $249 purchase. That is the right amount of information for the *assessment intake*, but the wrong amount for a *pre-purchase gate*.
5. **The SEO foundation isn't production-ready and the homepage is heavy.** No robots.txt, sitemap, canonical, structured data or OG images; 29 of 45 pages share the default meta description; the homepage HTML is **839 KB (228 KB gzipped)** because the Europe map is inlined several times; images ship unoptimised in the static export; the testimonial video is a 15.5 MB untranscoded MP4.

**What is genuinely strong and must be kept:** the Decision Set *idea* (GO / WAIT / STAY / SAY NO), "We don't sell every player a dream", the Pathway ≠ representation clarity, the parents page logic, the verify-us concept, the sample report, the logo, the typography, the legal discipline.

**One-line diagnosis:** *The site has the right conscience and the wrong salesmanship.* It needs a product people can picture, proof people can see in the first screen, colour and motion that feel alive, and a shorter road to the first payment.

---

## 2. First impression — the 5-second test

Hero (1440 / 1280 / 768 / 390): eyebrow "SOCCER · EUROPEAN PATHWAY — PLAYER ASSESSMENT", H1 "BEFORE YOU CHOOSE EUROPE, FIND OUT WHERE YOU ACTUALLY STAND.", sub, player/parent switch, "Apply for your assessment" + "Apply free · Assessment $249 if accepted", mono credential line, desktop-only tilted sample report.

| Question | Answered in 5 s? | Notes |
|---|---|---|
| Who is it for? | Partly | "Before you choose Europe" implies players considering Europe. Doesn't say "American", "college", "parents" until the switch is read. |
| What do you actually do? | Partly | "Find out where you stand" = assessment. Nothing signals ongoing career management. |
| Why Europe? | No | Assumes the desire. No hook on *why now* (college ending, no MLS draft, EU passport). |
| Why Concordia? | Weak | Only the 12-px "Led by FIFA Licensed Football Agent…" line. Not readable at a glance. |
| Why trust you? | Weak | No faces, no photos, no players, no logos-of-proof, no numbers in the first viewport. 768/390 show **text on navy only** (the report card is hidden below `lg`). |
| What do I do next? | Yes | CTA is clear and the free/paid split is explicit. |

**Verdict:** clear CTA, unclear product and weak authority. The headline is intelligent but cautious; it frames us as gatekeepers ("find out") rather than allies.

### Positioning territories compared

| Territory | Strength | Risk | Verdict |
|---|---|---|---|
| A. "Before you choose Europe, find out where you actually stand." (current) | Honest; sells the assessment | Passive; no authority; no relationship | Keep as an assessment-page H1 |
| B. "You don't need another highlight reel. You need to know where you actually stand." | Names a pain every US player recognises (the reel culture); sharp | Still assessment-only | Excellent **section 2 / ad hook** |
| C. "Think you can play in Europe? Ask someone who actually works in European football." | Direct, identity-led, challenges ego, implies authority immediately; scroll-stopping on social | "someone" sounds like one person; must stay team-framed | **Strongest homepage hero for cold US social traffic** |
| D. "What if you had a FIFA agent in your corner before you actually needed an agent?" | Best expression of the *monthly* product; unique in the category | Compliance: can read as "buy an agent". Must never imply representation is purchased | **Strongest headline for the $399 Pathway section / Pathway page**, with careful sub-copy: "A FIFA-licensed agent leads the team guiding your career — long before representation is on the table." |

**Recommendation:** Hero = **C** (adapted: "Ask the people who actually work in European football"), with the FIFA-agent-led signal as a large, readable proof line under the H1, and **D** as the headline of the Pathway product section. Use **B** as the problem section hook and as paid-social creative. Keep **A** on the Assessment page. A/B test C vs D as hero once traffic allows.

---

## 3. Persona conversion analysis

### Persona A — 21, NCAA senior, wants to play in Europe
- **First 5 s:** "Assessment about Europe." Doesn't feel spoken to as a college player.
- **Thinks we sell:** a $249 video review.
- **Trust:** only if they read the small licence line; no players who look like them, no college-to-Europe story.
- **Desire:** the Decision Set and "Silence isn't an answer" resonate; the sample report helps.
- **Doubt:** "$249 for someone to watch my game?", "Is this one guy?", "Do they get people signed?" (we can't promise — must show *process* proof instead).
- **Unanswered:** What happens after college ends? Can you help me in the January window? What leagues do Americans actually play in?
- **Leaves at:** the 10-step form on mobile; the long dark middle of the homepage.
- **Applies if:** a 60-second founder video + a real college-to-Europe worked journey + a 2-minute qualify step.
- **Pays $249 if:** the report feels like a professional document and the call is with someone credible.
- **Pays $399/mo if:** they can see a month-by-month plan aligned to the *next window* and feel someone is "in their corner" (messaging access, bi-weekly calls).

### Persona B — 17, academy player; parents considering Europe
- **First 5 s (parent):** "Europe assessment" — good. The parent switch is visible.
- **Thinks we sell:** expert advice — good fit.
- **Trust:** parents page is strong but deep; homepage shows little safeguarding/minors credibility up front. "Authorised to represent minors" is pending.
- **Desire:** "Your child doesn't need another promise" is the best line on the site for this persona.
- **Doubt:** price justification vs residency/academy programmes; under-18 international transfer rules; "who will talk to my child?"
- **Leaves at:** pricing (four programmes + jargon "Window/Two-Window/Cohort/Elite" is confusing).
- **Applies if:** "Talk to us first" exists (currently pending) and the guardian path is obvious.
- **Pays $249 if:** it is framed as risk reduction before a $10k+ decision.
- **Pays $399/mo if:** they see a parent dashboard / parent call cadence and month-by-month deliverables — "You don't have to figure this out alone."

### Persona C — 22, semi-pro / lower league
- **First 5 s:** "Europe assessment" — relevant.
- **Thinks we sell:** advice, maybe a way to get moved.
- **Trust:** wants proof we know markets: real transfers (Korona Kielce case is on hold), real players.
- **Desire:** league/market matching, "change market".
- **Doubt:** "Is this an agent or not? Will you get me a club?" — the honest "no club contact" answer must be paired with a clear *path to representation when appropriate*.
- **Leaves at:** the honesty-heavy copy without a picture of progress.
- **Pays $399/mo if:** market positioning, profile/CV/Transfermarkt guidance, opportunity verification and offer analysis are visible as ongoing work.

---

## 4. Homepage — section-by-section audit

Scores 1–10: **V**isual · **I**nteractivity · **C**larity · **T**rust · **E**motion · **CV** conversion value · **M**obile.

| # | Section | V | I | C | T | E | CV | M | Diagnosis |
|---|---|---|---|---|---|---|---|---|---|
| 01 | Hero | 7 | 4 | 7 | 4 | 5 | 7 | 7 | Strong type, good CTA. No human/proof; report card only ≥1024px; route line crosses copy at 768. |
| 02 | Silence | 6 | 3 | 8 | 3 | 7 | 5 | 7 | Great insight; outbox mock is pleasant but generic; text-heavy left column. |
| 03 | Decision Set | 6 | 6 | 8 | 5 | 6 | 5 | 6 | Best idea on the site, worst use of space: 3,273 px pinned, mostly empty navy. Mobile stem is long. **TOO LONG / TOO EMPTY.** |
| 04 | Built inside football + team + verify | 6 | 4 | 7 | 6 | 4 | 5 | 6 | First real photo (good). Three placeholder portraits dominate — reads unfinished. Verify rail has 3 of 5 cards "PENDING". |
| 05 | Assessment product | 6 | 2 | 8 | 5 | 4 | 7 | 6 | Ten-step grid + two lists = **TOO TEXT-HEAVY**. Good content, poor presentation. |
| 06 | Sample report | 7 | 6 | 8 | 6 | 4 | 7 | 7 | Genuinely useful. Should be *the* product hero, not section 6. |
| 07 | Success redefined | 6 | 4 | 7 | 4 | 6 | 4 | 6 | Nice board; philosophically redundant with 03. **REPETITIVE.** |
| 08 | Europe is not one market | 5 | 2 | 7 | 4 | 5 | 4 | 6 | Faint map, text. Explorer has **no live data**, so the teaser promises what the page can't deliver. **TOO DARK / TOO EMPTY.** |
| 09 | Find your path | 5 | 3 | 8 | 3 | 3 | 5 | 8 | Fine, but a thin band; competes with the main CTA. |
| 10 | After the assessment (ladder + 4 cards) | 5 | 2 | 5 | 4 | 3 | 5 | 5 | Ladder + 2 boxes + 4 price cards = **CARD GRID**. Product names (Window/Two-Window/Cohort/Elite) are jargon to Americans. Monthly relationship invisible. |
| 11 | Real careers | 6 | 2 | 7 | 4 | 4 | 4 | 6 | Worked examples good; Agency case on HOLD. Without real cases this feels hypothetical. |
| 12 | Agency players | 6 | 3 | 7 | 7 | 5 | 4 | 7 | Real players = real trust, but it's section 12. Should move to the first two screens as a proof strip. |
| 13 | Know what you're getting into | 6 | 3 | 7 | 6 | 5 | 3 | 6 | Strong differentiator, buried; merge into founder/trust story. |
| 14 | Pricing | 6 | 2 | 6 | 6 | 2 | 6 | 6 | Clear numbers, but four programmes + club = choice overload; no risk reversal; no monthly story. |
| 15 | Not representation | 6 | 2 | 8 | 7 | 2 | 4 | 6 | Necessary and well done; a full section is too much on the homepage — fold into How it works + pricing. |
| 16 | Testimonials | — | — | — | — | — | — | — | Hidden in production (no approved testimonial). **The biggest proof gap.** |
| 17 | FAQ | 5 | 4 | 8 | 6 | 2 | 5 | 7 | Good answers, plain accordion. |
| 18 | Final CTA | 7 | 3 | 7 | 4 | 6 | 6 | 7 | Good line ("Big ambition. Honest advice."); route-to-YOU is subtle. |

**Overall:** 18 sections is too many. Several sections argue the same philosophy (03, 07, 15, parts of 13). The product (05, 06, 10, 14) is split across four non-adjacent places. Proof (04, 12, 16) is scattered and late.

---

## 5. Ecomm Factory comparison

**Why Ecomm Factory feels alive** (from its source and renders):
1. **Colour blocking with conviction** — black → white → full-bleed electric blue → white → black. Each section is a different "room".
2. **Ambient motion everywhere** — a dot-field `<canvas>` behind most sections (starfield, bridge, directional, structured, signals, disperse), a pulsing chevron stream, marching dashed flow lines, a pointer-reactive dotted Estonian flag. Nothing is ever completely still.
3. **Immediate micro-feedback** — pillars/categories invert to black on hover and reveal copy; arrows slide; nav underlines grow; contact tiles turn blue.
4. **Manifesto beats** — one or two huge lines per screen; the page breathes between dense parts.
5. **Short copy blocks** — never more than a lede under a statement.

**Where Concordia is static / safe by comparison:**
- One colour room (navy) repeated; paper sections are rare and quiet.
- Motion is limited to the hero route draw, the Decision Set and a few reveals; most sections have **no motion and no hover feedback**.
- Photography (our real advantage over Ecomm Factory) is used small and late.
- Long paragraphs and lists where Ecomm Factory would use one statement + one interaction.
- Card grids (assessment steps, programmes, verify) where Ecomm Factory uses invert-on-hover tiles that feel tactile.

**What to borrow (not copy):** colour-blocked rooms; ambient but meaningful motion (our version: the Route as a living line, player-data particles, a subtle pitch-grid field); tactile hover inversion on every tile; manifesto beats between dense sections; tight copy. **What to do better:** real football photography and video, a live-looking product (report + dashboard) — Ecomm Factory has no product UI to show; we do.

---

## 6. Visual / art-direction audit

- **Backgrounds:** Night Ink #0D1B36 and Ink Deep #081127 are nearly indistinguishable; alternating them doesn't create rhythm. Result: one long dark scroll.
- **Contrast/brightness:** Route Yellow is used only for type/lines (by the Phase 1 rule "never backgrounds"). That rule now works against the brief ("more bright, more alive"). **Decision needed:** allow Route Yellow and Continental Blue as full-bleed section colours (sparingly — 2–3 rooms on the homepage).
- **Paper sections:** good contrast, but too few and too text-led.
- **Photography:** the strongest asset class we own (FIFA HQ, Wembley, signings, office, players) is under-used. Many are on HOLD for consent — so the art direction is currently forced into abstraction. Clearing 4–6 photos (E11) would change the site more than any animation.
- **Typography:** Anton display is right — confident, football-native. Over-used at very large sizes in long multi-line headlines (H2s of 4–5 lines read as walls). Shorter headlines, bigger single words.
- **Cards:** border-only dark cards everywhere = template feel. Need hierarchy: some photographic, some solid colour, some interactive.
- **Data visualisation:** the report's bars are good; nothing else uses football data visually. Opportunity: player radar/profile, minutes graph, league-level ladder, market-fit matrix.
- **Motion:** decorative where present (route), absent where it could explain (pricing, product, how it works).

**Proposed visual rhythm (homepage):**
DARK hero (photo/video + route) → BRIGHT proof strip (paper, real photos marquee) → BLUE problem (full-bleed Continental Blue, kinetic type) → INTERACTIVE decision (compact, dark) → PRODUCT (paper, interactive report) → PRODUCT 2 (dark, live dashboard) → HUMAN (full-bleed photography, Marks + team) → YELLOW statement band (one manifesto line) → DATA (markets/league ladder) → PRICING (paper) → CTA (dark, route completes).

---

## 7. Interaction audit

**Current inventory:** hero route draw (CSS); audience switch; Decision Set (scroll-lit, desktop) / tap-to-expand stem (mobile); outbox reveal; split-flap board; report viewer (tabs / swipe / full-screen); verify ledger + document modal with redaction; player rail (scroll-snap); window clock (tabs + steps); markets explorer (map/list, panel); Find Your Path quiz; 10-step form; checkout; FAQ accordions; sticky mobile CTA; header scroll state.

**Gaps:** almost no hover/tactile feedback on cards; no ambient motion; nothing interactive in pricing or the product ladder; no video; no data interactions on the homepage; the Decision Set is the only scroll story and it is too long.

**Proposed interactions (each tied to a purpose):**

| Interaction | Purpose | Priority |
|---|---|---|
| Hero: muted 8–12 s loop of real football (match/office/signing) behind type, poster on mobile | Emotion + trust in the first screen | P1 (needs footage) |
| Proof marquee under hero (real photos + credentials + player names, auto-scroll, pause on hover) | Trust in 5 s | P0/P1 |
| Interactive report with hotspots ("tap the level band") | Product value of $249 | P1 |
| **Career dashboard mockup** (live-looking: next match review, window countdown, target markets, messages, open opportunities being verified) | Makes $399/mo tangible | P0 for the monthly model |
| Month-by-month horizontal scroll ("Your career team, month by month") | Recurring value | P0 for monthly model |
| Decision cards (compact, one screen; flip/tilt cards on hover; mobile swipe deck) | Philosophy without 3k px | P1 |
| League-level ladder / market-fit matrix (choose position + passport → see example market types; clearly illustrative) | Curiosity + "they know markets" | P2 (no fabricated facts) |
| Before/after player profile (raw CV → positioned profile) | Shows profile/CV/Transfermarkt guidance value | P1 |
| Magnetic primary CTA + tactile tile inversion (Ecomm-style) | Premium feel | P2 quick win |
| Number counters — only for verified numbers (e.g., players represented) | Trust | P2 (needs verified data) |
| Video testimonials carousel | Proof | P1 (needs permissions) |

---

## 8. Trust audit

**Where trust currently appears:** hero micro-line (licence) → section 4 (photo, team placeholders, verify rail with pending cards) → section 12 (players) → section 13 (player rights) → footer (entity). **Too late and too small.**

**What the visitor needs by screen 2:** a face (Marks), a credential they can read at a glance ("Led by a FIFA Licensed Football Agent · Licence 202406-7079 · verify"), real football imagery, real players, and the company being real (Concordia Sports Agency SIA, Riga).

**Recommendations:**
- Promote "LED BY A FIFA LICENSED FOOTBALL AGENT" to a primary commercial signal (hero proof line ≥16px, badge-style; repeated on pricing and checkout). Compliant wording only — never "FIFA licensed agency/team", never imply FIFA endorsement.
- Proof strip directly under the hero.
- Replace "PENDING" verify cards on the homepage with only cleared items (production already hides them — but the homepage then shows 2 items; plan for that).
- A 60–90 s founder video (highest-leverage single asset for US social).
- Testimonials: the single biggest gap. Even 2–3 short video clips (with permission) would lift every persona.
- Use the honesty assets ("no guaranteed contracts", "we'll tell you not yet") as trust, high on the page — they differentiate from the trial industry (SoccerViza itself calls most European trials "glorified scams" and notes $3,000–5,000 costs — [SoccerViza](https://soccerviza.com/blog/how-to-get-a-professional-soccer-trial-in-europe); FIFPRO and clubs warn about fee-charging fake trials — [FIFPRO](https://fifpro.org/en/supporting-players/conditions-of-employment/the-transfer-of-players/warning-fake-agents-are-cheating-players), [Chelsea FC](https://www.chelseafc.com/en/news/article/protecting-against-scams-targeting-young-players)).

---

## 9. Assessment value audit

**Problem:** the deliverables are listed, not felt. "$249 for someone to watch my video?" is still a plausible reaction.

**Make highly visible (top 8):** full-match analysis (not highlights) · realistic current level band with reasoning · strengths & weaknesses (technical/tactical/physical where footage allows) · league/country/market fit (three directions) · passport/EU-eligibility implications · 90-day action plan · professional written report · strategy call — **under a FIFA-agent-led methodology**.

**Presentation:**
- Lead with the report (interactive), not the 10-step grid. Steps become a 4-step strip.
- Anchor value honestly against the alternatives families already consider: a self-funded trial trip or "trial programme" often costs **$3,000–5,000** ([SoccerViza](https://soccerviza.com/blog/how-to-get-a-professional-soccer-trial-in-europe)); comparable *evaluation-only* services range from £79–179 (UK, no market/agent layer — [IPSO](https://ipsofootball.com/have-your-player-scouted/)) to $1,000 (NJ academy evaluation — [Universal Soccer Academy](https://www.universalsocceracademy.com/training/individualtraining/evaluation)). Positioning: *"More than a video review; far less than a wrong trial."* (Any figures shown publicly must be sourced and re-verified — E23.)
- Name the output as an asset: "Your Player Pathway Report".

---

## 10. Ongoing career management — positioning, $399/month model and parent psychology

### 10.1 The commercial model to sell

FREE APPLICATION → **$249 Player Pathway Assessment** (entry, qualification) → **$399/month European Pathway** (core recurring product; 6-month initial pathway) → continue or stop per terms → formal representation only when appropriate and separately documented.

> Note: this supersedes the current site's fixed-term menu (Cohort $1,500, Window $2,400, Two-Window $4,200, Elite $7,500, Club $149/mo). Founder decision required on which of those survive (see §21).

### 10.2 $249 → $399/month vs $2,400 / 6 months — recommendation

| Factor | $2,400 / 6 months (or instalments) | $249 → $399/month |
|---|---|---|
| Perceived risk | High — one large decision | Low — next step is one month |
| Price anchoring | "$2,400" is the headline; compared with trial costs | "$399/month" compared with private coaching/club fees US families already pay monthly |
| Parent psychology | Feels like buying a programme/course | Feels like hiring a team, with control |
| Conversion after assessment | Lower | Higher (smaller step, momentum from report) |
| Cash flow | Upfront (better) | Monthly (smoother, slower) |
| Retention | Contracted | Earned monthly → churn risk, especially months 2–3 ("nothing happened") |
| Disputes/chargebacks | Larger single disputes | More, smaller; auto-renewal law exposure |
| Positioning fit | Course/programme | **Career management** ✓ |

**Recommendation: the monthly architecture is commercially stronger for US families, *provided* recurring value is made visible every month and the 6-month logic is honest.** Show **$399/month** as the price. Mention the six-month total only in the terms (never as the headline). The business plan warned against *open-ended* monthly billing because of churn; the answer is a structured monthly product with a clear horizon and a monthly deliverable, not "subscribe and hope".

### 10.3 Reconciling "6-month pathway" with "cancellable"

| Option | Commercial | Trust | Retention | Risk |
|---|---|---|---|---|
| A. $399/mo, 6-month minimum | Strong cash certainty | Lower ("locked in") | High | Must be prominent; contradicts any "cancel" messaging |
| B. $399/mo, 6 months recommended, cancel monthly | Highest trust, lowest barrier | High | Lowest | Month-2/3 churn; weak planning horizon |
| C. 6-month plan, cancel with notice (e.g., 30 days) | Balanced | Medium-high | Medium-high | Notice terms must be clear |
| **D (recommended). "Pathway plan, billed monthly" with an early exit**: 6-month pathway billed $399/month; full exit available within an initial window (e.g., after month 1) if the family isn't seeing value; after that, the pathway continues to month 6 (or cancel with defined notice) ; after month 6 it continues month-to-month, cancellable | Strong: low barrier + commitment after value is proven | High: "Try the first month properly; stay because it works" | High | Needs precise legal drafting |

**Commercial presentation (draft concept, not copy):** "$399/month · 6-month European Pathway · Billed monthly — no large upfront programme fee · Clear terms: [first-month exit] / [notice] / continue month-to-month after six months."

**Never** write "cancel anytime" if any minimum term exists.

**Must be confirmed legally before launch:** exact minimum term / exit window; notice periods; refund on cancellation; renewal after month 6 (auto-renewal disclosure + affirmative consent + easy online cancellation under US state laws — California, New York, Colorado, Illinois, Oregon, Virginia, New Jersey; Louisiana's Click-to-Cancel Act requires compliance by 1 Jan 2027; the FTC's federal click-to-cancel rule was vacated in 2025 and a renewed rulemaking has been petitioned — [JD Supra](https://www.jdsupra.com/topics/consent/consumer-contracts/subscription-services/), [EPIC](https://epic.org/epic-joins-coalition-urging-ftc-to-renew-click-to-cancel-rulemaking-to-protect-consumers-from-subscription-traps/)); EU 14-day withdrawal for EU consumers (contracting entity is Latvian); treatment of minors (guardian as contracting party); what happens when representation starts (programme ends, unused time refunded/credited — existing rule).

### 10.4 Why would a parent keep paying $399 every month?

Because every month produces something they can see. Proposed recurring-value structure (illustrative — to be confirmed against real capacity):

- **Always on (every month):** named career contact · bi-weekly strategy calls · direct messaging (defined response time) · opportunity/trial/academy/agent verification · monthly progress note to player *and* parent.
- **Month 1 — Diagnose & position:** onboarding from the assessment · career roadmap · target market shortlist · player CV/profile rebuild · Transfermarkt profile guidance (guidance only — no control over Transfermarkt).
- **Month 2 — Evidence:** full-match review #1 · development priorities · footage/highlight strategy.
- **Month 3 — Market:** league/country matching refined · market briefing · positioning review.
- **Month 4 — Prepare the window:** match review #2 · transfer-window plan · trial budget planning.
- **Month 5 — Opportunities:** opportunity evaluation · verification · offer/contract decision support.
- **Month 6 — Decide:** full pathway review · readiness · next-move decision (continue, change market, wait — or, where appropriate, a separate conversation about representation).

**Visualise it as** "Your career team, month by month": a horizontal timeline + a live-looking dashboard (next call, window countdown, verified opportunities, messages, progress). That one component will do more for the monthly conversion than any copy.

### 10.5 Compliance flags on the new service list
- "Club/trial opportunity research" and "club-level matching" sit in the **grey zone** identified in the business plan (§17): market and league mapping is advisory; a club-specific target list built to launch an approach, or any contact with clubs about the player, is Football Agent Services. Word these as *market/club-profile research and verification for the player's own decisions*, never as introductions or outreach.
- "Direct messaging access" must have a stated scope/response time to avoid open-ended-availability disputes.
- "Transfermarkt support" → "Transfermarkt profile guidance"; do not imply control or partnership.
- "A FIFA agent in your corner" → always pair with "Representation is separate, selective and never for sale."

### 10.6 Parent psychology — "Why would a parent pay $399/month?"
The parent is buying **information, clarity, oversight, risk reduction and better decisions** — not a dream. "**You don't have to figure out your child's football career alone**" is a strong, true and emotionally resonant line; recommended for the parents page hero and the Pathway section's parent variant. Proof the parent needs: who the team is, what they get each month, a parent touchpoint (quarterly or monthly parent call/summary), safeguarding/minors credentials, clear exit terms.

### 10.7 Player psychology — "I have someone in my corner"
The player wants a **mentor + career manager + football expert** who knows their minutes, weaknesses, level and options. The dashboard + bi-weekly calls + messaging make that tangible. Representation remains a separate, possible *later* step — say so plainly; it is also aspirational for them.

### 10.8 Pricing UX (recommended structure)
Two cards only on the homepage:

1. **START HERE — Player Pathway Assessment · $249 one-time** — "Know where you actually stand." → *Apply for your assessment*
2. **THEN — European Pathway · $399/month** — "Your career team, month by month." · 6-month pathway · billed monthly · no large upfront fee · terms summarised in one line with a link → *Starts after your assessment*

Below: "$150 of your assessment credited to your first Pathway month" (if retained) · "Representation is separate and never for sale." Elite/Club/Cohort (if kept) move to the Pricing page as secondary options.

---

## 11. Mobile audit (390 px; most US social traffic)

| Area | Finding | Severity |
|---|---|---|
| First viewport | Good: lockup, H1, switch, CTA, micro-line visible. But **no image, no face, no proof** — pure text on navy | High |
| Headline | ~5 lines at 50–56 px; fine, could be shorter | Low |
| CTA / sticky CTA | Clear; sticky bar appears after hero; hides on pricing/forms — good | — |
| Menu | Full-screen, large type, Apply on top — good | — |
| Scroll length | **29,810 px** home on mobile (≈35 screens) — too long for social traffic | High |
| Decision Set | Tap stem works; long; final 3×3 grid good | Medium |
| Team | Swipe rail of placeholders — reads unfinished | Medium |
| Pricing | Stacked cards are long; four programmes = scroll fatigue | High |
| Forms | 10 steps, ~30 fields, native date input, before any payment — **biggest drop-off risk** | High |
| Video | Testimonial gated; 15.5 MB MP4 would be unusable on cellular without transcoding/poster | High (before launch) |
| Tap targets | ≥44 px on primary controls; mono links slightly small | Low |
| Trust placement | Credential line is tiny; first real photo after ~6 screens | High |

---

## 12. Funnel / application audit

**Current:** Landing → Apply (intro + 9–10 steps) → instant triage → Result ("accepted") → Checkout (payer, address, 4 acks) → Confirmation.

**Friction analysis:** the "Apply first" gate is commercially *right* (it qualifies, signals exclusivity and protects the honesty positioning) but currently *too heavy*. On mobile, 30 fields before seeing a price commitment will lose most social traffic.

**Recommendation — "qualify fast, intake later":**
1. **Quick qualify (≈60–90 s, 6–8 fields):** age/DOB, position, current level, country, passports (incl. "not sure"), full-match link (or "not yet"), email, player/parent.
2. **Instant result** ("Accepted for a Pathway Assessment" / "Get footage first" / "Parent completes" / "Under 16").
3. **Pay $249.**
4. **Post-purchase intake** (the rest of the current form) — completion rate is far higher once paid, and it becomes part of the service.
5. **Assessment → Pathway upsell** at the report call and in the report itself ("Recommended next step: European Pathway").

**CTA architecture:** Primary: **"Start your assessment"** (micro: "Free 2-minute application · $249 if accepted"). Secondary: "See if you qualify" for Find Your Path; "Talk to us first" for parents. Avoid "Apply" alone (sounds like a job form); avoid "Get assessed" alone (hides the free gate). For the Pathway: "Starts after your assessment".

---

## 13. Technical SEO audit

### Review environment (correct as is)
- `<meta name="robots" content="noindex, nofollow">` on every page (review mode) ✓; Netlify `X-Robots-Tag: noindex, nofollow` header configured in `pathway/netlify.toml` ✓ (not verifiable live from here). **Do not index the review URL.**

### Production requirements (findings from crawling the built HTML)

| Item | Status | Fix |
|---|---|---|
| robots.txt | **Missing** | `app/robots.ts` (production: allow; review: disallow) |
| sitemap.xml | **Missing** | `app/sitemap.ts` from the route list; exclude apply/result/checkout/partners/legal shells as appropriate |
| Canonical | **Missing** on all pages | `metadataBase` + per-page `alternates.canonical` (domain pending) |
| Titles | Present; several >60 chars due to the long template suffix ("· Concordia Soccer · European Pathway") | Shorter template: "%s · Concordia Soccer" |
| Meta descriptions | **29 of 45 pages share the default** | Unique descriptions per page |
| H1 | 1 per page on content pages; **0 on /apply, /apply/result, /checkout/assessment, /find-your-path** (client-rendered) | Server-render a heading; those pages should be `noindex` anyway |
| H2/H3 | Generally logical; some sections use display `p` for headings | Audit heading levels |
| Open Graph / Twitter | og:site_name/type + twitter:card present; **no og:image, no per-page OG** | Generated OG images per page |
| Structured data | **None** | Organization (Concordia Sports Agency SIA / brand), Person (Marks — only verified facts), Service + Offer ($249; $399/month), FAQPage (FAQ), BreadcrumbList |
| Image alt | Good overall; one content image with `alt=""` (Agency case photo) | Descriptive alt |
| Image filenames | Clean, descriptive ✓ | — |
| Images | **Unoptimised in static export** (`images.unoptimized`), 1280 px JPEGs, no AVIF/WebP/srcset | Build-time image pipeline (sharp → AVIF/WebP + widths) or move to Netlify's Next.js runtime with image CDN |
| Video | 15.5 MB MP4, no poster, no captions/transcript, no VideoObject | Transcode (H.264 + AV1, ≤2–3 MB), poster, captions, VideoObject schema, or stream (Mux/Cloudflare) |
| HTML weight | **Home 839 KB (228 KB gz)** — Europe map paths inlined repeatedly (hero + markets + RSC payload); /markets 58 KB gz | Ship the map once as a static SVG file (or one shared `<symbol>`), not inline per instance |
| JS | Home ≈ 9 chunks, ≈ 638 KB raw (~215 KB gz) — React/Next baseline + client sections. No GSAP; framer-motion installed but unused | Remove unused dep; keep heavy interactive sections client-only and lazy |
| Fonts | Self-hosted via @fontsource ✓; 7 weights loaded globally | Subset/limit weights; `font-display: swap` ✓ |
| CWV risk | LCP risk from heavy HTML; CLS low (fixed aspect ratios ✓); INP fine | Fix map duplication and images first |
| URLs | Clean, human-readable ✓ (`/for/parents`, `/markets`, `/programmes/window`) | Product rename will change `/programmes/*` → plan redirects |
| 404 | Custom, noindex ✓ | — |
| Redirects | None needed yet | Add when programme routes change |
| Accessibility | Skip link, labelled forms, focus, reduced motion ✓; some low-contrast mono text on navy | Contrast pass on mono/slate text |

---

## 14. Keyword / search-intent strategy

*(Intent-led; confirm volumes before prioritising.)* Evidence that intent exists: US college-to-Europe content ranks for SoccerViza, Warubi, USA College Sport ([search](https://soccerviza.com/blog/), [Warubi](https://warubi-sports.com/professional-player-usa-europe/)); EU-passport value is well documented (≈55% of US-passport players in European leagues hold dual citizenship — [Soccer America](https://www.socceramerica.com/publications/article/70870/us-players-in-europe-a-quality-problem-not-qua.html?verified=1); [Wikipedia: EU status](https://en.wikipedia.org/wiki/EU_status_(football))).

| Cluster | Examples | Intent | Who | Page type |
|---|---|---|---|---|
| **High commercial** | soccer player assessment · professional soccer evaluation · soccer career management · soccer career consultant · FIFA soccer agent · soccer agent for college players · European soccer agent | Buy / hire | Player + parent | Assessment, Pathway, About/Verify |
| **Commercial-investigation** | soccer trials Europe · European soccer trial cost · are soccer trials legit · soccer scouting service · soccer representation | Compare / vet | Player + parent | Comparison guides, trial-scam guide, "how agents work" |
| **Informational (player)** | how to play professional soccer in Europe · play soccer in Europe after college · NCAA soccer to Europe · D2/D3/NAIA to pro · American soccer players in Europe | Learn | Player | Hub + guides |
| **Parent intent** | should my child play soccer in Europe · Europe vs college soccer · soccer academy Europe for American teenager · FIFA under-18 transfer rules | Decide / protect | Parent | Parents hub, minors guide |
| **Passport** | EU passport soccer · play soccer in Europe with Italian/Irish/Polish passport · non-EU player rules | Learn/act | Player + parent | Passport guides by country of ancestry |
| **Long-tail** | soccer trial scam warning signs · how to get on Transfermarkt · soccer CV template · full match vs highlights for scouts · transfer window dates by country | Learn | Player | Evergreen guides, tools |

---

## 15. Content / SEO architecture (12–24 months)

**Yes — build a serious content layer.** The category's organic leaders win with content (SoccerViza's blog is a direct content competitor), and our FIFA-agent + legal authority is exactly what Google's quality signals reward (first-hand expertise, named author, verifiable credentials).

```
/guides/                                  Hub
  /guides/play-soccer-in-europe/          Pillar (player)
    /guides/college-to-europe/            NCAA · NAIA · D2/D3 spokes
    /guides/mls-next-to-europe/
    /guides/american-players-in-europe/
  /guides/europe-or-college/              Pillar (parent)
    /guides/under-18-transfer-rules/      (legal review)
  /guides/eu-passport-soccer/             Pillar
    /guides/eu-passport/italy/ … /ireland/ /poland/ /germany/ …
  /guides/soccer-trials-europe/           Pillar (trust)
    /guides/trial-scams-warning-signs/    link magnet
    /guides/how-much-should-a-trial-cost/
  /guides/how-football-agents-work/       Pillar (authority)
    /guides/check-fifa-agent-licence/
    /guides/do-i-need-an-agent/
  /guides/player-profile/                 CV · highlight reel · full match · Transfermarkt guidance
  /guides/transfer-windows/
  /guides/contracts/                      what's in a pro contract · trial agreements (law-practice reviewed)
/markets/[country]/                       only sourced countries (E-MKT)
/careers/[slug]/                          real journeys (consented)
```

Cadence: 2 pillars + 4 spokes/month for 6 months, then country/passport spokes. Every article: named author (Marks / team), reviewed date, sources, CTA to "See if you qualify". Avoid programmatic country pages without sourced facts. Video: founder explainers repurposed from social ("Agent reacts to your highlight reel").

---

## 16. Competitor / category analysis

| Competitor / category | Offer | Price (public) | Promise | Model | Trust | Gap we can own |
|---|---|---|---|---|---|---|
| SoccerViza (Costa Rica) | Residential development + placement; strong blog | n/p | "Go pro" honestly; calls most trials scams | Residential | Content, claims of placements | Must travel; no FIFA-agent/legal advisory product |
| IFX | German trials, residencies | $3,500 / 30 days and up | Trials inside club sessions | Pay-to-participate | Since 2003 | Sells trips; conflict of interest |
| Warubi Sports | Ecosystem: camps, trials, FC Köln ITP, FIFA-licensed representation | Events ~€970 | Pathways at every stage | Events + agency | Scale, partners | Event-centric; not personal career management |
| OPSM Pro | Representation + pathway advising + database + events | n/p | Pro contracts | Agency + services | Since 2017 | Mixed agency/advisory; less legal/compliance clarity |
| NCE Soccer × Promoesports | Camps → agency fast track | Camp fees | Agency access | Camps feeding agency | Big agency brand | Pay-for-access optics |
| IPSO Football (UK) | Player assessment + mentorship | £79 / £179 + £50/game | Expert feedback | One-off + per-game | Tutors | No market/passport/agent layer; UK |
| 1UP Mentorship | Video feedback mentorship | $62.50/mo (6 mo) | Development feedback | Subscription | Coach mentors | Development only, not career/market |
| US evaluation services | Video/in-person evaluations | $40–$1,000 | Feedback/development plan | One-off | Local coaches | No European market intelligence |
| College recruiting (NCSA etc.) | College placement | $1,200–6,000+ | College scholarships | Packages | Scale | Not professional/Europe |

Sources: [SoccerViza](https://soccerviza.com/blog/how-to-get-a-professional-soccer-trial-in-europe), [Warubi](https://warubi-sports.com/about-us/), [OPSM Pro](https://www.opsmpro.com/?p=9740), [NCE/Promoesports](https://ncesoccer.com/nce-partner-with-promoesports/), [IPSO](https://ipsofootball.com/have-your-player-scouted/), [1UP](https://www.1upsoccer.com/mentorship), [Universal Soccer Academy](https://www.universalsocceracademy.com/training/individualtraining/evaluation); IFX and NCSA pricing from the business plan (§7).

**Differentiated position:** *the only FIFA-licensed-agent-led, legally literate, honest (no-trial-selling) career-management team for US players and families — month by month, with representation kept separate.* Premium vs 1UP ($62/mo) is justified by market/agent/legal depth; dramatically cheaper and lower-risk than trial programmes ($3,000–5,000 per trip). The site must make that comparison felt (carefully sourced).

---

## 17. Recommended homepage architecture

**From 18 sections to 11–12.** Proof and product move up; philosophy is concentrated; secondary tools move off the homepage.

| # | Section | Job | Notes |
|---|---|---|---|
| 1 | **Hook** — hero | "Think you can play in Europe? Ask the people who actually work in European football." + FIFA-agent-led proof line + dual CTA (Start assessment / See if you qualify) | Real footage/photo; player/parent switch |
| 2 | **Proof strip** | Real photos marquee · licence (verify) · real players · company | Bright/paper room |
| 3 | **Problem** | "You don't need another highlight reel…" + silence + trial-cost reality | Full-bleed blue, kinetic type |
| 4 | **Interaction: Decision** | GO/WAIT/STAY/SAY NO — compact (one screen), card deck | Philosophy, 1 screen not 4 |
| 5 | **Product 1 — Assessment $249** | Interactive report + 4-step strip + what you get | Paper room |
| 6 | **Product 2 — European Pathway $399/mo** | "A FIFA-licensed agent leading your career team — before you need an agent" + live dashboard + month-by-month | Dark room; the commercial centre of the page |
| 7 | **Human proof** | Marks (video) + team + player-rights/legal angle + real players | Full-bleed photography |
| 8 | **How it works** | Apply → Assess → Pathway → (Representation, separate) | Absorbs "not representation" |
| 9 | **Outcomes** | Worked examples + Agency cases (clearly labelled) + testimonials | When cleared |
| 10 | **Pricing + risk reversal** | Two cards; terms one-liner; credit; no guarantees promise | Yellow statement band before it |
| 11 | **FAQ** | Objections incl. monthly terms | — |
| 12 | **Final CTA** | Route completes on "YOU" | — |

Moved off the homepage (linked): Markets explorer (until data exists), Find Your Path (keep as secondary CTA), Success-redefined (merge into Decision), Know-what-you're-getting-into (merge into Human proof), long pricing table.

---

## 18. Current scorecard

| Dimension | Score /100 |
|---|---|
| Design | 68 |
| Wow factor | 45 |
| Interactivity | 52 |
| Premium feel | 65 |
| Clarity | 70 |
| Trust | 52 |
| Sales / CRO | 50 |
| Mobile | 66 |
| SEO foundation | 42 |
| US-market fit | 55 |
| **Current overall** | **57 / 100** |
| **Realistic after revision** | **84 / 100** (90+ requires cleared real proof: photos, testimonials, cases, founder video) |

**Biggest gap:** *visible proof and a visible product.* The site explains the right philosophy but doesn't show the people, the players or the month-by-month service. Most of the remaining gap is assets (consents, video) rather than code.

---

## 19. Recommendations — P0 / P1 / P2

### P0 — must fix before launch
| # | Recommendation | Impact | Effort |
|---|---|---|---|
| P0-1 | Rebuild the offer around **$249 → $399/month European Pathway**; retire/relocate the fixed-term menu (founder decision) | HIGH | MED |
| P0-2 | Decide and legally confirm the 6-month/cancellation structure (recommend Option D); remove any wording contradiction | HIGH | MED (legal) |
| P0-3 | Pathway product section: month-by-month value + live-looking career dashboard | HIGH | MED |
| P0-4 | "Led by a FIFA Licensed Football Agent" promoted to a primary, readable proof signal (compliant) | HIGH | LOW |
| P0-5 | Proof strip directly under hero (cleared photos/players/licence/company) | HIGH | LOW-MED (consents) |
| P0-6 | Shorten pre-payment application to a quick qualify; move full intake post-purchase | HIGH | MED |
| P0-7 | Production SEO basics: robots, sitemap, canonical/metadataBase, unique titles/descriptions, OG images, schema (Org, Person, Service/Offer, FAQ, Breadcrumb) | HIGH | LOW-MED |
| P0-8 | Performance: render the Europe map once (static SVG), image pipeline (AVIF/WebP/srcset), transcode/poster video | HIGH | MED |
| P0-9 | Reduce homepage to ~12 sections (merge 03/07, fold 15 into How it works, move 08/09 off) | HIGH | MED |
| P0-10 | Compliance wording for new services (club research ≠ outreach; messaging scope; Transfermarkt guidance) | HIGH | LOW |

### P1 — high-impact commercial / design
| # | Recommendation | Impact | Effort |
|---|---|---|---|
| P1-1 | Colour-blocked rhythm: allow Continental Blue + Route Yellow full-bleed rooms; more paper/photo rooms | HIGH | MED |
| P1-2 | Hero with real footage/photography (mobile poster) | HIGH | MED (asset) |
| P1-3 | Founder video (60–90 s) + 2–3 video testimonials | HIGH | MED (asset/consent) |
| P1-4 | Interactive report hotspots; before/after player profile | HIGH | MED |
| P1-5 | Compact Decision card deck (≤1 screen desktop; swipe deck mobile) | MED | MED |
| P1-6 | Tactile hover/invert states on all tiles, magnetic CTA, ambient Route motion | MED | LOW-MED |
| P1-7 | Plain-English product naming (drop "Window/Two-Window/Cohort" jargon on the homepage) | HIGH | LOW |
| P1-8 | Parents: "You don't have to figure out your child's football career alone" + parent touchpoints in Pathway | HIGH | LOW |
| P1-9 | Content engine: hub + first 2 pillars (Play in Europe; Trials/scams) with named authorship | HIGH (12–24 mo) | MED |
| P1-10 | Honest value anchoring vs trial costs and evaluation services (sourced) | MED | LOW |

### P2 — polish / experiments
| # | Recommendation | Impact | Effort |
|---|---|---|---|
| P2-1 | Hero A/B: C vs D positioning | MED | LOW |
| P2-2 | League-level ladder / market-fit matrix (illustrative, no fabricated facts) | MED | HIGH |
| P2-3 | Verified number counters (players represented etc.) | MED | LOW (needs data) |
| P2-4 | Exit-intent / save-my-progress for the qualify step | LOW-MED | LOW |
| P2-5 | Country/passport spokes at scale once sourced | MED | HIGH |
| P2-6 | Contrast pass on mono/slate microcopy | LOW | LOW |

---

## 20. Quick wins (high impact, low effort)
1. Promote the FIFA-agent-led line to a large proof badge in the hero (P0-4).
2. Rename CTA to "Start your assessment" + "Free 2-minute application · $249 if accepted".
3. Move the Agency players rail up as a proof strip (photos already cleared for the Agency site).
4. Collapse the desktop Decision Set from 300vh to one screen.
5. Two-card pricing on the homepage ($249 → $399/mo) once the model is confirmed.
6. Unique meta descriptions + shorter title template; robots/sitemap/canonical files.
7. Render the Europe map once (fixes most of the 839 KB homepage).
8. Replace placeholder-heavy team row on the homepage with Marks + "the team" link until photos arrive.
9. Hover inversion on tiles and arrow motion on links (Ecomm-style tactility).
10. Add the parent line "You don't have to figure out your child's football career alone."

---

## 21. Questions / decisions requiring founder input
1. **Product line:** does the $399/month European Pathway *replace* Cohort / Window / Two-Window / Elite? Do Elite (premium tier) and Pathway Club ($149/mo alumni) survive as add-ons?
2. **Commitment structure:** which option (A/B/C/D)? If D, how long is the early-exit window and what notice applies after it? What happens after month 6 (auto-continue month-to-month)?
3. **Assessment credit:** keep the $150 credit — toward the first Pathway month(s)?
4. **Deliverable cadence and capacity:** bi-weekly calls with whom (E13)? Direct messaging response time? Number of full-match reviews per 6 months?
5. **Brand rule change:** may Route Yellow and Continental Blue be used as full-bleed section colours?
6. **Assets:** which photos can be cleared now (E11 — Korona signing, office meeting, shirt presentations)? Can we shoot a 60–90 s founder video and hero footage? Which testimonials can be recorded with permission?
7. **Hero positioning:** approve C (hero) + D (Pathway section) + B (problem/ads)?
8. **Application:** approve "qualify fast, intake after payment"?
9. **Production domain** (needed for canonical, sitemap, schema, OG).
10. **Content engine:** who authors/reviews guides (Marks / law practice) and at what cadence?
11. **Legal review scope:** subscription terms (US state auto-renewal laws, EU withdrawal), minors, new service wording (club research, messaging), Transfermarkt guidance wording.

*End of audit. Nothing implemented. Awaiting founder feedback before the consolidated implementation specification.*
