/**
 * Terms — Pathway Assessment (Round 3). Draft wording for legal review (E35): reflects the exact
 * commercial flow and never promises more than the service provides.
 */
import { ACCEPTED_MEANING, ASSESSMENT_INCLUDES, DELIVERY, CALL_COVERS } from "./assessment";

export interface TermsClause { id: string; title: string; paras: string[]; list?: string[] }

export const ASSESSMENT_TERMS: TermsClause[] = [
  { id: "application", title: "Application", paras: [
    "You may apply for a Pathway Assessment free of charge. Submitting an application does not oblige you to buy anything and does not oblige us to offer you an assessment.",
    "We use the information in your application to decide whether we are prepared to offer you a Pathway Assessment. Where the player is under 18, a parent or legal guardian applies, pays and is included in communications.",
  ] },
  { id: "acceptance", title: "Acceptance for a Pathway Assessment", paras: [
    "After reviewing your application we will tell you that you are either (a) accepted for a Pathway Assessment, or (b) not accepted at this stage.",
    ACCEPTED_MEANING,
    "Acceptance for a Pathway Assessment does not mean that:",
  ], list: [
    "Concordia Sports Agency, Concordia Soccer or any person has agreed to represent the player;",
    "the player has signed, or will sign, with Concordia Sports Agency;",
    "any club has accepted, assessed or shown interest in the player;",
    "a trial, contract, transfer or any other opportunity is offered or guaranteed.",
  ] },
  { id: "payment", title: "Payment", paras: [
    "The Pathway Assessment costs USD 249, paid once, online. Payment can only be made after acceptance for a Pathway Assessment. Applicable taxes are shown at payment.",
    "Payment buys the Pathway Assessment described below and nothing else. It does not create an ongoing subscription, a representation relationship or any right to further services.",
  ] },
  { id: "materials", title: "Onboarding and materials", paras: [
    "Immediately after payment we ask you to provide the information and materials needed for the assessment — for example your football CV and history, Transfermarkt profile (if available), match footage and highlight video, contract and eligibility details, and your current representation status.",
    "Video should be shared as links (for example YouTube, Vimeo or Google Drive). You confirm that you are entitled to share the materials you send and that the information you provide is accurate to the best of your knowledge.",
  ] },
  { id: "assessment", title: "The Pathway Assessment", paras: [
    "The Pathway Assessment includes:",
  ], list: ASSESSMENT_INCLUDES },
  { id: "timing", title: "When the assessment is delivered", paras: [
    DELIVERY,
    "The 7-day period starts only once both conditions are met: payment has been received, and we have received the information and materials reasonably required to conduct the assessment. If essential information or footage is missing, we will tell you what we need; the period starts when it arrives.",
  ] },
  { id: "call", title: "The 60-minute consultation call", paras: [
    "The assessment includes one consultation call of up to 60 minutes, scheduled after the assessment is ready. During the call we may explain:",
  ], list: CALL_COVERS },
  { id: "advisory", title: "Advisory nature — no guaranteed outcomes", paras: [
    "The Pathway Assessment and the call are advisory and assessment-based. They reflect our professional view on the information available to us. We do not promise or guarantee a club, a trial, representation, an offer, a contract or a transfer, and we do not contact clubs on the player’s behalf as part of the Pathway Assessment.",
  ] },
  { id: "after", title: "After the assessment", paras: [
    "After the assessment there may be an opportunity to continue working together — for example through European Pathway — subject to that product’s own terms. Any further service requires a separate decision and, where applicable, separate payment.",
  ] },
  { id: "representation", title: "Football-agent representation", paras: [
    "The Pathway Assessment is not football-agent representation and is not a Football Agent Service within the meaning of the FIFA Football Agent Regulations.",
    "No representation relationship is created merely by submitting an application, being accepted for a Pathway Assessment, paying for the assessment, or taking part in the assessment call.",
    "Any representation by Concordia Sports Agency can arise only under a separate written representation agreement, where applicable, that complies with the FIFA Football Agent Regulations and applicable law. Paying for any Pathway service does not increase a player’s right, entitlement or chance to be represented.",
  ] },
];
