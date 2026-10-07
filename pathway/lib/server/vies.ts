/** EU VAT number validation via the European Commission VIES REST service (Implementing Regulation 282/2011, Art. 18). */
export async function checkVies(vatId: string): Promise<{ checked: boolean; valid: boolean; name?: string }> {
  const countryCode = vatId.slice(0, 2) === "GR" ? "EL" : vatId.slice(0, 2), vatNumber = vatId.slice(2);
  try {
    const ctl = AbortSignal.timeout(6000);
    const r = await fetch("https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ countryCode, vatNumber }), signal: ctl });
    if (!r.ok) return { checked: false, valid: false };
    const j = (await r.json()) as { valid?: boolean; name?: string };
    return { checked: true, valid: Boolean(j.valid), name: j.name && j.name !== "---" ? j.name : undefined };
  } catch { return { checked: false, valid: false }; }
}
