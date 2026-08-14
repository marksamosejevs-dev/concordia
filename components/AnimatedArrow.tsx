import { cn } from "@/lib/utils";

export default function AnimatedArrow({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block h-[1em] w-[1.3em] overflow-hidden align-middle",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 12"
        className="absolute left-0 top-0 h-full w-full transition-transform duration-300 ease-out group-hover:translate-x-full"
        fill="none"
      >
        <path d="M0 6H23M23 6L17 0.5M23 6L17 11.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <svg
        viewBox="0 0 24 12"
        className="absolute left-0 top-0 h-full w-full -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0"
        fill="none"
      >
        <path d="M0 6H23M23 6L17 0.5M23 6L17 11.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </span>
  );
}
