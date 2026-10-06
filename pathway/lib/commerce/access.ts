import type { AccessRule } from "./types";

export const accessCopy: Record<AccessRule, { label: string; explain: string }> = {
  public: { label: "Available", explain: "" },
  application_required: { label: "After a free application", explain: "Apply free. Only if you’re accepted for a Pathway Assessment do you pay — online, $249." },
  assessment_required: { label: "Assessment first", explain: "European Pathway is offered after your assessment, when it makes sense for you." },
  invitation_only: { label: "By invitation", explain: "Offered by our team when it fits your situation." },
};
