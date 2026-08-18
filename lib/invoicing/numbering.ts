import type { NumberingConfig } from "./types";

export function formatInvoiceNumber(
  config: NumberingConfig,
  seq: number,
  date: Date,
): string {
  const year = String(date.getFullYear());
  const yy = year.slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const seqStr = String(seq).padStart(config.sequenceDigits, "0");
  return config.pattern
    .replace(/{PREFIX}/g, config.prefix)
    .replace(/{YEAR}/g, year)
    .replace(/{YY}/g, yy)
    .replace(/{MONTH}/g, month)
    .replace(/{SEQ}/g, seqStr);
}

export function counterKey(config: NumberingConfig, date: Date): string {
  return config.resetPerYear ? String(date.getFullYear()) : "all";
}

/** Preview-only: what the next auto-generated number would look like, without allocating it. */
export function previewNextNumber(
  config: NumberingConfig,
  counters: Record<string, number>,
  date: Date,
): string {
  const key = counterKey(config, date);
  const nextSeq = (counters[key] ?? 0) + 1;
  return formatInvoiceNumber(config, nextSeq, date);
}

/**
 * Finds the lowest free sequence number starting after the stored counter,
 * skipping any candidate already taken (per `isTaken`). Used both to preview
 * the next number and to actually allocate one on save.
 */
export function findNextFreeNumber(
  config: NumberingConfig,
  counters: Record<string, number>,
  date: Date,
  isTaken: (candidate: string) => boolean,
): { number: string; seq: number } {
  const key = counterKey(config, date);
  let seq = (counters[key] ?? 0) + 1;
  let candidate = formatInvoiceNumber(config, seq, date);
  while (isTaken(candidate)) {
    seq += 1;
    candidate = formatInvoiceNumber(config, seq, date);
  }
  return { number: candidate, seq };
}

/**
 * Reverses the configured pattern against a candidate invoice number to
 * recover its sequence value, so the counter can "catch up" to numbers that
 * were entered manually (or accepted as-is from the suggestion) without ever
 * going through the counter increment path.
 */
export function parseSequence(config: NumberingConfig, candidate: string, date: Date): number | null {
  const year = String(date.getFullYear());
  const yy = year.slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const withoutSeq = config.pattern
    .replace(/{PREFIX}/g, config.prefix)
    .replace(/{YEAR}/g, year)
    .replace(/{YY}/g, yy)
    .replace(/{MONTH}/g, month);
  const idx = withoutSeq.indexOf("{SEQ}");
  if (idx === -1) return null;
  const before = withoutSeq.slice(0, idx);
  const after = withoutSeq.slice(idx + "{SEQ}".length);
  if (!candidate.startsWith(before) || !candidate.endsWith(after)) return null;
  const middle = candidate.slice(before.length, candidate.length - after.length);
  if (!/^\d+$/.test(middle)) return null;
  return parseInt(middle, 10);
}
