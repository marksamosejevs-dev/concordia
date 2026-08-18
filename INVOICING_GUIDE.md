# SIA Green Energy — Invoicing App User Guide

A self-contained invoicing tool for SIA Green Energy, built into this repository at
`/invoicing`. It supports Latvian-language domestic invoices and English-language
international invoices from the same customer, product, and numbering databases,
and produces a print-ready A4 PDF that follows the layout of the original
`Invoice_LT00107` reference invoice (dark green header/footer band, supplier/customer
blocks, item table, VAT summary, bank details, amount in words).

> **Note on the logo:** the reference `.docx` file had an image reading "AIDEX ENERGY
> GROUP" in its header, even though the invoice text says "SIA GREEN ENERGY" — that
> logo image doesn't belong to this business. The generated invoices use a plain
> SIA GREEN ENERGY text wordmark in the same dark-green colour instead. Once you have
> a real logo file, see point 12 below to drop it in.

## 1. How to open/start the invoice generator

The tool is part of this Next.js project, at the `/invoicing` route.

- **Locally:** `npm install` (first time only), then `npm run dev`, then open
  `http://localhost:3000/invoicing`.
- **On a deployed copy of this site:** open `https://<your-domain>/invoicing`.

Everything under `/invoicing` is a separate section from the public
Concordia Sports Agency marketing pages — it isn't linked from the public site's
navigation.

## 2. How to configure SIA Green Energy details

Go to **Settings** (`/invoicing/settings`). The **Company details** card holds the
legal name, registration number, VAT number, legal address, bank name, IBAN,
SWIFT/BIC, email, phone, website, an optional logo, and a free-text field for any
other legally required information. These fields are pre-filled from the reference
invoice and appear automatically on every invoice you generate. Edit and click
**Save** at any time — changes apply to invoices generated afterwards.

## 3. How to add customers

Go to **Customers** (`/invoicing/customers`) → **+ Add customer**. Fill in the legal
name, registration/VAT numbers, legal and billing addresses, country, contact
person, email, notes, and the customer's defaults: currency, language, and VAT
treatment. Save once, and from then on you pick this customer from a dropdown on
any invoice — the system auto-fills their details, default currency, default
language, and default VAT note.

## 4. How to create Latvian invoices

1. **Invoicing → New Invoice** (`/invoicing/new`).
2. Set **Market** to *Latvia* and **Language** to *Latvian*.
3. Pick the customer (or leave market/language as-is if the customer's own
   defaults are already Latvian/EUR — selecting a customer sets these for you).
4. Add invoice lines, set the VAT treatment (usually the 21% standard rate for
   domestic sales), and **Save invoice**.

The generated PDF uses proper Latvian accounting terms throughout — *Rēķins*,
*Rēķina Nr.*, *Apmaksas termiņš*, *Piegādātājs*, *Saņēmējs*, *PVN maksātāja Nr.*,
*Summa bez PVN*, *Apmaksai kopā*, *Apmaksas rekvizīti*, etc. — and renders Latvian
diacritics (ā, ē, ī, ū, ķ, ļ, ņ, ģ, š, č, ž) correctly.

## 5. How to create international invoices

Same flow, but set **Market** to *International* and **Language** to *English*.
The extra shipment-style fields — Incoterms, pick-up address, pick-up date,
purchase order number, contract number — are shown on the PDF only when filled in,
which is useful for export invoices like the wood-pellets reference invoice.

## 6. How to select VAT treatment

Every invoice (and every line) has a **VAT treatment** dropdown: Latvian standard
(21%), Latvian reduced (12%), 0% (other), reverse charge, intra-Community supply
(0%), export outside the EU (0%), or a fully custom rate. Choosing a treatment
fills in a matching legal note (e.g. the Article 138 reverse-charge wording) in the
**VAT / legal note** box — you can freely edit or replace that text before saving,
per invoice. The starting notes are templates, not legal advice; have your
accountant confirm the wording for your situation.

Manage the treatments and their default notes centrally in **Settings → VAT
treatments & legal notes**.

## 7. How to create products/services

Go to **Products** (`/invoicing/products`) → **+ Add product**. Store a Latvian
description, an English description, a default unit, a default unit price, and a
default VAT treatment. On an invoice line, pick a product from the "preset…"
dropdown to fill in the description (in the correct language automatically once
you generate the PDF), unit, price, and VAT treatment — then just adjust the
quantity.

## 8. How to generate PDF invoices

Once an invoice is saved (even as a Draft), the right-hand panel on its page shows
a live PDF preview plus **Preview** and **Download PDF** buttons. Preview opens the
PDF in a new tab; Download saves it with the filename pattern
`GE-2026-001_Customer_Name.pdf`. The PDF is generated fresh every time from the
saved invoice data, so re-opening it after an edit always reflects the latest
numbers — there's nothing to "regenerate" separately.

## 9. How invoice numbering works

Configured in **Settings → Invoice numbering**: a prefix (default `GE`), a pattern
using `{PREFIX}`, `{YEAR}`, `{YY}`, `{MONTH}`, `{SEQ}` tokens (default
`{PREFIX}-{YEAR}-{SEQ}`), how many digits to zero-pad the sequence to, and whether
the sequence resets each year. This produces numbers like `GE-2026-001`,
`GE-2026-002`, and so on.

The New Invoice screen shows the next number as a suggestion in an editable field.
Leave it as-is to use it, or type any other number to override it manually — the
system always checks existing invoices and refuses to save a duplicate number,
whichever way it was entered.

## 10. Where previous invoices are stored

All data lives as JSON files on disk in `data/invoicing/`:

- `company.json`, `vat-treatments.json`, `numbering-config.json`, `products.json` —
  configuration, safe to keep in version control.
- `customers.json`, `invoices.json`, `counters.json` — your actual business data.
  These are excluded from git via `.gitignore` so customer and financial records
  never get committed to the repository by accident; they simply live on whatever
  machine/server is running the app.

**Invoice history** (`/invoicing`) lists every invoice with its number, customer,
dates, amount, VAT, language, and status (Draft, Issued, Paid, Overdue, Cancelled).
From there you can open, change status, duplicate (creates a new Draft copy with a
fresh number and today's dates), or delete an invoice.

## 11. How to back up the invoice database

Copy the whole `data/invoicing/` folder somewhere safe (external drive, cloud
backup, etc.) on a regular basis — it's a handful of plain JSON files, so a simple
file copy is a complete backup. To restore, copy the folder back into place before
starting the app. If you'd rather have customer/invoice history version-controlled
in git as well, remove the three entries under "invoicing app data" near the bottom
of `.gitignore` and commit those files — just be aware that then puts real customer
and financial data into the repository's history.

## 12. How to modify the invoice template later

- **Wording/labels:** edit `lib/invoicing/pdf/labels.ts` (Latvian and English
  label dictionaries).
- **Layout/styling:** edit `lib/invoicing/pdf/InvoiceDocument.tsx` — it's a
  `@react-pdf/renderer` component with a `StyleSheet` at the top (colours, spacing,
  table columns) and the JSX layout below.
- **Real logo:** put an image file in `public/branding/` (create the folder) and
  set **Settings → Logo image path or URL** to e.g. `/branding/logo.png`. A full
  `https://` URL also works. Leave it blank to keep the text wordmark.
- **VAT notes and numbering format:** no code changes needed — both are editable
  from the Settings page.
- **Currencies:** add more ISO codes to the list in `lib/invoicing/currencies.ts`.
