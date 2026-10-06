/**
 * Terms — Pathway Assessment (Round 3). Draft wording for legal review (E35): reflects the exact
 * commercial flow and never promises more than the service provides.
 */
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, DELIVERY_FULL, CALL_COVERS } from "./assessment";

export interface TermsClause { id: string; title: string; paras: string[]; list?: string[] }

export const ASSESSMENT_TERMS: TermsClause[] = [
  { id: "application", title: "Application", paras: [
    "You may apply for a Pathway Assessment free of charge. Players in women’s and men’s football can apply. Submitting an application does not oblige you to buy anything and does not oblige us to offer you an assessment.",
    "Where the player is under 18, a parent or legal guardian applies, pays and is included in communications.",
  ] },
  { id: "review", title: "Application review", paras: [
    "We review the information in your application to decide whether we are prepared to offer you a Pathway Assessment. The outcome is either (a) accepted for a Pathway Assessment, or (b) not accepted at this stage. We tell you the outcome by email.",
  ] },
  { id: "acceptance", title: "Acceptance for a Pathway Assessment", paras: [
    ACCEPTED_MEANING,
    "Acceptance for a Pathway Assessment does not mean that:",
  ], list: [
    "Concordia Sports Agency, Concordia Soccer or any person has agreed to represent the player;",
    "the player has signed, or will sign, with Concordia Sports Agency;",
    "a club has accepted the player or shown interest in the player;",
    "a trial has been arranged;",
    "a contract or a transfer is available;",
    "any football opportunity is guaranteed.",
  ] },
  { id: "payment", title: "Payment of USD 249", paras: [
    "The Pathway Assessment costs USD 249, paid once, online. Only a player accepted for a Pathway Assessment can pay. Applicable taxes are shown at payment.",
    "Payment buys the Pathway Assessment described in these terms and nothing else. It does not create a subscription, a representation relationship or any right to further services. A failed or incomplete payment does not start onboarding or the assessment.",
  ] },
  { id: "onboarding", title: "Onboarding", paras: [
    "Immediately after your payment is confirmed, we send you an onboarding request asking for your football profile and materials.",
  ] },
  { id: "materials", title: "Submission of materials", paras: [
    "We ask for information such as your football CV and playing history, current club and contract status, positions, eligibility, Transfermarkt profile (if available), match footage and highlight video (if available), current representation status and objectives. Video should be shared as links.",
    "Some items may not exist — for example no Transfermarkt profile, no highlight video or no current club. Telling us that an item is not available is not, in itself, a reason we cannot proceed.",
    "You confirm that you are entitled to share the materials you send and that the information you provide is accurate to the best of your knowledge.",
  ] },
  { id: "sufficiency", title: "Materials review", paras: [
    "After you submit your materials, our team reviews whether we have received the information and materials reasonably required to conduct your Pathway Assessment. This is a professional judgement made for each player; no single item is decisive on its own.",
    "If additional information or materials are reasonably required, we will tell you what is missing.",
  ] },
  { id: "start", title: "Assessment start", paras: [
    "The assessment starts on the date we confirm that your materials are sufficient, provided your payment has been received. We confirm the start date to you by email.",
  ] },
  { id: "period", title: "The 7-day assessment period", paras: [
    DELIVERY_FULL,
    "The 7-day period does not begin merely because the onboarding form has been submitted or because particular items (such as video) have been provided.",
  ] },
  { id: "delivery", title: "Assessment delivery", paras: ["The Pathway Assessment includes:"], list: ASSESSMENT_INCLUDES },
  { id: "call", title: "The 60-minute consultation", paras: [
    "The assessment includes one consultation call of up to 60 minutes, scheduled once the assessment is ready. During the call we may discuss:",
  ], list: CALL_COVERS },
  { id: "advisory", title: "Advisory nature — no guaranteed outcomes", paras: [
    "The Pathway Assessment and the consultation call are advisory and assessment-based. They reflect our professional view on the information available to us. We do not promise or guarantee representation, a club, a trial, an offer, a contract, a transfer or any placement, and we do not contact clubs on the player’s behalf as part of the Pathway Assessment.",
  ] },
  { id: "pathway", title: "Possible continuation: European Pathway", paras: [
    "After the assessment you may be offered the opportunity to continue with European Pathway, an advisory career-management service at USD 399 per month, designed as a 6-month pathway and paid monthly. European Pathway is provided under its own terms. Cancellation options are available; subscription terms apply.",
  ] },
  { id: "representation", title: "Possible separate football-agent representation", paras: [
    "The Pathway Assessment and European Pathway are not football-agent representation and are not Football Agent Services within the meaning of the FIFA Football Agent Regulations.",
    "No representation relationship is created merely by submitting an application, being accepted for a Pathway Assessment, paying USD 249, submitting materials, receiving the assessment, taking part in the consultation call, or subscribing to an advisory product such as European Pathway.",
    "Any representation by Concordia Sports Agency can arise only under a separate written representation agreement, where applicable, that complies with the FIFA Football Agent Regulations and applicable law. Paying for any Pathway service does not increase a player’s right, entitlement or chance to be represented.",
  ] },
];
