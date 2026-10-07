import { IS_REVIEW } from "@/lib/site-mode";

export function ReviewBar() {
  if (!IS_REVIEW) return null;
  return (
    <div className="mono fixed bottom-3 right-3 z-[60] hidden items-center gap-2 bg-route px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-ink shadow-lg lg:flex" role="note">
      Pre-launch preview · pending content shown with a dashed outline
    </div>
  );
}
