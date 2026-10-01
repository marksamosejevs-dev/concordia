import { pending, type Evidence } from "@/lib/evidence";

export interface FaqItem { q: string; a: string; category: "assessment" | "programmes" | "representation" | "parents" | "practical"; home?: boolean; evidence?: Evidence }

export const faq: FaqItem[] = [
  { q: "Do you guarantee a trial or contract?", a: "No. Nobody honest can. We assess, advise and plan. We don’t arrange trials or contact clubs as part of European Pathway.", category: "assessment", home: true },
  { q: "Will you contact clubs for me?", a: "Not as part of European Pathway. Club contact on a player’s behalf happens only under formal representation by Concordia Sports Agency, which is separate and selective.", category: "representation", home: true },
  { q: "What if you tell me I’m not ready?", a: "Then you’ll know why, what to work on, and what a realistic next step looks like. That answer is part of what you pay for.", category: "assessment", home: true },
  { q: "Does a more expensive programme make representation more likely?", a: "No. Representation can’t be bought, and no programme changes a player’s right, entitlement or chance of being represented.", category: "representation", home: true },
  { q: "My child is under 18. How does this work?", a: "A parent or guardian applies, pays and is welcome on every call. Under-16s receive guidance only — no assessment is sold.", category: "parents", home: true },
  { q: "Who reviews my match?", a: "A qualified member of our team analyses your full match, and every assessment follows Concordia’s professional assessment framework and receives senior review.", category: "assessment", home: true, evidence: pending("E13", "Final sign-off wording") },
  { q: "Is the application really free?", a: "Yes. We review every application before accepting payment. If an assessment is right for you, you’ll be invited to pay $249 online.", category: "assessment" },
  { q: "What does “accepted” mean?", a: "Accepted for a Pathway Assessment — nothing more. It is not acceptance for representation, by the Agency or by any club.", category: "assessment" },
  { q: "What footage do I need?", a: "At least one full, unedited match. Highlights help, but they can’t replace a full match.", category: "assessment" },
  { q: "Can I play in Europe without an EU passport?", a: "Sometimes — it depends on the country and the division. Your assessment explains what your passport(s) mean for the markets that fit your profile.", category: "assessment" },
  { q: "I’m still in college. Does this affect my eligibility?", a: "The assessment is career advisory and involves no agency agreement. Check with your compliance office if you have eligibility questions.", category: "practical", evidence: pending("E35", "Wording to be confirmed with US counsel") },
  { q: "What happens after the assessment?", a: "You read the report and take the call. If a programme makes sense we’ll explain which one and why — and if none does, we’ll say so. $150 of the assessment is credited toward a programme booked within 14 days.", category: "programmes" },
  { q: "Is legal review included?", a: "European Pathway is career advisory and doesn’t create a lawyer–client relationship. Formal legal services are engaged and billed separately. Elite includes two prepaid legal credits, provided separately.", category: "programmes", evidence: pending("E9") },
  { q: "What’s the refund policy?", a: "Assessment: full refund until the review of your match begins. Programmes: refund terms are set out in the Refund Policy.", category: "practical", evidence: pending("E24", "Approved refund policy text") },
  { q: "Who am I contracting with?", a: "Concordia Soccer · European Pathway services are provided by Concordia Sports Agency SIA (Reg. No. 40203574668), Rīga, Latvia. Buying a Pathway service does not create a football-agent representation agreement.", category: "practical" },
];
