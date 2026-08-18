"use client";

import { useState, useTransition } from "react";
import { saveCompanyAction, saveNumberingConfigAction, saveVatTreatmentsAction } from "../actions";
import { formatInvoiceNumber } from "@/lib/invoicing/numbering";
import type { CompanySettings, NumberingConfig, VatTreatment } from "@/lib/invoicing/types";
import { btnPrimary, card, input, label, textarea } from "@/lib/invoicing/ui";

function SavedFlag({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return <span className="text-xs font-medium text-emerald-700">Saved</span>;
}

export function SettingsForm({
  company: initialCompany,
  numbering: initialNumbering,
  vatTreatments: initialVat,
}: {
  company: CompanySettings;
  numbering: NumberingConfig;
  vatTreatments: VatTreatment[];
}) {
  return (
    <div className="space-y-6">
      <CompanyCard initial={initialCompany} />
      <NumberingCard initial={initialNumbering} />
      <VatCard initial={initialVat} />
    </div>
  );
}

function CompanyCard({ initial }: { initial: CompanySettings }) {
  const [form, setForm] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveCompanyAction(form);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={card}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Company details</h2>
        <div className="flex items-center gap-3">
          <SavedFlag saved={saved} />
          <button type="submit" className={btnPrimary} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Legal company name</label>
          <input className={input} value={form.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </div>
        <div>
          <label className={label}>Brand / trading name</label>
          <input
            className={input}
            placeholder="e.g. AIDEX ENERGY GROUP"
            value={form.brandName}
            onChange={(e) => set("brandName", e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-400">
            Shown as the wordmark in the invoice header when there&apos;s no logo image. Leave blank to
            just show the legal name.
          </p>
        </div>
        <div>
          <label className={label}>Registration number</label>
          <input
            className={input}
            value={form.registrationNumber}
            onChange={(e) => set("registrationNumber", e.target.value)}
          />
        </div>
        <div>
          <label className={label}>VAT number</label>
          <input className={input} value={form.vatNumber} onChange={(e) => set("vatNumber", e.target.value)} />
        </div>
        <div>
          <label className={label}>Website</label>
          <input className={input} value={form.website} onChange={(e) => set("website", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={label}>Legal address</label>
          <input
            className={input}
            value={form.legalAddress}
            onChange={(e) => set("legalAddress", e.target.value)}
          />
        </div>
        <div>
          <label className={label}>Bank name</label>
          <input className={input} value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
        </div>
        <div>
          <label className={label}>IBAN</label>
          <input className={input} value={form.iban} onChange={(e) => set("iban", e.target.value)} />
        </div>
        <div>
          <label className={label}>SWIFT/BIC</label>
          <input className={input} value={form.swift} onChange={(e) => set("swift", e.target.value)} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input className={input} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={label}>Phone</label>
          <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className={label}>Logo image path or URL</label>
          <input
            className={input}
            placeholder="/branding/logo.png or https://…"
            value={form.logoUrl}
            onChange={(e) => set("logoUrl", e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-400">
            Drop a logo file in <code>public/branding/</code> and reference it as{" "}
            <code>/branding/logo.png</code>. Leave blank to use the text wordmark.
          </p>
        </div>
        <div className="col-span-2">
          <label className={label}>Other legally required information</label>
          <textarea
            className={textarea}
            value={form.additionalInfo}
            onChange={(e) => set("additionalInfo", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}

function NumberingCard({ initial }: { initial: NumberingConfig }) {
  const [form, setForm] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof NumberingConfig>(key: K, value: NumberingConfig[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveNumberingConfigAction(form);
      setSaved(true);
    });
  }

  let preview = "";
  try {
    preview = formatInvoiceNumber(form, 1, new Date());
  } catch {
    preview = "";
  }

  return (
    <form onSubmit={handleSubmit} className={card}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Invoice numbering</h2>
        <div className="flex items-center gap-3">
          <SavedFlag saved={saved} />
          <button type="submit" className={btnPrimary} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={label}>Prefix</label>
          <input className={input} value={form.prefix} onChange={(e) => set("prefix", e.target.value)} />
        </div>
        <div>
          <label className={label}>Sequence digits</label>
          <input
            type="number"
            min={1}
            max={6}
            className={input}
            value={form.sequenceDigits}
            onChange={(e) => set("sequenceDigits", Number(e.target.value))}
          />
        </div>
        <div className="flex items-end pb-1.5">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.resetPerYear}
              onChange={(e) => set("resetPerYear", e.target.checked)}
            />
            Reset sequence every year
          </label>
        </div>
        <div className="col-span-2">
          <label className={label}>Pattern</label>
          <input className={input} value={form.pattern} onChange={(e) => set("pattern", e.target.value)} />
          <p className="mt-1 text-xs text-slate-400">
            Tokens: <code>{"{PREFIX}"}</code> <code>{"{YEAR}"}</code> <code>{"{YY}"}</code>{" "}
            <code>{"{MONTH}"}</code> <code>{"{SEQ}"}</code>
          </p>
        </div>
        <div>
          <label className={label}>Example</label>
          <p className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-emerald-900">
            {preview || "—"}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        The next number is only allocated when an invoice is saved, and the system checks existing
        invoices to prevent duplicates. You can still type a manual number on any invoice to override
        the automatic sequence.
      </p>
    </form>
  );
}

function VatCard({ initial }: { initial: VatTreatment[] }) {
  const [treatments, setTreatments] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(idx: number, patch: Partial<VatTreatment>) {
    setTreatments((list) => list.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveVatTreatmentsAction(treatments);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={card}>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">VAT treatments &amp; legal notes</h2>
        <div className="flex items-center gap-3">
          <SavedFlag saved={saved} />
          <button type="submit" className={btnPrimary} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <p className="mb-4 text-xs text-slate-400">
        These are starting templates, not legal advice — verify the wording with your accountant. Every
        note can still be edited or overridden on an individual invoice before it is issued.
      </p>
      <div className="space-y-4">
        {treatments.map((t, idx) => (
          <div key={t.key} className="rounded-md border border-slate-200 p-3">
            <div className="mb-2 grid grid-cols-3 gap-3">
              <div>
                <label className={label}>Label (Latvian)</label>
                <input className={input} value={t.labelLv} onChange={(e) => update(idx, { labelLv: e.target.value })} />
              </div>
              <div>
                <label className={label}>Label (English)</label>
                <input className={input} value={t.labelEn} onChange={(e) => update(idx, { labelEn: e.target.value })} />
              </div>
              <div>
                <label className={label}>Default rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className={input}
                  placeholder="custom"
                  value={t.rate ?? ""}
                  onChange={(e) => update(idx, { rate: e.target.value === "" ? null : Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Legal note (Latvian)</label>
                <textarea className={textarea} value={t.noteLv} onChange={(e) => update(idx, { noteLv: e.target.value })} />
              </div>
              <div>
                <label className={label}>Legal note (English)</label>
                <textarea className={textarea} value={t.noteEn} onChange={(e) => update(idx, { noteEn: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
