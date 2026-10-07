/**
 * LEGAL DOCUMENTS — Concordia Soccer · European Pathway (Concordia Sports Agency SIA).
 * Production drafts based on the actual product and data flows. Items needing an owner decision are listed in
 * docs/PRODUCTION_SETUP.md (“Owner information required”) — the text below states the rule the system implements.
 * Single source: rendered at /legal/[slug]; checkout, emails and product pages reuse content/commerce.ts.
 */
import { LEGAL_ENTITY, LICENCE, CONTACT } from "./site";
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, CALL_COVERS, DELIVERY_FULL } from "./assessment";
import { REFUND_LINE, REFUND_WHY, CREDIT_LINE, CREDIT_MATH, CREDIT_WINDOW, CONTRACT_REVIEW_LINE } from "./commerce";
import { RULES } from "./business-rules";

export interface LegalSection { id: string; title: string; paras?: string[]; list?: string[]; after?: string[] }
export interface LegalDoc { slug: string; title: string; summary: string; updated: string; sections: LegalSection[]; /** business rules used here that are not yet owner-confirmed */ pending?: (keyof typeof RULES)[] }

/* Cancellation / renewal wording is generated from the business rule (owner decision pending — see RULES.cancellation). */
const CXL = RULES.cancellation.value;
const PRICE_TERMS = RULES.priceModel.value === "final_price_everywhere"
  ? "Prices are in US dollars. Where Latvian VAT applies (consumers in the European Union, and businesses in Latvia), it is included in the price shown; no Latvian VAT arises for customers outside the EU, and EU businesses with a valid VAT number are invoiced under the reverse charge."
  : "Prices are in US dollars and are shown before VAT. Where Latvian VAT applies (consumers in the European Union, and businesses in Latvia), it is added at checkout; no Latvian VAT arises for customers outside the EU, and EU businesses with a valid VAT number are invoiced under the reverse charge.";
const PRICE_TERMS_FULL = PRICE_TERMS + " The exact total is shown before you pay.";
const RENEWAL_TEXT = CXL.mode === "minimum_term"
  ? `Your subscription renews automatically every month at USD 399. It has a minimum term of ${CXL.minimumMonths} monthly payments; after that it continues monthly on the same terms until cancelled. Before your first payment you confirm the recurring charge and the minimum term at checkout; we email a confirmation of the subscription and its terms.`
  : "Your subscription renews automatically every month at USD 399 until you cancel. The 6-month shape is a recommended pathway, not a minimum term: you are not required to stay for six months. After six months it continues monthly on the same terms until cancelled. Before your first payment you confirm this recurring charge at checkout; we email a confirmation of the subscription and its terms.";
const CANCELLATION_TEXT = (CXL.mode === "minimum_term"
  ? `After the minimum term of ${CXL.minimumMonths} monthly payments, you can cancel online from your status page (“Manage subscription”) or by emailing us; cancellation takes effect at the end of the billing month already paid. `
  : "You can cancel online from your status page (“Manage subscription”) or by emailing us. Cancellation takes effect at the end of the billing month already paid; you keep the service until then and no further payments are taken. ")
  + "Except where mandatory law requires otherwise, payments for a month that has started are not refunded. Your statutory right of withdrawal (section 6) is not affected.";

export const LEGAL_UPDATED = "7 October 2026";
const E = LEGAL_ENTITY;
const who = `${E.name} (registration No. ${E.registrationNo}, VAT No. ${E.vatNo}), ${E.address.join(", ")} (“Concordia”, “we”, “us”)`;
const contact = `${CONTACT.email}`;

const NO_GUARANTEE = ["representation by Concordia Sports Agency or anyone else", "a club introduction, club interest or acceptance by a club", "a trial", "a contract, transfer or professional career", "a scholarship", "a visa or work permit"];

const terms: LegalDoc = {
  slug: "terms", title: "Terms of Service", updated: LEGAL_UPDATED, pending: ["priceModel"],
  summary: "The general terms for using this website and the Concordia Soccer · European Pathway services. The Pathway Assessment Terms and the European Pathway Subscription Terms add the specific rules for each paid service.",
  sections: [
    { id: "who", title: "1. Who we are", paras: [`Concordia Soccer · European Pathway is a brand and service of ${who}. Concordia Soccer is a project of Concordia Sports Agency. Contact: ${contact}.`] },
    { id: "services", title: "2. What we provide", paras: ["We provide football career assessment and advisory services for players in women’s and men’s football who are considering European football:"], list: ["a free application, which we review;", "the Pathway Assessment (USD 249, one time), offered only to applicants we accept — see the Pathway Assessment Terms;", "European Pathway (USD 399 per month), an ongoing advisory career-management service offered after the assessment — see the European Pathway Subscription Terms."] },
    { id: "acceptance", title: "3. What “accepted” means", paras: [ACCEPTED_MEANING, "We decide on each application individually. We may decline an application without giving detailed reasons; no payment is taken to apply."] },
    { id: "not-representation", title: "4. Advisory services — not football-agent representation", paras: [
      "Our services are career assessment and advice. They are not Football Agent Services within the meaning of the FIFA Football Agent Regulations: we do not negotiate, communicate or conclude transactions with clubs on the player’s behalf as part of these services, and we do not contact clubs about the player as part of these services.",
      `${LICENCE.holder} holds a FIFA football agent licence personally (licence No. ${LICENCE.number}). The licence belongs to him as an individual; it is not a licence of Concordia or of these services, and no endorsement by FIFA is stated or implied.`,
      "Football-agent representation, where offered, is separate and selective. It can arise only under a separate written representation agreement that complies with the FIFA Football Agent Regulations and applicable law — including, for a minor, signature by the player’s legal guardian(s) and FIFA’s rules on minors. Buying any Pathway service does not create, require or increase the chance of representation.",
    ] },
    { id: "no-guarantee", title: "5. No guaranteed outcomes", paras: ["Our assessments and advice reflect our professional view on the information available to us. We do not promise or guarantee:"], list: NO_GUARANTEE, after: ["Football outcomes depend on many factors outside our control, including the player’s performance and decisions by clubs, leagues and authorities."] },
    { id: "contract-review", title: "6. Contract and document review (European football)", paras: [
      `${CONTRACT_REVIEW_LINE} This review concerns European professional football matters (for example European club–player agreements, transfer documentation, representation documentation and football regulatory context).`,
      "We do not provide legal services under United States federal or state law, NCAA rules or US athlete-agent laws, and we do not claim that any member of our team is admitted to practise law in every European jurisdiction. Where advice under a specific national law is required, we will say so and can involve local counsel, whose engagement and fees are agreed with you in advance and separately.",
    ] },
    { id: "eligibility", title: "7. Who can use the services", paras: ["Pathway Assessments are offered to players aged 16 and over. If the player is under 18, a parent or legal guardian must apply with the player, consent to the application, enter into any paid contract and make the payment; we treat the parent or guardian as our main contact and copy them on our communications. See How we work with minors."] },
    { id: "your-info", title: "8. Your information and materials", paras: [
      "You confirm that the information you give us is accurate to the best of your knowledge and that you are entitled to share the materials you send (for example match footage, documents and links).",
      "You keep all rights in your materials. You allow us to use them only to provide the services you asked for. We do not publish your materials or share them with clubs. How we handle personal data is explained in our Privacy Policy.",
    ] },
    { id: "payment", title: "9. Prices and payment", paras: [PRICE_TERMS_FULL + " Payments are processed by Stripe; we never receive or store your full card details. Specific payment, refund and cancellation rules are in the Pathway Assessment Terms, the European Pathway Subscription Terms and the Refund & Withdrawal Policy."] },
    { id: "consumers", title: "10. Consumer rights", paras: ["If you are a consumer, you have the rights given to you by mandatory consumer law — including, where applicable, a 14-day right of withdrawal for contracts concluded online (see the Refund & Withdrawal Policy). Nothing in our terms limits rights that cannot legally be limited."] },
    { id: "liability", title: "11. Liability", paras: [
      "We provide our services with reasonable care and skill. We are not liable for decisions you or others take, for the acts of clubs, agents, academies or authorities, or for losses that were not reasonably foreseeable.",
      "To the extent permitted by law, our total liability arising from a service is limited to the fees you paid for that service. This does not limit liability for intentional misconduct or gross negligence, for death or personal injury caused by negligence, or any liability that cannot legally be limited — and it does not affect your statutory rights as a consumer.",
    ] },
    { id: "website", title: "12. Using this website", paras: ["Please don’t misuse the website — for example by trying to access other people’s information, interfering with its operation or submitting false applications. Links you receive from us (for example to your status page) are personal: please don’t share them. Website content is protected by intellectual-property rights and may not be reused without permission."] },
    { id: "communications", title: "13. Communications", paras: ["We send service emails needed to provide what you asked for (for example application received, outcome, payment confirmation, requests for materials and assessment updates). These are not marketing. We send marketing emails only if you opted in, and you can unsubscribe at any time."] },
    { id: "law", title: "14. Governing law and disputes", paras: [
      "These terms are governed by the laws of the Republic of Latvia. If you are a consumer, this choice of law does not deprive you of the protection of mandatory provisions of the law of the country where you habitually reside.",
      "We will try to resolve any complaint quickly and informally first (see Complaints). Disputes may be brought before the competent courts of Latvia; consumers may also bring proceedings in the courts their own law allows. Consumers in the EU may contact the Latvian Consumer Rights Protection Centre (PTAC) or their national consumer authority.",
    ] },
    { id: "changes", title: "15. Changes to these terms", paras: ["We may update these terms for future use of the website and services. The version you accepted when you bought a service continues to apply to that purchase unless a change is required by law. The date at the top shows the latest version."] },
  ],
};

const assessment: LegalDoc = {
  slug: "assessment-terms", title: "Pathway Assessment Terms", updated: LEGAL_UPDATED, pending: ["priceModel"],
  summary: "The rules for the USD 249 Pathway Assessment: who can buy it, what it includes, when it starts, the 7-day target, the consultation call, refunds and the USD 150 credit.",
  sections: [
    { id: "application", title: "1. Free application and review", paras: ["Applying is free and does not oblige you to buy anything. We review each application and tell you by email whether we can offer a Pathway Assessment. Only an accepted applicant can buy it. Where the player is under 18, a parent or legal guardian applies with the player, buys the assessment and is our main contact."] },
    { id: "acceptance", title: "2. Acceptance", paras: [ACCEPTED_MEANING, "Acceptance does not mean that Concordia Sports Agency or anyone else has agreed to represent the player, that a club is interested, or that a trial, contract or transfer is available."] },
    { id: "includes", title: "3. What the Pathway Assessment includes", paras: ["Depending on the player’s profile and the materials available, the Pathway Assessment includes:"], list: ASSESSMENT_INCLUDES },
    { id: "price", title: "4. Price and payment", paras: ["The Pathway Assessment costs USD 249, paid once, online, through Stripe’s secure checkout. Taxes are as set out under Prices in the Terms of Service. The contract is concluded when the payment is confirmed. A failed or incomplete payment does not open onboarding."] },
    { id: "materials", title: "5. Onboarding and materials", paras: ["After payment is confirmed we ask for the player’s football profile and materials. Video should be shared as links. Some items may not exist — for example no Transfermarkt profile, no highlight video or no current club; telling us an item is not available is not, in itself, a reason we cannot proceed.", "We review whether we have received the information and materials reasonably required to conduct the assessment. This is a professional judgement for each player; no single item decides it. If more is reasonably required, we tell you what is missing."] },
    { id: "start", title: "6. When the assessment starts — the 7-day target", paras: [DELIVERY_FULL, "The assessment starts on the date we confirm the materials are sufficient, provided payment has been received. We confirm the start date and the target completion date by email. The 7-day period does not begin merely because payment was made or the onboarding form was submitted."] },
    { id: "early-start", title: "7. Starting within the withdrawal period", paras: ["If you are a consumer you may ask us at checkout to start straight away, within your 14-day withdrawal period. If you don’t, we begin after that period ends. See the Refund & Withdrawal Policy for what happens if you withdraw after asking us to start."] },
    { id: "call", title: "8. The consultation call", paras: ["The assessment includes one consultation call of up to 60 minutes, booked once the assessment is ready. Parents and guardians are welcome. The call may cover:"], list: CALL_COVERS, after: ["If you don’t book or attend the call within a reasonable time after we invite you (and after a reminder), the assessment is treated as delivered; we will still try to find a time if you contact us."] },
    { id: "advisory", title: "9. Advisory nature", paras: ["The assessment and the call are advisory and assessment-based. They reflect our professional view on the information available to us. We do not guarantee any outcome (see Terms of Service, section 5) and we do not contact clubs on the player’s behalf as part of the assessment."] },
    { id: "refunds", title: "10. Refunds", paras: [REFUND_LINE, REFUND_WHY, "Mandatory law includes, for consumers, the statutory right of withdrawal described in the Refund & Withdrawal Policy. If we cannot provide the assessment at all for reasons on our side, we refund the fee in full."] },
    { id: "credit", title: "11. USD 150 assessment credit", paras: [CREDIT_LINE, CREDIT_MATH, CREDIT_WINDOW, "The credit is linked to the paid assessment and to the same player and payer, and can be used only once. If the assessment payment is refunded or reversed (including through a chargeback), the unused credit lapses; if the credit has already been used and the assessment payment is later refunded, the credit amount may be charged on the next European Pathway invoice."] },
    { id: "representation", title: "12. Representation is separate", paras: ["Paying for the assessment, receiving it, attending the call or subscribing to European Pathway does not create a representation relationship. Any football-agent representation requires a separate written agreement under the FIFA Football Agent Regulations and applicable law."] },
  ],
};

const pathway: LegalDoc = {
  slug: "pathway-terms", title: "European Pathway Subscription Terms", updated: LEGAL_UPDATED, pending: ["cancellation", "priceModel"],
  summary: "The rules for European Pathway (USD 399 per month): what it is, monthly billing, the first-payment credit, renewal, cancellation and failed payments.",
  sections: [
    { id: "service", title: "1. The service", paras: ["European Pathway is an ongoing, advisory football career-management service, offered after a Pathway Assessment. It is designed as a 6-month European career pathway and is paid monthly. The monthly plan follows the player’s assessment and may include career strategy, match analysis, profile positioning, European market guidance, transfer-window planning, opportunity vetting and:", CONTRACT_REVIEW_LINE], after: ["European Pathway is not football-agent representation and does not involve contacting clubs on the player’s behalf (see Terms of Service, section 4)."] },
    { id: "price", title: "2. Price and billing", paras: ["USD 399 per month, charged in advance each month to the payment method you provide, through Stripe. There is no six-month upfront payment. Taxes are as set out in the Terms of Service, section 9."] },
    { id: "credit", title: "3. First payment with the assessment credit", paras: [CREDIT_LINE, CREDIT_MATH, CREDIT_WINDOW] },
    { id: "renewal", title: "4. Renewal", paras: [RENEWAL_TEXT] },
    { id: "cancel", title: "5. Cancellation", paras: [CANCELLATION_TEXT] },
    { id: "withdrawal", title: "6. Statutory withdrawal (consumers)", paras: ["Consumers have a 14-day right of withdrawal from the subscription contract. If you asked us to start within that period and then withdraw, you pay a proportionate amount for the service provided until you told us. See the Refund & Withdrawal Policy."] },
    { id: "failed", title: "7. Failed payments", paras: ["If a monthly payment fails, we and Stripe will notify you and retry. If payment is not made within a reasonable time after the reminders, we may pause the service and then end the subscription. Ending the subscription for non-payment does not remove amounts already due."] },
    { id: "ending", title: "8. Ending by us", paras: ["We may end the subscription with 30 days’ notice, or immediately for serious breach (for example abusive behaviour or providing false information). If we end it without fault on your side, we refund any amount paid for the period after the end date.", "If the player enters a football-agent representation agreement with Concordia Sports Agency, European Pathway ends on the date that agreement starts; the subscription is cancelled and any amount paid for the period after that date is refunded."] },
    { id: "changes", title: "9. Price changes", paras: ["We will give at least 30 days’ notice by email before any price change takes effect for an existing subscription. You can cancel before the change applies."] },
  ],
};

const refunds: LegalDoc = {
  slug: "refunds", title: "Refund & Withdrawal Policy", updated: LEGAL_UPDATED, pending: ["cancellation"],
  summary: "When fees are refundable, your statutory 14-day right of withdrawal as a consumer, how to withdraw, and how cancellations work.",
  sections: [
    { id: "assessment", title: "1. Pathway Assessment (USD 249)", paras: [REFUND_LINE, REFUND_WHY] },
    { id: "withdrawal", title: "2. Your 14-day right of withdrawal (consumers)", paras: [
      "If you buy as a consumer, you may withdraw from a contract concluded online within 14 days of its conclusion, without giving a reason. For the Pathway Assessment, the contract is concluded when your payment is confirmed; for European Pathway, when the subscription starts.",
      "We apply this right to all consumers, wherever they live.",
    ] },
    { id: "early", title: "3. If you asked us to start within the 14 days", paras: [
      "At checkout — or later from your status page — you may expressly ask us to start straight away. If you do, and then withdraw within the 14 days, you pay an amount proportionate to what we provided until you told us you were withdrawing, compared with the full service; we refund the rest within 14 days.",
      "Once a service has been fully provided at your express request — for the Pathway Assessment, when the assessment has been delivered and the consultation call has taken place — the right of withdrawal no longer applies to it.",
      "If you did not ask us to start early, we may still check your materials, but the assessment itself begins only after the 14 days have passed, and a withdrawal within that time is refunded in full.",
    ] },
    { id: "how", title: "4. How to withdraw", paras: [`Use “Withdraw from contract here” on your status page (the link in our emails) — we confirm receipt by email with the date and time. You can also send us a clear statement, for example by email to ${contact}, or use the model form below. To meet the deadline it is enough to send your message before the 14 days have passed. We refund using the same payment method, without fees for you.`] },
    { id: "form", title: "5. Model withdrawal form", paras: [`To: ${E.name}, ${E.address.join(", ")}, ${contact}`, "I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service (*): …", "Ordered on (*) / received on (*): …", "Name of consumer(s): … · Address of consumer(s): … · Application reference: …", "Signature of consumer(s) (only if this form is notified on paper): … · Date: …", "(*) Delete as appropriate."] },
    { id: "pathway", title: "6. European Pathway cancellation", paras: [CANCELLATION_TEXT + " See the European Pathway Subscription Terms."] },
    { id: "our-side", title: "7. When we refund regardless", paras: ["If we cannot provide a paid service at all for reasons on our side, or we end a subscription without fault on your side, we refund what you paid for the part not provided."] },
    { id: "credit", title: "8. The USD 150 assessment credit and refunds", paras: ["The credit is not cash and cannot be refunded or paid out. If the assessment payment is refunded or reversed, any unused credit lapses (see Pathway Assessment Terms, section 11)."] },
    { id: "chargebacks", title: "9. Chargebacks", paras: ["Please contact us before disputing a payment with your bank — most questions are resolved quickly. A disputed assessment payment pauses the assessment and voids any unused credit until the dispute is resolved."] },
  ],
};

const privacy: LegalDoc = {
  slug: "privacy", title: "Privacy Policy", updated: LEGAL_UPDATED,
  summary: "How Concordia Sports Agency SIA handles personal data for Concordia Soccer · European Pathway — under the EU General Data Protection Regulation (GDPR).",
  sections: [
    { id: "controller", title: "1. Controller", paras: [`The controller is ${who}. Contact for privacy questions and requests: ${contact} (subject “Privacy”).`] },
    { id: "data", title: "2. What we collect", list: [
      "Application: player’s name, date of birth, nationality and passports, country of residence, email and optional phone; for under-18s, the parent or guardian’s name, relationship, email and optional phone; football information (positions, foot, height, club, level, minutes, history, national-team experience, education/college details, contract status and end date, offers, whether the player has an agent), optional links (match footage, highlights, Transfermarkt, other profiles), goals and target countries, and your consent choices.",
      "Onboarding (after payment): the football profile and materials you send — CV, playing history, statistics, profile and video links, documents you upload (for example a CV or an existing representation agreement), representation status, objectives and target leagues; and, only if you choose to provide it with explicit consent, injury information relevant to the assessment.",
      "Assessment and service: our assessment, notes, communications with you, call scheduling, and (for European Pathway) your plan and progress.",
      "Payments: payer name and email, country of residence, buyer type, business name and VAT number if you buy as a business, consents given at checkout, and the payment details Stripe returns to us (payment status, amounts, billing country, card country, Stripe customer/payment identifiers, invoice references). Card numbers are entered on Stripe’s page; we never receive or store them.",
      "Technical: the country your request came from (derived by our hosting provider; we do not store your IP address in our records), and the storage described in our Cookie Policy.",
      "Attribution: campaign parameters (for example utm_source) that brought you to the site — kept across visits only if you accept optional storage.",
    ] },
    { id: "purposes", title: "3. Why we use it and our legal bases", list: [
      "To review your application, provide the Pathway Assessment and European Pathway, and communicate with you about them — necessary to take steps at your request before entering into a contract and to perform the contract (GDPR Art. 6(1)(b)).",
      "To take and record payments, issue receipts/invoices, determine and document VAT treatment and keep accounting records — legal obligations under Latvian tax and accounting law (Art. 6(1)(c)).",
      "Injury information — only with your explicit consent (Art. 9(2)(a)), only for the assessment; you can withdraw consent at any time and we then delete it.",
      "For players under 18 — the parent or guardian’s consent to the application and their role as contracting party (Art. 6(1)(b) and, where relevant, Art. 8).",
      "Optional: sharing your application with Concordia Sports Agency (consent, Art. 6(1)(a)); marketing emails (consent); keeping campaign attribution across visits (consent).",
      "To keep the service secure, prevent misuse and handle disputes — our legitimate interests (Art. 6(1)(f)).",
    ] },
    { id: "sharing", title: "4. Who receives your data", paras: ["We do not sell personal data and do not share player information with clubs. We use these service providers (processors) under data-processing terms:"], list: [
      "Netlify, Inc. — website hosting and our application database (data stored in the EU, Frankfurt region).",
      "Resend — sending our service emails.",
      "Stripe Payments Europe, Ltd. — payment processing (Stripe also acts as an independent controller for its own legal obligations, such as fraud prevention).",
      "A calendar booking provider, if we send you a booking link for the consultation call (you will see its name on the booking page).",
      "Our accountants and professional advisers where necessary, and authorities where the law requires.",
    ], after: ["Concordia Sports Agency (our parent business) sees your application only if you opted in."] },
    { id: "transfers", title: "5. International transfers", paras: ["Some providers are based in the United States or may access data from there. Where personal data is transferred outside the EU/EEA, we rely on an adequacy decision (such as the EU–US Data Privacy Framework for certified providers) or the European Commission’s Standard Contractual Clauses."] },
    { id: "retention", title: "6. How long we keep it", list: [
      "Applications that are not accepted: 12 months after the decision (so we can recognise a re-application), then deleted.",
      "Customers: for as long as we provide the service, then for the periods required by Latvian accounting and tax law for payment and invoice records; other assessment data for up to 3 years after the service ends, for follow-up questions and legal claims.",
      "Injury information: deleted when the assessment is completed or when you withdraw consent, whichever is earlier.",
      "Marketing and optional consents: until you withdraw them.",
    ] },
    { id: "minors", title: "7. Players under 18", paras: ["We offer assessments from age 16. For players under 18, the parent or legal guardian applies with the player, consents, is the contracting party and payer, and receives our communications. We collect only what is needed for the football assessment. See How we work with minors."] },
    { id: "rights", title: "8. Your rights", paras: ["You can ask for access to your data, correction, deletion, restriction, portability, and object to processing based on legitimate interests; you can withdraw consent at any time (without affecting earlier processing). Email us to exercise your rights. You may also complain to the Latvian Data State Inspectorate (Datu valsts inspekcija, www.dvi.gov.lv) or the authority where you live."] },
    { id: "automated", title: "9. No automated decisions", paras: ["Every application decision, materials-sufficiency decision and assessment is made by people. A rules-based hint may help our reviewers sort applications, but it never decides."] },
    { id: "security", title: "10. Security", paras: ["Data is encrypted in transit, access to our admin is password-protected and limited to the team, and links to your status page are individually signed. Please keep your personal links private."] },
  ],
};

const cookies: LegalDoc = {
  slug: "cookies", title: "Cookie & Storage Policy", updated: LEGAL_UPDATED,
  summary: "Exactly what this website stores on your device — and what it doesn’t.",
  sections: [
    { id: "summary", title: "1. In short", paras: ["We do not use analytics, advertising or social-media tracking cookies. We store only what the site needs to work, plus one optional item you can accept or reject."] },
    { id: "necessary", title: "2. Strictly necessary (no consent needed)", list: [
      "cs_consent_v1 (local storage) — remembers your cookie choice.",
      "cs_application_draft (session storage) — keeps your application answers while you fill in the form in this browser tab; cleared when you submit or close the tab.",
      "cs_admin (cookie) — signs Concordia staff into the admin area; never set for visitors.",
      "Stripe — when you pay, Stripe’s checkout page (on stripe.com) sets cookies needed for secure payment and fraud prevention, under Stripe’s own policy.",
    ] },
    { id: "optional", title: "3. Optional (only if you accept)", list: ["cs_attribution_v1 (local storage) — remembers which campaign or referral brought you to the site, across visits, so we know which channels work. No personal data. If you reject it, campaign details are kept only for the current visit and are not stored on your device."] },
    { id: "manage", title: "4. Changing your choice", paras: ["The banner offers Accept, Reject and Manage (choose each optional category). Change your choice at any time with “Cookie settings” in the website footer. Rejecting is as easy as accepting, and rejecting never limits your access to the site."] },
  ],
};

const minors: LegalDoc = {
  slug: "minors", title: "How we work with minors", updated: LEGAL_UPDATED, pending: ["minimumAge"],
  summary: "Our safeguards for players under 18 and the role of parents and guardians.",
  sections: [
    { id: "age", title: "1. Minimum age", paras: ["We offer Pathway Assessments to players aged 16 and over. At younger ages, development, minutes and enjoyment matter most."] },
    { id: "guardian", title: "2. Parents and legal guardians", list: ["For players aged 16–17, a parent or legal guardian applies with the player and confirms consent.", "The parent or guardian is the contracting party for any paid service and makes the payment.", "We copy the parent or guardian on our emails and welcome them on every call.", "We don’t ask a minor to make commitments or decisions without their parent or guardian."] },
    { id: "data", title: "3. Data", paras: ["We collect only what is needed for the football assessment. Injury information is optional and needs explicit consent, given by the parent or guardian for a minor. See the Privacy Policy."] },
    { id: "fifa", title: "4. FIFA rules on minors", paras: [`International transfers of players under 18 are prohibited by FIFA’s Regulations on the Status and Transfer of Players except in limited cases. We explain what this means for the player before discussing any move abroad. ${LICENCE.holder} is a FIFA Licensed Football Agent authorised to represent minors; football-agent representation of a minor would only ever be under a separate written agreement signed by the legal guardian(s), in line with the FIFA Football Agent Regulations — and is never part of the Pathway services.`] },
    { id: "concerns", title: "5. Raising a concern", paras: [`If you have a safeguarding concern about how anyone connected with our services treats a young player, email ${contact} (subject “Safeguarding”). We take every concern seriously and, where appropriate, refer it to the relevant authorities.`] },
  ],
};

const complaints: LegalDoc = {
  slug: "complaints", title: "Complaints", updated: LEGAL_UPDATED,
  summary: "How to raise a complaint and what happens next.",
  sections: [
    { id: "how", title: "1. How to complain", paras: [`Email ${contact} with your application reference and what went wrong. We acknowledge complaints promptly and aim to give a full answer within 14 days; if we need longer, we will tell you why.`] },
    { id: "escalation", title: "2. If you’re not satisfied", paras: ["Consumers may contact the Latvian Consumer Rights Protection Centre (Patērētāju tiesību aizsardzības centrs, PTAC) or use the Consumer Dispute Resolution Commission in Latvia, or the consumer authority in their own country. You can always go to court."] },
  ],
};

const company: LegalDoc = {
  slug: "company", title: "Company information", updated: LEGAL_UPDATED,
  summary: "Who provides the services on this website.",
  sections: [
    { id: "provider", title: "Service provider", list: [`${E.name}`, `Registration No. ${E.registrationNo} (Register of Enterprises of the Republic of Latvia)`, `VAT No. ${E.vatNo}`, `Registered address: ${E.address.join(", ")}`, `Email: ${contact}`, "Website: https://concordia.football/"] },
    { id: "brand", title: "Brand", paras: [E.note, "Concordia Soccer · European Pathway is a project of Concordia Sports Agency."] },
    { id: "licence", title: "FIFA licence", paras: [`${LICENCE.holder} holds FIFA football agent licence No. ${LICENCE.number} personally. No FIFA endorsement of Concordia Soccer, Concordia Sports Agency or these services is stated or implied.`] },
  ],
};

export const LEGAL_DOCS: LegalDoc[] = [terms, assessment, pathway, refunds, privacy, cookies, minors, complaints, company];
export const legalDoc = (slug: string) => LEGAL_DOCS.find((d) => d.slug === slug);
