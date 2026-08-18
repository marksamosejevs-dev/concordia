// Converts a monetary amount into words, for the "amount in words" line seen
// on the reference invoice. Best-effort — double-check unusual amounts.

type Gender = "m" | "f";

const ONES_M = ["nulle", "viens", "divi", "trīs", "četri", "pieci", "seši", "septiņi", "astoņi", "deviņi"];
const ONES_F = ["nulle", "viena", "divas", "trīs", "četri", "pieci", "seši", "septiņi", "astoņi", "deviņi"];
const TEENS = [
  "desmit",
  "vienpadsmit",
  "divpadsmit",
  "trīspadsmit",
  "četrpadsmit",
  "piecpadsmit",
  "sešpadsmit",
  "septiņpadsmit",
  "astoņpadsmit",
  "deviņpadsmit",
];
const TENS = ["", "", "divdesmit", "trīsdesmit", "četrdesmit", "piecdesmit", "sešdesmit", "septiņdesmit", "astoņdesmit", "deviņdesmit"];

function onesWordLv(d: number, gender: Gender): string {
  return gender === "f" ? ONES_F[d] : ONES_M[d];
}

/** 0-999, gender only affects the trailing ones digit (1 or 2). */
function group3Lv(n: number, gender: Gender): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds === 1) parts.push("simts");
  else if (hundreds > 1) parts.push(`${ONES_M[hundreds]} simti`);

  if (rest >= 11 && rest <= 19) {
    parts.push(TEENS[rest - 10]);
  } else if (rest >= 20) {
    const t = Math.floor(rest / 10);
    const o = rest % 10;
    parts.push(o === 0 ? TENS[t] : `${TENS[t]} ${onesWordLv(o, gender)}`);
  } else if (rest === 10) {
    parts.push("desmit");
  } else if (rest > 0) {
    parts.push(onesWordLv(rest, gender));
  }
  return parts.join(" ");
}

function scaleWordLv(groupValue: number, singular: string, plural: string): string {
  const isSingular = groupValue % 100 !== 11 && groupValue % 10 === 1;
  return isSingular ? singular : plural;
}

/** Integer part (>= 0) to Latvian words. `gender` applies to the trailing units group only. */
export function integerToWordsLv(n: number, gender: Gender): string {
  if (n === 0) return "nulle";
  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n / 1_000_000) % 1000);
  const thousands = Math.floor((n / 1000) % 1000);
  const units = n % 1000;

  const segments: string[] = [];
  if (billions > 0) {
    segments.push(group3Lv(billions, "m"));
    segments.push(scaleWordLv(billions, "miljards", "miljardi"));
  }
  if (millions > 0) {
    segments.push(group3Lv(millions, "m"));
    segments.push(scaleWordLv(millions, "miljons", "miljoni"));
  }
  if (thousands > 0) {
    segments.push(group3Lv(thousands, "m"));
    segments.push(scaleWordLv(thousands, "tūkstotis", "tūkstoši"));
  }
  if (units > 0 || segments.length === 0) {
    segments.push(group3Lv(units, gender));
  }
  return segments.join(" ");
}

const ONES_EN = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS_EN = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS_EN = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function group3En(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds > 0) parts.push(`${ONES_EN[hundreds]} hundred`);
  if (rest >= 10 && rest <= 19) {
    parts.push(TEENS_EN[rest - 10]);
  } else if (rest >= 20) {
    const t = Math.floor(rest / 10);
    const o = rest % 10;
    parts.push(o === 0 ? TENS_EN[t] : `${TENS_EN[t]}-${ONES_EN[o]}`);
  } else if (rest > 0) {
    parts.push(ONES_EN[rest]);
  }
  return parts.join(" ");
}

export function integerToWordsEn(n: number): string {
  if (n === 0) return "zero";
  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n / 1_000_000) % 1000);
  const thousands = Math.floor((n / 1000) % 1000);
  const units = n % 1000;

  const segments: string[] = [];
  if (billions > 0) segments.push(`${group3En(billions)} billion`);
  if (millions > 0) segments.push(`${group3En(millions)} million`);
  if (thousands > 0) segments.push(`${group3En(thousands)} thousand`);
  if (units > 0 || segments.length === 0) segments.push(group3En(units));
  return segments.join(" ");
}

interface CurrencyWords {
  major: { singular: string; plural: string; genitivePlural: string; gender: Gender; invariant?: boolean };
  minor: { singular: string; plural: string; genitivePlural: string };
}

const CURRENCY_WORDS_LV: Record<string, CurrencyWords> = {
  EUR: {
    major: { singular: "eiro", plural: "eiro", genitivePlural: "eiro", gender: "m", invariant: true },
    minor: { singular: "cents", plural: "centi", genitivePlural: "centu" },
  },
  USD: {
    major: { singular: "dolārs", plural: "dolāri", genitivePlural: "dolāru", gender: "m" },
    minor: { singular: "cents", plural: "centi", genitivePlural: "centu" },
  },
  GBP: {
    major: { singular: "mārciņa", plural: "mārciņas", genitivePlural: "mārciņu", gender: "f" },
    minor: { singular: "penss", plural: "pensi", genitivePlural: "pensu" },
  },
};

/** Latvian counting rule: zero takes the genitive plural noun form ("nulle centu"), not nominative plural. */
function pickFormLv(count: number, singular: string, plural: string, genitivePlural: string): string {
  if (count === 0) return genitivePlural;
  return count % 100 !== 11 && count % 10 === 1 ? singular : plural;
}

const CURRENCY_WORDS_EN: Record<string, { major: string; majorPlural: string; minor: string; minorPlural: string }> = {
  EUR: { major: "euro", majorPlural: "euro", minor: "cent", minorPlural: "cents" },
  USD: { major: "dollar", majorPlural: "dollars", minor: "cent", minorPlural: "cents" },
  GBP: { major: "pound", majorPlural: "pounds", minor: "pence", minorPlural: "pence" },
};

function splitAmount(amount: number): { major: number; minor: number } {
  const rounded = Math.round((amount + Number.EPSILON) * 100);
  return { major: Math.floor(rounded / 100), minor: rounded % 100 };
}

export function amountToWordsLv(amount: number, currency: string): string {
  const { major, minor } = splitAmount(Math.max(0, amount));
  const words = CURRENCY_WORDS_LV[currency];
  if (!words) return `${amount.toFixed(2)} ${currency}`;

  const majorWord = words.major.invariant
    ? words.major.singular
    : pickFormLv(major, words.major.singular, words.major.plural, words.major.genitivePlural);
  const minorWord = pickFormLv(minor, words.minor.singular, words.minor.plural, words.minor.genitivePlural);

  const majorText = `${capitalize(integerToWordsLv(major, words.major.gender))} ${majorWord}`;
  const minorText = `${integerToWordsLv(minor, "m")} ${minorWord}`;
  return `${majorText} un ${minorText}`;
}

export function amountToWordsEn(amount: number, currency: string): string {
  const { major, minor } = splitAmount(Math.max(0, amount));
  const words = CURRENCY_WORDS_EN[currency];
  if (!words) return `${amount.toFixed(2)} ${currency}`;

  const majorWord = major === 1 ? words.major : words.majorPlural;
  const minorWord = minor === 1 ? words.minor : words.minorPlural;

  const majorText = `${capitalize(integerToWordsEn(major))} ${majorWord}`;
  const minorText = `${integerToWordsEn(minor)} ${minorWord}`;
  return `${majorText} and ${minorText}`;
}

export function amountToWords(amount: number, currency: string, language: "lv" | "en"): string {
  return language === "lv" ? amountToWordsLv(amount, currency) : amountToWordsEn(amount, currency);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
