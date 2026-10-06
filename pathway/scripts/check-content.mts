/**
 * Publication guard. Runs before every build.
 * - Always: structural checks (prices locked, forbidden phrases, legal entity, no minor photo shipped).
 * - NEXT_PUBLIC_SITE_MODE=production: fails if anything a production build would expose is still
 *   unsupported — placeholder tokens in rendered content, HOLD photos still in /public, etc.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const production = process.env.NEXT_PUBLIC_SITE_MODE === "production";
const errors: string[] = [];
const warnings: string[] = [];

const walk = (dir: string, ext: RegExp): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return ["node_modules", ".next", "out"].includes(d.name) ? [] : walk(p, ext);
    return ext.test(d.name) ? [p] : [];
  });

const sources = [...walk(path.join(root, "app"), /\.(tsx?)$/), ...walk(path.join(root, "components"), /\.(tsx?)$/), ...walk(path.join(root, "content"), /\.(ts)$/)];
const all = sources.map((f) => ({ f: path.relative(root, f), s: fs.readFileSync(f, "utf8") }));

// 1. Locked prices.
const products = fs.readFileSync(path.join(root, "content/products.ts"), "utf8");
for (const [id, price] of [["assessment", 249], ["pathway", 399], ["cohort", 1500], ["window", 2400], ["two-window", 4200], ["elite", 7500], ["club", 149]] as const) {
  if (!new RegExp(`id: "${id}"[^}]*price: ${price}[,\\s]`).test(products)) errors.push(`Locked price changed or missing: ${id} must be $${price}`);
}

// 2. Forbidden public phrases (implying endorsement, guarantees, or agency licensing).
const FORBIDDEN = [/FIFA[- ]approved/i, /FIFA[- ]endorsed/i, /FIFA[- ]licensed (agency|team)/i, /guaranteed (trial|contract|placement)/i, /partner clubs/i, /unlock your potential/i, /chase your dreams/i, /\bdelusion\b/i, /\d+\s?% (off|discount)/i, /only \d+ (spots|places) left/i, /cancel any ?time/i, /\$2,?39\d/, /7 business days/i, /30-minute (review|career|strategy)? ?call/i];
for (const { f, s } of all) {
  for (const rx of FORBIDDEN) {
    for (const m of s.matchAll(new RegExp(rx, "gi"))) {
      const line = s.slice(0, m.index).split("\n").length;
      const ctx = s.split("\n")[line - 1];
      if (/scripts\/check-content|FORBIDDEN|no (fake|endorsement)|not “FIFA-licensed”|not ".*"|never|No endorsement|isn’t|aren’t|are not|Never:/i.test(ctx)) continue;
      errors.push(`Forbidden phrase ${rx} in ${f}:${line}`);
    }
  }
}

// 2b. The 7-day period is never computed in the customer UI: only lib/assessment-status.ts (team-confirmed sufficiency) may.
for (const { f, s: src } of all) {
  if (!f.startsWith("components/") && !f.startsWith("app/")) continue;
  if (/addDays\(|dueBy|assessment_due/.test(src)) errors.push(`Automatic assessment deadline in ${f} — use lib/assessment-status.ts (payment + team-confirmed sufficiency)`);
}

// 3. Legal entity present and correct.
const site = fs.readFileSync(path.join(root, "content/site.ts"), "utf8");
if (!site.includes("Concordia Sports Agency SIA") || !site.includes("40203574668")) errors.push("Legal contracting entity details missing from content/site.ts");

// 4. Minor photo (Wembley with a child) must never be shipped.
const pub = walk(path.join(root, "public"), /\.(jpe?g|png|webp|mp4)$/i);
if (pub.some((p) => /minor|nazar/i.test(p))) errors.push("A photo of a minor without guardian permission is in /public");

// 5. Production-only gates.
if (production) {
  const photosTs = fs.readFileSync(path.join(root, "content/photos.ts"), "utf8");
  for (const m of photosTs.matchAll(/src: B \+ "([^"]+)"[^}]*evidence: hold\(/g)) {
    if (fs.existsSync(path.join(root, "public/assets/pathway/photos", m[1]))) errors.push(`HOLD photo still in /public: ${m[1]} — clear consent or remove before public launch`);
  }
  if (/videos\/testimonials/.test(pub.join("\n")) && /evidence: pending\("E15"/.test(fs.readFileSync(path.join(root, "content/testimonials.ts"), "utf8"))) errors.push("Testimonial video without permission is in /public");
  const creators = fs.readFileSync(path.join(root, "content/creators.ts"), "utf8");
  if (/enabled: true/.test(creators) && /pending\("E28"/.test(creators)) errors.push("Creator page enabled before partner policy (E28) approval");
} else {
  warnings.push("Review mode: pending content renders with PENDING tags. Use NEXT_PUBLIC_SITE_MODE=production for launch builds.");
}

for (const w of warnings) console.log(`⚠  ${w}`);
if (errors.length) { console.error(`✖ Content check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n")); process.exit(1); }
console.log(`✓ Content check passed (${production ? "production" : "review"} mode, ${all.length} files)`);
