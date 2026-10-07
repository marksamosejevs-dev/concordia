import Link from "next/link";

export function Loading() { return <div className="h-64 animate-pulse rounded-[16px] border border-white/10 bg-ink-deep" aria-busy="true" aria-label="Loading" />; }
export function InvalidLink() {
  return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">This link isn’t valid.</h1>
      <p className="mt-3 text-white/75">Please use the most recent link in your email from Concordia. If you haven’t applied yet, the application is free.</p>
      <Link href="/apply" className="btn btn-route mt-6">Apply free <span className="arrow" aria-hidden>→</span></Link>
    </div>
  );
}
export function LoadError({ retry }: { retry: () => void }) {
  return (
    <div className="rounded-[16px] border border-white/15 bg-ink-deep p-8">
      <h1 className="display d-md">We couldn’t load this just now.</h1>
      <p className="mt-3 text-white/75">Please try again in a moment.</p>
      <button onClick={retry} className="btn btn-ghost mt-6">Try again</button>
    </div>
  );
}
