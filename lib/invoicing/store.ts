import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  CompanySettings,
  Customer,
  Invoice,
  NumberingConfig,
  Product,
  VatTreatment,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "invoicing");

function filePath(name: string) {
  return path.join(DATA_DIR, name);
}

// Serialize reads/writes per file so concurrent server actions (e.g. two
// invoice saves racing to allocate a number) don't clobber each other.
const locks = new Map<string, Promise<unknown>>();

export async function runExclusive<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return withLock(name, fn);
}

async function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const previous = locks.get(name) ?? Promise.resolve();
  let release: () => void;
  const next = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(
    name,
    previous.then(() => next),
  );
  await previous;
  try {
    return await fn();
  } finally {
    release!();
  }
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(filePath(name), JSON.stringify(fallback, null, 2));
      return fallback;
    }
    throw err;
  }
}

async function writeJson<T>(name: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath(name), JSON.stringify(data, null, 2));
}

// --- Company settings -------------------------------------------------

export async function getCompany(): Promise<CompanySettings> {
  return readJson<CompanySettings>("company.json", {
    legalName: "",
    registrationNumber: "",
    vatNumber: "",
    legalAddress: "",
    bankName: "",
    iban: "",
    swift: "",
    email: "",
    phone: "",
    website: "",
    additionalInfo: "",
    logoUrl: "",
  });
}

export async function saveCompany(company: CompanySettings): Promise<void> {
  await withLock("company.json", () => writeJson("company.json", company));
}

// --- VAT treatments -----------------------------------------------------

export async function getVatTreatments(): Promise<VatTreatment[]> {
  return readJson<VatTreatment[]>("vat-treatments.json", []);
}

export async function saveVatTreatments(treatments: VatTreatment[]): Promise<void> {
  await withLock("vat-treatments.json", () => writeJson("vat-treatments.json", treatments));
}

// --- Numbering config -----------------------------------------------------

export async function getNumberingConfig(): Promise<NumberingConfig> {
  return readJson<NumberingConfig>("numbering-config.json", {
    prefix: "GE",
    pattern: "{PREFIX}-{YEAR}-{SEQ}",
    sequenceDigits: 3,
    resetPerYear: true,
  });
}

export async function saveNumberingConfig(config: NumberingConfig): Promise<void> {
  await withLock("numbering-config.json", () => writeJson("numbering-config.json", config));
}

// --- Products -----------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>("products.json", []);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await withLock("products.json", () => writeJson("products.json", products));
}

// --- Customers -----------------------------------------------------

export async function getCustomers(): Promise<Customer[]> {
  return readJson<Customer[]>("customers.json", []);
}

export async function saveCustomers(customers: Customer[]): Promise<void> {
  await withLock("customers.json", () => writeJson("customers.json", customers));
}

// --- Invoices -----------------------------------------------------

export async function getInvoices(): Promise<Invoice[]> {
  return readJson<Invoice[]>("invoices.json", []);
}

export async function saveInvoices(invoices: Invoice[]): Promise<void> {
  await withLock("invoices.json", () => writeJson("invoices.json", invoices));
}

// --- Numbering counters -----------------------------------------------------

export async function withCounters<T>(
  fn: (counters: Record<string, number>) => Promise<T> | T,
): Promise<T> {
  return withLock("counters.json", async () => {
    const counters = await readJson<Record<string, number>>("counters.json", {});
    const result = await fn(counters);
    await writeJson("counters.json", counters);
    return result;
  });
}

// --- Invoices need their own lock for read-modify-write cycles -----------

export async function withInvoices<T>(
  fn: (invoices: Invoice[]) => Promise<T> | T,
): Promise<T> {
  return withLock("invoices.json", async () => {
    const invoices = await readJson<Invoice[]>("invoices.json", []);
    const result = await fn(invoices);
    await writeJson("invoices.json", invoices);
    return result;
  });
}

export async function withCustomers<T>(
  fn: (customers: Customer[]) => Promise<T> | T,
): Promise<T> {
  return withLock("customers.json", async () => {
    const customers = await readJson<Customer[]>("customers.json", []);
    const result = await fn(customers);
    await writeJson("customers.json", customers);
    return result;
  });
}

export async function withProducts<T>(
  fn: (products: Product[]) => Promise<T> | T,
): Promise<T> {
  return withLock("products.json", async () => {
    const products = await readJson<Product[]>("products.json", []);
    const result = await fn(products);
    await writeJson("products.json", products);
    return result;
  });
}
