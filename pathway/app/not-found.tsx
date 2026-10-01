import Link from "next/link";
export default function NotFound() {
  return (
    <section className="on-ink flex min-h-[80vh] items-center pt-[var(--header-h)]">
      <div className="wrap"><p className="eyebrow text-slate-light">404</p><h1 className="display d-xl mt-4 max-w-[14ch]">Wrong turn. The route continues here.</h1><Link href="/" className="btn btn-route mt-10">Back to home →</Link></div>
    </section>
  );
}
