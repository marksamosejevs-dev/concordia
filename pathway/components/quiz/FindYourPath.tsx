"use client";
import Link from "next/link";
import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Find Your Path — a routing and education tool, never a verdict.
 * It identifies what information is missing and routes to the right next step.
 */
type Q = { id: string; q: string; help?: string; options: string[]; multi?: boolean; skipIf?: (a: Record<string, string[]>) => boolean };
const QUESTIONS: Q[] = [
  { id: "age", q: "How old are you?", options: ["Under 16", "16–17", "18–21", "22–25", "26+"] },
  { id: "who", q: "Who is answering?", options: ["The player", "A parent or guardian"] },
  { id: "level", q: "Where are you playing now?", options: ["College", "Academy", "Semi-pro", "Professional", "Amateur", "Not currently playing"] },
  { id: "division", q: "Which college level?", options: ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "Other"], skipIf: (a) => a.level?.[0] !== "College" },
  { id: "position", q: "What’s your position?", options: ["Goalkeeper", "Centre-back", "Full-back", "Midfield", "Winger", "Forward"] },
  { id: "country", q: "Where are you based?", options: ["United States", "Canada", "UK / Ireland", "Europe", "Elsewhere"] },
  { id: "eu", q: "Do you hold an EU/EEA passport — or might you be eligible through ancestry?", options: ["Yes, I hold one", "Possibly, through ancestry", "No", "Not sure"] },
  { id: "footage", q: "Do you have full-match footage?", help: "A full, unedited match — not just highlights.", options: ["Yes", "Highlights only", "No"] },
  { id: "contract", q: "What’s your contract situation?", options: ["No contract", "Under contract", "Contract ending soon", "Not applicable"] },
  { id: "goal", q: "What are you trying to decide?", options: ["First professional contract", "A better level", "Europe specifically", "Europe or college", "Not sure yet"] },
];

type Route = { key: string; title: string; body: string; checklist?: string[]; cta: { href: string; label: string }; secondary?: { href: string; label: string } };

function route(a: Record<string, string[]>): Route {
  const age = a.age?.[0];
  if (age === "Under 16") return { key: "E", title: "It’s early — and that’s a good thing.", body: "At this age, the most valuable things are development, minutes and enjoyment. We don’t sell assessments to under-16s. Here’s what matters most right now.", checklist: ["Play as many competitive minutes as you can", "Ask coaches for honest feedback on two things to improve", "Start filming full matches — they’ll matter later"], cta: { href: "/for/parents", label: "Read the parents’ guide" } };
  const minor = age === "16–17";
  const noFootage = a.footage?.[0] !== "Yes";
  const passportMaybe = ["Possibly, through ancestry", "Not sure"].includes(a.eu?.[0] ?? "");
  if (minor) return { key: "C", title: "This is a decision to make with your parent or guardian.", body: "For players under 18, a parent or guardian applies, pays and joins every call. International moves for minors are tightly restricted — an honest assessment starts by explaining the rules.", checklist: noFootage ? ["Get a full match on video first — it’s required"] : undefined, cta: { href: "/apply", label: "Apply as a parent or guardian" }, secondary: { href: "/for/parents", label: "Read the parents’ guide" } };
  if (noFootage) return { key: "B", title: "Get a full match first.", body: "Without a full match, nobody can place you in a level range honestly — not us, and not clubs. Here’s how to get usable footage. Then apply.", checklist: ["Any full 90 minutes, unedited", "A wide angle from the stand is better than nothing", "Add your highlights too — they help, they just can’t replace a match"], cta: { href: "/apply", label: "Start your application" }, secondary: { href: "/assessment", label: "See what an assessment includes" } };
  if (passportMaybe) return { key: "D", title: "Your passport question could change the map.", body: "Passport eligibility can significantly change which markets are open to you. Confirm it with a citizenship lawyer — and let the assessment show what it would mean for your options.", cta: { href: "/apply", label: "Apply for your assessment" }, secondary: { href: "/markets", label: "Explore the markets" } };
  return { key: "A", title: "Your next step is a Player Pathway Assessment.", body: "You have what an assessment needs: a full match and a clear question. It will give you a realistic level range, three market directions and a 90-day plan — and tell you honestly if the answer is “not yet”.", cta: { href: "/apply", label: "Apply for your assessment" }, secondary: { href: "/assessment", label: "See what you receive" } };
}

export function FindYourPath() {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const visible = QUESTIONS.filter((q) => !q.skipIf?.(answers));
  const q = visible[i];

  const choose = (opt: string) => {
    const next = { ...answers, [q.id]: [opt] };
    setAnswers(next);
    if (i === 0) track("quiz_start");
    const nextVisible = QUESTIONS.filter((x) => !x.skipIf?.(next));
    if (i + 1 >= nextVisible.length) { setDone(true); track("quiz_complete", { route: route(next).key }); try { sessionStorage.setItem("cs_quiz", JSON.stringify(next)); } catch {} }
    else setI(i + 1);
  };

  if (done) {
    const r = route(answers);
    return (
      <div className="border border-white/15 bg-ink-deep p-7 sm:p-10">
        <p className="eyebrow text-route">Your recommended next step</p>
        <h2 className="display d-lg mt-4">{r.title}</h2>
        <p className="lede mt-5 max-w-2xl text-white/85">{r.body}</p>
        {r.checklist && <ul className="mt-6 space-y-2">{r.checklist.map((c) => <li key={c} className="flex gap-3"><span className="mt-2 h-[6px] w-[6px] shrink-0 bg-route" />{c}</li>)}</ul>}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href={r.cta.href} className="btn btn-route">{r.cta.label} <span className="arrow">→</span></Link>
          {r.secondary && <Link href={r.secondary.href} className="btn btn-ghost">{r.secondary.label}</Link>}
        </div>
        <p className="mt-8 max-w-2xl text-[0.85rem] text-slate-light">This is a routing tool, not an assessment. It doesn’t judge your ability or your chances — that needs a professional look at a full match. Your answers stay in this browser and pre-fill your application.</p>
        <button onClick={() => { setDone(false); setI(0); setAnswers({}); }} className="mono mt-6 text-[0.72rem] uppercase tracking-[0.1em] text-slate-light underline">Start again</button>
      </div>
    );
  }

  return (
    <div className="border border-white/15 bg-ink-deep p-7 sm:p-10">
      <div className="flex items-center justify-between">
        <p className="mono text-[0.72rem] text-slate-light">Question {i + 1} of {visible.length}</p>
        {i > 0 && <button onClick={() => setI(i - 1)} className="mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-light underline">← Back</button>}
      </div>
      <div className="mt-3 h-[3px] bg-white/10"><div className="h-full bg-route transition-[width] duration-500" style={{ width: `${(i / visible.length) * 100}%` }} /></div>
      <h2 className="display d-md mt-8" id="q-title">{q.q}</h2>
      {q.help && <p className="mt-2 text-white/70">{q.help}</p>}
      <div role="radiogroup" aria-labelledby="q-title" className="mt-8 grid gap-3 sm:grid-cols-2">
        {q.options.map((o) => (
          <button key={o} role="radio" aria-checked={answers[q.id]?.[0] === o} onClick={() => choose(o)}
            className={`min-h-[56px] border px-5 py-3 text-left font-semibold transition-colors ${answers[q.id]?.[0] === o ? "border-route bg-route text-ink" : "border-white/20 hover:border-white"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}
