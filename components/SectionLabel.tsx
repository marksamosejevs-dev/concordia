import { cn } from "@/lib/utils";

export default function SectionLabel({
  index,
  label,
  className,
}: {
  index?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase", className)}>
      {index && <span className="opacity-50">{index}</span>}
      <span>{label}</span>
    </div>
  );
}
